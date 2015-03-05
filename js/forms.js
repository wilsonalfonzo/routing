//OpenLayers.ProxyHost = "proxy.cgi?url=";
var fields;
var trackingLayer;
var wfsurl;
var capaWfs;
var cols;

// WFS DISCAPACITADOS VARIABLES
var fieldsDiscapacitados;
var protDiscapacitados;
var dataDiscapacitados;
var colsDiscapacitados;

// WFS ALBERGUES VARIABLES
var fieldsAlbergues;
var protAlbergues;
var dataAlbergues;
var colsAlbergues;

var gridPanel;
var search;
var gridTitle;

function Forms()
{
    var wgs32717 = new OpenLayers.Projection("EPSG:32717");
    var wgs900913 = new OpenLayers.Projection("EPSG:900913");
    
        function getWfsLayer(layer1, layer2, range, wfsLayer, fields){
                    wfsProtocol= new OpenLayers.Protocol.HTTP({
                    srsName: "EPSG:32717",
                    strategies: [new OpenLayers.Strategy.BBOX()],
                    url:"http://localhost:8080/geoserver/chanduy/ows?service=WFS&version=1.0&request=GetFeature&typeName=chanduy:"+layer1+
                        "&CQL_FILTER=INTERSECTS(geom,collectGeometries(queryCollection('chanduy:"+layer2+"','geom','rango=''"+range+"''')))",
                    format: new OpenLayers.Format.GML({
                            extractStyles : true,
                            extractAttributes : true,
                            internalProjection: wgs900913,
                            externalProjection: wgs32717
                            })
                });
                    wfsData = new GeoExt.data.FeatureStore({
                        layer: wfsLayer,    
                        proxy: new GeoExt.data.ProtocolProxy({
                        protocol: wfsProtocol   
                    }),
                        fields: fields,
                        autoLoad: true
                    });    
                }                
                
            /*wmsAlbergues.mergeNewParams({'CQL_FILTER': "DWITHIN(geom, collectGeometries(queryCollection(
'chanduy:casas_comunales', 'geom', 'comunidad = ''" + cbComunas.getRawValue() + "''')), " + cbMetros.getRawValue() + " , meters)"});    */
             function getAlberguesComunidad(capa, comuna, radio, wfsLayer, fields){
                    comuna = encodeURI(comuna);
                    //comuna = encodeURIComponent(comuna);
                    wfsProtocol= new OpenLayers.Protocol.HTTP({  
                    srsName: "EPSG:32717",
                    strategies: [new OpenLayers.Strategy.BBOX()],   
                    //wmsAlbergues.mergeNewParams({'CQL_FILTER': "DWITHIN(geom, collectGeometries(queryCollection('chanduy:casas_comunales', 'geom', 'comunidad = ''" + cbComunas.getRawValue() + "''')), " + cbMetros.getRawValue() + " , meters)"});           
                    url:"http://localhost:8080/geoserver/chanduy/ows?service=WFS&version=1.0&request=GetFeature&typeName=chanduy:entidades&CQL_FILTER=DWITHIN(geom,collectGeometries(queryCollection('chanduy:"+capa+"','geom','comunidad=''"+comuna+"''')),"+radio+",meters)",
                    format: new OpenLayers.Format.GML({
                            extractStyles : true,
                            extractAttributes : true,
                            internalProjection: wgs900913,
                            externalProjection: wgs32717
                            })
                });       

                    wfsData = new GeoExt.data.FeatureStore({
                        layer: wfsLayer,    
                        proxy: new GeoExt.data.ProtocolProxy({
                        protocol: wfsProtocol   
                    }),
                        fields: fields,
                        autoLoad: true
                    });  
                }    

            function consultasTsunami(layer1, layer2, rango, distancia, wfsLayer, fields){
                wfsProtocol= new OpenLayers.Protocol.HTTP({
                    srsName: "EPSG:32717",
                    strategies: [new OpenLayers.Strategy.BBOX()],
                    url:"http://localhost:8080/geoserver/chanduy/ows?service=WFS&version=1.0&request=GetFeature&typeName=chanduy:"+layer1+
                        "&CQL_FILTER=DWITHIN(geom,collectGeometries(queryCollection('chanduy:"+layer2+"','geom','rango=''"+rango+"''','INCLUDE')),"+distancia+",meters)",
                    format: new OpenLayers.Format.GML({
                            extractStyles : true,
                            extractAttributes : true,
                            internalProjection: wgs900913,
                            externalProjection: wgs32717
                            })
                });
                    wfsData = new GeoExt.data.FeatureStore({
                        layer: wfsLayer,    
                        proxy: new GeoExt.data.ProtocolProxy({
                        protocol: wfsProtocol   
                    }),
                        fields: fields,
                        autoLoad: true
                    });               
            }
            
            function capaAlbergues(capa, rango){
                    protAlbergues= new OpenLayers.Protocol.HTTP({
                //url: "http://localhost:8080/geoserver/chanduy/wfs?service=WFS&version=1.0&request=GetFeature&typeName=chanduy:discapacitados&CQL_FILTER=INTERSECTS(geom,collectGeometries(queryCollection('chanduy:amenaza_inundacion','geom','rango=''Bajo''')))&CRS=EPSG:900913",
                    url:"http://localhost:8080/geoserver/chanduy/wfs?service=WFS&version=1.0&request=GetFeature&typeName=chanduy:entidades&CQL_FILTER=INTERSECTS(geom,collectGeometries(queryCollection('chanduy:"+capa+"','geom','rango=''"+rango+"''')))&CRS=EPSG:900913",
                    format: new OpenLayers.Format.GML({
                            extractStyles : true,
                            extractAttributes : true
                            })
                });       

                    dataAlbergues = new GeoExt.data.FeatureStore({
                        layer: wfsAlbergues,    
                        proxy: new GeoExt.data.ProtocolProxy({
                        protocol: protAlbergues   
                    }),
                        fields: fieldsAlbergues,
                        autoLoad: true
                    });    
                }

            /*
            Quitar filtros
            */    
                function quitarFiltros(){
                    //quitar filtro capa inundacion
                    delete amenazaInundacion.params.CQL_FILTER;
                    amenazaInundacion.redraw(true);

                    //quitar filtro capa remocion de masa
                    delete amenazaRemocion.params.CQL_FILTER;
                    amenazaInundacion.redraw(true);

                    /*delete Remocion.params.CQL_FILTER;
                    amenazaInundacion.redraw(true);*/
                }

                var btnLimpiarFiltro_1 = new Ext.Button({
                    width:75,
                    text: 'Consultar', 
                    disabled: true
                });

                //quitar filtros formulario grupos vulnerables por amenaza
                var btnQuitarFitrosAmenaza = new Ext.Button({
                    width:75,
                    text: 'Quitar filtros', 
                    disabled: true,
                    handler:function(){
                        quitarFiltros();
                    }
                });                

                //quitar filtros formulario grupos vulnerables por distancia
                var btnQuitarFitrosDistancia = new Ext.Button({
                    width:75,
                    text: 'Quitar filtros', 
                    disabled: true,
                    handler:function(){
                        quitarFiltros();
                    }
                });                

            /*
            */

    
  //FORMULARIOS ZONAS SEGURAS / ENTIDADES 
        var dataComunidades = new Ext.data.JsonStore({
                url:'php/cargarCombos.php',
                autoLoad: true,
                root:'data',
                baseParams: {combo: 'comunidades'},
                fields: ['code','nombre']
        });

        var dataPuntos = new Ext.data.JsonStore({
                url:'php/consultas.php',
                //autoLoad: true,
                root:'puntos',
               // baseParams: {combo:'',comuna: ''},
                fields: ['x','y']
        });    

         var dataMetros = new Ext.data.JsonStore({
                url:'php/cargarCombos.php',
                autoLoad: true,
                root:'metros',
                baseParams: {combo: 'radio'},
                fields: ['id','metros']
        });
			                               
    var cbComunas = new Ext.form.ComboBox({
    fieldLabel:'Comunidad',
    store: dataComunidades,
    valueField: 'code',
    displayField:'nombre',
    typeAhead: true,
    triggerAction: 'all',
    emptyText: 'Selecione comuna',
    width: 110,
    editable:false,
    listeners:{
        select: {
            fn:function(combo) {
                dataPuntos.load({ 
                params:{  
			comuna:this.getRawValue()
					}
            });
            cbMetros.setDisabled(false);
           }
        }
    }    
    });
   //seleccionar el primer elemeto del combo 
   dataPuntos.on('load', function(my, record, options) {
   cbOculto.setValue(record[0].get('x'));
   });

    var cbOculto = new Ext.form.ComboBox({
    fieldLabel:'Selecciona',
    width: 100,
    store: dataPuntos,
    valueField: 'x',
    displayField: 'y',
    mode: 'local',
    emptyText: 'Selecione radio',
    triggerAction: 'all',
    editable:false,
    hidden:true    
    });

    var cbMetros = new Ext.form.ComboBox({
    fieldLabel:'Distancia (m)',
    store: dataMetros,
    displayField:'metros',
    valueField:'id',
    typeAhead: true,
    triggerAction: 'all',
    emptyText: '(m)',
    width: 110,
    editable:false,
    disabled: true,
    listeners:{
        select: { fn:function(button)
            {
                btnConsultarAlbergues.setDisabled(false);
            }
            }
                
            }
    });
 
    var btnConsultarAlbergues = new Ext.Button({
        width:75,
        text: 'Consultar', 
        disabled: true,
        handler: function() { 
            //HIDE ALL LAYERS
            wfsDiscapacitados.setVisibility(false);
            
            capaWfs = wfsAlbergues;
            fields = fieldsAlbergues;
            cols = colsAlbergues;
            var comuna = cbComunas.getRawValue();
            //alert(cbComunas.getValue());
            //comuna = comuna.replace(/ /g, '_');
            var radio = cbMetros.getRawValue();
            var capa  = "casas_comunales";

            getAlberguesComunidad(capa, comuna, radio, capaWfs, fields)
            
            //gridPanel.store.unbind();
            gridPanel.getSelectionModel().unbind();
            gridPanel.reconfigure(wfsData, new Ext.grid.ColumnModel(cols));
            capaWfs.setVisibility(true);
            gridPanel.store.bind(capaWfs);
            gridPanel.getSelectionModel().bind(capaWfs);
            gridPanel.setTitle('Albergues por Comunidad');            
            Ext.getCmp('gridPanelAccordion').expand();
            /*
            gridPanel.reconfigure(wfsData, new Ext.grid.ColumnModel(cols));
                        gridPanel.store.bind(wfsDiscapacitados);
                        gridPanel.getSelectionModel().bind(wfsDiscapacitados);
                        gridPanel.setTitle('Grupos Vulnerables - Riesgo Remoción de Masa');
            */


            tipoFiltro = 2;
            sectorLayer.removeAllFeatures();
            var lon =cbOculto.getRawValue();  
            var lat = cbOculto.getValue();
           
            var point = new OpenLayers.Geometry.Point (lat, lon).transform(new OpenLayers.Projection("EPSG:32717"),new OpenLayers.Projection("EPSG:900913"));
           
            var circle = OpenLayers.Geometry.Polygon.createRegularPolygon(point, cbMetros.getRawValue(), 30, 0);
            
        	var feature = new OpenLayers.Feature.Vector(circle);
        	sectorLayer.addFeatures([feature]);
        	sectorLayer.redraw();
            map.zoomToExtent(sectorLayer.getDataExtent());
            //wmsAlbergues.setVisibility(true);
            wmsComunidadesChanduy.setVisibility(true);
           // wmsEntidades.redraw();
        }
    });

           
        this.frmConsultaxDistancia = new Ext.FormPanel({
        id: 'frmConsultaRadio',
        //frame: true,
        labelAlign: 'left',
        labelWidth: 75,
        buttonAlign: 'right',
        border:false,
        bodyStyle:'padding:5px 5px 0',
        items:[cbComunas, cbOculto, cbMetros],
         buttons: [btnConsultarAlbergues, btnLimpiarFiltro_1]
        });
//FIN DEL FORMULARIO CONSULTA ENTIDADES X DISTANCIA

//FORMULARIO CONSULTA DISCAPACITADOS POR AMENAZAS

    var dataTipos = new Ext.data.ArrayStore ({
            id:0,
            fields: ['id','tipo'], 
            data: [ 
            ['1', 'AMENAZA'], 
            ['2', 'RIESGO']]//, 
            //['3', 'VULNERABILIDAD']]
         });

      var dataEventos = new Ext.data.JsonStore({
                url:'php/cargarCombos.php',
                autoLoad: true,
                root:'fenomenosN',
                baseParams: {combo: 'fenomenos'},
                fields: ['id','fenomeno']
        });
         
    //Almacenamiento para rango de amenazas 
    var dataRangos = new Ext.data.JsonStore({
                    url:'php/cargarCombos.php',
                    //autoLoad: true,
                    root:'rangos',
                    baseParams: {combo:'rango'},
                    fields: ['id','rango']
    });
        
           
var cbTipos = new Ext.form.ComboBox({
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
                     
           var txt = cbTipos.getRawValue();
           dataEventos.load({ params:{ combo: 'fenomenos' , tipo: '1' } });
           if (txt != "Vulnerabilidad")
           {
               cbEventos.setDisabled(false);     

               //dataEventos.load({ params:{ combo: 'fenomenos', tipo: txt  } });

               /*if(txt == "RIESGO")
               {
                console.log(txt);
                dataEventos.load({ params:{ combo: 'fenomenos', tipo: '1' } });
               }
               else
               {
                
               }*/

           }
           else
           {

                cbEventos.setDisabled(true);
                dataEventos.clearFilter();

                dataEventos.filterBy(function (record) { 
                  
                if (record.get('id') == '1' || record.get('id') == 'TSUNAMI') return record;
               });

              btnConsultar.setDisabled(false);
              //comboRangos.setDisabled(false);
           }
           
            
                   }
                }
            } 
         });

