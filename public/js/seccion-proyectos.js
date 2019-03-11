$(document).ready(function() {
	obtenerJSONs();
});


var informacion=[];

function obtenerJSONs(){

  informacion.push(
    {nombre:'Mi Proyecto 1',
     descripcion:'Descripcion de mi proyecto.',
     fechaCreacion:'3/02/2019'},
    {nombre:'Mi Proyecto 2',
     descripcion:'Descripcion de mi proyecto.',
     fechaCreacion:'5/02/2019'},
    {nombre:'Mi Proyecto 3',
     descripcion:'Descripcion de mi proyecto.',
     fechaCreacion:'10/02/2019'}
  );

  creacionTarjetas();
}

function creacionTarjetas(){
  document.getElementById('sector-inferior').innerHTML = '';

  for(var i=0; i<informacion.length; i++){
    document.getElementById('sector-inferior').innerHTML += 
    `<div class="col-lg-4 col-md-4 col-sm-4 col-xl-4 contenedor-tarjeta">
      <a class="a-tarjeta" href="seccion-archivos.html">
        <div id="mi-proyecto-${i}" class="card mb-3 tarjeta-proyecto">
          <div class="row no-gutters">
            <div class="col-xl-6 col-lg-6 col-md-6 tarj">
              <div class="card-body">
                <h4 class="card-title">${informacion[i].nombre}</h4>
                <p class="card-text">${informacion[i].descripcion}</p>
                <p class="card-text"><small class="text-muted">Fecha Creacion:</small></p>
                <p class="card-text"><small class="text-muted"><b>${informacion[i].fechaCreacion}</b></small></p>
              </div>
            </div>
            <div class="col-xl-3 col-lg-3 col-md-3 tarj-carp">
              <img src="img/Logo-GEPO-page.svg" class="card-img">
            </div>
            <div class="col-xl-1 col-lg-1 col-md-1 btn-func">
              <a href="#">
                <i class="fas fa-share-alt"></i>
              </a><br>
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