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
                  <button data-toggle="modal" data-target="#modalVerCarpeta" onclick="verCarpeta('${subcarpeta._id}');"></button>
                  <li class="fas fa-eye"></li>
                </label>
                <label>
                  <button data-toggle="modal" data-target="#modalCompartirCarpeta" onclick="compartirCarpeta('${subcarpeta._id}', '${subcarpeta.nombre}');"></button>
                  <li class="fas fa-share-alt"></li>
                </label>
                <label>
                  <button data-toggle="modal" data-target="#modalEliminarCarpeta" onclick="eliminarCarpeta('${subcarpeta._id}', '${subcarpeta.nombre}');"></button>
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
                <span class="num">${subcarpeta.carpetas_internas.length}</span>
                <span class="word">Carpetas</span>
              </div>
              <div class="item">
                <span class="num">${subcarpeta.proyectos_internos.length}</span>
                <span class="word">Proyectos</span>
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
                  <button data-toggle="modal" data-target="#modalVerProyecto" onclick="verProyecto('${proyecto._id}');"></button>
                  <li class="fas fa-eye"></li>
                </label>
                <label>
                  <button onclick="descargarProyecto('${proyecto._id}');"></button>
                  <li class="fas fa-download"></li>
                </label>
                <label>
                  <button data-toggle="modal" data-target="#modalCompartirProyecto"  onclick="compartirProyecto('${proyecto._id}', '${proyecto.nombre}');"></button>
                  <li class="fas fa-share-alt"></li>
                </label>
                <label>
                  <button data-toggle="modal" data-target="#modalEliminarProyecto"  onclick="eliminarProyecto('${proyecto._id}', '${proyecto.nombre}');"></button>
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
                  <button data-toggle="modal" data-target="#modalVerArchivo" onclick="verArchivo('${archivo._id}');"></button>
                  <li class="fas fa-eye"></li>
                </label>
                <label>
                  <button onclick="obtenerArchivo('${archivo._id}', true);"></button>
                  <li class="fas fa-download"></li>
                </label>
                <label>
                  <button data-toggle="modal" data-target="#modalCompartirArchivo"  onclick="compartirArchivo('${archivo._id}', '${archivo.nombre}.${archivo.extension}');"></button>
                  <li class="fas fa-share-alt"></li>
                </label>
                <label>
                  <button data-toggle="modal" data-target="#modalEliminarArchivo"  onclick="eliminarArchivo('${archivo._id}', '${archivo.nombre}.${archivo.extension}');"></button>
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
    },5000);

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
          },5000);
        }
        else{
          $("#status-carpeta").css("color", "red");
          $("#status-carpeta").text(respuesta.mensaje);
          setTimeout(function () {  
            $("#status-carpeta").css("color", "");
            $("#status-carpeta").text("");
          },5000);
        }
      },
      error:function (error) {  
        $(".div-loading").css("display", "none");
        $("#status-carpeta").css("color", "red");
        $("#status-carpeta").text(error);
        setTimeout(function () {  
          $("#status-carpeta").css("color", "");
          $("#status-carpeta").text("");
        },5000);
      }
    });
  }else{  
    $(".div-loading").css("display", "none");
    $("#status-carpeta").css("color", "red");
    $("#status-carpeta").text("Asegurese de llenar todos los campos requeridos");
    setTimeout(function () {  
      $("#status-carpeta").css("color", "");
      $("#status-carpeta").text("");
    },5000);
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
    },5000);

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
          },5000);
        }
        else{
          $("#status-proyecto").css("color", "red");
          $("#status-proyecto").text(respuesta.mensaje);
          setTimeout(function () {  
            $("#status-proyecto").css("color", "");
            $("#status-proyecto").text("");
          },5000);
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
    },5000);
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
    },5000);

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
    },5000);
  }else{
    $("#slc-extension-archivo").css("border", "green 1px solid");
    $("#slc-extension-archivo").css("color", "green");

    setTimeout(function () {  
      $("#slc-extension-archivo").css("color", "");
      $("#slc-extension-archivo").css("border", "");
    },5000);
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
          },5000);
        }
        else{
          $("#status-archivo").css("color", "red");
          $("#status-archivo").text(respuesta.mensaje);
          setTimeout(function () {  
            $("#status-archivo").css("color", "");
            $("#status-archivo").text("");
          },5000);
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
    },5000);
  }
});

