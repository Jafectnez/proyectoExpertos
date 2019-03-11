var informacionPais = ["Honduras",
                       "Costa Rica",
                       "Nicaragua",
                       "Panama",
                       "El Salvador",
                       "Guatemala"];

var informacionGenero = ["Masculino", "Femenino", "Helicoptero Apache de Combate"]

jQuery(document).ready(function() {
  var data = ``;
  for(var i=0; i < informacionPais.length; i++){
    data += `<option value="${i+1}">${informacionPais[i]}</option>`;
  }
  $("#select-pais").html(data)

  data = ``;
  for(var i=0; i < informacionGenero.length; i++){
    data += `<option value="${i+1}">${informacionGenero[i]}</option>`;
  }
  $("#select-genero").html(data)
});

function registro() {
  var campos = [
    {campo:'txt-nombre',valido:false},
    {campo:'txt-apellido',valido:false},
    {campo:'select-genero',valido:false},
    {campo:'txt-correo',valido:false},
    {campo:'txt-usuario',valido:false},
    {campo:'txt-password',valido:false},
    {campo:'select-pais',valido:false}
  ];

  for (var i=0;i<campos.length;i++){
    campos[i].valido = validarCampoVacio(campos[i].campo);
  }

  for(var i=0;i<campos.length;i++){
    if (!campos[i].valido)
      return;
  }

  location.href = "../login.html";
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
    registro();
  }
}
