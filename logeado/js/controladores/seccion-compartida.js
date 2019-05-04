$(document).ready(function () {
  $(".div-loading").css("display", "block");
  $.ajax({
    url: "/carpetas/carpetas-compartidas",
    method: "GET",
    dataType: "json",
    success: function(res) {
      $(".div-loading").css("display", "none");
      creacionTarjetas(res);
    },
    error: function(error) {
      $(".div-loading").css("display", "none");
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
              <a onclick="abrirCarpeta(${datos[i]._id}, ${datos[i].nombre});">Abrir</a>
            </div>
            <div class="seccion-derecha">
            <div class="item">
              <span class="num">${datos[i].carpetas_internas.length}</span>
              <span class="word">Carpetas</span>
            </div>
            <div class="item">
              <span class="num">${datos[i].proyectos_internos.length}</span>
              <span class="word">Proyectos</span>
            </div>
            <div class="item">
              <span class="num">${datos[i].archivos_internos.length}</span>
              <span class="word">Archivos</span>
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