//Funcionalidades Archivo
function verArchivo(idArchivo) {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/archivos/${idArchivo}`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      $("#id-archivo-editar").val(respuesta.archivo._id);
      $("#title-archivo").val(`${respuesta.archivo.nombre}`);
      $("#txtA-contenido-archivo-editar").text(respuesta.archivo.contenido);
      $("#nombre-creador-archivo").text("Creador: "+respuesta.creador);
      $("#slc-extension-editar-"+respuesta.archivo.extension).attr("selected", true);

      $("#tbl-modificaciones-archivo").html("");
      for(var i=0; i<respuesta.archivo.modificaciones.length; i++){
        var row = `<tr><td>${respuesta.archivo.modificaciones[i].mensaje}</td><td>${respuesta.archivo.modificaciones[i].fecha}</td></tr>`;
        $("#tbl-modificaciones-archivo").append(row);
      }
    },
    error: function (error) {  
      $(".div-loading").css("display", "none");
      console.error(error.mensaje);
      console.error(error.datos);
    }
  });
}

$("#btn-editar-archivo").on("click", function () {
  $("#btn-actualizar-archivo").removeClass("hide");
  $("#btn-editar-archivo").addClass("hide");
  $("#title-archivo").removeAttr("disabled");
  $("#slc-extension-editar").removeAttr("disabled");
  $("#txtA-contenido-archivo-editar").removeAttr("disabled");
})

$("#btn-actualizar-archivo").on("click", function () {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "POST",
    url: "/archivos/guardar",
    data: {
      idArchivo: $("#id-archivo-editar").val(),
      nombreArchivo: $("#title-archivo").val(),
      extensionArchivo: $("#slc-extension-editar").val(),
      contenidoArchivo: $("#txtA-contenido-archivo-editar").val()
    },
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      $("#btn-editar-archivo").removeClass("hide");
      $("#btn-actualizar-archivo").addClass("hide");
      $("#title-archivo").attr("disabled", true);
      $("#slc-extension-editar").attr("disabled", true);
      $("#txtA-contenido-archivo-editar").attr("disabled", true);
      if(respuesta.status == 1){
        console.log(respuesta.mensaje);
        $("#status-archivo-editar").css("color", "green");
        $("#status-archivo-editar").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-archivo-editar").css("color", "");
          $("#status-archivo-editar").text("");
        },5000);
      }else{
        console.error(respuesta.mensaje);
        $("#status-archivo-editar").css("color", "red");
        $("#status-archivo-editar").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-archivo-editar").css("color", "");
          $("#status-archivo-editar").text("");
        },5000);
      }
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
      console.error(respuesta.mensaje)
    }
  });
});

function compartirArchivo(idArchivo, nombreArchivo) {
  $("#id-archivo-compartir").val(idArchivo);
  $("#title-archivo-compartir").text(nombreArchivo);
}

$("#btn-compartir-archivo").on("click", function () {  
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "POST",
    url: `/archivos/${$("#id-archivo-compartir").val()}/compartir`,
    data: {
      idAmigoCompartir: $('input:radio[name=rBtn-idAmigo]:checked').val()
    },
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      console.log(respuesta);
      if(respuesta.status = 1){
        $("#status-compartir-archivo").css("color", "green");
        $("#status-compartir-archivo").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-compartir-archivo").css("color", "");
          $("#status-compartir-archivo").text("");
        },5000);
      }else{
        $("#status-compartir-archivo").css("color", "red");
        $("#status-compartir-archivo").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-compartir-archivo").css("color", "");
          $("#status-compartir-archivo").text("");
        },5000);
      }
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
      $("#status-compartir-archivo").css("color", "red");
      $("#status-compartir-archivo").text("Ocurrió un error, intente de nuevo luego.");
      console.error(respuesta);
      setTimeout(function () {  
        $("#status-compartir-archivo").css("color", "");
        $("#status-compartir-archivo").text("");
      },5000);
    }
  });
});

function eliminarArchivo(idArchivo, nombreArchivo) {
  $("#id-archivo-eliminar").val(idArchivo);
  $("#title-archivo-eliminar").text(nombreArchivo);
}

$("#btn-eliminar-archivo").on("click", function () {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/archivos/${$("#id-archivo-eliminar").val()}/eliminar`,
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
});
//Fin funcionalidades Archivo

