var myRango;             
var mapPanel, tree;
var mapa;
var vector;
var viewparams;
var oLayers;
var oms;
var layerList;
var renderer;
var filtroRango;
var gridPanel;

var txtSearch;
var wfsDiscapacitados; 
var wfsAlbergues;
var tipo; //almacena tipo de filtro de datagrid

var msgBox;
var win;
/*      CALCULO DE RUTAS        */
var gridRuta;
var lbDistancia;
var colsRuta;
var dataRuta;

//var storeAmenazaTsunami;
//OpenLayers.ProxyHost = "proxy.cgi?url=";

Ext.onReady(function() {
    //.store.bind(LayerAmenInundacion);
    //app.featureGrid.getSelectionModel().bind(LayerAmenInundacion);
    Ext.QuickTips.init();
    
    // create a map panel with some layers that we will show in our layer tree
    // below.
    var xy = new OpenLayers.LonLat(535636.0680, 9736544.9773).transform(new OpenLayers.Projection("EPSG:32717"),new OpenLayers.Projection("EPSG:900913"));
     // toolbar
    map = new OpenLayers.Map();
    
    OpenLayers.ProxyHost = "proxy.cgi?url=";
    var wgs900913 = new OpenLayers.Projection("EPSG:900913");
      // allow testing of specific renderers via "?renderer=Canvas", etc
    //var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    //renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
    
   vector = new OpenLayers.Layer.Vector("vector");   
   pointLayer = new OpenLayers.Layer.Vector("points");   
   
     var discapacitadosStyle = new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    pointRadius: "${type}", // sized according to type attribute
                    fillColor: "#ffcc66",
                    strokeColor: "#ff9933",
                    strokeWidth: 2,
                    graphicZIndex: 1
                }),
                "select": new OpenLayers.Style({
                    fillColor: "#66ccff",
                    strokeColor: "#3399ff",
                    graphicZIndex: 2
                })
            });
            
      
    //var ctrl, toolbarItems = [], action, actions = {};
//trackingLayer = new OpenLayers.Layer.Vector('select',{displayInLayerSwitcher: true, isBaseLayer:false, features:[], visibility:false });	
    
    //crea nueva instancia de los layers
    oLayers = new Layers();
    oForms= new Forms();
     // mapa.addLayers(oLayers.layers);
    
    map.addLayers([vector]);
     
     //CONTROLES DE mapa
	//Añade al mapa un control de navegación (movimiento ratón y teclado)
	map.addControl(new OpenLayers.Control.Navigation({handleRightClicks:true})); //Doble clic botón derecho para disminuir zoom
	//Añade al mapa un control para crear url de estado del mapa
	map.addControl(new OpenLayers.Control.Permalink());
	//Añade al mapa un control que recupera el estado del mapa de la url creada por permalink
	map.addControl(new OpenLayers.Control.ArgParser());
	//Añade al mapa un control de escala numérica
	map.addControl(new OpenLayers.Control.Scale());	
	//Añade al mapa un control de posición (coordenadas) del ratón
	map.addControl(new OpenLayers.Control.MousePosition({numDigits:2}));
	//Añade al mapa un control de escala gráfica
	map.addControl(new OpenLayers.Control.ScaleLine());
	//Añade al mapa un control de barra de zoom
	//map.addControl(new OpenLayers.Control.PanZoomBar());
	//Añade al mapa el control de historial de navegación
       // map.addControl(new OpenLayers.Control.DrawFeature(vector));
        
	hist = new OpenLayers.Control.NavigationHistory({limit:10});	
	map.addControl(hist);
	//var options = 
        //map.addControl(new OpenLayers.Control.OverviewMap( {autoPan:true,maxExtent: extent}));

        //Obejto controlador de la barra de herramientas
	var oToolBar = new Toolbar();	
	
	// Creamos un arreglo con los elementos de la barra de herramientas 
	var toolbarItems=[];
		toolbarItems.push(oToolBar.actionZoom);		
		toolbarItems.push(oToolBar.actionZoomIn);			
		toolbarItems.push(oToolBar.actionZoomOut);	
		toolbarItems.push("-");
		toolbarItems.push(oToolBar.actionZoomFull);						
		toolbarItems.push(oToolBar.actionhistPrev);		
		toolbarItems.push(oToolBar.actionhistNext);
        toolbarItems.push("-");
        toolbarItems.push(oToolBar.actionPan);  
		toolbarItems.push(oToolBar.actionMedl);				
		toolbarItems.push(oToolBar.actionMeda);
		toolbarItems.push("-");
        toolbarItems.push(oToolBar.actionPuntos);                
        toolbarItems.push(oToolBar.actionEliminaRuta);
        
        console.log(session);
        //toolbarItems.push("<-");	
        if(session != 1){
            toolbarItems.push("-");
            toolbarItems.push(oToolBar.actionIdentify);
        }
        else
        {
            toolbarItems.push("-");
            toolbarItems.push(oToolBar.actionPrint);    
        }			
                
		//toolbarItems.push(oToolBar.actionIdentif);
    
    mapPanel = new GeoExt.MapPanel({
        border: true,
        region: "center",
        //renderTo: win,
        // we do not want all overlays, to try the OverlayLayerContainer
        map: map,//OpenLayers.Map({allOverlays: false}),
        center: xy,
        zoom: 9,
        layers: oLayers.layers,
        tbar: [toolbarItems]
    });
    
    