//Combobox tipo de amenazas
var cbEventos = new Ext.form.ComboBox({
    fieldLabel:'Evento',
    store: dataEventos,
    listeners:{
        select: {
            fn:function(combo) {
            cbRangos.setDisabled(false);
            
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
   });
   
    var cbRangos = new Ext.form.ComboBox({
        fieldLabel:'Rango',
        width: 125,
        store: dataRangos,
        displayField: 'rango',
        valueField: 'id',
        id:'cbRangos',
        emptyText: 'Selecione rango',
        triggerAction: 'all',
        editable:false,
        disabled:true,
        listeners:{
        select: {
            
            fn:function() {
            btnConsultar.setDisabled(false);
            //alert('vbbb');
            }
        }}
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
    //FIN COLUMAS DEL DATAGRID
    
    //DATOS DEL GRID / WFS DISCAPACITADOS 
    fieldsDiscapacitados =[ {name: 'nombres', type: 'string'},
                            {name: 'edad', type: 'string'},
                            {name: 'cedula', type: 'string'},                            
                            {name: 'discapacid', type: 'string'},
                            {name: 'telefonos', type: 'string'},
                            {name: 'parroquia', type: 'string'},
                            {name: 'direccion', type: 'string'}                            
                        ];             
    
    colsDiscapacitados = [
                            {header: "Nombre", dataIndex: "nombres", sortable: true},
                            {header: "Edad", dataIndex: "edad"},
                            {header: "Cedula", dataIndex: "cedula", sortable: true},                            
                            {header: "Discapacidad", dataIndex: "discapacid"},
                            {header: "Telefono", dataIndex: "telefonos"},
                            {header: "Parroquia", dataIndex: "parroquia"},
                            {header: "Direccion", dataIndex: "direccion"}                            
                        ];
        
    //DATOS DEL GRID / WFS ALBERGUES    
     fieldsAlbergues =[ {name: 'descriptio', type: 'string'},
                            {name: 'tipo', type: 'string'},
                            {name: 'altitude', type: 'string'},
                            {name: 'comuna', type: 'comuna'}
                        ];             
    
    colsAlbergues = [
        {header: "Nombre", dataIndex: "descriptio", sortable: true},
        {header: "Tipo", dataIndex: "tipo", sortable: true},
        {header: "Elevacion", dataIndex: "altitude"},
        {header: "Comuna", dataIndex: "comuna"} ];    
    
    var btnConsultar = new Ext.Button({
    width:75,
    text: 'Consultar', 
    disabled: true,
    handler: function() {

   /* var filtro = new OpenLayers.Filter.Comparison({ 
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "rango",
                        value: "Medio"
                         });*/
                        
    //wmsAmenazaInundacion.redraw({force:true});
      
    var tipo = cbTipos.getRawValue();
    
    //HIDE ALL LAYERS
    wfsDiscapacitados.setVisibility(false);
    wfsAlbergues.setVisibility(false);

    var capa1 = groupCapas.getValue().getGroupValue();
                        if (capa1 == "discapacitados"){
                            capaWfs = wfsDiscapacitados;
                            fields = fieldsDiscapacitados;
                            cols = colsDiscapacitados;
                            tipoFiltro = 1;
                            
                        }else{
                           capaWfs = wfsAlbergues;
                           fields = fieldsAlbergues;
                           cols = colsAlbergues;
                           tipoFiltro = 2;
                        }
               
       switch (tipo)
        {
            case "AMENAZA":
                gridPanel.getSelectionModel().unbind();
                var evento= cbEventos.getRawValue();
                
                amenazaInundacion.setVisibility(false);
                amenazaRemocion.setVisibility(false);
                wmsRiesgoInundacion.setVisibility(false);
                wmsRiesgoRemocion.setVisibility(false);
                wmsDiscapacitados.setVisibility(false );
                
                switch (evento)
                {
                    case "INUNDACION":
                        /*
                        remove filters amenazaInundacion
                        */                        
                        delete amenazaRemocion.params.CQL_FILTER;
                        amenazaRemocion.redraw(true);
                        
                        amenazaInundacion.mergeNewParams({ 'CQL_FILTER': "rango='" + cbRangos.getRawValue()+"'"});
                        amenazaInundacion.setVisibility(true);
                        //  NEW FWS LAYER FORM GML
                        var rango = cbRangos.getRawValue();
                        
                        var capa2  = "amenaza_inundacion";
                        //radioGroupVal();
                        getWfsLayer(capa1, capa2, rango, capaWfs, fields);
                        //  RECONFIGURE DATAGRID
                        capaWfs.setVisibility(true);
                        gridPanel.reconfigure(wfsData, new Ext.grid.ColumnModel(cols));
                        
                       // alert("123");
                       // dataGrid.reconfigure(storeAmenazaInundacion, 
                        //new Ext.grid.ColumnModel(colsAmenazaInundacion));
                        capaWfs.setVisibility(true);
                        gridPanel.store.bind(capaWfs);
                        //alert('here');
                        search.store = capaWfs;

                        //wfsData.load({params:{start: 0, limit: 100}});
                        wfsData.load({params:{start:0, limit:20, forumId: 4}});
                       // search.onTriggerSearch();
                        gridPanel.getSelectionModel().bind(capaWfs);
                        gridPanel.setTitle('Grupos Vulnerables - Amenaza de Inundación');
                        Ext.getCmp('gridPanelAccordion').expand();
                        break;
                       
                    case "TSUNAMI":
                       
                        break;
                       
                    case "REMOCION DE MASA":
                        /*
                        remove filters amenazaInundacion
                        */                        
                        delete amenazaInundacion.params.CQL_FILTER;
                        amenazaInundacion.redraw(true);

                        amenazaRemocion.mergeNewParams({ 'CQL_FILTER': "rango='" + cbRangos.getRawValue()+"'"});
                        amenazaRemocion.setVisibility(true);
                        //  NEW FWS LAYER FORM GML
                        var rango = cbRangos.getRawValue();
                        var capa2  = "amenaza_remocion_masa";
                        
                        getWfsLayer(capa1, capa2, rango, capaWfs, fields);
                        //  RECONFIGURE DATAGRID
                        capaWfs.setVisibility(true);
                        gridPanel.reconfigure(wfsData, new Ext.grid.ColumnModel(cols));
                        gridPanel.store.bind(capaWfs);
                        gridPanel.getSelectionModel().bind(capaWfs);
                        gridPanel.setTitle('Grupos Vulnerables - Amenaza Remoción de Masa');
                        Ext.getCmp('gridPanelAccordion').expand();
                        break;                   
                }
           
            break;
            
            case "RIESGO":
                gridPanel.getSelectionModel().unbind(); 
               var evento= cbEventos.getRawValue();
              
                amenazaInundacion.setVisibility(false);
                amenazaRemocion.setVisibility(false);
                wmsRiesgoInundacion.setVisibility(false);
                wmsRiesgoRemocion.setVisibility(false);
                wmsDiscapacitados.setVisibility(false );
                
                //myRango= comboRangos.getRawValue();
                //dataGrid.getSelectionModel();
                //dataGrid.getSelectionModel().unbind();
                switch (evento)
                {
                    //var sm = dataGrid.getSelectionModel();
                    
                    case "INUNDACION":
                       // wmsDiscapacitados.mergeNewParams({'CQL_FILTER': "INTERSECTS(geom, collectGeometries(queryCollection('chanduy:', 'geom','rango = ''"+cbRangos.getRawValue()+"''')))"});
                        wmsRiesgoInundacion.mergeNewParams({ 'CQL_FILTER': "rango='" + cbRangos.getRawValue()+"'"});
                        //wmsDiscapacitados.setVisibility(true);
                        wmsRiesgoInundacion.setVisibility(true);
                        
                        //  NEW FWS LAYER FORM GML
                                              
                        var rango = cbRangos.getRawValue();
                        //var capa1 = groupCapas.getValue().getGroupValue();
                        var capa2  = "riesgo_inundacion";
                        
                        getWfsLayer(capa1, capa2, rango, capaWfs, fields);
                        //  RECONFIGURE DATAGRID
                        capaWfs.setVisibility(true);
                        gridPanel.reconfigure(wfsData, new Ext.grid.ColumnModel(cols));
                        gridPanel.store.bind(capaWfs);
                        gridPanel.getSelectionModel().bind(capaWfs);
                        gridPanel.setTitle('Grupos Vulnerables - Riesgo Inundación');
                        Ext.getCmp('gridPanelAccordion').expand();
                        break;
                        
                    case "TSUNAMI":
                       
                        break;
                       
                    case "REMOCION DE MASA":
                        //wmsDiscapacitados.mergeNewParams({'CQL_FILTER': "INTERSECTS(geom, collectGeometries(queryCollection('chanduy:riesgo_remocion_masa', 'geom','rango = ''"+cbRangos.getRawValue()+"''')))"});
                        wmsRiesgoRemocion.mergeNewParams({ 'CQL_FILTER': "rango='" + cbRangos.getRawValue()+"'"});
                        //wmsDiscapacitados.setVisibility(true);
                        wmsRiesgoRemocion.setVisibility(true);
                        
                        //  NEW FWS LAYER FORM GML
                        var rango = cbRangos.getRawValue();
                        //var capa1 = groupCapas.getValue().getGroupValue();
                        var capa2  = "riesgo_remocion_masa";
                       getWfsLayer(capa1, capa2, rango, capaWfs, fields);
                        //  RECONFIGURE DATAGRID
                        capaWfs.setVisibility(true);
                        gridPanel.reconfigure(wfsData, new Ext.grid.ColumnModel(cols));
                        gridPanel.store.bind(wfsDiscapacitados);
                        gridPanel.getSelectionModel().bind(wfsDiscapacitados);
                        gridPanel.setTitle('Grupos Vulnerables - Riesgo Remoción de Masa');
                        Ext.getCmp('gridPanelAccordion').expand();
                    break;
                }
        }
      }
    });
    


var groupCapas = new Ext.form.RadioGroup
(    
    {    
        fieldLabel: 'Capa',
        id:"capaConsulta1",
        columns : 1,
        name:'capaConsulta1',
        items:     [{
                    
                    boxLabel : "Discapacitados" , 
                    name: 'capaConsulta',
                    inputValue:'discapacitados',
                    id:'capaDiscapacitados',
                    checked: true
                                        
                },{
                    boxLabel: "Albergues",
                    name: 'capaConsulta',
                    inputValue:'entidades',
                    id: 'capaAlbergues'                   
                    
                }]   
    }
);


    this.frmDiscapacitados = new Ext.FormPanel({
        id: 'frmDiscapacitados',
        labelAlign: 'left',
        labelWidth: 60,
        buttonAlign: 'right',
        width: 185,
        border: false,
        //defaultType: 'textfield',
        //layout: 'column',  
        items:[groupCapas, cbTipos, cbEventos, cbRangos, btnConsultar]
    });

/*
*   Funciones y controles para 
*   formulario de distancia
*/    

//TSUNAMI POR DISCAPACITADOS
    var cbRangos2 = new Ext.form.ComboBox({
        fieldLabel:'Rango',
        width: 100,
        store: dataRangos,
        displayField: 'rango',
        valueField: 'id',
        id:'cbRangos2',
        emptyText: 'Selecione rango',
        triggerAction: 'all',
        editable:false,
        disabled:true,
        listeners:{
        select: {
            
            fn:function() {
            btnConsultar.setDisabled(false);            
            }
        }}
    });
    
    var txtMetros = new Ext.form.TextField({
                    fieldLabel: 'Distancia (m)',
                    width:100,
                    name: 'distancia',
                     listeners:{
                                change: {
                                        fn:function() {
                                            var string = this.getValue();
                                            if (string != ''){
                                                cbRangos2.setDisabled(false);
                                            }else{
                                                cbRangos2.setDisabled(true);
                                            }
                                        }
                                        }
                                }
                });

                    
    //Combobox tipo de amenazas
var cbxAmenazas = new Ext.form.ComboBox({
    fieldLabel:'Evento',
    store: dataEventos,
    listeners:{
        select: {
            fn:function(combo) {
            //cbRangos.setDisabled(false);           
            }
        }
    },
    valueField: 'id',
    displayField: 'fenomeno',
    id:'cbxAmenazas',
    labelAlign: 'left',
    width: 100,
    emptyText: 'Tipo Amenaza',
    triggerAction: 'all',
    editable:false
    //disabled:true
   });

var btnTsunami = new Ext.Button({
    width:75,
    text: 'Consultar', 
    //disabled: true,
    
    handler: function() {
        /*alert(mostrarCapa);
        if (mostrarCapa != "" && mostrarCapa !== undefined){
            mostrarCapa.setVisibility(false);
        }*/
        tipoFiltro = 1;
        amenazaTsunami.setVisibility(false);
        amenazaInundacion.setVisibility(false);
        amenazaRemocion.setVisibility(false);

        distancia = txtMetros.getValue();
        //alert (distancia);
        
        //consultasTsunami(distancia,wfsDiscapacitados,fieldsDiscapacitados );
       // var rango = Encoder.EncodeType = cbRangos2.getRawValue();
        //var encoded = Encoder.htmlEncode(document.getElementById('cbRangos2'));
        var rango = cbRangos2.getRawValue();
        var layer2 = "";
        var mostrarCapa = "";

        if (cbxAmenazas.getRawValue() == 'TSUNAMI'){
            layer2 = 'amenaza_tsunami';
            mostrarCapa = amenazaTsunami;
            gridTitle = gridPanel.setTitle('Grupos Vulnerables - Amenaza por Tsunami');
        }else if (cbxAmenazas.getRawValue() == 'INUNDACION'){
            layer2 = 'amenaza_inundacion';
            mostrarCapa = amenazaInundacion;
            gridTitle = gridPanel.setTitle('Grupos Vulnerables - Amenaza por Inundación');
        }else{
            layer2 = 'amenaza_remocion_masa';
            mostrarCapa = amenazaRemocion;
            gridTitle = gridPanel.setTitle('Grupos Vulnerables - Amenaza por Remoción de Masa');
        }
       
        //var rango = String.Format(url, Server.UrlEncode());
        consultasTsunami("discapacitados",layer2, rango, distancia,wfsDiscapacitados,fieldsDiscapacitados );
        gridPanel.reconfigure(wfsData, new Ext.grid.ColumnModel(colsDiscapacitados));
        gridPanel.store.bind(wfsDiscapacitados);
        gridPanel.getSelectionModel().bind(wfsDiscapacitados);
        //amenazaTsunami.setVisibility(true); 
        mostrarCapa.setVisibility(true);
        Ext.getCmp('gridPanelAccordion').expand();

        tipoFiltro = 1;
    }
});

//IMPRIMIR GRID
	var btnPrintGrid = new Ext.Button({
			 text   : 'Imprimir Tabla',
                handler: function() {
				 Ext.ux.Printer.print(Ext.getCmp('grid'));
                },
				 margins: '20 0 0 0'
		}); 

    this.frmTsunami = new Ext.FormPanel({
        id: 'frmTsunami',
        labelAlign: 'left',
        labelWidth: 75,
        buttonAlign: 'right',
        width: 185,
        border: false,
        //defaultType: 'textfield',
        //layout: 'column',  
        items:[txtMetros, cbxAmenazas, cbRangos2, btnTsunami]
    });

/*
*   C'ALCULO DE RUTAS
*   GRID
*   LABEL
*   WINDOW
*/

//-->1
    dataRuta = new Ext.data.JsonStore({
        url:'php/pgrouting.php',
        autoLoad: true,
        root:'ruta',
        autoload:true,
        //baseParams: {combo: 'radio'},
        fields: ['distancia','descripcion','velocidad','tiempo_min']
    });

//-->2
    colsRuta = [
        { width:50, header: 'Velocidad promedio',  dataIndex: 'descripcion' },
        { width:25, header: 'Km/h',  dataIndex: 'velocidad' },
        { width: 50, header: 'Tiempo Aprox. min',  dataIndex: 'tiempo_min' }
    ];

    lbDistancia = new Ext.form.Label({
        id: 'lbDistancia',
        text : 'Category ',        
        width:400,
        height:200,       
        style: 'font-weight:bold;',
        anchor:'100%'
    });

    gridRuta = new Ext.grid.GridPanel({
        id: "grid",
        width:400,        
        height:150,
        viewConfig: {forceFit: true},
        store: dataRuta,
        columns: colsRuta
    });

this.frmRuta = new Ext.FormPanel({
        id: 'frmRuta',
        labelAlign: 'left',
        renderTo: win,
        labelWidth: 400,
        buttonAlign: 'right',
        width: 400,
        border: false,
        //defaultType: 'textfield',
        //layout: 'column',  
        items:[lbDistancia, gridRuta]
    });

 win = new Ext.Window({
        title:'Cálculo de ruta',
        closeAction: 'hide',
        //renderTo: Ext.getBody(),
       // autoShow: true,
        //modal: true,
        layout:'fit',
        width:400,
        height:180,
        closable:true,
        //collapsible: true,
        items:[this.frmRuta]
    });

    /*
    search box
    */
    txtSearch = new Ext.form.TextField({
        fieldLabel: 'test',
        width:500,
        name: 'txtSearch',
        enableKeyEvents: true,
        listeners:{
                    keyup: {
                            fn:function(form, e) {
                                console.log(tipo);
                                var searchValue = this.getValue();
                                if(searchValue != ""){
                                    var testStore = gridPanel.getStore();  
                                    var rows = testStore.getCount();
                                    console.log(rows);
                                    if(rows > 0){                                  
                                        if (tipoFiltro == 1){     
                                            testStore.filter([{property:'nombres', value:searchValue}]);
                                        }else{
                                            testStore.filter([{property:'descriptio', value:searchValue}]);
                                        }
                                    }
                                                      /*{property:'nombres', value:searchValue} *///])  ;
                                }else{
                                    gridPanel.store.clearFilter();
                                }
                                    
                            }
                    }
                }
    });

/*
message box
*/

}