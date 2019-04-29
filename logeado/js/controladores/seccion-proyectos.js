$(document).ready(function () {
  datosCarpeta();
});

function datosCarpeta() {
  $("#nombre-portada").text(localStorage.getItem("Nombre_Carpeta"));
}

function cargarTarjetas(){
  $.ajax({
    url: "/proyectos/"+localStorage.getItem("Id_Carpeta"),
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

function creacionTarjetas(datos){
  document.getElementById('sector-inferior').innerHTML = '';

  for(var i=0; i<datos.length; i++){
    datos[i].colaboradores = 0;
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
              <button onclick="abrirProyecto('${datos[i]._id}', '${datos[i].nombre}');">Abrir</button>
            </div>
            <div class="seccion-derecha">
              <div class="item">
                <span class="num">${datos[i].colaboradores}</span>
                <span class="word">Colabs</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

}

function abrirProyecto(id, nombre) {
  localStorage.setItem("Id_Proyecto", id);
  localStorage.setItem("Nombre_Proyecto", nombre);
  window.location = 'seccion-archivos.html';
}

$("#btn-crear-proyecto").on("click",function () {
  $.ajax({
    type: "POST",
    url: "/proyectos/crear",
    data: {
      nombreProyecto: $("#txt-nombre-proyecto").val(),
      descripcionProyecto: $("#txtA-descripcion-proyecto").val()
    },
    dataType: "json",
    success: function (respuesta) {
      if(respuesta.status == 1){
        cargarTarjetas();
        $.ajax({
          type: "GET",
          url: "/archivos/archivos-proyecto",
          dataType: "json",
          success: function (response) {
            
          }
        });
        $("#status").css("color", "green");
        $("#status").text(respuesta.mensaje);
      }
      else{
        $("#status").css("color", "red");
        $("#status").text(respuesta.mensaje);
      }
    }
  });
});

$("#btn-crear-archivo").on("click",function () {
  $.ajax({
    type: "POST",
    url: "/archivos/crear",
    data: {
      nombreArchivo: $("#txt-nombre-archivo").val(),
      extensionArchivo: $("#slc-extension-archivo").val()
    },
    dataType: "json",
    success: function (respuesta) {
      if(respuesta.status == 1){
        cargarTarjetas();
        $("#status").css("color", "green");
        $("#status").text(respuesta.mensaje);
      }
      else{
        $("#status").css("color", "red");
        $("#status").text(respuesta.mensaje);
      }
    }
  });
});