//Funcionalidades Proyecto
function abrirProyecto(id, nombre) {
  localStorage.setItem("Id_Proyecto", id);
  localStorage.setItem("Nombre_Proyecto", nombre);
  window.location = 'seccion-archivos.html';
}

function verProyecto(idProyecto) {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/proyectos/${idProyecto}`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      $("#id-proyecto-editar").val(respuesta.proyecto._id);
      $("#title-proyecto").val(`${respuesta.proyecto.nombre}`);
      $("#txtA-descripcion-proyecto-editar").text(respuesta.proyecto.descripcion);
      $("#nombre-creador").text("Creador: "+respuesta.creador);
    },
    error: function (error) {  
      $(".div-loading").css("display", "none");
      console.error(error.mensaje);
      console.error(error.datos);
    }
  });
}

$("#btn-editar-proyecto").on("click", function () {
  $("#btn-actualizar-proyecto").removeClass("hide");
  $("#btn-editar-proyecto").addClass("hide");
  $("#title-proyecto").removeAttr("disabled");
  $("#txtA-descripcion-proyecto-editar").removeAttr("disabled");
})

$("#btn-actualizar-proyecto").on("click", function () {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "POST",
    url: "/proyectos/guardar",
    data: {
      idProyecto: $("#id-proyecto-editar").val(),
      nombreProyecto: $("#title-proyecto").val(),
      descripcionProyecto: $("#txtA-descripcion-proyecto-editar").val()
    },
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      $("#btn-editar-proyecto").removeClass("hide");
      $("#btn-actualizar-proyecto").addClass("hide");
      $("#title-proyecto").attr("disabled", true);
      $("#txtA-descripcion-proyecto-editar").attr("disabled", true);
      if(respuesta.status == 1){
        console.log(respuesta.mensaje);
        $("#status-proyecto-editar").css("color", "green");
        $("#status-proyecto-editar").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-proyecto-editar").css("color", "");
          $("#status-proyecto-editar").text("");
        },5000);
      }else{
        console.error(respuesta.mensaje);
        $("#status-proyecto-editar").css("color", "red");
        $("#status-proyecto-editar").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-proyecto-editar").css("color", "");
          $("#status-proyecto-editar").text("");
        },5000);
      }
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
      console.error(respuesta.mensaje)
    }
  });
});

function compartirProyecto(idProyecto, nombreProyecto) {
  $("#id-proyecto-compartir").val(idProyecto);
  $("#title-proyecto-compartir").text(nombreProyecto);
}

$("#btn-compartir-proyecto").on("click", function () {  
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "POST",
    url: `/proyectos/${$("#id-proyecto-compartir").val()}/compartir`,
    data: {
      idAmigoCompartir: $('input:radio[name=rBtn-idAmigo]:checked').val()
    },
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      console.log(respuesta);
      if(respuesta.status = 1){
        $("#status-compartir-proyecto").css("color", "green");
        $("#status-compartir-proyecto").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-compartir-proyecto").css("color", "");
          $("#status-compartir-proyecto").text("");
        },5000);
      }else{
        $("#status-compartir-proyecto").css("color", "red");
        $("#status-compartir-proyecto").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-compartir-proyecto").css("color", "");
          $("#status-compartir-proyecto").text("");
        },5000);
      }
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
      $("#status-compartir-proyecto").css("color", "red");
      $("#status-compartir-proyecto").text("Ocurrió un error, intente de nuevo luego.");
      console.error(respuesta);
      setTimeout(function () {  
        $("#status-compartir-proyecto").css("color", "");
        $("#status-compartir-proyecto").text("");
      },5000);
    }
  });
});

function eliminarProyecto(idProyecto, nombreProyecto) {
  $("#id-proyecto-eliminar").val(idProyecto);
  $("#title-proyecto-eliminar").text(nombreProyecto);
}

$("#btn-eliminar-proyecto").on("click", function () {  
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/proyectos/${$("#id-proyecto-eliminar").val()}/eliminar`,
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
      }else{
        console.error(respuesta.mensaje);
        $("#status").css("color", "red");
        $("#status").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status").css("color", "");
          $("#status").text("");
        },5000);
      }
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
    }
  });
});
//Fin funcionalidades Proyecto

