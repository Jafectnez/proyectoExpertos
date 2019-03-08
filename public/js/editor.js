$(document).ready(function() {

  var editorHTML = CodeMirror.fromTextArea(document.getElementById("txtA-html"), {
    lineNumbers: true,
    mode : "xml",
    htmlMode: true,
    theme: "icecoder",
    tabSize: 2,
    smartIndent: true,
    styleActiveLine: true,
    matchBrackets: true
  });

  var editorCSS = CodeMirror.fromTextArea(document.getElementById("txtA-css"), {
    lineNumbers: true,
    mode:"css",
    theme: "icecoder",
    tabSize: 2,
    smartIndent: true,
    styleActiveLine: true,
    matchBrackets: true
  });

  var editorJS = CodeMirror.fromTextArea(document.getElementById("txtA-js"), {
    lineNumbers: true,
    mode:"javascript",
    theme: "icecoder",
    tabSize: 2,
    smartIndent: true,
    keyMap: "sublime",
    lineWrapping: true,
    styleActiveLine: true,
    matchBrackets: true
  });
});