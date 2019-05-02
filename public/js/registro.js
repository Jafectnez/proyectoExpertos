function registro() {
  $(".div-loading").css("display", "block");
  var campos = [
    {parametro:'nombreUsuario',
     campo:'txt-nombre',
     valido:false,
     regex: /((^[A-Z]+[A-Za-záéíóúñ]+)((\s)(^[A-Z]+[A-Za-záéíóúñ]+)))*$/
    },
    {parametro:'apellidoUsuario',
    campo:'txt-apellido',
     valido:false,
     regex: /((^[A-Z]+[A-Za-záéíóúñ]+)((\s)(^[A-Z]+[A-Za-záéíóúñ]+)))*$/
    },
    {parametro:'generoUsuario',
     campo:'select-genero',
     valido:false,
     regex: /.+/
    },
    {parametro:'correoUsuario',
     campo:'txt-correo',
     valido:false,
     regex: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    },
    {parametro:'nickUsuario',
     campo:'txt-usuario',
     valido:false,
     regex: /(([A-Za-záéíóúñ]+)((\s)(^[A-Z]+[A-Za-záéíóúñ]+)))*$/
    },
    {parametro:'contraseniaUsuario',
     campo:'txt-password',
     valido:false,
     regex: /.+/
    },
    {parametro:'residenciaUsuario',
     campo:'txtA-residencia',
     valido:false,
     regex: /([A-Za-z0-9]+.)+/}
  ];

  for (var i=0;i<campos.length;i++){
    campos[i].valido = validarCampo(campos[i].campo, campos[i].regex);
  }

  var parametros = {
    "nombreUsuario" : "",
    "apellidoUsuario" : "",
    "generoUsuario" : "",
    "correoUsuario" : "",
    "nickUsuario" : "",
    "contraseniaUsuario" : "",
    "residenciaUsuario" : ""
  };

  for(var i=0;i<campos.length;i++){
    if (!campos[i].valido){
      $(".div-loading").css("display", "none");
      $("#estado").text("Asegurese de llenar todos los datos necesarios");
      $("#estado").css("color", "red");

      setTimeout(function () {
        $("#estado").text("");
        $("#estado").css("color", "");
        for(var j=0;j<campos.length;j++)
          document.getElementById(campos[j].campo).classList.remove('is-invalid');
      },3000);

      return;
    }
    parametros[campos[i].parametro]=$("#"+campos[i].campo).val();
  }

  $.ajax({
    type: "POST",
    url: "/registrar",
    data: parametros,
    dataType: "json",
    success: function (res) {
      $(".div-loading").css("display", "none");
      if(res.status == 1){
        $("#estado").text(res.mensaje);
        $("#estado").css("color", "green");
        $.ajax({
          type: "POST",
          url: "/carpetas/crear",
          data: {
            nombreCarpeta: 'Mi Carpeta 1',
            descripcionCarpeta: 'Carpeta creada automáticamente',
            id: res.objeto._id
          },
          dataType: "json",
          success: function (response) {
            alert(response.mensaje);
            setTimeout(function() {  
              location.href = "../login.html";
            }, 3000);
          },
          error: function (error) {  
            console.error(error);            
          }
        });
      }else{
        $("#estado").text(res.mensaje);
        $("#estado").css("color", "red");
      }
    },
    error: function (error) {
      $(".div-loading").css("display", "none");
      console.error(error);
    }
  });
}
    
function validarCampo(campo, regex){
  if (document.getElementById(campo).value ==''){   
    document.getElementById(campo).classList.add('input-error');
    document.getElementById(campo).className += ' is-invalid';
    return false;
  }else if(!regex.exec(document.getElementById(campo).value)){
    document.getElementById(campo).classList.add('input-error');
    document.getElementById(campo).className += ' is-invalid';
    return false;
  }else{
    document.getElementById(campo).classList.remove('input-error');
    document.getElementById(campo).className += ' is-valid ';
    return true;
  }
}