$(document).ready(function () {
  $.ajax({
    url: "/carpetas/5cc21ecebb85f813043174ad",
    method: "GET",
    dataType: "json",
    success: function(res) {
      creacionTarjetas(res);
    },
    error: function(error) {
      console.error(error);
    }
  });
});

var informacion=[];

function obtenerJSONs(){

  informacion.push(
    {nombre:'Mi Carpeta 1',
     descripcion:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, itaque! Doloremque, officiis?',
     proyectos: 4},
     {nombre:'Mi Carpeta 2',
     descripcion:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, itaque! Doloremque, officiis?',
     proyectos: 2},
     {nombre:'Mi Carpeta 3',
     descripcion:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, itaque! Doloremque, officiis?',
     proyectos: 3});

  creacionTarjetas();
}

function creacionTarjetas(datos){
  document.getElementById('sector-inferior').innerHTML = '';

  for(var i=0; i<datos.length; i++){
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
              <span class="nombre-tarjeta">${datos[i].nombre}</span>
            </div>
          </div>
          <div class="descripcion-tarjeta">
            <div class="seccion-izquierda">
              <h3>Descripción</h3>
              <p>${datos[i].descripcion}</p>
              <a href="seccion-proyectos.html">Abrir</a>
            </div>
            <div class="seccion-derecha">
              <div class="item">
                <span class="num">${datos[i].proyectos}</span>
                <span class="word">Proyectos</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

}