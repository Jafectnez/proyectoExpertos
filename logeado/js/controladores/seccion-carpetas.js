localStorage.setItem("Id_Carpeta", "");
localStorage.setItem("Nombre_Carpeta", "Carpeta no Seleccionada");

$(document).ready(function () {
  cargarTarjetas();
});

function cargarTarjetas() {
  $(".div-loading").css("display", "block");
  $.ajax({
    url: "/carpetas",
    method: "GET",
    dataType: "json",
    success: function(datos) {
      $(".div-loading").css("display", "none");
      document.getElementById('sector-inferior').innerHTML = '';

      for(var i=0; i<datos.length; i++){
        if(datos[i].eliminado)
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
                      <button data-toggle="modal" data-target="#modalVerCarpeta" onclick="verCarpeta('${datos[i]._id}');"></button>
                      <li class="fas fa-eye"></li>
                    </label>
                    <label>
                      <button id="compartir-carpeta" data-toggle="modal" data-target="#modalCompartir" onclick="compartirCarpeta('${datos[i]._id}', '${datos[i].nombre}');"></button>
                      <li class="fas fa-share-alt"></li>
                    </label>
                    <label>
                      <button id="eliminar-carpeta" data-toggle="modal" data-target="#modalEliminar" onclick="eliminarCarpeta('${datos[i]._id}', '${datos[i].nombre}');"></button>
                      <li class="fas fa-trash"></li>
                    </label>
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
                    <span class="num">${datos[i].archivos.length}</span>
                    <span class="word">Archivos</span>
                  </div>
                </div>
                <div>
                  <button class="btn-tarjeta" onclick="abrirCarpeta('${datos[i]._id}', '${datos[i].nombre}');">Abrir</button>
                </div>
              </div>
            </div>
          </div>`;
      }
    },
    error: function(error) {
      $(".div-loading").css("display", "none");
      console.error(error);
    }
  });
}

function abrirCarpeta(id, nombre) {
  localStorage.setItem("Id_Carpeta", id);
  localStorage.setItem("Nombre_Carpeta", nombre);
  window.location = 'seccion-proyectos.html'
}

function verCarpeta(idCarpeta) {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/carpetas/${idCarpeta}`,
    dataType: "json",
    success: function (respuesta) {
      console.log(respuesta);
      console.log(respuesta.carpeta);
      $(".div-loading").css("display", "none");
      $("#id-carpeta-editar").val(respuesta.carpeta._id);
      $("#title-carpeta").val(`${respuesta.carpeta.nombre}`);
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
        cargarTarjetas();
        verCarpeta(respuesta.datos._id);
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

$("#btn-crear-carpeta").on("click",function () {
  $(".div-loading").css("display", "block");
  var campos = [{campo: 'txt-nombre-carpeta'},
                {campo: 'txtA-descripcion-carpeta'}];

  var validos = true;

  for(let i in campos)
    if(!validarCampo(campos[i].campo))
      validos = false;

  if(validos){
    $.ajax({
      type: "POST",
      url: "/carpetas/crear",
      data: {
        nombreCarpeta: $("#txt-nombre-carpeta").val(),
        descripcionCarpeta: $("#txtA-descripcion-carpeta").val()
      },
      dataType: "json",
      success: function (respuesta) {
        $(".div-loading").css("display", "none");
        if(respuesta.status == 1){
          cargarTarjetas();
          $("#status").css("color", "green");
          $("#status").text(respuesta.mensaje);
          setTimeout(function () {  
            $("#status").css("color", "black");
            $("#status").text("");
          },5000);
        }
        else{
          $("#status").css("color", "red");
          $("#status").text(respuesta.mensaje);
          setTimeout(function () {  
            $("#status").css("color", "black");
            $("#status").text("");
          },5000);
        }
      },
      error: function (respuesta) {  
        $(".div-loading").css("display", "none");
      }
    });
  }else{  
    $(".div-loading").css("display", "none");
    $("#status").css("color", "red");
    $("#status").text("Asegurese de llenar todos los campos requeridos");
    setTimeout(function () {  
      $("#status").css("color", "");
      $("#status").text("");
    },5000);
  }
});

function compartirCarpeta(idCarpeta, nombreCarpeta) {
  $("#id-compartir").val(idCarpeta);
  $("#title-carpeta-compartir").text(nombreCarpeta);
}

$("#btn-compartir").on("click", function () {  
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "POST",
    url: `/carpetas/${$("#id-compartir").val()}/compartir`,
    data: {
      idAmigoCompartir: $('input:radio[name=rBtn-idAmigo]:checked').val()
    },
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");

      if(respuesta.status = 1){
        $("#status-compartir").css("color", "green");
        $("#status-compartir").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-compartir").css("color", "");
          $("#status-compartir").text("");
        },5000);
      }else{
        $("#status-compartir").css("color", "red");
        $("#status-compartir").text(respuesta.mensaje);
        setTimeout(function () {  
          $("#status-compartir").css("color", "");
          $("#status-compartir").text("");
        },5000);
      }
    },
    error: function (respuesta) {  
      $(".div-loading").css("display", "none");
      $("#status-compartir").css("color", "red");
      $("#status-compartir").text("Ocurrió un error, intente de nuevo más tarde.");
      console.error(respuesta);
      setTimeout(function () {  
        $("#status-compartir").css("color", "");
        $("#status-compartir").text("");
      },5000);
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

function eliminarCarpeta(idCarpeta, nombreCarpeta) {
  $("#id-eliminar").val(idCarpeta);
  $("#title-carpeta-eliminar").text(nombreCarpeta);
}

$("#btn-eliminar").on("click", function () {  
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `/carpetas/${$("#id-eliminar").val()}/eliminar`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      if(respuesta.status == 1){
        console.log(respuesta.mensaje);
        $("#status").css("color", "red");
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