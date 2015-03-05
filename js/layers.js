//var wmsLimiteProvincial;
var renderer;
var protocoloRiesgoInundacion;

var storeAmenazaTsunami;
var storeAmenazaInundacion;
var storeAmenazaRemocion;

var storeRiesgoInundacion;
var storeRiesgoRemocion;

var wmsRuta;
var wmsLimiteProvincial;
var wmsVias;
var wmsParroquias;
var wmsAmenazaInundacion;
var wmsZonasSeguras;
var wmsAmenazaRemocion;
var wmsAmenazaTsunami;

var wmsRiesgoRemocion;
var wmsRiesgoInundacion;
var wmsComunidadesChanduy;
var wmsCasasComunales;
var wmsAlbergues;
var wmsDiscapacitados;
var wfsPrueba;
var wmsSqlInundacion;

var wfsAmenazaInundacion;
var wfsAmenazaRemocion;
var wfsAmenazaTsunami;

var wfsRiesgoInundacion;
var wfsRiesgoRemocion;

var tracking;
var greenFlag;

var sectorLayer;
//var trackingLayer;

//var layerAmenInundacion;

function Layers(){
  //  this.layers = new OpenLayers.Layer.OSM("Simple OSM Map");
    
    this.LayerBase = new OpenLayers.Layer.OSM("Simple OSM Map");/*
    
    var layerList =[{    
                    text: 'Background Layers',
                    leaf: false,                    
                    expanded: true,
                    children: [{
                        nodeType: 'gx_layer',
                        layer: oms,
                        checked: false
                        }]
    }
   */
          
     greenFlag = OpenLayers.Util.applyDefaults(
        {externalGraphic: "img/${greenFlag}.png", pointRadius: 20},
        OpenLayers.Feature.Vector.style["default"]);
        var styleMap = new OpenLayers.StyleMap({"default": greenFlag, "select": {pointRadius: 30}});           
        
         //SQL AMENAZA INUNDACION
         wmsSqlInundacion = new OpenLayers.Layer.WMS("WMS SQL Inundacion",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'vistaAmenInundacion',
            layers: 'chanduy:vista_amenaza_inundacion',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });
        
        //WFS LIMTE PROVINCIAL
        wmsLimiteProvincial = new OpenLayers.Layer.WMS("Limite Provincial",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'vistaAmenazaInundacion',
            layers: 'chanduy:limite_provincial',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });  
        
        //WMS PARROQUIAS
        wmsParroquias = new OpenLayers.Layer.WMS("Parroquias",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'parroquias',
            layers: 'chanduy:parroquias',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });  
        
        //WFS AMENAZA INUNDACION
        /*wmsAmenazaInundacion = new OpenLayers.Layer.WMS("WMS Amenaza Inundacion",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'vistaAmenazaInundacion',
            layers: 'chanduy:amenaza_inundacion',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });  */
        
        //WMS AMENAZA REMOSION DE MASA
         amenazaRemocion = new OpenLayers.Layer.WMS("Amenaza Remoción de Masa",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'amenazaRemocion',
            layers: 'chanduy:amenaza_remocion_masa',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        }); 
        
        //WFS AMENAZA INUNDACION
        amenazaInundacion = new OpenLayers.Layer.WMS("Amenaza Inundacion",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'amenazaInundacion',
            layers: 'chanduy:amenaza_inundacion',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });
        
        //WMS AMENAZA TSUNAMI
        amenazaTsunami = new OpenLayers.Layer.WMS("Amenaza Tsunami",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'amenazaTsunami',
            layers: 'chanduy:amenaza_tsunami',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });
        
        //WMS AMENAZA REMOSION DE MASA
       /*  wmsAmenazaRemocion = new OpenLayers.Layer.WMS("Amenaza Remosión de Masa",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'vistaAmenRemocion',
            layers: 'chanduy:amenaza_remocion_masa',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });               */
        
        //WMS RIESGO REMOSION
        wmsRiesgoRemocion = new OpenLayers.Layer.WMS("WMS Riesgo Remocion Masa",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'vistaAmenRemocion',
            layers: 'chanduy:riesgo_remocion_masa',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });
        
        //WMS RIESGO INUNDACION
        wmsRiesgoInundacion = new OpenLayers.Layer.WMS("WMS Riesgo Inundacion",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'vistaAmenRemocion',
            layers: 'chanduy:riesgo_inundacion',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });
        
        //WMS COMUNIDADES CHANDUY
        wmsComunidadesChanduy = new OpenLayers.Layer.WMS("Comunidades Chanduy",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'comunidadesChanduy',
            layers: 'chanduy:comunaschanduy',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });
        
         //WMS CASAS COMUNALES
        wmsCasasComunales = new OpenLayers.Layer.WMS("Casas Comunales",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'comunidadesChanduy',
            layers: 'chanduy:casas_comunales',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });
        
         //WMS ENTIDADES
        wmsAlbergues = new OpenLayers.Layer.WMS("Albergues",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'entidadesChanduy',
            layers: 'chanduy:entidades',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });
        
         //WMS ZONAS SEGURA
        wmsZonasSeguras = new OpenLayers.Layer.WMS("Zonas Seguras",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'zonasSeguras',
            layers: 'chanduy:zonas_seguras',
            version: '1.3.0',
            format: 'image/png',
            transparent: true,
            style:styleMap
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });
        
        //WMS ENTIDADES
        wmsDiscapacitados = new OpenLayers.Layer.WMS("Discapacitados",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id: 'entidadesChanduy',
            layers: 'chanduy:discapacitados',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });
        
        //WMS RUTA MAS CORTA
        wmsRuta = new OpenLayers.Layer.WMS("pgrouting",
            "http://localhost:8080/geoserver/chanduy/wms",
            {
            layers: 'chanduy:pgrouting',
            version: '1.3.0',
            format: 'image/png',
           // viewparams:'x1:543603.0981478957;y1:9735391.646607857;x2:543906.9671379762;y2:9730235.07913521',
            //viewparams: 'x1:545738.9760560881;y1:9729779.554061841;x2:550012.660187293;y2:9725835.095122024',
            transparent: true
            },
            {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
            
            });
        
        //WMS VIAS
        wmsVias= new OpenLayers.Layer.WMS("Vias",
            "http://localhost:8080/geoserver/chanduy/wms",
            {id:'vias',
            layers: 'chanduy:vias',
            version: '1.3.0',
            format: 'image/png',
            transparent: true
            },
        {
            cisBaseLayer: false, 
            projection: 'EPSG:900913'
        });
        
       // trackingLayer = new OpenLayers.Layer.Vector("demo");
        
