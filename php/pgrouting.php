<?php
  include("configuracion.php");
  include("$root/php/db.php");
  
/*$x1 = $_POST['x1'];
$y1 = $_POST['y1'];
$x2 = $_POST['x2'];
$y2 = $_POST['y2'];*/
	        
    //  function load_ruta(){
  if(isset($_POST['x1']))
  {
    $x1 = $_POST['x1'];
    $y1 = $_POST['y1'];
    $x2 = $_POST['x2'];
    $y2 = $_POST['y2'];
    $sql = "select (Select sum(cost) FROM pgr_fromAtoB('vias','".$x1."', '".$y1."', '".$x2."', '".$y2."')) as distancia,
        velocidad, ((Select sum(cost) FROM pgr_fromAtoB('vias','".$x1."', '".$y1."', '".$x2."', '".$y2."'))/((velocidad*1000)/60)) as tiempo_min, descripcion from velocidad_km_h ";// as distancia,

		  $rs = pg_query($sql) or die;
		  while ($row = pg_fetch_object($rs)) 
      {
        $distancia = $row->distancia;
        $descripcion = $row->descripcion;
        $velocidad = $row->velocidad;
        $tiempo_min = $row->tiempo_min;
			   //$y = $row->y;
        $result[] = array('distancia'=>$distancia, 'descripcion'=>$descripcion, 'velocidad'=>$velocidad, 'tiempo_min'=>$tiempo_min);//, 'y'=>$y);
		  }
		  echo '{"success":true, "ruta":'.json_encode($result).'}';	              
	};

?>