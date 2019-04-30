$(document).ready(function () {
  datosCarpeta();
  cargarTarjetas();
});

function datosCarpeta() {
  $("#nombre-portada").text(localStorage.getItem("Nombre_Carpeta"));
}

function cargarTarjetas(){
  $.ajax({
    url: "/carpetas/proyectos",
    method: "GET",
    dataType: "json",
    success: function(res) {
      creacionTarjetas(res);
    },
    error: function(error) {
      console.error(error);
    }
  });

  $.ajax({
    url: "/carpetas/archivos",
    method: "GET",
    dataType: "json",
    success: function(res) {
      creacionTarjetasArchivos(res);
    },
    error: function(error) {
      console.error(error);
    }
  });
}

function creacionTarjetas(datos){
  document.getElementById('sector-inferior').innerHTML = '';

  for(var i=0; i<datos[0].proyectos.length; i++){
    var proyecto = datos[0].proyectos[i];
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
              <span class="nombre-tarjeta">${proyecto.nombre}</span>
            </div>
          </div>
          <div class="descripcion-tarjeta">
            <div class="seccion-izquierda">
              <h3>Descripción</h3>
              <p>${proyecto.descripcion}</p>
              <button onclick="abrirProyecto('${proyecto._id}', '${proyecto.nombre}');">Abrir</button>
            </div>
            <div class="seccion-derecha">
              <div class="item">
                <span class="num">${proyecto.colaboradores.length}</span>
                <span class="word">Colabs</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

}

function creacionTarjetasArchivos(datos){
  if(datos[0].archivos.length < 1)
    return;

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

function abrirProyecto(id, nombre) {
  localStorage.setItem("Id_Proyecto", id);
  localStorage.setItem("Nombre_Proyecto", nombre);
  window.location = 'seccion-archivos.html';
}

$("#btn-crear-proyecto").on("click",function () {
  $.ajax({
    type: "POST",
    url: `/proyectos/${localStorage.getItem("Id_Carpeta")}/crear`,
    data: {
      nombreProyecto: $("#txt-nombre-proyecto").val(),
      descripcionProyecto: $("#txtA-descripcion-proyecto").val()
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

$("#btn-crear-archivo").on("click",function () {
  $.ajax({
    type: "POST",
    url: `/archivos/${localStorage.getItem("Id_Carpeta")}/crear`,
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