//******* DECLARACION DE PROTOCOLOS **********//
        //Protocolo Amenaza Inundacion      
        var protocoloAmenazaInundacion= new OpenLayers.Protocol.WFS({
        url:"http://localhost:8080/geoserver/chanduy/wfs",
        version: "1.1.0",
        //id:'amenInundacion',
        featureType: "amenaza_inundacion",
        featureNS: "http://www.chanduy.org"
         });
         
        var protocoloAmenazaRemocion= new OpenLayers.Protocol.WFS({
            url:"http://localhost:8080/geoserver/chanduy/wfs",
            version: "1.1.0",
            //id:'amenInundacion',
            featureType: "amenaza_remocion_masa",
            featureNS: "http://www.chanduy.org"
        });
                     
        var protocoloAmenazaTsunami= new OpenLayers.Protocol.WFS({
        url:"http://localhost:8080/geoserver/chanduy/wfs",
        version: "1.1.0",
        //id:'amenInundacion',
        featureType: "amenaza_tsunami",
        featureNS: "http://www.chanduy.org"
         });
         
         //Protocolo Amenaza Inundacion      
       var protocoloRiesgoInundacion= new OpenLayers.Protocol.WFS({
        url:"http://localhost:8080/geoserver/chanduy/wfs",
        version: "1.1.0",
        //id:'amenInundacion',
        featureType: "riesgo_inundacion",
        featureNS: "http://www.chanduy.org"
         });
         
        var protocoloRiesgoRemocion= new OpenLayers.Protocol.WFS({
            url:"http://localhost:8080/geoserver/chanduy/wfs",
            version: "1.1.0",
            //id:'amenInundacion',
            featureType: "riesgo_remocion_masa",
            featureNS: "http://www.chanduy.org"
        });
                  

