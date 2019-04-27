function login() {
  var campos = [
    {campo:'txt-usuario',
     valido:false,
     regex: /^[A-Za-z0-9]+$|[A-Za-z0-9]+\@[A-Za-z0-9]+\.[a-z]+$/
    },
    {campo:'txt-password',
     valido:false,
     regex: /\.+$/
    }
  ];

  for (var i=0;i<campos.length;i++){
    campos[i].valido = validarCampo(campos[i].campo, campos[i].regex);
  }

  for(var i=0;i<campos.length;i++){
    if (!campos[i].valido){
      $("#estado").text("Asegurese de llenar todos los datos necesarios");
      $("#estado").css("color", "red");

      setTimeout(function () {
        $("#estado").text("");
        $("#estado").css("color", "");
        document.getElementById("txt-usuario").classList.remove('is-invalid');
        document.getElementById("txt-password").classList.remove('is-invalid');
      },3000);
      return;
    }
  }

  $.ajax({
    type: "POST",
    url: "/login",
    data: `usuario=${$("#txt-usuario").val()}&contrasenia=${$("#txt-password").val()}`,
    dataType: "json",
    success: function (res) {
      if(res.status == 1){
        location.href = "../seccion-principal.html";
      }else{
        $("#estado").text(res.mensaje);
        $("#estado").css("color", "red");
        document.getElementById("txt-usuario").classList.remove('is-valid');
        document.getElementById("txt-password").classList.remove('is-valid');

        setTimeout(function () {
          $("#estado").text("");
          $("#estado").css("color", "");
          document.getElementById("txt-usuario").classList.remove('is-invalid');
          document.getElementById("txt-password").classList.remove('is-invalid');
        },3000);
      }
    },
    error: function (error) {
      console.error(error);
    }
  });
}
    
function validarCampo(campo, regex){
  if (document.getElementById(campo).value ==''){   
    document.getElementById(campo).classList.add('input-error');
    document.getElementById(campo).className += ' is-invalid';
    return false;
  }else if(regex.exec(campo)){ 
    document.getElementById(campo).classList.add('input-error');
    document.getElementById(campo).className += ' is-invalid';
    return false;
  }else{
    document.getElementById(campo).classList.remove('input-error');
    document.getElementById(campo).className += ' is-valid ';
    return true;
  }
}

function enterPress(e) {
  if (e.keyCode == 13) {
    login();
  }
}
