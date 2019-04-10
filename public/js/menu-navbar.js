jQuery(document).ready(function() {
  var dir_menu = "navbar-menu.txt"; //direccion donde se encuentra el menu
  $.ajax({
    url : dir_menu,
    dataType: "text",
    success : function (data) 
    {
      $("#navbar-menu").html(data);
    }
  });
});

$(".btn-navbar").on("click", function () {
  $(".menu-navbar").toggleClass("show");
});