/**
* @class GetIt.GridPrinter
* @author Ed Spencer (edward@domine.co.uk)
* Grouped Grid Panel printing support by:
*   Rahul singla (http://www.rahulsingla.com)
* Class providing a common way of printing Ext.Components. Ext.ux.Printer.print delegates the printing to a specialised
* renderer class (each of which subclasses Ext.ux.Printer.BaseRenderer), based on the xtype of the component.
* Each renderer is registered with an xtype, and is used if the component to print has that xtype.
* 
* See the files in the renderers directory to customise or to provide your own renderers.
* 
* Usage example:
* 
* var grid = new Ext.grid.GridPanel({
*   colModel: //some column model,
*   store   : //some store
* });
* 
* Ext.ux.Printer.print(grid);
* 
*/
/*          PRINT GRID*/
Ext.ux.Printer = function() {

    return {
        /**
        * @property renderers
        * @type Object
        * An object in the form {xtype: RendererClass} which is manages the renderers registered by xtype
        */
        renderers: {},

        /**
        * Registers a renderer function to handle components of a given xtype
        * @param {String} xtype The component xtype the renderer will handle
        * @param {Function} renderer The renderer to invoke for components of this xtype
        */
        registerRenderer: function(xtype, renderer) {
            this.renderers[xtype] = new (renderer)();
        },

        /**
        * Returns the registered renderer for a given xtype
        * @param {String} xtype The component xtype to find a renderer for
        * @return {Object/undefined} The renderer instance for this xtype, or null if not found
        */
        getRenderer: function(xtype) {
            return this.renderers[xtype];
        },

        /**
        * Prints the passed grid. Reflects on the grid's column model to build a table, and fills it using the store
        * @param {Ext.Component} component The component to print
        */
        print: function(component) {
            var xtypes = component.getXTypes().split('/');

            //iterate backwards over the xtypes of this component, dispatching to the most specific renderer
            for (var i = xtypes.length - 1; i >= 0; i--) {
                var xtype = xtypes[i],
            renderer = this.getRenderer(xtype);

                if (renderer != undefined) {
                    renderer.print(component);
                    break;
                }
            }
        }
    };
} ();

/**
* Override how getXTypes works so that it doesn't require that every single class has
* an xtype registered for it.
*/
Ext.override(Ext.Component, {
    getXTypes: function() {
        var tc = this.constructor;
        if (!tc.xtypes) {
            var c = [], sc = this;
            while (sc) { //was: while(sc && sc.constructor.xtype) {
                var xtype = sc.constructor.xtype;
                if (xtype != undefined) c.unshift(xtype);

                sc = sc.constructor.superclass;
            }
            tc.xtypeChain = c;
            tc.xtypes = c.join('/');
        }
        return tc.xtypes;
    }
});

/**
* @class Ext.ux.Printer.BaseRenderer
* @extends Object
* @author Ed Spencer
* Abstract base renderer class. Don't use this directly, use a subclass instead
*/
Ext.ux.Printer.BaseRenderer = Ext.extend(Object, {
    /**
    * Prints the component
    * @param {Ext.Component} component The component to print
    */
    print: function(component) {
        var name = component && component.getXType
             ? String.format("print_{0}_{1}", component.getXType(), component.id.replace(/-/g, '_'))
             : "print";

        var win = window.open('', name);

        win.document.write(this.generateHTML(component));
        
        //Print after a timeout to be cross-browser compatible.
        setTimeout(function() {
            win.document.close();

            win.print();
            win.close();
        }, 1000);
    },

    /**
    * Generates the HTML Markup which wraps whatever this.generateBody produces
    * @param {Ext.Component} component The component to generate HTML for
    * @return {String} An HTML fragment to be placed inside the print window
    */
    generateHTML: function(component) {
        return new Ext.XTemplate(
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
      '<html>',
        '<head>',
            '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
            '<link href="' + this.stylesheetPath + '" rel="stylesheet" type="text/css" media="screen,print" />',
            '<title>' + this.getTitle(component) + '</title>',
        '</head>',
        '<body>',
          this.generateBody(component),
        '</body>',
      '</html>'
    ).apply(this.prepareData(component));
    },

    /**
    * Returns the HTML that will be placed into the print window. This should produce HTML to go inside the
    * <body> element only, as <head> is generated in the print function
    * @param {Ext.Component} component The component to render
    * @return {String} The HTML fragment to place inside the print window's <body> element
    */
    generateBody: Ext.emptyFn,

    /**
    * Prepares data suitable for use in an XTemplate from the component 
    * @param {Ext.Component} component The component to acquire data from
    * @return {Array} An empty array (override this to prepare your own data)
    */
    prepareData: function(component) {
        return component;
    },

    /**
    * Returns the title to give to the print window
    * @param {Ext.Component} component The component to be printed
    * @return {String} The window title
    */
    getTitle: function(component) {
        return typeof component.getTitle == 'function' ? component.getTitle() : (component.title || "Printing");
    },

    /**
    * @property stylesheetPath
    * @type String
    * The path at which the print stylesheet can be found (defaults to 'stylesheets/print.css')
    */
    //stylesheetPath: 'stylesheets/print.css'
    stylesheetPath: 'style/gridPrinter.css'
});

