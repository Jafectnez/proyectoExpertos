var valueHTML = ``;
var valueJS = ``;
var valueCSS = ``;

$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: `/proyectos/${localStorage.getItem("Id_Proyecto")}/archivos`,
    dataType: "json",
    success: function (respuesta) {
      for(var i=0; i<respuesta[0].archivos.length; i++){
        var archivo = respuesta[0].archivos[i];

        if(archivo.extension == "html")
          valueHTML = `${archivo.contenido}`;
        else if(archivo.extension == "js")
          valueJS = `${archivo.contenido}`;
        else
          valueCSS = `${archivo.contenido}`;
      }
    }
  });
});

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
  value: valueHTML,
  keyMap: "sublime",
  extraKey: {"Ctrl-Space":"autocomplete"}
});

$("#editor-html").children(".CodeMirror").prepend("<h3>HTML</h3>");

var editorCSS = CodeMirror(document.getElementById("editor-css"), {
  lineNumbers: true,
  mode:"css",
  theme: "ambiance",
  tabSize: 2,
  value: valueCSS,
  smartIndent: true,
  matchBrackets: true,
  keyMap: "sublime",
  extraKey: {"Ctrl-Space":"autocomplete"}
});

$("#editor-css").children(".CodeMirror").prepend("<h3>CSS</h3>");

var editorJS = CodeMirror(document.getElementById("editor-js"), {
  lineNumbers: true,
  mode:"javascript",
  value: valueJS,
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