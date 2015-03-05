<?php
@session_start();
if(isset($_SESSION['INCYT_UPSE_User']))
{
	echo '1';
	unset($_SESSION['INCYT_UPSE_User']);
}
//session_unset();
//session_destroy();

?>