/**
* @class Ext.ux.Printer.ColumnTreeRenderer
* @extends Ext.ux.Printer.BaseRenderer
* @author Ed Spencer
* Helper class to easily print the contents of a column tree
*/
Ext.ux.Printer.ColumnTreeRenderer = Ext.extend(Ext.ux.Printer.BaseRenderer, {

    /**
    * Generates the body HTML for the tree
    * @param {Ext.tree.ColumnTree} tree The tree to print
    */
    generateBody: function(tree) {
        var columns = this.getColumns(tree);

        //use the headerTpl and bodyTpl XTemplates to create the main XTemplate below
        var headings = this.headerTpl.apply(columns);
        var body = this.bodyTpl.apply(columns);

        return String.format('<table>{0}<tpl for=".">{1}</tpl></table>', headings, body);
    },

    /**
    * Returns the array of columns from a tree
    * @param {Ext.tree.ColumnTree} tree The tree to get columns from
    * @return {Array} The array of tree columns
    */
    getColumns: function(tree) {
        return tree.columns;
    },

    /**
    * Descends down the tree from the root, creating an array of data suitable for use in an XTemplate
    * @param {Ext.tree.ColumnTree} tree The column tree
    * @return {Array} Data suitable for use in the body XTemplate
    */
    prepareData: function(tree) {
        var root = tree.root,
        data = [],
        cols = this.getColumns(tree),
        padding = this.indentPadding;

        var f = function(node) {
            if (node.hidden === true || node.isHiddenRoot() === true) return;

            var row = Ext.apply({ depth: node.getDepth() * padding }, node.attributes);

            Ext.iterate(row, function(key, value) {
                Ext.each(cols, function(column) {
                    if (column.dataIndex == key) {
                        row[key] = column.renderer ? column.renderer(value) : value;
                    }
                }, this);
            });

            //the property used in the first column is renamed to 'text' in node.attributes, so reassign it here
            row[this.getColumns(tree)[0].dataIndex] = node.attributes.text;

            data.push(row);
        };

        root.cascade(f, this);

        return data;
    },

    /**
    * @property indentPadding
    * @type Number
    * Number of pixels to indent node by. This is multiplied by the node depth, so a node with node.getDepth() == 3 will
    * be padded by 45 (or 3x your custom indentPadding)
    */
    indentPadding: 15,

    /**
    * @property headerTpl
    * @type Ext.XTemplate
    * The XTemplate used to create the headings row. By default this just uses <th> elements, override to provide your own
    */
    headerTpl: new Ext.XTemplate(
    '<tr>',
      '<tpl for=".">',
        '<th width="{width}">{header}</th>',
      '</tpl>',
    '</tr>'
  ),

    /**
    * @property bodyTpl
    * @type Ext.XTemplate
    * The XTemplate used to create each row. This is used inside the 'print' function to build another XTemplate, to which the data
    * are then applied (see the escaped dataIndex attribute here - this ends up as "{dataIndex}")
    */
    bodyTpl: new Ext.XTemplate(
    '<tr>',
      '<tpl for=".">',
        '<td style="padding-left: {[xindex == 1 ? "\\{depth\\}" : "0"]}px">\{{dataIndex}\}</td>',
      '</tpl>',
    '</tr>'
  )
});

