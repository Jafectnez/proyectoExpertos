$(document).ready(function () {
  cargarTarjetas();
});

function cargarTarjetas() {
  $.ajax({
    url: "/amigos",
    method: "GET",
    dataType: "json",
    success: function(datos) {
      document.getElementById('sector-inferior').innerHTML = '';

      for(var i=0; i<datos.datos[0].amigos.length; i++){
        var amigo = datos.datos[0].amigos[i];
        
        document.getElementById('sector-inferior').innerHTML += 
        ` <div class="col col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div class="tarjeta">
              <div class="cabecera-tarjeta">
                <img src="${amigo.foto_perfil}" alt="">
                <div class="cover"></div>
                <div class="menu">
                  <ul>
                    <label>
                      <button onclick="eliminarAmigo('${amigo._id}');"></button>
                      <li class="fas fa-trash"></li>
                    </label>
                  </ul>
                  <i class="fas fa-ellipsis-v"></i>
                </div>

                <div class="nombre">
                  <span class="nombre-tarjeta">${amigo.usuario}</span>
                </div>
              </div>
              <div class="descripcion-tarjeta">
                <div class="seccion-izquierda">
                  <h3>${amigo.nombre} ${amigo.apellido}</h3>
                  <p>${amigo.correo}</p>
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
        },3000);
        return;
      }

      for(var i=0; i<respuesta.datos.length; i++){
        var user = respuesta.datos[i];
        var row = `<tr>
                    <td>${user.usuario}</td>
                    <td>${user.nombre} ${user.apellido}</td>
                    <td><button type="button" class="btn btn-link" onclick="agregarAmigo('${user._id}')"><i class="fas fa-user-plus"></i></button></td>
                  </tr>`;

        $("#resultado-usuario").append(row);
      }
    }
  });
}

function agregarAmigo(idUsuario) {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `amigos/${idUsuario}/agregar`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      console.log(respuesta.mensaje);
      cargarTarjetas();
    }
  });
}

function eliminarAmigo(idAmigo) {
  $(".div-loading").css("display", "block");
  $.ajax({
    type: "GET",
    url: `amigos/${idAmigo}/eliminar`,
    dataType: "json",
    success: function (respuesta) {
      $(".div-loading").css("display", "none");
      console.log(respuesta.mensaje);
      cargarTarjetas();
    }
  });
}

function enterPress(e) {
  if (e.keyCode == 13) {
    buscarUsuario();
  }
}