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
})