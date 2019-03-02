$(document).ready(function() {
	obtenerJSONs();
});


var informacion=[];

function obtenerJSONs(){

  informacion.push(
    {nombre:'Espacio de Trabajo Compartido 1',
     ultimaModif:'3'},
     {nombre:'Espacio de Trabajo Compartido 2',
      ultimaModif:'1'},
      {nombre:'Espacio de Trabajo Compartido 3',
       ultimaModif:'10'},
    {nombre:'Espacio de Trabajo Privado',
     ultimaModif:'5'});

  creacionTarjetas();
}

function creacionTarjetas(){
  document.getElementById('sector-inferior').innerHTML = '';

  for(var i=0; i<informacion.length; i++){
    document.getElementById('sector-inferior').innerHTML += 
    `<div class="col-lg-4 col-md-4 col-sm-4 col-xl-4 contenedor-tarjeta">
      <a class="a-tarjeta" href="seccion-carpetas.html">
        <div id="mi-espacio-trabajo-${i}" class="card mb-3 tarjeta-espacio-trabajo" style="max-width: 540px;">
          <div class="row no-gutters">
            <img src="img/Logo-GEPO-page.svg" class="card-img" style="width:100px;height:100px">
            <div class="col-md-8"> 
              <div class="card-body">
                <h4 class="card-title" id ="nombre-espacio-trabajo">${informacion[i].nombre}</h4>
                <p class="card-text"><small class="text-muted">Ultima modificacion: hace <b id="ultima-modif">${informacion[i].ultimaModif} min</b></small></p>
              </div>
            </div>
          </div>
        </div>
      </a>
     </div>`;
  }

}