//Funcionalidades Carpeta
function abrirCarpeta(id, nombre) {
  localStorage.setItem("Id_Carpeta", id);
  localStorage.setItem("Nombre_Carpeta", nombre);
  window.location = 'seccion-proyectos.html'
}

function verCarpeta(idCarpeta) {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/carpetas/${idCarpeta}/datos`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      $("#id-carpeta-editar").val(respuesta.carpeta._id);
      $("#title-carpeta").text(`${respuesta.carpeta.nombre}`);
      $("#txtA-descripcion-carpeta-editar").text(respuesta.carpeta.descripcion);
      $("#nombre-creador").text("Creador: "+respuesta.creador);
    },
    error: function (error) {  
      $(".div-loading").css("display", "none");
      console.error(error.mensaje);
      console.error(error.datos);
    }
  });
}

$("#btn-editar-carpeta").on("click", function () {
  $("#btn-actualizar-carpeta").removeClass("hide");
  $("#btn-editar-carpeta").addClass("hide");
  $("#title-carpeta").removeAttr("disabled");
  $("#txtA-descripcion-carpeta-editar").removeAttr("disabled");
})

$("#btn-actualizar-carpeta").on("click", function () {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "POST",
    url: "/carpetas/guardar",
    data: {
      idCarpeta: $("#id-carpeta-editar").val(),
      nombreCarpeta: $("#title-carpeta").val(),
      descripcionCarpeta: $("#txtA-descripcion-carpeta-editar").val()
    },
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      $("#btn-editar-carpeta").removeClass("hide");
      $("#btn-actualizar-carpeta").addClass("hide");
      $("#title-carpeta").attr("disabled", true);
      $("#txtA-descripcion-carpeta-editar").attr("disabled", true);
      if(respuesta.status == 1){
        console.log(respuesta.mensaje);
        $("#status-carpeta-editar").css("color", "green");
        $("#status-carpeta-editar").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-carpeta-editar").css("color", "");
          $("#status-carpeta-editar").text("");
        },5000);
      }else{
        console.error(respuesta.mensaje);
        $("#status-carpeta-editar").css("color", "red");
        $("#status-carpeta-editar").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-carpeta-editar").css("color", "");
          $("#status-carpeta-editar").text("");
        },5000);
      }
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
      console.error(respuesta.mensaje)
    }
  });
});

function compartirCarpeta(idCarpeta, nombreCarpeta) {
  $("#id-compartir-carpeta").val(idCarpeta);
  $("#title-carpeta-compartir-carpeta").text(nombreCarpeta);
}

$("#btn-compartir-carpeta").on("click", function () {  
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "POST",
    url: `/carpetas/${$("#id-compartir-carpeta").val()}/compartir`,
    data: {
      idAmigoCompartir: $('input:radio[name=rBtn-idAmigo]:checked').val()
    },
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");

      if(respuesta.status = 1){
        $("#status-compartir-carpeta").css("color", "green");
        $("#status-compartir-carpeta").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-compartir-carpeta").css("color", "");
          $("#status-compartir-carpeta").text("");
        },5000);
      }else{
        $("#status-compartir-carpeta").css("color", "red");
        $("#status-compartir-carpeta").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-compartir-carpeta").css("color", "");
          $("#status-compartir-carpeta").text("");
        },5000);
      }
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
      $("#status-compartir-carpeta").css("color", "red");
      $("#status-compartir-carpeta").text("Ocurrió un error, intente de nuevo más tarde.");
      console.error(respuesta);
      setTimeout(function () {  
        $("#status-compartir-carpeta").css("color", "");
        $("#status-compartir-carpeta").text("");
      },5000);
    }
  });
});

function eliminarCarpeta(idCarpeta, nombreCarpeta) {
  $("#id-carpeta-eliminar").val(idCarpeta);
  $("#title-carpeta-eliminar").text(nombreCarpeta);
}

$("#btn-eliminar-carpeta").on("click", function () {  
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/carpetas/${$("#id-carpeta-eliminar").val()}/eliminar`,
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
      }else{
        console.error(respuesta.mensaje);
        $("#status").css("color", "red");
        $("#status").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status").css("color", "");
          $("#status").text("");
        },5000);
      }
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
    }
  });
});
//Fin funcionalidades Carpeta  