// create our own layer node UI class, using the TreeNodeUIEventMixin
    var LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());
        
    // using OpenLayers.Format.JSON to create a nice formatted string of the
    // configuration for editing it in the UI
    var treeConfig = new OpenLayers.Format.JSON().write([{
        nodeType: "gx_baselayercontainer"
    }, /*{
        nodeType: "async",
        text:"WFS Layers",
        expanded: true,
    children:[{
            
    },
    {
            nodeType:"gx_layer",
            layer:"WFS Amenaza Remosion"
            },
    {
            nodeType:"gx_layer",
            layer:"WFS Amenaza Tsunami"
            },
    {
            nodeType:"gx_layer",
            layer:"WFS Riesgo Inundacion"
            },
    {
            nodeType:"gx_layer",
            layer:"WFS Amenaza Tsunami"
            }
    ]
        //expanded: true,
        // render the nodes inside this container with a radio button,
        // and assign them the group "foo".
       /* loader: {
            baseAttrs: {
                radioGroup: "foo",
                uiProvider: "layernodeui"
            }
        }
    },*/
{
    nodeType:"async",
    text:"Santa Elena",
    expanded: true,
    children:[{nodeType:"gx_layer",
            layer:"Limite Provincial"            
    },  
    {nodeType:"gx_layer",
    layer:"Parroquias"
    },
    /*{
            nodeType:"gx_layer",
            layer:"xyz"
    },*/
    {nodeType:"gx_layer",
    layer:"Zonas Seguras"
    },
    {
        nodeType:"gx_layer",
            layer:"Vias"
            }   ,
    {
        nodeType:"gx_layer",
            layer:"Discapacitados"
            }    
]     
},
{
    nodeType:"async",
    text:"WMS Amenazas",
    expanded: true,
    children:[{
                    nodeType:"gx_layer",
                    layer:"Amenaza Remoción de Masa"            
                  },  
                
                {
                    nodeType:"gx_layer",
                    layer:"Amenaza Inundacion"
                },                
                {
                    nodeType:"gx_layer",
                    layer:"Amenaza Tsunami"
                }    
            ]},
{
    nodeType:"async",
    text:"WMS Riesgo",
    expanded: true,
    children:[{nodeType:"gx_layer",
            layer:"WMS Riesgo Remocion Masa"            
    },
    {nodeType:"gx_layer",
            layer:"WMS Riesgo Inundacion"
                    
    }    
]     
},
{
    nodeType:"async",
    text:"Parroquia Chanduy",
    expanded: true,
    children:[{
            nodeType:"gx_layer",
            layer:"Comunidades Chanduy"
    },
    {
            nodeType:"gx_layer",
            layer:"Casas Comunales"
    },
    /*{
            nodeType:"gx_layer",
            layer:"demo"
    },*/
    {
            nodeType:"gx_layer",
            layer:"Albergues"
    }
       
]
       
}
], true);

    // create the tree with the configuration from above
    tree = new Ext.tree.TreePanel({
        border: true,
        region: "west",
        title: "Capas",
        width: 200,
        split: true,
        collapsible: true,
        collapseMode: "mini",
        autoScroll: true,
        plugins: [
            new GeoExt.plugins.TreeNodeRadioButton({
                listeners: {
                    "radiochange": function(node) {
                        alert(node.text + " is now the active layer.");
                    }
                }
            })
        ],
        loader: new Ext.tree.TreeLoader({
            // applyLoader has to be set to false to not interfer with loaders
            // of nodes further down the tree hierarchy
            applyLoader: false,
            uiProviders: {
                "layernodeui": LayerNodeUI
            }
        }),
        root: {
            nodeType: "async",
            // the children property of an Ext.tree.AsyncTreeNode is used to
            // provide an initial set of layer nodes. We use the treeConfig
            // from above, that we created with OpenLayers.Format.JSON.write.
            children: Ext.decode(treeConfig)
        },
        listeners: {
            "radiochange": function(node){
                alert(node.layer.name + " is now the the active layer.");
            }
        },
        rootVisible: false,
        lines: false/*,
        bbar: [{
            text: "Show/Edit Tree Config",
            handler: function() {
                treeConfigWin.show();
                Ext.getCmp("treeconfig").setValue(treeConfig);
            }
        }]*/
    });

  
    // dialog for editing the tree configuration
    var treeConfigWin = new Ext.Window({
        layout: "fit",
        hideBorders: true,
        closeAction: "hide",
        width: 300,
        height: 400,
        title: "Tree Configuration",
        items: [{
            xtype: "form",
            layout: "fit",
            items: [{
                id: "treeconfig",
                xtype: "textarea"
            }],
            buttons: [{
                text: "Save",
                handler: function() {
                    var value = Ext.getCmp("treeconfig").getValue()
                    try {
                        var root = tree.getRootNode();
                        root.attributes.children = Ext.decode(value);
                        tree.getLoader().load(root);
                    } catch(e) {
                        alert("Invalid JSON");
                        return;
                    }
                    treeConfig = value;
                    treeConfigWin.hide();
                }
            }, {
                text: "Cancel",
                handler: function() {
                    treeConfigWin.hide();
                }
            }]
        }]
    });
   
 