Ext.ux.Printer.registerRenderer('columntree', Ext.ux.Printer.ColumnTreeRenderer);

/**
* @class Ext.ux.Printer.GridPanelRenderer
* @extends Ext.ux.Printer.BaseRenderer
* @author Ed Spencer
* Helper class to easily print the contents of a grid. Will open a new window with a table where the first row
* contains the headings from your column model, and with a row for each item in your grid's store. When formatted
* with appropriate CSS it should look very similar to a default grid. If renderers are specified in your column
* model, they will be used in creating the table. Override headerTpl and bodyTpl to change how the markup is generated
*/
Ext.ux.Printer.GridPanelRenderer = Ext.extend(Ext.ux.Printer.BaseRenderer, {

    /**
    * Generates the body HTML for the grid
    * @param {Ext.grid.GridPanel} grid The grid to print
    */
    generateBody: function(grid) {
        var columns = this.getColumns(grid);

        //use the headerTpl and bodyTpl XTemplates to create the main XTemplate below
        var headings = this.headerTpl.apply(columns);
        var body = this.bodyTpl.apply(columns);

        return String.format('<table>{0}<tpl for=".">{1}</tpl></table>', headings, body);
    },

    /**
    * Prepares data from the grid for use in the XTemplate
    * @param {Ext.grid.GridPanel} grid The grid panel
    * @return {Array} Data suitable for use in the XTemplate
    */
    prepareData: function(grid) {
        //We generate an XTemplate here by using 2 intermediary XTemplates - one to create the header,
        //the other to create the body (see the escaped {} below)
        var columns = this.getColumns(grid);

        //build a useable array of store data for the XTemplate
        var data = [];
        grid.store.data.each(function(item) {
            var convertedData = {};

            //apply renderers from column model
            Ext.iterate(item.data, function(key, value) {
                Ext.each(columns, function(column) {
                    if (column.dataIndex == key) {
                        convertedData[key] = column.renderer ? column.renderer(value, null, item) : value;
                        return false;
                    }
                }, this);
            });

            data.push(convertedData);
        });

        return data;
    },

    /**
    * Returns the array of columns from a grid
    * @param {Ext.grid.GridPanel} grid The grid to get columns from
    * @return {Array} The array of grid columns
    */
    getColumns: function(grid) {
        var columns = [];

        Ext.each(grid.getColumnModel().config, function(col) {
            if (col.hidden != true) columns.push(col);
        }, this);

        return columns;
    },

    /**
    * @property headerTpl
    * @type Ext.XTemplate
    * The XTemplate used to create the headings row. By default this just uses <th> elements, override to provide your own
    */
    headerTpl: new Ext.XTemplate(
    '<tr>',
      '<tpl for=".">',
        '<th>{header}</th>',
      '</tpl>',
    '</tr>'
  ),

    /**
    * @property bodyTpl
    * @type Ext.XTemplate
    * The XTemplate used to create each row. This is used inside the 'print' function to build another XTemplate, to which the data
    * are then applied (see the escaped dataIndex attribute here - this ends up as "{dataIndex}")
    */
    bodyTpl: new Ext.XTemplate(
    '<tr>',
      '<tpl for=".">',
        '<td>\{{dataIndex}\}</td>',
      '</tpl>',
    '</tr>'
  )
});

Ext.ux.Printer.registerRenderer('grid', Ext.ux.Printer.GridPanelRenderer);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Customizations.
//http://github.com/edspencer/Ext.ux.Printer/

//Ext.ux.Printer.BaseRenderer.prototype.stylesheetPath = '/sites/default/files/content/blog/extjs-printer/Ext.ux.Printer.css';
Ext.ux.Printer.BaseRenderer.prototype.stylesheetPath = 'style/print.css';
Ext.override(Ext.ux.Printer.GridPanelRenderer, {
    bodyTpl: new Ext.XTemplate(
        '<tr>',
          '<tpl for=".">',
            '<tpl if="dataIndex"><td>\{{dataIndex}\}</td></tpl>',
            '<tpl if="!dataIndex"><td>&nbsp;</td></tpl>',
          '</tpl>',
        '</tr>'
  )
});

