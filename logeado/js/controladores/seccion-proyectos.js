localStorage.setItem("Id_Proyecto", "");
localStorage.setItem("Nombre_Proyecto", "Proyecto no Seleccionado");

$(document).ready(function () {
  datosCarpeta();
  cargarTarjetas();
});

function datosCarpeta() {
  $("#nombre-portada").text(localStorage.getItem("Nombre_Carpeta"));
}

function cargarTarjetas(){
  $(".div-loading").css("display", "block");
  document.getElementById('sector-inferior').innerHTML = ``;
  
  $.ajax({
    url: `/carpetas/${localStorage.getItem("Id_Carpeta")}/carpetas`,
    method: "GET",
    dataType: "json",
    success: function(res) {
      creacionTarjetasCarpetas(res);

      $.ajax({
        url: `/carpetas/${localStorage.getItem("Id_Carpeta")}/proyectos`,
        method: "GET",
        dataType: "json",
        success: function(res) {
          creacionTarjetasProyectos(res);

          $.ajax({
            url: `/carpetas/${localStorage.getItem("Id_Carpeta")}/archivos`,
            method: "GET",
            dataType: "json",
            success: function(res) {
              $(".div-loading").css("display", "none");
              creacionTarjetasArchivos(res);
            },
            error: function(error) {
              $(".div-loading").css("display", "none");
              console.error(error);
            }
          });
        },
        error: function(error) {
          $(".div-loading").css("display", "none");
          console.error(error);
        }
      });
    },
    error: function(error) {
      $(".div-loading").css("display", "none");
      console.error(error);
    }
  });
}

function creacionTarjetasCarpetas(datos) {
  for(var i=0; i<datos[0].carpetas.length; i++){
    var subcarpeta = datos[0].carpetas[i];
    if(subcarpeta.eliminado)
      continue;
    
    document.getElementById('sector-inferior').innerHTML += 
    ` <div class="col col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div class="tarjeta">
          <div class="cabecera-tarjeta">
            <img src="img/Logo-GEPO-page.svg" alt="">
            <div class="cover"></div>
            <div class="menu">
              <ul>
                <label>
                  <button onclick="compartirCarpeta('${subcarpeta._id}');"></button>
                  <li class="fas fa-share-alt"></li>
                </label>
                <label>
                  <button onclick="eliminarCarpeta('${subcarpeta._id}');"></button>
                  <li class="fas fa-trash"></li>
                </label>
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
            <div>
              <button class="btn-tarjeta" onclick="abrirCarpeta('${subcarpeta._id}', '${subcarpeta.nombre}');">Abrir</button>
            </div>
          </div>
        </div>
      </div>`;
  }
}

function creacionTarjetasProyectos(datos){
  for(var i=0; i<datos[0].proyectos.length; i++){
    var proyecto = datos[0].proyectos[i];
    if(proyecto.eliminado)
      continue;

    document.getElementById('sector-inferior').innerHTML += 
    ` <div class="col col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div class="tarjeta">
          <div class="cabecera-tarjeta">
            <img src="img/Logo-GEPO-page.svg" alt="">
            <div class="cover"></div>
            <div class="menu">
              <ul>
                <label>
                  <button onclick="compartirProyecto('${proyecto._id}');"></button>
                  <li class="fas fa-share-alt"></li>
                </label>
                <label>
                  <button onclick="eliminarProyecto('${proyecto._id}');"></button>
                  <li class="fas fa-trash"></li>
                </label>
              </ul>
              <i class="fas fa-ellipsis-v"></i>
            </div>

            <div class="nombre">
              <span class="nombre-tarjeta">${proyecto.nombre}</span>
            </div>
          </div>
          <div class="descripcion-tarjeta">
            <div class="row">
              <div class="seccion-izquierda">
                <h3>Descripción</h3>
                <p>${proyecto.descripcion}</p>
              </div>
              <div class="seccion-derecha">
                <div class="item">
                  <span class="num">${proyecto.colaboradores.length}</span>
                  <span class="word">Colabs</span>
                </div>
              </div>
            </div>
            <button class="btn-tarjeta" onclick="abrirProyecto('${proyecto._id}', '${proyecto.nombre}');">Abrir</button>
          </div>
        </div>
      </div>`;
  }

}

