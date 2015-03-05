<?php 
require "db.php";
	
	$comuna = $_POST['comuna'];
	
        if ($comuna!="")
        {           
            load_puntos();            
        };
      
        
        function load_puntos()
        {
            $puntos = $_POST['comuna'];
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