Ext.ux.Printer.GroupedGridPanelRenderer = Ext.extend(Ext.ux.Printer.GridPanelRenderer, {

    generateBody: function(grid) {
        var view = grid.view;

        if (view instanceof Ext.grid.GroupingView && view.canGroup()) {
            this.overrideForGrouping(grid);

            var columns = this.getColumns(grid);

            this.bodyTpl.numColumns = this.getColumns(grid).length;
            var cells = this.bodyTpl.cellTpl.apply(columns);
            this.bodyTpl.innerTemplate = String.format('<tpl for="groupRecords"><tr>{0}</tr></tpl>', cells);

            if (grid.hasPlugin(Ext.grid.GroupSummary)) {
                var summaryCells = this.bodyTpl.groupSummaryCellTemplate.apply(columns);
                this.bodyTpl.groupSummaryTemplate = String.format('<table class=\'group-summary\'><tpl for="summaries"><tr>{0}</tr></tpl></table>', summaryCells);
            } else {
                this.bodyTpl.groupSummaryTemplate = '';
            }

            var headings = this.headerTpl.apply(columns);
            var body = this.bodyTpl.apply({});

            return (String.format('<table class=\'table-parent\'>{0}<tpl for=".">{1}</tpl>{2}</table>', headings, body, this.generateGridTotals(grid)));

        } else {
            //No grouping, use base class logic.
            return (Ext.ux.Printer.GroupedGridPanelRenderer.superclass.generateBody.call(this, grid));
        }
    },

    gridTotalsTpl: new Ext.XTemplate(
                '<tr>',
                  '<td colspan=\'{[values.length]}\'>',
                    '<table class=\'grid-totals\'>',
                        '<tr>',
                          '<tpl for=".">',
                            '<td style=\'{style}\'>{total}</td>',
                          '</tpl>',
                        '</tr>',
                    '</table>',
                  '</td>',
                '</tr>'
              ),

    generateGridTotals: function(grid) {
        var plugin = grid.getPluginByType(Ext.ux.GridTotals);
        if (Ext.isEmpty(plugin)) {
            return ('');
        } else {
            var totals = plugin.getRenderedTotals();
            var columns = this.getColumns(grid);

            var rendered = new Array(columns.length);
            for (var i = 0; i < columns.length; i++) {
                var col = columns[i];
                rendered[i] = { total: totals[col.actualIndex], style: columns[i].style };
            }
            return (this.gridTotalsTpl.apply(rendered));
        }
    },

    overrideForGrouping: function(grid) {
        var me = this;

        Ext.apply(this, {
            columns: null,

            headerTpl: new Ext.XTemplate(
                '<tr>',
                  '<tpl for=".">',
                    '<th style=\'{style}\'>{header}</th>',
                  '</tpl>',
                '</tr>'
              ),

            bodyTpl: new Ext.XTemplate(
                '<tr>',
                  '<td colspan=\'{[this.getColumnCount()]}\'>',
                    '<div class=\'group-header\'>{[this.getGroupTextTemplate()]}</div>',
                    '<table class=\'group-body\'>',
                      '{[this.getInnerTemplate()]}',
                    '</table>',
                    '{[this.getGroupSummaryTemplate()]}',
                  '</td>',
                '</tr>',

                {
                    numColumns: 0,
                    cellTpl: new Ext.XTemplate('<tpl for="."><td style=\'{style}\'>\{{dataIndex}\}</td></tpl>'),
                    groupSummaryCellTemplate: new Ext.XTemplate('<tpl for="."><td style=\'{style}\'>\{{dataIndex}\}</td></tpl>'),
                    innerTemplate: null,
                    groupSummaryTemplate: null,

                    getColumnCount: function() {
                        return (this.numColumns);
                    },

                    getGroupTextTemplate: function() {
                        return ('{groupText}');
                    },

                    getInnerTemplate: function() {
                        return (this.innerTemplate);
                    },

                    getGroupSummaryTemplate: function() {
                        return (this.groupSummaryTemplate);
                    }
                }),

            prepareData: function(grid) {
                var view = grid.view;

                var columns = this.getColumns(grid);
                var groups = this.getGroupedData(grid);
                var groupTextTpl = new Ext.XTemplate(view.groupTextTpl);

                Ext.each(groups, function(group) {
                    var groupRecords = [];
                    group.groupText = groupTextTpl.apply(group);

                    Ext.each(group.rs, function(item) {
                        var convertedData = {};

                        //apply renderers from column model
                        Ext.iterate(item.data, function(key, value) {
                            Ext.each(columns, function(column) {
                                if (column.dataIndex == key) {
                                    convertedData[key] = column.renderer ? column.renderer(value, null, item) : value;
                                    return false;
                                }
                            }, this);
                        });

                        groupRecords.push(convertedData);
                    });

                    group.groupRecords = groupRecords;

                    var summaryRenderer = grid.getPluginByType(Ext.grid.GroupSummary);
                    if (!Ext.isEmpty(summaryRenderer)) {
                        //Summary calculation for column in each group.
                        var cs = view.getColumnData();
                        group.summaries = {};
                        var data = summaryRenderer.calculate(group.rs, cs);

                        Ext.each(columns, function(col) {
                            var rendered = '';
                            if (col.summaryType || col.summaryRenderer) {
                                rendered = (col.summaryRenderer || col.renderer)(data[col.name], {}, { data: data }, 0, col.actualIndex, grid.store);
                            }
                            if (rendered == undefined || rendered === "") rendered = "&#160;";

                            group.summaries[col.dataIndex] = rendered;
                        });
                    }

                    delete group.rs;
                });

                return (groups);
            },

            getColumns: function(grid) {
                if (this.columns == null) {
                    var columns = [];
                    var columnData = grid.view.getColumnData();

                    Ext.each(grid.getColumnModel().config, function(col, index) {
                        if (col.hidden != true) {
                            columns.push(
                                {
                                    dataIndex: col.dataIndex,
                                    header: col.header,
                                    renderer: col.renderer,
                                    summaryType: col.summaryType,
                                    summaryRenderer: col.summaryRenderer,
                                    style: columnData[index].style,
                                    name: columnData[index].name,
                                    actualIndex: index
                                });
                        }
                    }, this);

                    this.columns = columns;
                }
                return this.columns;
            },

            getGroupedData: function(grid) {
                var rs = grid.store.getRange();
                var ds = grid.store;
                var view = grid.view;

                var groupField = ds.getGroupState(),
                    colIndex = grid.colModel.findColumnIndex(groupField),
                    cfg = grid.colModel.config[colIndex],
                    groupRenderer = cfg.groupRenderer || cfg.renderer,
                    prefix = view.showGroupName ? (cfg.groupName || cfg.header) + ': ' : '',
                    groups = [],
                    curGroup, i, len, gid;

                for (i = 0, len = rs.length; i < len; i++) {
                    var rowIndex = i,
                        r = rs[i],
                        gvalue = r.data[groupField];

                    g = view.getGroup(gvalue, r, groupRenderer, rowIndex, colIndex, ds);
                    if (!curGroup || curGroup.group != g) {
                        gid = view.constructId(gvalue, groupField, colIndex);
                        curGroup = {
                            group: g,
                            gvalue: gvalue,
                            text: prefix + g,
                            groupId: gid,
                            startRow: rowIndex,
                            rs: [r]
                        };
                        groups.push(curGroup);
                    } else {
                        curGroup.rs.push(r);
                    }
                    r._groupId = gid;
                }

                return (groups);
            }
        });
    }
});
Ext.ux.Printer.registerRenderer('grid', Ext.ux.Printer.GroupedGridPanelRenderer);

//Utility Methods, not part of the Printer itself.
Ext.Component.prototype.getPluginByType = function(constructorFn) {
    if (Ext.isEmpty(constructorFn)) {
        return (null);
    }
    
    if (Ext.isArray(this.plugins)) {
        for (var i = 0, len = this.plugins.length; i < len; i++) {
            if (this.plugins[i] instanceof constructorFn) {
                return (this.plugins[i]);
            }
        }
    } else {
        if (this.plugins instanceof constructorFn) {
            return (this.plugins);
        }
    }

    return (null);
}

Ext.Component.prototype.hasPlugin = function(constructorFn) {
    var plugin = this.getPluginByType(constructorFn);
    return (!Ext.isEmpty(plugin));
}
