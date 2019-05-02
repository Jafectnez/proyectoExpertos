$(".btn-navbar").on("click", function () {
  $(".menu-navbar").toggleClass("show");
});

var editorHTML = CodeMirror(document.getElementById("editor-html"), {
  lineNumbers: true,
  mode : "xml",
  htmlMode: true,
  theme: "ambiance",
  tabSize: 2,
  smartIndent: true,
  matchBrackets: true,
  keyMap: "sublime",
  extraKey: {"Ctrl-Space":"autocomplete"}
});

$("#editor-html").children(".CodeMirror").prepend("<h3>HTML</h3>");

var editorCSS = CodeMirror(document.getElementById("editor-css"), {
  lineNumbers: true,
  mode:"css",
  theme: "ambiance",
  tabSize: 2,
  smartIndent: true,
  matchBrackets: true,
  keyMap: "sublime",
  extraKey: {"Ctrl-Space":"autocomplete"}
});

$("#editor-css").children(".CodeMirror").prepend("<h3>CSS</h3>");

var editorJS = CodeMirror(document.getElementById("editor-js"), {
  lineNumbers: true,
  mode:"javascript",
  theme: "ambiance",
  tabSize: 2,
  smartIndent: true,
  keyMap: "sublime",
  lineWrapping: true,
  matchBrackets: true,
  keyMap: "sublime",
  extraKey: {"Ctrl-Space":"autocomplete"}
});

$("#editor-js").children(".CodeMirror").prepend("<h3>JS</h3>");
var input = document.getElementById("select-tema");

function selectTheme() {
  var theme = input.options[input.selectedIndex].textContent;
  
  editorHTML.setOption("theme", theme);
  editorJS.setOption("theme", theme);
  editorCSS.setOption("theme", theme);
  location.hash = "#" + theme;
}

var choice = (location.hash && location.hash.slice(1)) ||
             (document.location.search &&
              decodeURIComponent(document.location.search.slice(1)));

if (choice) {
  input.value = choice;
  editorHTML.setOption("theme", choice);
  editorJS.setOption("theme", choice);
  editorCSS.setOption("theme", choice);
}

CodeMirror.on(window, "hashchange", function() {
  var theme = location.hash.slice(1);
  if (theme) { input.value = theme; selectTheme(); }
});

function cargarPlantillaHTML(){
  var dir_plantilla = "../ejemplo.html";
  $.ajax({
    url : dir_plantilla,
    dataType: "text",
    success : function (data) 
    {
      editorHTML.setOption("value", data);
    }
  });

  $("#resultado").attr("src", "ejemplo.html");
}

$(document).ready(function () {
  $("#nombre-portada").text(localStorage.getItem("Nombre_Proyecto"));
  $.ajax({
    type: "GET",
    url: `/proyectos/${localStorage.getItem("Id_Proyecto")}/archivos`,
    dataType: "json",
    success: function (respuesta) {
      for(var i=0; i<respuesta[0].archivos.length; i++){
        var archivo = respuesta[0].archivos[i];

        if(archivo.extension == "html")
          editorHTML.setOption("value", `${archivo.contenido}`);
        else if(archivo.extension == "js")
          editorJS.setOption("value", `${archivo.contenido}`);
        else
          editorCSS.setOption("value", `${archivo.contenido}`);
      }
    }
  });
});

editorHTML.on("change", function () {  
  cargarIframe();
});

editorCSS.on("change", function () {  
  cargarIframe();
});

editorJS.on("change", function () {  
  cargarIframe();
});

function guardarCambios(){
  $.ajax({
    type: "POST",
    url: "/archivos/guardar-cambios",
    data: {
      id: {
        html: `${localStorage.getItem("html")}`,
        js: `${localStorage.getItem("js")}`,
        css: `${localStorage.getItem("css")}`
      },
      contenido: {
        html: editorHTML.getValue(),
        js: editorJS.getValue(),
        css: editorCSS.getValue()
      }
    },
    dataType: "json",
    success: function (respuesta) {
      if(respuesta.status == 1){
        $("#alerta").text(respuesta.mensaje);
        $("#alerta").css("display", "block");
        setTimeout(function () {  
          $("#alerta").css("display", "none");
          $("#alerta").text("");
        },3000);
      }else{
        $("#alerta").text(respuesta.mensaje);
        $("#alerta").css("color", "red");
        $("#alerta").css("display", "block");
        setTimeout(function () {  
          $("#alerta").css("display", "none");
          $("#alerta").text("");
          $("#alerta").css("color", "");
        },3000);
      }
    }
  });
}

function cargarIframe() {
  const getGeneratedPageURL = ({ html, css, js }) => {
    const getBlobURL = (code, type) => {
      const blob = new Blob([code], { type })
      return URL.createObjectURL(blob)
    }
  
    const cssURL = getBlobURL(css, 'text/css')
    const jsURL = getBlobURL(js, 'text/javascript')

    var posicionInsercion = html.indexOf("</title>");
    posicionInsercion += 8;
    html = `${html.slice(0, posicionInsercion)} 
              ${css && `<link rel="stylesheet" type="text/css" href="${cssURL}" />`} 
              ${js && `<script src="${jsURL}"></script>`} 
            ${html.slice(posicionInsercion, (html.length-1))}`;

    return getBlobURL(html, 'text/html')
  }
  
  const url = getGeneratedPageURL({
    html: `${editorHTML.getValue()}`,
    css: `${editorCSS.getValue()}`,
    js: `${editorJS.getValue()}`
  })
  
  const iframe = document.querySelector('#resultado')
  iframe.src = url
}