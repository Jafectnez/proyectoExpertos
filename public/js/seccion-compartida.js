$(document).ready(function() {
	obtenerJSONs();
});


var informacion=[];

function obtenerJSONs(){

  informacion.push(
    {nombre:'Mi Carpeta 1',
     descripcion:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, itaque! Doloremque, officiis?',
     carpetas: 3},
     {nombre:'Mi Carpeta 2',
     descripcion:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, itaque! Doloremque, officiis?',
     carpetas: 1});

  creacionTarjetas();
}

function creacionTarjetas(){
  document.getElementById('sector-inferior').innerHTML = '';

  for(var i=0; i<informacion.length; i++){
    document.getElementById('sector-inferior').innerHTML += 
    ` <div class="col col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div class="tarjeta">
          <div class="cabecera-tarjeta">
            <img src="img/Logo-GEPO-page.svg" alt="">
            <div class="cover"></div>
            <div class="menu">
              <ul>
                <li class="fas fa-share-alt"></li>
                <li class="fas fa-trash"></li>
              </ul>
              <i class="fas fa-ellipsis-v"></i>
            </div>

            <div class="nombre">
              <span class="nombre-tarjeta">${informacion[i].nombre}</span>
            </div>
          </div>
          <div class="descripcion-tarjeta">
            <div class="seccion-izquierda">
              <h3>Descripción</h3>
              <p>${informacion[i].descripcion}</p>
              <a href="seccion-proyectos.html">Abrir</a>
            </div>
            <div class="seccion-derecha">
              <div class="item">
                <span class="num">${informacion[i].carpetas}</span>
                <span class="word">Carpetas</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

}