<?php 
require "db.php";

$combo = $_POST['combo'];

//$comuna = $_POST['comuna'];

	switch ($combo) {
		case 'comunidades':
			load_comunas();
			break;

		case 'radio':
			load_radio_m();
			break;

		case 'fenomenos':	
			if( isset($_POST["tipo"]) )
			{
				load_fenomenosN('1');
			}
			else
			{
				load_fenomenosN();	
			}			
			break;

		case 'rango':	
			load_rangos();
			break;	
	};
              
    function load_comunas()
    {
		$sql = "Select id, nombre from comunidades_chanduy";
		$rs = pg_query($sql) or die;
		while ($row = pg_fetch_object($rs)) {
			$id = $row->id;
			$nombre = $row->nombre;

			//coordenadas
			//select x,y from casas_comunales where comunidad = 'ENGUNGA';
			$_cc = $code = $x = $y = null;
			$_cc = pg_query("select x, y from casas_comunales where comunidad = '".$nombre."' ");			
			$cc = pg_fetch_object($_cc);	
			$x = $cc->x;
			$y = $cc->y;
			$code = $id ."|". $x ."|". $y;
			$result[] = array('id'=>$id, 'nombre'=>$nombre, 'code'=>$code);
			//break;
		}
		echo '{"success":true, "data":'.json_encode($result).'}';	
	};
    
    function load_radio_m()
    {
		$sql = "Select id, metros from metros";
		$rs = pg_query($sql) or die;
		while ($row = pg_fetch_object($rs)) 
		{
			$id = $row->id;
			$metros = $row->metros;
			$result[] = array('id'=>$id, 'metros'=>$metros);
		}
		echo '{"success":true, "metros":'.json_encode($result).'}';	
	};
    
    function load_rangos()
    {
		$sql = "Select id, rango from rangos";
		$rs = pg_query($sql) or die;
		while ($row = pg_fetch_object($rs)) 
		{
			$id = $row->id;
			$rango = $row->rango;
			$result[] = array('id'=>$id, 'rango'=>$rango);
		}
		echo '{"success":true, "rangos":'.json_encode($result).'}';	
	};
    
    function load_fenomenosN( $tipo = "" )
    {
    	$sql = null;
		if( $tipo <> "" )
		{
			$sql = "Select id, fenomeno from f_naturales where id <> '3' ";
		}
		else
		{
			$sql = "Select id, fenomeno from f_naturales";			
		}
		
		$rs = pg_query($sql) or die;
		while ($row = pg_fetch_object($rs)) 
		{
			$id = $row->id;
			$fenomeno = $row->fenomeno;
			$result[] = array('id'=>$id, 'fenomeno'=>$fenomeno);
		}
		echo '{"success":true, "fenomenosN":'.json_encode($result).'}';	
	};
    
    function load_puntos()
    {
        $puntos = $_POST ['comuna'];
        $sql = "Select x, y from casas_comunales where comunidad = '".$puntos."'" ;
		$rs = pg_query($sql) or die;
		while ($row = pg_fetch_object($rs)) 
		{
			$x = $row->x;
			$y = $row->y;
			$result[] = array('x'=>$x, 'y'=>$y);
		}
		echo '{"success":true, "puntos":'.json_encode($result).'}';	              
	};
     
?>