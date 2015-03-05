<html>
<head>
<link rel="stylesheet" href="OpenLayers/theme/default/style.css" type="text/css">
<link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="GeoExt/resources/css/geoext-all.css" />
<link rel="stylesheet" type="text/css" href="style/visor.css" />		

        <style type="text/css">
        .legend {
            padding-left: 18px;
        }
        .x-tree-node-el {
            border-bottom: 1px solid #ddd;
            padding-bottom: 3px;
        }
        .x-tree-ec-icon {
            width: 3px;
        }
        .gx-tree-layer-icon {
            display: none;
        }
    </style>
</head>
<body>
<?php 
  error_reporting(0);
  @session_start();
  //print_r($_SESSION);
?>
   <div>
  <!-- <div id="gxmap"></div>
  <div id="mappanel"></div>-->
   <div id="desc"></div>
   <div id="desc1"></div>
   </div>  
  <script src="OpenLayers/OpenLayers.js" type="text/javascript"></script>
  <script src="ext/adapter/ext/ext-base.js" type="text/javascript"></script>
  <script src="ext/ext-all.js"  type="text/javascript"></script>
  <script src="GeoExt/script/GeoExt.js" type="text/javascript"></script>
  <script src="DrawPoints.js" type="text/javascript"></script>
  <script src="proj4js/lib/proj4js-compressed.js" type="text/javascript"></script>
  <script src="proj4js/lib/defs/EPSG32717.js" type="text/javascript"></script>
  <script type="text/javascript" src="Geoext/lib/GeoExt.js"></script> 
  <script src="mapa.js?t=<?php echo mktime(date('H'), date('i'), date('s')); ?>"></script>
  <script src="js/Ext.ux.Printer.js"></script>
  <script src="js/SearchField.js"></script>
  <script src="js/Ajax.js"></script>
  <script src="js/layers.js"></script>    
  <script src="js/forms.js"></script>
  <script src="js/toolbar.js"></script>
  <script type="text/javascript">
    var session = "<?php echo $_SESSION['INCYT_UPSE_User'] ?>";  
    //alert(session);
  </script>
  
</body>
</html>
