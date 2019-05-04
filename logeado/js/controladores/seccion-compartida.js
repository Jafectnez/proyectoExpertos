$(document).ready(function () {
  cargarTarjetas();
});

function cargarTarjetas() {
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
}

function creacionTarjetas(datos){
  document.getElementById('sector-inferior').innerHTML = '';

  for(var i=0; i<datos.length; i++){
    var carpeta = datos[i].carpeta;
    
    document.getElementById('sector-inferior').innerHTML += 
    ` <div class="col col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div class="tarjeta">
          <div class="cabecera-tarjeta">
            <img src="img/Logo-GEPO-page.svg" alt="">
            <div class="cover"></div>
            <div class="menu">
              <ul>
                <label>
                  <button id="eliminar-carpeta-compartida" data-toggle="modal" data-target="#modalEliminar" onclick="eliminarCarpetaCompartida('${carpeta._id}', '${carpeta.nombre}');"></button>
                  <li class="fas fa-trash"></li>
                </label>
              </ul>
              <i class="fas fa-ellipsis-v"></i>
            </div>

            <div class="nombre">
              <span class="nombre-tarjeta">${carpeta.nombre}</span>
            </div>
          </div>
          <div class="descripcion-tarjeta">
            <div class="seccion-izquierda">
              <h3>Descripción</h3>
              <p>${carpeta.descripcion}</p>
            </div>
            <div class="seccion-derecha">
              <div class="item">
                <span class="num-creador">${datos[i].creador}</span>
                <span class="word">Creador</span>
              </div>
            </div>
            <button class="btn-tarjeta" onclick="abrirCarpeta('${carpeta._id}', '${carpeta.nombre}');">Abrir</button>
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

function eliminarCarpetaCompartida(idCarpeta, nombreCarpeta) {
  $("#id-eliminar").val(idCarpeta);
  $("#title-carpeta-eliminar").text(nombreCarpeta);
}

$("#btn-eliminar").on("click", function () {  
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/carpetas/${$("#id-eliminar").val()}/compartidas/eliminar`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      if(respuesta.status == 1){
        console.log(respuesta.mensaje);
        $("#status").css("color", "green");
        $("#status").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status").css("color", "");
          $("#status").text("");
        },5000);
        cargarTarjetas();
      }else
        console.error(respuesta.mensaje);
        $("#status").css("color", "red");
        $("#status").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status").css("color", "");
          $("#status").text("");
        },5000);
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
      console.log(error)
    }
  });
})