function validarCampo(campo, regex = /.+/){
  if ($("#"+campo).value ==''){   
    $("#"+campo).css("color", "red");
    $("#"+campo).css("border", "red 1px solid");

    setTimeout(function () {  
      $("#"+campo).css("color", "");
      $("#"+campo).css("border", "");
    },5000);

    return false;

  }else if(!regex.exec($("#"+campo).val())){
    $("#"+campo).css("color", "red");
    $("#"+campo).css("border", "red 1px solid");

    setTimeout(function () {  
      $("#"+campo).css("color", "");
      $("#"+campo).css("border", "");
    },5000);

    return false;

  }else{
    $("#"+campo).css("color", "green");
    $("#"+campo).css("border", "green 1px solid");

    setTimeout(function () {  
      $("#"+campo).css("color", "");
      $("#"+campo).css("border", "");
    },5000);

    return true;
  }
}

//Funcion buscar Usuario
$("#txt-nombre-usuario-carpeta").on("change", function () {
  buscarUsuario("carpeta");
});

$("#txt-nombre-usuario-proyecto").on("change", function () {
  buscarUsuario("proyecto");
});

$("#txt-nombre-usuario-archivo").on("change", function () {
  buscarUsuario("archivo");
});

function buscarUsuario(dato) {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/amigos/buscar/${$("#txt-nombre-usuario-"+dato).val()}`,
    dataType: "json",
    success: function (respuesta) {
      console.log(respuesta);
      $("#resultado-usuario-"+dato).html("");
      $(".div-loading").css("display", "none");

      if(respuesta.datos.length < 1){
        $("#status-usuario").css("color", "red");
        $("#status-usuario").text("No se han encontrado coincidencias");
        setTimeout(function () {  
          $("#status-usuario").css("color", "");
          $("#status-usuario").text("");
        },5000);
        return;
      }

      for(var i=0; i<respuesta.datos.length; i++){
        var user = respuesta.datos[i];
        var row = `<tr>
                    <td>${user.usuario}</td>
                    <td>${user.nombre} ${user.apellido}</td>
                    <td><input type="radio" name="rBtn-idAmigo" value='${user._id}'></td>
                  </tr>`;

        $("#resultado-usuario-"+dato).append(row);
      }
    }
  });
}

//Funcionalidad de Descargas
function descargarArchivo(Blob, nombre) {
  var reader = new FileReader();
  reader.onload = function (event) {
    var save = document.createElement('a');
    save.href = event.target.result;
    save.target = '_blank';
    save.download = nombre;

    var clicEvent = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    
    save.dispatchEvent(clicEvent);
    
    (window.URL || window.webkitURL).revokeObjectURL(save.href);
  };
  
  reader.readAsDataURL(Blob);
};

function obtenerArchivo(idArchivo, unico) {
  $(".div-loading").css("display", "block");
  //Obtencion de los datos
  $.ajax({
    type: "GET",
    url: `archivos/${idArchivo}`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      if(unico){
        miArchivo = new Blob([respuesta.archivo.contenido], {
          type: `text/${respuesta.archivo.extension}`
        });
        descargarArchivo(miArchivo, `${respuesta.archivo.nombre}.${respuesta.archivo.extension}`);
      }else{
        return respuesta.archivo;
      }
    }
  });
}

function descargarProyecto(idProyecto) {
  $(".div-loading").css("display", "block");
  //Obtencion de los datos
  $.ajax({
    type: "GET",
    url: `proyectos/${idProyecto}/descargar`,
    contentType: 'application/json', 
    xhrFields:{
        responseType: 'blob'
    },
    success: function(data, status, xhr){
      $(".div-loading").css("display", "none");

      var filename = "";
      var disposition = xhr.getResponseHeader('Content-Disposition');
      if (disposition && disposition.indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) { 
            filename = matches[1].replace(/['"]/g, '');
          }
      }

      var anchor = document.createElement('a');
      var url = window.URL || window.webkitURL;
      anchor.href = url.createObjectURL(data);
      anchor.download = filename;
      document.body.append(anchor);
      anchor.click();
      setTimeout(function(){  
          document.body.removeChild(anchor);
          url.revokeObjectURL(anchor.href);
      }, 1);
    },
    error: function (respuesta) {
      $(".div-loading").css("display", "none");
      console.error(respuesta);
    }
  });
}