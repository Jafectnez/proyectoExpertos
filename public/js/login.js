function login() {
  var campos = [
    {campo:'txt-nombre',valido:false},
    {campo:'txt-password',valido:false}
  ];

  for (var i=0;i<campos.length;i++){
    campos[i].valido = validarCampoVacio(campos[i].campo);
  }

  for(var i=0;i<campos.length;i++){
    if (!campos[i].valido)
      return;
  }

  location.href = "../seccion-principal.html";
}
    
function validarCampoVacio(campo){
  if (document.getElementById(campo).value ==''){   
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