//*************** REGION WFS *******************
//**********************************************
//WFS AMENAZA INUNDACION
    wfsAmenazaInundacion= new OpenLayers.Layer.Vector("WFS Amenaza Inundacion",
            {
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: protocoloAmenazaInundacion
            });
            
//WFS AMENAZA REMOSION
     wfsAmenazaRemocion= new OpenLayers.Layer.Vector("WFS Amenaza Remocion",
            {
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: protocoloAmenazaRemocion/*,
            filter:new OpenLayers.Filter.Comparison({ 
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "rango",
                        value: ""})*/
            });
            
 //WFS AMENAZA TSUNAMI
    wfsAmenazaTsunami= new OpenLayers.Layer.Vector("WFS Amenaza Tsunami",
            {
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: protocoloAmenazaTsunami
            });
          
 //WFS RIESGO INUNDACION
 wfsRiesgoInundacion= new OpenLayers.Layer.Vector("WFS Riesgo Inundacion",
            {
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: protocoloRiesgoInundacion
            });
            
//WFS RIESGO REMOSION
     wfsRiesgoRemocion= new OpenLayers.Layer.Vector("WFS Riesgo Remocion",
            {
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: protocoloRiesgoRemocion/*,
            filter:new OpenLayers.Filter.Comparison({ 
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "rango",
                        value: ""})*/
            });
            
    //WFS CONSULTAS
          wfsDiscapacitados = new OpenLayers.Layer.Vector("wfsDiscapacitados",{
                styleMap:new OpenLayers.StyleMap({
                    "default":new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                        externalGraphic:"img/discapacidad-default.png",
                        graphicOpacity:1,
                        name: "discapacitados",
                        pointRadius:10
                    }, OpenLayers.Feature.Vector.style["default"])),
                    "select":new OpenLayers.Style({
                        externalGraphic:"img/discapacidad-selected.png"
                    })/*,
                    "highlight":new OpenLayers.Style({
                        externalGraphic:"../img/marker-gold.png"
                    }),
                    "lowlight":new OpenLayers.Style({
                        externalGraphic:"../img/marker-green.png"
                    })*/
                })
            });
            
            
   
   wfsAlbergues = new OpenLayers.Layer.Vector("wfsAlbergues",{
                styleMap:new OpenLayers.StyleMap({
                    "default":new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                        externalGraphic:"img/casa-default.png",
                        graphicOpacity:1,
                        //rotation:-45,
                        pointRadius:10
                    }, OpenLayers.Feature.Vector.style["default"])),
                    "select":new OpenLayers.Style({
                        externalGraphic:"img/casa-selected.png"
                    })/*,
                    "highlight":new OpenLayers.Style({
                        externalGraphic:"../img/marker-gold.png"
                    }),
                    "lowlight":new OpenLayers.Style({
                        externalGraphic:"../img/marker-green.png"
                    })*/
                })
            });
            
            
    sectorLayer = new OpenLayers.Layer.Vector("Sectores", {hideInLegend :true});

   // sectorLayer.set("hideInLegend", !sectorLayer.get("hideInLegend"));
            
  ///******************
                
        storeAmenazaTsunami = new GeoExt.data.FeatureStore({
            //layer: this.layerAmenTsunami,
            fields: [{name:"gid", type:"integer"},
                     {name:"docver", type:"string"},
                     {name:"rango", type:"string"}
            ],
            layer: wfsAmenazaTsunami
            //autoload:true
         });
         
         storeAmenazaInundacion = new GeoExt.data.FeatureStore({
           fields: [{name:"gid", type:"integer"},
                    {name:"va_geo_ind", type:"integer"},
                    {name:"va_hidr_in", type:"integer"},
                    {name:"va_gemf_in", type:"integer"},
                    {name:"va_isoy_fr", type:"integer"},
                    {name:"va_pen_ind", type:"integer"},
                    {name:"suma", type:"integer"},
                    {name:"porcentaje", type:"integer"},
                    {name:"rango", type:"string"}
            ],
            layer:wfsAmenazaInundacion
            //autoload:true
         });
        
        storeAmenazaRemocion = new GeoExt.data.FeatureStore({
           fields: [{name:"gid", type:"integer"},
                    {name:"su12345", type:"integer"},
                    {name:"va_sism_fr", type:"integer"},
                    {name:"va_isoy_fr", type:"integer"},
                    {name:"sumto_7", type:"integer"},
                    {name:"porcentaje", type:"integer"},
                    {name:"rango", type:"string"}
            ],
            layer:wfsAmenazaRemocion
            //autoload:true
         });
        
        storeRiesgoInundacion = new GeoExt.data.FeatureStore({
           // layer:wfsRiesgoInundacion,
          //  fields:[],
           /*fields: [{name:"amenaza", type:"integer"},
                    {name:"vulnerabil", type:"integer"},
                    {name:"suma", type:"integer"},
                    {name:"porcentaje", type:"integer"},
                    {name:"rango", type:"string"}
                    ],*/
        proxy: new GeoExt.data.ProtocolProxy({
            protocol: protocoloRiesgoInundacion            
        }),
            
            autoload:true
         });
        
        storeRiesgoRemocion = new GeoExt.data.FeatureStore({
           /*fields: [{name:"va_vulne", type:"integer"},
                    {name:"va_am_frm", type:"integer"},
                    {name:"suma", type:"integer"},
                    {name:"porcentaje", type:"integer"},
                    {name:"rango", type:"string"}
            ],*/
            layer:wfsRiesgoRemocion
            //autoload:true
         });
        
        //,wfsDiscapacitados,wfsAlbergues]
          
       //Coleccion de capas
        this.layers = [this.LayerBase,wmsLimiteProvincial , wmsParroquias,
                        //wmsAmenazaInundacion, //wmsAmenazaRemocion,
                        amenazaRemocion, amenazaInundacion, amenazaTsunami,
                        wmsRiesgoRemocion, wmsRiesgoInundacion, //wmsSqlInundacion,
                        wmsComunidadesChanduy, wmsCasasComunales, wmsVias, wmsZonasSeguras,
                        wmsDiscapacitados,
                        wmsRuta, wmsAlbergues, sectorLayer,
                        wfsDiscapacitados, wfsAlbergues
                        /*wfsAmenazaInundacion,
                        wfsAmenazaRemocion, wfsAmenazaTsunami,
                        wfsRiesgoInundacion, wfsRiesgoRemocion//, wfsPrueba*/
                    ];
                            
                            
    //DESHABILITAR CAPAS WMS
           //wmsAmenazaInundacion.setVisibility(false);	
          // wmsAmenazaRemocion.setVisibility(false);
           
            amenazaTsunami.setVisibility(false);
            amenazaRemocion.setVisibility(false); 
            amenazaInundacion.setVisibility(false);
           
           wmsRiesgoRemocion.setVisibility(false);
           wmsRiesgoInundacion.setVisibility(false);
           
           wmsComunidadesChanduy.setVisibility(false);
           wmsCasasComunales.setVisibility(false);
           wmsZonasSeguras.setVisibility(false);
           wmsLimiteProvincial.setVisibility(false);
           wmsParroquias.setVisibility(false);
           wmsVias.setVisibility(false);
           wmsRuta.setVisibility(true);
           wmsAlbergues.setVisibility(false);
           wmsDiscapacitados.setVisibility(false);
           sectorLayer.hideInLegend = true;
        ///   tracking.setVisibility(true);
          // wfsAmenazaInundacion.setVisibility(false);
           //wfsAmenazaRemocion.setVisibility(false); 
          // wfsAmenazaTsunami.setVisibility(false);
          // wfsPrueba.setVisibility(true);
           
           
           //wfsRiesgoInundacion.setVisibility(false);
          // wfsRiesgoRemocion.setVisibility(false); 
           
           //wmsRuta.setVisibility(true);
      // storeAmenazaInundacion.bind(t;his.layerAmenInundacion);
}