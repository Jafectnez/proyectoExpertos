$(document).ready(function () {
  datosProyecto();
  cargarTarjetas();
});

function cargarTarjetas() {
  $.ajax({
    url: `/proyectos/${localStorage.getItem("Id_Proyecto")}/archivos`,
    method: "GET",
    dataType: "json",
    success: function(res) {
      creacionTarjetas(res);
    },
    error: function(error) {
      console.error(error);
    }
  });
  
}

function datosProyecto() {
    $("#nombre-portada").text(localStorage.getItem("Nombre_Proyecto"));
}

function creacionTarjetas(datos){
  document.getElementById('sector-inferior').innerHTML = '';

  for(var i=0; i<datos[0].archivos.length; i++){
    var archivo = datos[0].archivos[i];
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
              <span class="nombre-tarjeta">${archivo.nombre}.${archivo.extension}</span>
            </div>
          </div>
          <div class="descripcion-tarjeta">
            <div class="seccion-izquierda">
              <h3>Última Modificación</h3>
              <p>${archivo.modificaciones[archivo.modificaciones.length - 1].mensaje}</p>
            </div>
            <div class="seccion-derecha">
              <div class="item">
                <span class="num">${archivo.modificaciones[archivo.modificaciones.length - 1].fecha}</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

}