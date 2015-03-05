	//clase toolbar
        var epsg_32717 = new OpenLayers.Projection("EPSG:32717");
        var epsg_900913 = new OpenLayers.Projection("EPSG:900913");
        var dist;
        var vector;
        
        
	this.lbl;
	function Toolbar(){
	 Ext.QuickTips.init();
	//BARRA DE HERRAMIENTAS
        Ext.QuickTips.ini
		//ZOOM BOX
		var control_zoom = new OpenLayers.Control.ZoomBox();
		this.actionZoom = new GeoExt.Action({
			control: control_zoom,
			map:map,
			enableToggle:true,
			tooltip: "Zoom ventana",
			iconCls: "zoomsq"
		});			
		//ZOOM IN
		var control_zoomIn =new OpenLayers.Control.ZoomIn({title:"Aumentar zoom"});
		this.actionZoomIn = new GeoExt.Action({
			control: control_zoomIn,
			map:map,
			enableToggle:false,
			tooltip: "Aumentar zoom",
			iconCls: "zoomin"
		});
		//ZOOM OUT
		var control_zoomOut =new OpenLayers.Control.ZoomOut({title:"Disminuir zoom"});
		this.actionZoomOut = new GeoExt.Action({
			control: control_zoomOut,
			map:map,
			enableToggle:false,
			tooltip: "Disminuir zoom",
			iconCls: "zoomout"
		});
		//ZOOM FULL
		var control_zoomFull = new OpenLayers.Control.ZoomToMaxExtent({title:"Extensión máxima"});
		this.actionZoomFull = new GeoExt.Action({
			control: control_zoomFull,
			map:map,			
			iconCls: "zoomfull",
			tooltip: "Extensión máxima"
			
		});
		
		
		
		//HISTORIAL PREVIO
		this.actionhistPrev = new GeoExt.Action({
			control: hist.previous,
			disabled: true,
			map:map,
			toggleGroup: "historial",
			tooltip: "Previo",
			iconCls: "previous"
		});
		//HISTORIAL SIGUIENTE
		this.actionhistNext = new GeoExt.Action({
			control: hist.next,
			disabled: true,
			map:map,
			toggleGroup: "historial",
			iconCls: "next",
			tooltip: "Siguiente"
			
		});
		
		//PAN
		//var control_pan =new OpenLayers.Control.Pan();
		var control_pan = new OpenLayers.Control.Navigation()
		this.actionPan = new GeoExt.Action({
			control: control_pan,
			map:map,
			toggleGroup: "draw",
			allowDepress: false,
			//enableToggle:true,
			pressed: true,
			tooltip: "Pan",
			//qtip: 'Imprimir Grid',
			iconCls: "pan"
		});

		//Mediciones lineales
		var medl= new OpenLayers.Control.Measure(
						OpenLayers.Handler.Path, //Tipo de geometría para medir: linea
						{persist: true, //Mantener la geometría hasta nueva medición o cambio de control
						displayClass:'olControlMeasurePath'}); //Estilo de diseño (CSS) del control
					//Define eventos a controlar sobre el control
					medl.events.on({
						"measure": mostrarMediciones //Cuando acaba de medir llama a la función mostrarMediciones
		});
		this.actionMedl = new GeoExt.Action({
			control: medl,
			map:map,
			toggleGroup: "draw",
			//enableToggle:true,
			tooltip: "mesurar longitud",
			iconCls: "medl"
		});
                
                //Print
                var winPrint;	
                var btnPrint = new OpenLayers.Control.Button({
			trigger: function(){
			
				window.print();				
			}
			
		});
                
            this.actionPrint = new GeoExt.Action({
			control: btnPrint,
			tooltip: "Imprimir mapa",
			iconCls: "print"
		});
		
	
		
		//Mediciones de áreas
		var meda= new OpenLayers.Control.Measure(
					OpenLayers.Handler.Polygon, //Tipo de geometría para medir: polígono
					{persist: true, //Mantener la geometría hasta nueva medición o cambio de control
					displayClass:'olControlMeasurePolygon'}); //Estilo de diseño (CSS) del control
				//Define eventos a controlar sobre el control
				meda.events.on({
					"measure": mostrarMediciones //Cuando acaba de medir llama a la función mostrarMediciones
					/*"measurepartial": mostrarMediciones*/}); //Durante las medidas parciales llama a la función mostrarMediciones
		
            this.actionMeda = new GeoExt.Action({
			control: meda,
			map:map,
			toggleGroup: "draw",
			//enableToggle:true,
			tooltip: "Medir área",
			iconCls: "meda"
		});
		
                
                function crearPopUP(event){
							var popUp = new GeoExt.Popup({
								title: "Información",
								location: event.xy ,
								width:200,
								map:map,
								html: event.text,
								autoDestroy:true,
								autoScroll:true
							});
							popUp.show();						
				};
                
                //Función para dar tratar los eventos de los controles de medidas (lineales y áreas)
		function mostrarMediciones(event) { //La variable event es el objeto evento
						if(event.order == 1) { //Si el evento lo ha disparado la medición lineal
							crearPopupMed(event, "Longitud: " + event.measure.toFixed(1) + " " + event.units); //Escribe resultado)
						} else { //Si medición de superficie
							 crearPopupMed(event, "Área: " + event.measure.toFixed(1) + " " + event.units + "<sup>2</" + "sup>" );
							
						}
		};	
                
                function crearPopupMed(event, resultado){
		var	popUp = new GeoExt.Popup({
							title: "Medida",
							location:event.xy,
							width:200,
							height:100,
							map:map,
							html: resultado,
							autoDestroy:true,
							autoScroll:true
						});
						popUp.show();
		};	
                
                //CALCULO DE RUTA MAS CORTA
                             
                //Anade puntos para obtener ruta optima
                var puntos= new OpenLayers.Control.DrawFeature(vector,
					OpenLayers.Handler.Point, //Tipo de geometría para medir: polígono
					{//persist: true, //Mantener la geometría hasta nueva medición o cambio de control
					displayClass:'olControlDrawFeaturePoint'});
                                    
                puntos.events.on({
                featureadded: function() {
                pgrouting(puntos);
                }
                });
        
            this.actionPuntos = new GeoExt.Action({
			control: puntos,
			map:map,
			enableToggle:true,
                       // pressed: this.activated ? false : true,
			tooltip: "Calcular ruta",
			iconCls: "routing",
			group: "ruta",
                        
                         listeners: {
                            toggle: function (btn, pressed)
                            {
                                if (pressed)
                                    {
                                wmsVias.setVisibility(true);
                                    }
                                else
                                    {
                                wmsVias.setVisibility(false);
                                    }
                             }
                                    }
		});
                
                //CREAR VENTANA CON DATOS DE RUTA
       //-->1
                 //FUNCION PGROUTING   
         function pgrouting(layer) {
            if ((vector.features.length % 2)==0) {
            
            // transform the two geometries from EPSG:900913 to EPSG:32717
             var startpoint = vector.features[vector.features.length-2].geometry.clone();
             var finalpoint = vector.features[vector.features.length-1].geometry.clone();
             
             startpoint.transform(epsg_900913, epsg_32717);
             finalpoint.transform(epsg_900913, epsg_32717);
             
             //valores x,y enviados al servidor
             viewparams = [
             'x1:' + startpoint.x + ';' + 'y1:' + startpoint.y + ';' +
             'x2:' + finalpoint.x + ';' + 'y2:' + finalpoint.y
             ];
             
              dataRuta.load({ 
                params:{  
			x1: startpoint.x, y1: startpoint.y, x2: finalpoint.x, y2: finalpoint.y
                    }
            });
            vector.removeAllFeatures();
           //calcula ruta mas corta con pgrouting  
            wmsRuta.mergeNewParams( { viewparams: viewparams });
            //wmsRuta.setVisibility(true);
             
            var cbOculto = new Ext.form.ComboBox({
                                                    fieldLabel:'Rango',
                                                    width: 125,
                                                    store:dataRuta, //storePgrouting,
                                                    displayField: 'distancia',
                                                    mode: 'local',
                                                    valueField: 'distancia',
                                                    emptyText: 'Selecione rango',
                                                    triggerAction: 'all'//,
                                                });
    
            dataRuta.on('load', function(my, record, options) {
            cbOculto.setValue(record[0].get('distancia'));
            dist="";
            dist = record[0].get('distancia');
            console.log(dist);
           	
		            if ((dist !=='null') && (dist > 0)){
		                lbDistancia.setText('Distancia total : ' + dist + 'm');   
				win.show();
		            }else{
		                 Ext.MessageBox.alert('Información', 'No se pudo calcular la ruta...!');
		            }
            });
         }
    };
         
         //Eliminar Rutas
            function eliminarRutas()
            {                 
                vector.removeAllFeatures();                   	
             	wmsRuta.mergeNewParams( { viewparams: '' });
           /* if (pgruta.length)
                {
                for (var i = 0; i < map.layers.length+1; i++)
                {
                    if (map.layers[i].name == "pgrouting")
                    {
                        alert(map.layers[i].name);
                        map.removeLayer(map.layers[i]);
                    }

                }
                }*/
            };   

            this.actionEliminaRuta = new Ext.Action({
                    handler : function() {
                        eliminarRutas();
                    },
                    tooltip: "Eliminar ruta",
                    iconCls: "removerouting",
                    group: "ruta",
            });
            
            
                     
		var actionPopUp = function(e) {
                OpenLayers.Console.log(e.type, e.feature.id);				
				var myWfsLayer = oLayers.wfsAmenazaTsunami;//mapa.getLayersByName("WFS")[0];
				 var myFeature = myWfsLayer.getFeatureById(e.feature.id);
				 if (myFeature){
				//	alert(myFeature.toSource());
					//alert(e.feature.attributes.toSource())
					//var attr =myFeature.attributes;
					
				}
				
				  var feature = e.feature.attributes;
					alert(myWfsLayer);   
				
				 
                };
                
                function crearPopUP(event){
							var popUp = new GeoExt.Popup({
								title: "Información",
								location: event.xy ,
								width:300,
								map:map,
								html: event.text,
                                                                collapsable:true,
								autoDestroy:true,
								autoScroll:true
							});
							popUp.show();
                                                       // alert (viewparams);
				};
                                
                function crearPopupMed(event, resultado){
		var	popUp = new GeoExt.Popup({
							title: "mesure",
							location:event.xy,
							width:200,
							height:100,
							map:map,
							html: resultado,
							autoDestroy:true,
							autoScroll:true
						});
						popUp.show();
		};	
			 // SelectFeature control, a "toggle" control
			this.actionIdentif = new GeoExt.Action({
				text: "Identificació",
				control: new OpenLayers.Control.SelectFeature(oLayers.layerAmenazaTsunami, {
					type: OpenLayers.Control.TYPE_TOGGLE,
					 clickout: true, hover: false, //
					eventListeners: {
					 // beforefeaturehighlighted: actionPopUp,
						featurehighlighted: actionPopUp
					  // featureunhighlighted: actionPopUp
					}
				}),
				map: map,
				// button options
				enableToggle: true,
				tooltip: "Identificació"
			});
		
	
		function getCapasActivas(map){
                    //App.vector.setVisibility(false);
                    var layersActivos=map.getLayersBy('visibility',true);
                    //App.vector.setVisibility(true);
                    if (layersActivos.length < 2){
                        alert("Necesita elegir al menos una capa para poder Consultar");
                       // App.vector.destroyFeatures();
                        return "error"
                        }else{
                       //    var typename="";
                         //   for (var indic=0; indic < layersActivos.length; indic++){
                           // if (layersActivos[indic].params!= undefined && layersActivos[indic].isBaseLayer !== true){

                            //typename=typename + layersActivos[indic].name +",";
                                //}
                            //}
                            //t/ypename = typename.substring(0,typename.length -1);
                            //return typename;
                   }// del else
                }
		
		//IDENTIFICACIÓN
		var identificar = new OpenLayers.Control.WMSGetFeatureInfo({
			hover:false,
			drillDown:false,
			maxFeatures:10,
			url: "http://localhost:8080/geoserver/chanduy/wms",
			layerUrls:"http://localhost:8080/geoserver/gwc",//[  /*oLayers.layerDistricte,*/oLayers.wmsZonasSeguras],
			//layer: "pgrouting",
                        queryVisible: true,
                        //vendorParams: viewparams, // map: oParams.mapfile_tematic },
			
                    eventListeners:{                                                            
				getfeatureinfo: function(event){
                                  //getCapasActivas: function(map){
                                   // var layersActivos=map.getLayersBy('visibility',true);
                                    //alert (layersActivos.length);
                                    //if (layersActivos.length < 3){
                                    //alert("Necesita elegir al menos una capa para poder Consultar");
                                   // App.vector.destroyFeatures();
                                   // return "error"
                                    crearPopUP(event);
                                    }
                               }
		});
	    

		this.actionIdentify = new GeoExt.Action({
			control: identificar,
			map:map,                       
                        enableToggle:true,
			tooltip: "Identificar",
			iconCls: "identify"
		});
				
		var button = new OpenLayers.Control.Button({
			displayClass: "callejero", trigger: function(){
				//selectControl.activate();
				
			selectCtrl.activate();
				//window.open("calles.php?lstCarrers=" , "ventana1" , "width=600,height=300,scrollbars=yes") ;
			}
		});
			
		     
                function mostrarMediciones(event) { //La variable event es el objeto evento
						if(event.order == 1) { //Si el evento lo ha disparado la medición lineal
							crearPopupMed(event, "Mesura: " + event.measure.toFixed(1) + " " + event.units); //Escribe resultado)
						} else { //Si medición de superficie
							 crearPopupMed(event, "Àrea: " + event.measure.toFixed(1) + " " + event.units + "<sup>2</" + "sup>" );
							
						}
		};	
                
	}	
       
         
           	

