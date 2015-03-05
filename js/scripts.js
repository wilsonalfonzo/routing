$(document).ready(function(){
	$("#login").click(function(){
		//console.log(1);
		$.post("php/login.php",$("#formLogin").serialize(), function(data){
			
		})
	});
});