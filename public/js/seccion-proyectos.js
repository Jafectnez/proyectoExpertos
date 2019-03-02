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
            <img src="img/Logo-GEPO-page.svg" class="card-img">
            <div class="col-md-8">
              <div class="card-body">
                <h4 class="card-title">${informacion[i].nombre}</h4>
                <p class="card-text">${informacion[i].descripcion}</p>
                <p class="card-text"><small class="text-muted">Fecha Creacion:<b>${informacion[i].fechaCreacion}</b></small></p>
              </div>
            </div>
          </div>
        </div>
      </a>
     </div>`;
  }

}