var protocol= new OpenLayers.Protocol.WFS({
                    url:  "http://localhost:8080/geoserver/chanduy/wfs",
                    featureType: "capas",
                    featureNS: "http://www.chanduy.org"
                });
                
var protocol_amen_inun= new OpenLayers.Protocol.WFS({
                    url:  "http://localhost:8080/geoserver/chanduy/wfs",
                    featureType: "amenaza_inundacion",
                    featureNS: "http://www.chanduy.org"                
                });
                
/*var protocoloAmenazaTsunami= new OpenLayers.Protocol.WFS({
                    url:  "http://localhost:8080/geoserver/chanduy/wfs",
                    featureType: "amenaza_tsunami",
                    featureNS: "http://www.chanduy.org"                
                });*/
                
var protocoloAmenazas= new OpenLayers.Protocol.WFS({
                    url:  "http://localhost:8080/geoserver/chanduy/wfs",
                    featureType: "f_naturales",
                    featureNS: "http://www.chanduy.org"                
                });
                
var protocoloRangos= new OpenLayers.Protocol.WFS({
                    url:  "http://localhost:8080/geoserver/chanduy/wfs",
                    featureType: "rango_amenazas",
                    featureNS: "http://www.chanduy.org"                
                });
      
      
   var store = new GeoExt.data.FeatureStore({
    fields: [{name:"nombre_par", type:"string"}
        //{name: "type", type: "string"}
    ],
    proxy: new GeoExt.data.ProtocolProxy({
            protocol: protocol              
        })
        //autoload:true
     });
     
      var dataTipos = new Ext.data.ArrayStore ({
        id:0,
        fields: ['id','tipo'], 
        data: [ 
        ['1', 'AMENAZA'], 
        ['2', 'RIESGO'], 
        ['3', 'VULNERABILIDAD']]
     });

      var dataFenomenos = new Ext.data.JsonStore({
                url:'php/cargarCombos.php',
                autoLoad: true,
                root:'fenomenosN',
                baseParams: {combo: 'fenomenos'},
                fields: ['id','fenomeno']
        });
     
         
     var store_amen_inun = new GeoExt.data.FeatureStore({
    fields: [{name:"gid", type:"integer"},
             {name:"rango", type:"string"}
        ],
    proxy: new GeoExt.data.ProtocolProxy({
            protocol: protocol_amen_inun              
        })
        //autoload:true
     });
     
         
    //Almacenamiento para rango de amenazas 
    var dataRangos = new Ext.data.JsonStore({
                    url:'php/cargarCombos.php',
                    //autoLoad: true,
                    root:'rangos',
                    baseParams: {combo:'rango'},
                    fields: ['id','rango']
    });
        
    //almacenamiento para tipo de amenazas
    var storeAmenazas = new GeoExt.data.FeatureStore({
    fields: [{name:"id", type:"integer"},
             {name:"descripcion", type:"string"}
        ],
    proxy: new GeoExt.data.ProtocolProxy({
            protocol: protocoloAmenazas            
        })
        });

     store.load();
     store_amen_inun.load();
     storeAmenazas.load();
       