function creacionTarjetasArchivos(datos){
  for(var i=0; i<datos[0].archivos.length; i++){
    var archivo = datos[0].archivos[i];
    if(archivo.eliminado)
      continue;

    document.getElementById('sector-inferior').innerHTML += 
    ` <div class="col col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div class="tarjeta">
          <div class="cabecera-tarjeta">
            <img src="img/Logo-GEPO-page.svg" alt="">
            <div class="cover"></div>
            <div class="menu">
              <ul>
                <label>
                  <button onclick="verArchivo('${archivo._id}');"></button>
                  <li class="fas fa-eye"></li>
                </label>
                <label>
                  <button onclick="compartirArchivo('${archivo._id}');"></button>
                  <li class="fas fa-share-alt"></li>
                </label>
                <label>
                  <button onclick="eliminarArchivo('${archivo._id}');"></button>
                  <li class="fas fa-trash"></li>
                </label>
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

$("#btn-crear-carpeta").on("click",function () {
  $(".div-loading").css("display", "block");
  if(localStorage.getItem("Id_Carpeta") == "" || !localStorage.getItem("Id_Carpeta")){
    $(".div-loading").css("display", "none");
    $("#status-carpeta").css("color", "red");
    $("#status-carpeta").text("No hay carpeta seleccionada");
    setTimeout(function () {  
      $("#status-carpeta").css("color", "");
      $("#status-carpeta").text("");
    },3000);

    return;
  }

  var campos = [{campo: 'txt-nombre-carpeta'},
                {campo: 'txtA-descripcion-carpeta'}];

  var validos = true;

  for(let i in campos)
    if(!validarCampo(campos[i].campo))
      validos = false;

  if(validos){
    $.ajax({
      type: "POST",
      url: `/carpetas/${localStorage.getItem("Id_Carpeta")}/crear`,
      data: {
        nombreCarpeta: $("#txt-nombre-carpeta").val(),
        descripcionCarpeta: $("#txtA-descripcion-carpeta").val()
      },
      dataType: "json",
      success: function (respuesta) {
        $(".div-loading").css("display", "none");
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
      },
      error:function (error) {  
        $(".div-loading").css("display", "none");
        $("#status-carpeta").css("color", "red");
        $("#status-carpeta").text(error);
        setTimeout(function () {  
          $("#status-carpeta").css("color", "");
          $("#status-carpeta").text("");
        },3000);
      }
    });
  }else{  
    $(".div-loading").css("display", "none");
    $("#status-carpeta").css("color", "red");
    $("#status-carpeta").text("Asegurese de llenar todos los campos requeridos");
    setTimeout(function () {  
      $("#status-carpeta").css("color", "");
      $("#status-carpeta").text("");
    },3000);
  }
});

$("#btn-crear-proyecto").on("click",function () {
  $(".div-loading").css("display", "block");
  if(localStorage.getItem("Id_Carpeta") == "" || !localStorage.getItem("Id_Carpeta")){
    $(".div-loading").css("display", "none");
    $("#status-proyecto").css("color", "red");
    $("#status-proyecto").text("No hay carpeta seleccionada");
    setTimeout(function () {  
      $("#status-proyecto").css("color", "");
      $("#status-proyecto").text("");
    },3000);

    return;
  }

  var campos = [{campo: 'txt-nombre-proyecto'},
                {campo: 'txtA-descripcion-proyecto'}];

  var validos = true;

  for(let i in campos)
    if(!validarCampo(campos[i].campo))
      validos = false;

  if(validos){
    $.ajax({
      type: "POST",
      url: `/proyectos/${localStorage.getItem("Id_Carpeta")}/crear`,
      data: {
        nombreProyecto: $("#txt-nombre-proyecto").val(),
        descripcionProyecto: $("#txtA-descripcion-proyecto").val()
      },
      dataType: "json",
      success: function (respuesta) {
        $(".div-loading").css("display", "none");
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
      },
      error: function (respuesta) {  
        $(".div-loading").css("display", "none");
      }
    });
  }else{ 
    $(".div-loading").css("display", "none"); 
    $("#status-proyecto").css("color", "red");
    $("#status-proyecto").text("Asegurese de llenar todos los campos requeridos");
    setTimeout(function () {  
      $("#status-proyecto").css("color", "");
      $("#status-proyecto").text("");
    },3000);
  }
});

$("#btn-crear-archivo").on("click",function () {
  $(".div-loading").css("display", "block");
  if(localStorage.getItem("Id_Carpeta") == "" || !localStorage.getItem("Id_Carpeta")){
    $(".div-loading").css("display", "none");
    $("#status-archivo").css("color", "red");
    $("#status-archivo").text("No hay carpeta seleccionada");
    setTimeout(function () {  
      $("#status-archivo").css("color", "");
      $("#status-archivo").text("");
    },3000);

    return;
  }

  var campos = [{campo: 'txt-nombre-archivo'},
                {campo: 'txtA-contenido-archivo'}];

  var validos = true;

  for(let i in campos)
    if(!validarCampo(campos[i].campo))
      validos = false;

  if($("#slc-extension-archivo").val() == "none"){
    validos = false;
    $("#slc-extension-archivo").css("border", "red 1px solid");
    $("#slc-extension-archivo").css("color", "red");

    setTimeout(function () {  
      $("#slc-extension-archivo").css("color", "");
      $("#slc-extension-archivo").css("border", "");
    },3000);
  }else{
    $("#slc-extension-archivo").css("border", "green 1px solid");
    $("#slc-extension-archivo").css("color", "green");

    setTimeout(function () {  
      $("#slc-extension-archivo").css("color", "");
      $("#slc-extension-archivo").css("border", "");
    },3000);
  }

  if(validos){
    $.ajax({
      type: "POST",
      url: `/archivos/${localStorage.getItem("Id_Carpeta")}/crear`,
      data: {
        nombreArchivo: $("#txt-nombre-archivo").val(),
        extensionArchivo: $("#slc-extension-archivo").val(),
        contenidoArchivo: $("#txtA-contenido-archivo").val()
      },
      dataType: "json",
      success: function (respuesta) {
        $(".div-loading").css("display", "none");
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
      },
      error: function (repuesta) {  
        $(".div-loading").css("display", "none");
      }
    });
  }else{  
    $(".div-loading").css("display", "none");
    $("#status-archivo").css("color", "red");
    $("#status-archivo").text("Asegurese de llenar todos los campos requeridos");
    setTimeout(function () {  
      $("#status-archivo").css("color", "");
      $("#status-archivo").text("");
    },3000);
  }
});

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

function verArchivo(idArchivo) {
  console.log("Ver archivo " + idArchivo);
}

function compartirArchivo(idArchivo) {
  console.log("Compartir archivo " + idArchivo);
}

function eliminarArchivo(idArchivo) {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/archivos/${idArchivo}/eliminar`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      if(respuesta.status == 1){
        console.log(respuesta.mensaje);
        cargarTarjetas();
      }else
        console.error(respuesta.mensaje)
    }
  });
}

