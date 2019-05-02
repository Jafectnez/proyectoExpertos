localStorage.setItem("Id_Carpeta", "");
localStorage.setItem("Nombre_Carpeta", "Carpeta no Seleccionada");

$(document).ready(function () {
  cargarTarjetas();
});

function cargarTarjetas() {
  $.ajax({
    url: "/carpetas",
    method: "GET",
    dataType: "json",
    success: function(datos) {
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
                    <label for="compartir-carpeta">
                      <button id="compartir-carpeta" onclick="compartirCarpeta(${datos[i]._id});"></button>
                      <li class="fas fa-share-alt"></li>
                    </label>
                    <label for="eliminar-carpeta">
                      <button id="eliminar-carpeta" onclick="eliminarCarpeta(${datos[i]._id});"></button>
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
                    <span class="num">${datos[i].proyectos_internos.length}</span>
                    <span class="word">Proyectos</span>
                  </div>
                  <div class="item">
                    <span class="num">${datos[i].carpetas_internas.length}</span>
                    <span class="word">Carpetas</span>
                  </div>
                  <div class="item">
                    <span class="num">${datos[i].archivos_internos.length}</span>
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
      console.error(error);
    }
  });
}

function abrirCarpeta(id, nombre) {
  localStorage.setItem("Id_Carpeta", id);
  localStorage.setItem("Nombre_Carpeta", nombre);
  window.location = 'seccion-proyectos.html'
}

$("#btn-crear-carpeta").on("click",function () {
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
        if(respuesta.status == 1){
          cargarTarjetas();
          $("#status").css("color", "green");
          $("#status").text(respuesta.mensaje);
          setTimeout(function () {  
            $("#status").css("color", "black");
            $("#status").text("");
          },3000);
        }
        else{
          $("#status").css("color", "red");
          $("#status").text(respuesta.mensaje);
          setTimeout(function () {  
            $("#status").css("color", "black");
            $("#status").text("");
          },3000);
        }
      }
    });
  }else{  
    $("#status").css("color", "red");
    $("#status").text("Asegurese de llenar todos los campos requeridos");
    setTimeout(function () {  
      $("#status").css("color", "");
      $("#status").text("");
    },3000);
  }
});

function compartirCarpeta(idCarpeta) {
  console.log("Compartir carpeta " + idCarpeta);
}

function eliminarCarpeta(idCarpeta) {
  $.ajax({
    type: "GET",
    url: `/carpetas/${idCarpeta}/eliminar`,
    dataType: "json",
    success: function (respuesta) {
      if(respuesta.status == 1){
        console.log(respuesta.mensaje);
        cargarTarjetas();
      }else
        console.error(respuesta.mensaje)
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