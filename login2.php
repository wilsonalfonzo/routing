<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>INCYT - UPSE</title>

    <!-- Bootstrap Core CSS -->
    <link rel="stylesheet" href="scripts/bootstrap/css/bootstrap.min.css" type="text/css">

    <!-- Custom CSS -->
    <link href="scripts/css/sb-admin-2.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="../bower_components/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>
<?php
    @session_start();
    print_r($_SESSION);
    ?>
    <div class="container">
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <div class="login-panel panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Please Sign In</h3>
                    </div>
                    <div class="panel-body">
                        <form role="form" method="POST" name="formLogin" id="formLogin">
                            
                                <div class="form-group">
                                    <input class="form-control" placeholder="E-mail" name="email" id="email" type="text" autofocus>
                                </div>
                                <div class="form-group">
                                    <input class="form-control" placeholder="Password" name="password" id="password" type="password" value="">
                                </div>
                                <!--<div class="checkbox">
                                    <label>
                                        <input name="remember" type="checkbox" value="Remember Me">Remember Me
                                    </label>
                                </div>
                                -->
                                <!-- Change this to a button or input when using this as a form -->
                                <a href="javascript:;" class="btn btn-lg btn-success btn-block" id="login">Login</a>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- jQuery -->
    <script src="scripts/jquery/jquery-1.11.2.min.js" type="text/javascript"></script>      
    <script src="scripts/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
    <!-- Custom Theme JavaScript -->
    <script src="js/scripts.js"></script>

</body>

</html>
