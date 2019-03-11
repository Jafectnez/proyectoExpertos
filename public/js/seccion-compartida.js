$(document).ready(function() {
	obtenerJSONs();
});


var informacion=[];

function obtenerJSONs(){

  informacion.push(
    {nombre:'Mi Carpeta 1',
     fechaCreacion:'3/02/2019'},
    {nombre:'Mi Carpeta 2',
     fechaCreacion:'1/02/2019'});

  creacionTarjetas();
}

function creacionTarjetas(){
  document.getElementById('sector-inferior').innerHTML = '';

  for(var i=0; i<informacion.length; i++){
    document.getElementById('sector-inferior').innerHTML += 
    `<div class="col-lg-4 col-md-4 col-sm-4 col-xl-4 contenedor-tarjeta">
      <a class="a-tarjeta" href="seccion-proyectos.html">
        <div id="mi-carpeta-${i}" class="card mb-3 tarjeta-carpeta"">
          <div class="row no-gutters">
            <div class="col-xl-6 col-lg-6 col-md-6 tarj">
              <div class="card-body">
                <h4 class="card-title" id="nombre-carpeta">${informacion[i].nombre}</h4>
                <p class="card-text"><small class="text-muted">Fecha Creacion:</small></p>
                <p class="card-text"><small class="text-muted"><b>${informacion[i].fechaCreacion}</b></small></p>
              </div>
            </div>
            <div class="col-xl-3 col-lg-3 col-md-3 tarj-carp">
              <i class="fas fa-folder card-img"></i>
            </div>
            <div class="col-xl-1 col-lg-1 col-md-1 btn-func">
              <a href="#">
              <i class="fas fa-trash"></i>
              </a>
            </div>
          </div>
        </div>
      </a>
     </div>`;
  }

}