var editorHTML = CodeMirror.fromTextArea(document.getElementById("editor-html"), {
  lineNumbers: true,
  mode : "xml",
  htmlMode: true,
  theme: "icecoder",
  tabSize: 2,
  smartIndent: true,
  matchBrackets: true,
  keyMap: "sublime",
  extraKey: {"Ctrl-Space":"autocomplete"}
});

var editorCSS = CodeMirror.fromTextArea(document.getElementById("editor-css"), {
  lineNumbers: true,
  mode:"css",
  theme: "icecoder",
  tabSize: 2,
  smartIndent: true,
  matchBrackets: true,
  keyMap: "sublime",
  extraKey: {"Ctrl-Space":"autocomplete"}
});

var editorJS = CodeMirror.fromTextArea(document.getElementById("editor-js"), {
  lineNumbers: true,
  mode:"javascript",
  theme: "icecoder",
  tabSize: 2,
  smartIndent: true,
  keyMap: "sublime",
  lineWrapping: true,
  matchBrackets: true,
  keyMap: "sublime",
  extraKey: {"Ctrl-Space":"autocomplete"}
});

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

function cargarPlantillaJS(){
  console.log("No hay plantilla base creada");
}


function cargarPlantillaCSS(){
  console.log("No hay plantilla base creada");
}