var comboTipos = new Ext.form.ComboBox({
    id: 'cbTipos',
    fieldLabel:'Tipo',
    width: 125,
    editable:false,
    triggerAction: 'all',
    typeAhead: true,
    mode: 'local',
    store: dataTipos,
    valueFileld:'id',
    displayField: 'tipo',
     listeners:{
        select: {
            fn:function(combo) {
           // var comboCity = Ext.getCmp('cbx');
           var txt = comboTipos.getRawValue();
           if (txt != "Vulnerabilidad")
               {
                   comboEventos.setDisabled(false);
               }
               else
                   {
                      comboEventos.setDisabled(true);
                      //comboRangos.setDisabled(false);
                   }
            
                   }
                }
            } 
         });

//Combobox tipo de amenazas
var comboEventos = new Ext.form.ComboBox({
    fieldLabel:'Evento',
    store: dataFenomenos,//store_amen_inun,//store,
  /* filter: new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.OR,
                    filters: [
                        new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.EQUAL_TO,
                            property: "rango",
                            value: "Alta"
                        })
                    ]
                }),*/
    listeners:{
        select: {
            fn:function(combo) {
            comboRangos.setDisabled(false);
            
            }
        }
    },
    valueField: 'id',
    displayField: 'fenomeno',
    id:'cbAmenazas',
    labelAlign: 'left',
    width: 125,
    emptyText: 'Tipo Amenaza',
    triggerAction: 'all',
    editable:false,
    disabled:true
    //lastQuery:''
});

filtroRango = new OpenLayers.Filter.Comparison({ 
                   type: OpenLayers.Filter.Comparison.EQUAL_TO,
                   property: "rango",
                   value: myRango
                   });

//Combobox Rango de amenazas
var comboRangos = new Ext.form.ComboBox({
    fieldLabel:'Rango',
    width: 125,
    store: dataRangos,
    displayField: 'rango',
    valueField: 'id',
    id:'cbRangos',
    emptyText: 'Selecione rango',
    triggerAction: 'all',
    editable:false,
    disabled:true
    });

