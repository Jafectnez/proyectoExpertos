var planActivo = "";

jQuery(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "/perfil-usuario",
    dataType: "json",
    success: function (respuesta) {
      if(respuesta.status == 1){
        var user = respuesta.datos[0];
        $("#txt-usuario").val(user.usuario);
        $("#txt-contrasenia").val(user.contrasenia);
        $("#txt-correo").val(user.correo);
        $("#txt-nombre").val(user.nombre);
        $("#txt-apellido").val(user.apellido);
        $("#foto-perfil").attr("src", user.foto_perfil);
        $("#txt-residencia").val(user.residencia);

        if(user.plan_activo == "5cc77af9fb6fc00ed59db713"){
          $("#spn-tipo-usuario").text("Gratuito");
          $("#plan-gratuito").attr("selected", "selected");
          planActivo = "5cc77af9fb6fc00ed59db713";
        }else if(user.plan_activo == "5cc77b39fb6fc00ed59db736"){
          $("#spn-tipo-usuario").text("Regular");
          $("#plan-regular").attr("selected", "selected");
          planActivo = "5cc77b39fb6fc00ed59db736";
        }else{
          $("#spn-tipo-usuario").text("Premium");
          $("#plan-premium").attr("selected", "selected");
          planActivo = "5cc77b5bfb6fc00ed59db754";
        }

        if(user.genero == "Masculino"){
          $("#genero-masculino").attr("selected", "selected");
        }else if(user.genero == "Femenino"){
          $("#genero-femenino").attr("selected", "selected");
        }else{
          $("#genero-apache").attr("selected", "selected");
        }

      }else{
        console.error(respuesta.mensaje);
      }
    }
  });
});

$("#actualizar-perfil").on("click", function(){
  var campos = [
    {campo: "txt-usuario", regex: /(([A-Za-záéíóúñ]+)((\s)(^[A-Z]+[A-Za-záéíóúñ]+)))*$/},
    {campo: "txt-contrasenia", regex: /.+/},
    {campo: "txt-correo", regex: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/},
    {campo: "txt-nombre", regex: /((^[A-Z]+[A-Za-záéíóúñ]+)((\s)(^[A-Z]+[A-Za-záéíóúñ]+)))*$/},
    {campo: "txt-apellido", regex: /((^[A-Z]+[A-Za-záéíóúñ]+)((\s)(^[A-Z]+[A-Za-záéíóúñ]+)))*$/},
    {campo: "txt-residencia", regex: /([A-Za-z0-9]+.)+/}
  ];

  var validos = true

  for(let i in campos)
    if(!validarCampo(campos[i].campo, campos[i].regex))
      validos = false;

  if(validos){
    $.ajax({
      type: "POST",
      url: "/actualizar-perfil",
      data: {
        usuario: $("#txt-usuario").val(),
        contrasenia: $("#txt-contrasenia").val(),
        correo: $("#txt-correo").val(),
        nombre: $("#txt-nombre").val(),
        apellido: $("#txt-apellido").val(),
        residencia: $("#txt-residencia").val(),
        genero: $("#slc-genero").val(),
      },
      dataType: "json",
      success: function (respuesta) {
        if(respuesta.status == 1){
          $("#status").text(respuesta.mensaje);
          setTimeout(function () {
            $("#status").text("");
          },3000);
        }else{
          $("#status").text(respuesta.mensaje);
          $("#status").css("color", "red");
          setTimeout(function () {
            $("#status").text("");
            $("#status").css("color", "");
          },3000);
        }
      }
    });
  }else{
    console.error("Dato invalido, verifique e intente nuevamente");
  }
});

$("#btn-pagar").on("click", function () {  
  if(validarCampo("txt-num-tarjeta", /[0-9]{4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4}/)){
    if(!$("#slc-plan").val()==planActivo){
      $.ajax({
        type: "GET",
        url: `/cambiar-plan/${$("#slc-plan").val()}`,
        dataType: "json",
        success: function (respuesta) {
          if(respuesta.status == 1){
            $("#status-pago").text(respuesta.mensaje);
            setTimeout(function () {
              $("#status-pago").text("");
            },3000);
          }else{
            $("#status-pago").text(respuesta.mensaje);
            $("#status-pago").css("color", "red");
            setTimeout(function () {
              $("#status-pago").text("");
              $("#status-pago").css("color", "");
            },3000);
          }
        }
      });
    }else{
      $("#status-pago").text("Plan seleccionado esta activo actualmente");
      setTimeout(function () {
        $("#status-pago").text("");
      },3000);
    }
  }else{
    $("#status-pago").text("Datos inválidos, intente nuevamente.");
    $("#status-pago").css("color", "red");
    setTimeout(function () {
      $("#status-pago").text("");
      $("#status-pago").css("color", "");
    },3000);
  }
});
 
function validarCampo(campo, regex = /.+/){
  if (document.getElementById(campo).value ==''){   
    document.getElementById(campo).classList.add('input-error');
    document.getElementById(campo).className += ' is-invalid';
    return false;
  }else if(regex.exec(document.getElementById(campo).value)){
    document.getElementById(campo).classList.remove('input-error');
    document.getElementById(campo).className += ' is-valid ';
    return true;
  }else{   
    document.getElementById(campo).classList.add('input-error');
    document.getElementById(campo).className += ' is-invalid';
    return false;
  }
}