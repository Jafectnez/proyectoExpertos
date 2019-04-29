jQuery(document).ready(function() {
    var dir_menu = "barra-menu.txt"; //direccion donde se encuentra el menu
	$.ajax({
		url : dir_menu,
		dataType: "text",
		success : function (data) 
		{
			$("#barra-menu").html(data);
			
			$(".btn-navbar").on("click", function () {
				$(".menu-navbar").toggleClass("show");
			});

			cargarDatosUsuario();
		}
	});
});

function cargarDatosUsuario(){
	$.ajax({
		type: "GET",
		url: "/datos-usuario",
		dataType: "json",
		success: function (res) {
			$("#usuario").text(res.usuario);
		},
		error:function (error) {  
			console.error(error);
			
		}
	});
}

$(".btn-agregar").on("click", function () {
	var boton = $(this)
	boton.addClass("rebotar");
	setTimeout(function() {
		boton.removeClass("rebotar");
	}, 300);
});

$("#btn-cerrar-sesion").on("click", function () {
	$.ajax({
		type: "GET",
		url: "/logout",
		dataType: "json",
		success: function (res) {
			window.location('login.html');
		},
		error: function (error) { 
			console.error(error);
			
		}
	});
});