//******COLUMNAS DATAGRID***************
//columnas amenaza inundacion
var colsAmenazaInundacion = [
        { header: 'Id',  dataIndex: 'gid' },
        { header: 'va_geo_ind', dataIndex: 'va_geo_ind' },
        { header: 'va_hidr_in', dataIndex: 'va_hidr_in' },
        { header: 'va_gemf_in', dataIndex: 'va_gemf_in' },
        { header: 'va_isoy_fr', dataIndex: 'va_isoy_fr' },
        { header: 'va_pen_ind', dataIndex: 'va_pen_ind' },
        { header: 'suma', dataIndex: 'suma' },
        { header: 'porcentaje', dataIndex: 'porcentaje' },
        { header: 'rango', dataIndex: 'rango' }
        ];

//columnas amenaza tsunami
var colsAmenazaTsunami = [
        { header: 'Id',  dataIndex: 'gid' },
        { header: 'Docver', dataIndex: 'docver' },
        { header: 'Rango', dataIndex: 'rango' }        
        ];

//comunas amenaza remocion de masa
var colsAmenazaRemocion = [
        { header: 'Id',  dataIndex: 'gid' },
        { header: 'suma', dataIndex: 'su12345' },
        { header: 'va_sism_fr', dataIndex: 'va_sism_fr' },
        { header: 'va_isoy_fr', dataIndex: 'va_isoy_fr' },
        { header: 'total', dataIndex: 'sumto_7' },
        { header: 'porcentaje', dataIndex: 'porcentaje' },
        { header: 'rango', dataIndex: 'rango' }
        ];
        
//columnas riesgo Inundacion
var colsRiesgoInundacion = [
        { header: 'Id',  dataIndex: 'gid' },
        { header: 'Docver', dataIndex: 'docver' },
        { header: 'Rango', dataIndex: 'rango' }        
        ];
        
//columnas riesgo remocion
var colsRiesgoRemocion = [
        { header: 'Id',  dataIndex: 'gid' },
        { header: 'Docver', dataIndex: 'docver' },
        { header: 'Rango', dataIndex: 'rango' }        
        ];

