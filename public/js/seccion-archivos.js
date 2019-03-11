$(document).ready(function() {
	obtenerJSONs();
});


var informacion=[];

function obtenerJSONs(){

  informacion.push(
    {nombre:'Mi Archivo',
     extension:'html',
     fechaCreacion:'3/02/2019'},
    {nombre:'Mi Archivo',
     extension:'css',
     fechaCreacion:'3/02/2019'},
    {nombre:'Mi Archivo',
     extension:'js',
     fechaCreacion:'3/02/2019'});

  creacionTarjetas();
}

function creacionTarjetas(){
  document.getElementById('sector-inferior').innerHTML = '';

  for(var i=0; i<informacion.length; i++){
    document.getElementById('sector-inferior').innerHTML += 
    `<div class="col-lg-4 col-md-4 col-sm-4 col-xl-4 contenedor-tarjeta">
      <div id="mi-archivo-${i}" class="card mb-3 tarjeta-archivo">
        <div class="row no-gutters">
          <img src="img/Logo-GEPO-page.svg" class="card-img">
          <div class="col-md-7">
            <div class="card-body">
              <h4 class="card-title">${informacion[i].nombre}.${informacion[i].extension}</h4>
              <p class="card-text"><small class="text-muted">Fecha Creacion:</small></p>
              <p class="card-text"><small class="text-muted"><b>${informacion[i].fechaCreacion}</b></small></p>
            </div>
          </div>
        </div>
      </div>
     </div>`;
  }

}