function compartirProyecto(idProyecto) {
  console.log("Compartir proyecto " + idProyecto);
}

function eliminarProyecto(idProyecto) {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/proyectos/${idProyecto}/eliminar`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      if(respuesta.status == 1){
        console.log(respuesta.mensaje);
        cargarTarjetas();
      }else
        console.error(respuesta.mensaje)
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
    }
  });
}

function compartirCarpeta(idCarpeta) {
  console.log("Compartir carpeta " + idCarpeta);
}

function eliminarCarpeta(idCarpeta) {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/carpetas/${idCarpeta}/eliminar`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      if(respuesta.status == 1){
        console.log(respuesta.mensaje);
        cargarTarjetas();
      }else
        console.error(respuesta.mensaje)
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
    }
  });
}
    
function validarCampo(campo, regex = /.+/){
  if ($("#"+campo).value ==''){   
    $("#"+campo).css("color", "red");
    $("#"+campo).css("border", "red 1px solid");

    setTimeout(function () {  
      $("#"+campo).css("color", "");
      $("#"+campo).css("border", "");
    },3000);

    return false;

  }else if(!regex.exec($("#"+campo).val())){
    $("#"+campo).css("color", "red");
    $("#"+campo).css("border", "red 1px solid");

    setTimeout(function () {  
      $("#"+campo).css("color", "");
      $("#"+campo).css("border", "");
    },3000);

    return false;

  }else{
    $("#"+campo).css("color", "green");
    $("#"+campo).css("border", "green 1px solid");

    setTimeout(function () {  
      $("#"+campo).css("color", "");
      $("#"+campo).css("border", "");
    },3000);

    return true;
  }
}