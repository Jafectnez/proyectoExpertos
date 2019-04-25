var informacion = [
  {tipoUsuario:'Tier 1',precio:10.00},
  {tipoUsuario:'Tier 2',precio:100.00}
];

jQuery(document).ready(function() {
  document.getElementById("txt-usuario").value = "Zaden Ower";
  document.getElementById("txt-correo").value = "allan@gepo.hn";
  document.getElementById("txt-nombre").value = "Allan";
  document.getElementById("txt-apellido").value = "Martínez";

  
  var data = ``;
  for(var i=0; i < informacion.length; i++){
    data += `<option value="${i}">${informacion[i].tipoUsuario} - $ ${informacion[i].precio}.00</option>`;
  }

  $("#select-tipos-usuarios").html(data)
});
 
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