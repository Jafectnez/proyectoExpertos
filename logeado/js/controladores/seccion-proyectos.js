$(document).ready(function () {
  datosCarpeta();
  cargarTarjetas();
});

function datosCarpeta() {
  $("#nombre-portada").text(localStorage.getItem("Nombre_Carpeta"));
}

function cargarTarjetas(){
  document.getElementById('sector-inferior').innerHTML = ``;
  
  $.ajax({
    url: `/carpetas/${localStorage.getItem("Id_Carpeta")}/carpetas`,
    method: "GET",
    dataType: "json",
    success: function(res) {
      creacionTarjetasCarpetas(res);
    },
    error: function(error) {
      console.error(error);
    }
  });

  $.ajax({
    url: `/carpetas/${localStorage.getItem("Id_Carpeta")}/proyectos`,
    method: "GET",
    dataType: "json",
    success: function(res) {
      creacionTarjetasProyectos(res);
    },
    error: function(error) {
      console.error(error);
    }
  });

  $.ajax({
    url: `/carpetas/${localStorage.getItem("Id_Carpeta")}/archivos`,
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

function creacionTarjetasCarpetas(datos) {
  for(var i=0; i<datos[0].carpetas.length; i++){
    var subcarpeta = datos[0].carpetas[i];
    
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
              <span class="nombre-tarjeta">${subcarpeta.nombre}</span>
            </div>
          </div>
          <div class="descripcion-tarjeta">
            <div class="seccion-izquierda">
              <h3>Descripción</h3>
              <p>${subcarpeta.descripcion}</p>
              <button onclick="abrirCarpeta('${subcarpeta._id}', '${subcarpeta.nombre}');">Abrir</button>
            </div>
            <div class="seccion-derecha">
              <div class="item">
                <span class="num">${subcarpeta.proyectos_internos.length}</span>
                <span class="word">Proyectos</span>
              </div>
              <div class="item">
                <span class="num">${subcarpeta.carpetas_internas.length}</span>
                <span class="word">Carpetas</span>
              </div>
              <div class="item">
                <span class="num">${subcarpeta.archivos_internos.length}</span>
                <span class="word">Archivos</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }
}

function creacionTarjetasProyectos(datos){
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

function abrirCarpeta(id, nombre) {
  localStorage.setItem("Id_Carpeta", id);
  localStorage.setItem("Nombre_Carpeta", nombre);
  window.location = 'seccion-proyectos.html'
}

function abrirProyecto(id, nombre) {
  localStorage.setItem("Id_Proyecto", id);
  localStorage.setItem("Nombre_Proyecto", nombre);
  window.location = 'seccion-archivos.html';
}

$("#btn-crear-carpeta").on("click",function () {
  $.ajax({
    type: "POST",
    url: `/carpetas/${localStorage.getItem("Id_Carpeta")}/crear`,
    data: {
      nombreCarpeta: $("#txt-nombre-carpeta").val(),
      descripcionCarpeta: $("#txtA-descripcion-carpeta").val()
    },
    dataType: "json",
    success: function (respuesta) {
      if(respuesta.status == 1){
        cargarTarjetas();
        $("#status-carpeta").css("color", "green");
        $("#status-carpeta").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-carpeta").css("color", "");
          $("#status-carpeta").text("");
        },3000);
      }
      else{
        $("#status-carpeta").css("color", "red");
        $("#status-carpeta").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-carpeta").css("color", "");
          $("#status-carpeta").text("");
        },3000);
      }
    }
  });
});

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
        $("#status-proyecto").css("color", "green");
        $("#status-proyecto").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-proyecto").css("color", "");
          $("#status-proyecto").text("");
        },3000);
      }
      else{
        $("#status-proyecto").css("color", "red");
        $("#status-proyecto").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-proyecto").css("color", "");
          $("#status-proyecto").text("");
        },3000);
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
        $("#status-archivo").css("color", "green");
        $("#status-archivo").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-archivo").css("color", "");
          $("#status-archivo").text("");
        },3000);
      }
      else{
        $("#status-archivo").css("color", "red");
        $("#status-archivo").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-archivo").css("color", "");
          $("#status-archivo").text("");
        },3000);
      }
    }
  });
});