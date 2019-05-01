$(document).ready(function () {
  cargarTarjetas()
});

function cargarTarjetas() {
  $.ajax({
    url: "/carpetas",
    method: "GET",
    dataType: "json",
    success: function(datos) {
      document.getElementById('sector-inferior').innerHTML = '';

      for(var i=0; i<datos.length; i++){
        
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
                  <button onclick="abrirCarpeta('${datos[i]._id}', '${datos[i].nombre}');">Abrir</button>
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
});