$(document).ready(function() {
  document.getElementById("txtA-html").value =
  `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Page Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <h1>Hola Mundo!</h1>
    <button onclick="clickeado();">Clickeame</button>
    <div id="respuesta"></div>
  </body>
  </html>`;

  document.getElementById("txtA-css").value =
  `h1{
    color: #8a2be2;
   }`;

  document.getElementById("txtA-js").value =
  `function clickeado(){
    document.getElementById("respuesta").innerHTML = \`Gracias por Clickearme!\`;
  }`;

  var editorHTML = CodeMirror.fromTextArea(document.getElementById("txtA-html"), {
    lineNumbers: true,
    mode : "xml",
    htmlMode: true,
    theme: "icecoder",
    tabSize: 2,
    smartIndent: true,
    keyMap: "sublime",
    extraKey: {"Ctrl-Space":"autocomplete"}
  });

  var editorCSS = CodeMirror.fromTextArea(document.getElementById("txtA-css"), {
    lineNumbers: true,
    mode:"css",
    theme: "icecoder",
    tabSize: 2,
    smartIndent: true,
    keyMap: "sublime"
  });

  var editorJS = CodeMirror.fromTextArea(document.getElementById("txtA-js"), {
    lineNumbers: true,
    mode:"javascript",
    theme: "icecoder",
    tabSize: 2,
    smartIndent: true,
    keyMap: "sublime",
    lineWrapping: true
  });

  document.getElementById("resultado").setAttribute("src", "../ejemplo.html");
});