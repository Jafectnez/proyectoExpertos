$(document).ready(function () {
  cargarTarjetas();
});

function cargarTarjetas() {
  $(".div-loading").css("display", "block");
  document.getElementById('sector-inferior').innerHTML = '';
  $.ajax({
    url: `/carpetas/carpetas-compartidas`,
    method: "GET",
    dataType: "json",
    success: function(res) {
      creacionTarjetasCarpetas(res);

      $.ajax({
        url: `/carpetas/proyectos-compartidos`,
        method: "GET",
        dataType: "json",
        success: function(res) {
          creacionTarjetasProyectos(res);

          $.ajax({
            url: `/carpetas/archivos-compartidos`,
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

function creacionTarjetasCarpetas(datos){
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

function creacionTarjetasProyectos(datos){
  for(var i=0; i<datos.length; i++){
    var proyecto = datos[i].proyecto;

    document.getElementById('sector-inferior').innerHTML += 
    ` <div class="col col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div class="tarjeta">
          <div class="cabecera-tarjeta">
            <img src="img/Logo-GEPO-page.svg" alt="">
            <div class="cover"></div>
            <div class="menu">
              <ul>
                <label>
                  <button data-toggle="modal" data-target="#modalEliminarProyecto"  onclick="eliminarProyectoCompartido('${proyecto._id}', '${proyecto.nombre}');"></button>
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
                  <span class="num-creador">${datos[i].creador}</span>
                  <span class="word">Creador</span>
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
  for(var i=0; i<datos.length; i++){
    var archivo = datos[i].archivo;

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
                <span class="num-creador">${datos[i].creador}</span>
                <span class="word">Creador</span>
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
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/archivos/${idArchivo}`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      $("#id-archivo").val(respuesta.archivo._id);
      $("#title-archivo").text(`${respuesta.archivo.nombre}.${respuesta.archivo.extension}`);
      $("#txtA-contenido-archivo").text(respuesta.archivo.contenido);
      $("#nombre-creador").text("Creador: "+respuesta.creador);
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
  $("#txtA-contenido-archivo").removeAttr("disabled");
})

$("#btn-actualizar-archivo").on("click", function () {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "POST",
    url: "/archivos/guardar",
    data: {
      idArchivo: $("#id-archivo").val(),
      contenidoArchivo: $("#txtA-contenido-archivo").val()
    },
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      $("#btn-editar-archivo").removeClass("hide");
      $("#btn-actualizar-archivo").addClass("hide");
      $("#txtA-contenido-archivo").attr("disabled", true);
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

function eliminarProyectoCompartido(idProyecto, nombreProyecto) {
  $("#id-proyecto-eliminar").val(idProyecto);
  $("#title-proyecto-eliminar").text(nombreProyecto);
}

$("#btn-eliminar-proyecto").on("click", function () {  
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/carpetas/${$("#id-proyecto-eliminar").val()}/compartidos/eliminar`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      if(respuesta.status == 1){
        console.log(respuesta.mensaje);
        $("#status-eliminar-proyecto").css("color", "green");
        $("#status-eliminar-proyecto").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-eliminar-proyecto").css("color", "");
          $("#status-eliminar-proyecto").text("");
        },5000);
        cargarTarjetas();
      }else{
        console.error(respuesta.mensaje);
        $("#status-eliminar-proyecto").css("color", "red");
        $("#status-eliminar-proyecto").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-eliminar-proyecto").css("color", "");
          $("#status-eliminar-proyecto").text("");
        },5000);
      }
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
      console.log(error)
    }
  });
});

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
      console.log(error)
    }
  });
});

//Funcion buscar Usuario
$("#txt-nombre-usuario").on("change", function () {
  buscarUsuario();
});

function buscarUsuario() {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/amigos/buscar/${$("#txt-nombre-usuario").val()}`,
    dataType: "json",
    success: function (respuesta) {
      $("#resultado-usuario").html("");
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

        $("#resultado-usuario").append(row);
      }
    }
  });
}