/*
//Crear boton de consulta
var btnConsultar = new Ext.Button({
    width:75,
    text: 'Consultar', 
    handler: function() { 
      
        var dataGrid = Ext.getCmp('grid');
        
        var tipo = comboTipos.getValue();
        switch (tipo)
        {
            case "Amenaza":
                var evento= comboEventos.getValue();
                myRango= comboRangos.getRawValue();
                dataGrid.getSelectionModel();
                dataGrid.getSelectionModel().unbind();
                alert('as');
                switch (evento)
                {
                    //var sm = dataGrid.getSelectionModel();
                    
                    case 1:
                        //CASE AMENAZA INUNDACION
                        wfsAmenazaInundacion.filter = new OpenLayers.Filter.Comparison({ 
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "rango",
                        value: myRango
                        });
                        
                        wfsAmenazaInundacion.refresh({force:true});
                                        
                        dataGrid.reconfigure(storeAmenazaInundacion, 
                        new Ext.grid.ColumnModel(colsAmenazaInundacion));
                        dataGrid.store.bind(wfsAmenazaInundacion);
                        dataGrid.getSelectionModel().bind(wfsAmenazaInundacion);
                        break;
                           
                    case 2:
                        
                        amenazaRemocion.filter = new OpenLayers.Filter.Comparison({ 
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "rango",
                        value: myRango
                        });
                        
                        amenazaRemocion.refresh({force:true});                     
                        //Reconfigurar dataGrid
                        dataGrid.reconfigure(storeAmenazaRemosion, 
                        new Ext.grid.ColumnModel(colsAmenazaRemocion));
                        
                        dataGrid.store.bind(amenazaRemocion);
                        dataGrid.getSelectionModel().bind(amenazaRemocion);
                       // new GeoExt.grid.FeatureSelectionModel({layer: wfsAmenazaRemosion});
                       // new GeoExt.grid.FeatureSelectionModel({layers: wfsAmenazaRemosion}));
                        break;
                       
                    case 3:
                        //CASE AMENAZA TSUNAMI
                        wfsAmenazaTsunami.filter = new OpenLayers.Filter.Comparison({ 
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "rango",
                        value: myRango
                        });
                        wfsAmenazaTsunami.refresh({force:true});
                         
                        //Reconfigurar dataGrid
                        dataGrid.reconfigure(storeAmenazaTsunami, 
                        new Ext.grid.ColumnModel(colsAmenazaTsunami));
                        
                        dataGrid.getSelectionModel().bind(wfsAmenazaTsunami);
                        
                        break;
                    
                }
           
            break;
            
            case "Riesgo":
                var evento= comboEventos.getValue();
                myRango= comboRangos.getRawValue();
                dataGrid.getSelectionModel();
                dataGrid.getSelectionModel().unbind();
                
                 switch (evento)
                {
                    //var sm = dataGrid.getSelectionModel();
                    
                    case 1:
                       // dataGrid.getSelectionModel().unbind();
                        //CASE AMENAZA INUNDACION
                        wfsRiesgoInundacion.filter = new OpenLayers.Filter.Comparison({ 
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "rango",
                        value: myRango
                        });
                        
                        wfsRiesgoInundacion.refresh({force:true});
                                        
                        dataGrid.reconfigure(storeRiesgoInundacion, 
                        new Ext.grid.ColumnModel({defaults: {
	                            sortable: true
	                        }}));
                        //dataGrid.store(storeRiesgoInundacion);
                        dataGrid.store.bind(wfsRiesgoInundacion);
                        dataGrid.getSelectionModel().bind(wfsRiesgoInundacion);
                        break;
                           
                    case 2:
                        break;
                }
           
            break;
        
            case "Vulnerabilidad":
           
            break;
             
        }
        
    } 
});*/


/*var form = new Ext.FormPanel({
        id: 'company-form',
        frame: true,
        labelAlign: 'left',
        labelWidth: 40,
        buttonAlign: 'right',
        bodyStyle:'padding:5px 5px 0',
        width: 185,
        items:[comboTipos, comboEventos, comboRangos, btnConsultar]
});*/



var protDiscapacitados= new OpenLayers.Protocol.HTTP({
                    //url: "http://localhost:8080/geoserver/chanduy/wfs?service=WFS&version=1.0&request=GetFeature&typeName=chanduy:discapacitados&CQL_FILTER=INTERSECTS(geom,collectGeometries(queryCollection('chanduy:amenaza_inundacion','geom','rango=''Bajo''')))&CRS=EPSG:900913",
                    url:"http://localhost:8080/geoserver/chanduy/wfs?service=WFS&version=1.0&request=GetFeature&typeName=chanduy:discapacitados&CQL_FILTER=INTERSECTS(geom,collectGeometries(queryCollection(%27chanduy:amenaza_inundacion%27,%27geom%27,%27rango=%27%27Bajo%27%27%27)))&CRS=EPSG:32717",
                    format: new OpenLayers.Format.GML({
						extractStyles : true,
						extractAttributes : true
					})
                }); 
      
      
var dataDiscapacitados = new GeoExt.data.FeatureStore({
                layer: wfsDiscapacitados});
            
/*var filtrosDiscapacitados = [
 new Ext.util.Filter({
  property: "nombres", value: txtSearch.getValue()
 }),
 new Ext.util.Filter({
  property: "discapacid", value: txtSearch.getValue()
 })
];*/



search = new Ext.ux.form.SearchField({
                store: dataDiscapacitados,
                width:320//,

            });
