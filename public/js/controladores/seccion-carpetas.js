$(document).ready(function () {
  $.ajax({
    url: "/carpetas/5cc244b2eeb38871d1a3338f",
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
              <button onclick="abrirCarpeta('${datos[i]._id}', '${datos[i].nombre}');">Abrir</button>
            </div>
            <div class="seccion-derecha">
              <div class="item">
                <span class="num">${datos[i].proyectos.length}</span>
                <span class="word">Proyectos</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

}

function abrirCarpeta(id, nombre) {
  localStorage.setItem("Id_Carpeta", id);
  localStorage.setItem("Nombre_Carpeta", nombre);
  window.location = 'seccion-proyectos.html'
}