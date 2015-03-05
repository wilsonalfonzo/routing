<?php
@session_start();
print_r($_POST);
if( ( isset($_POST["email"]) ) && ( isset($_POST["password"])  ) ){
  $_SESSION["INCYT_UPSE_User"]='1';        
}
  
print_r($_SESSION);
?>