//Crear gridPanel
gridPanel = new Ext.grid.GridPanel({
        title: "Resultados",
        id: "grid",
        region: "south",
        //split:"true",
        viewConfig: {forceFit: true},
        store: dataDiscapacitados,
        width: 1366,
        height: 150,//,
        sm: new GeoExt.grid.FeatureSelectionModel(),
       /* cm: new Ext.grid.ColumnModel({
	                        defaults: {
	                            sortable: true
	                        }	                       
	                    }),*/
        columns:[      
    ],
    
     tbar: [
            'Buscar: ', ' ',
            txtSearch,{
                text   : 'Imprimir',
                width : 100,               
                
      handler: function() {
                            var gridStore = gridPanel.getStore();  
                            var nrows = gridStore.getCount();
                            //console.log(rows);
                            if(nrows > 0){
                                 Ext.ux.Printer.print(Ext.getCmp('grid'));
                            }else{
                                //console.log('No existen datos por imprimir');
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    msg:  'No existen datos por imprimir.',
                                    width:200,
                                    icon: Ext.MessageBox.INFO,
                                    buttons: Ext.MessageBox.OK}
                                    );
                                //msgBox.show();
                            }
      }
            }]
      });
      
      
var legendPanel = new GeoExt.LegendPanel({
            width: '100%',
            border : false,            
            filter: function(record){
            //Your filter function goes here, note that the function is processed on each layer.
            // Return false for those layers you want to exclude.
            /*var layer = record.getLayer();
                return layer.displayInLayerSwitcher === true &&
                layer.isBaseLayer === false ; 
                //return layer.wfsAlbergues === false;
                //return !record.get("").wfsAlbergues; 
                console.log(record);
                alert("1");*/
                //console.log(record.get("layer").name);
               // console.log(1222);
               var layerName = record.get("layer").name;
               if( layerName == "wfsAlbergues" || layerName == "wfsDiscapacitados" || layerName == "Sectores" || layerName == "vector" )
               {
                    return false;
               }
               else
               {
                    return true; 
               }
               
            },            
            defaults: {
            style: 'padding:5px'
            },
            bodyStyle: 'padding:5px'
            //}	
      });
    
    
    var legend = new Ext.Panel({
            id:'leyenda',
            margins: '5 5 5 0',
            items: legendPanel,
            border: false
        });

    
    new Ext.Viewport({
        layout: "fit",
        hideBorders: true,
        //renderTo: win,
        items: {
            layout: "border",
            deferredRender: false,
            items: [mapPanel,//leyendaPanel,
            
                {
               // contentEl: "desc",
               
                layout: "accordion",
                region: "west",
                //bodyStyle: {"padding": "5px"},
                collapsible: true,
                collapseMode: "mini",
                split: true,
                width: 200,
                title: "",
                items:[tree,                
            {
                bodyStyle: {"padding": "5px"},
                collapsible: true,
                collapseMode: "mini",
                autoScroll:true,
                split: true,
                width: 200,
                title: "Leyenda",
                items: [legend]
                }                                  
                ]
            },
                {
                layout: "accordion",
                region: "east",
                collapsible: true,
                collapseMode: "mini",
                split: true,
                width: 200,
                title: "Consultas",
                items:[{                
                width: 200,
                title: "Albergues por Comunidad",
                items: [oForms.frmConsultaxDistancia]},
            {
                bodyStyle: {"padding": "5px"},
                collapsible: true,
                collapseMode: "mini",
                width: 200,
                title: "Grupos Vulnerables por Amenazas",
                items: [oForms.frmDiscapacitados]
                },   
            {
                bodyStyle: {"padding": "5px"},
                collapsible: true,
                collapseMode: "mini",
                split: true,
                width: 200,
                title: "Grupos Vulnerables por distancia",
                items: [oForms.frmTsunami]
                }                                    
                ]
            }, {//bodyStyle: {"padding": "5px"},
                layout: "accordion",
                id: "gridPanelAccordion",
                name: "gridPanelAccordion",
                region: "south",
                //collapsible: true,
                collapseMode: "mini",
                collapsed: true,
                split: true,
                height: 150,       
                items: gridPanel
            }
                   ]
        }
    });
});