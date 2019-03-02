$(document).ready(function() {
	obtenerJSONs();
});


var informacion=[];

function obtenerJSONs(){

  informacion.push(
    {nombre:'Mi Carpeta 1',
     fechaCreacion:'3/02/2019'},
    {nombre:'Mi Carpeta 2',
     fechaCreacion:'1/02/2019'},
    {nombre:'Mi Carpeta 3',
     fechaCreacion:'10/02/2019'},
    {nombre:'Mi Carpeta 4',
     fechaCreacion:'5/02/2019'});

  creacionTarjetas();
}

function creacionTarjetas(){
  document.getElementById('sector-inferior').innerHTML = '';

  for(var i=0; i<informacion.length; i++){
    document.getElementById('sector-inferior').innerHTML += 
    `<div class="col-lg-4 col-md-4 col-sm-4 col-xl-4 contenedor-tarjeta">
      <a class="a-tarjeta" href="seccion-proyectos.html">
        <div id="mi-carpeta-${i}" class="card mb-3 tarjeta-carpeta" style="max-width: 540px;">
          <div class="row no-gutters">
            <img src="img/carpetas.png" class="card-img">
            <div class="col-md-8">
            <div class="card-body">
              <h4 class="card-title" id="nombre-carpeta">${informacion[i].nombre}</h4>
              <p class="card-text"><small class="text-muted">Fecha Creación: <b id="fecha-creacion">${informacion[i].fechaCreacion}</b></small></p>
            </div>
            </div>
          </div>
        </div>
      </a>
     </div>`;
  }

}