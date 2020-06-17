//handle drop event
var handleDrop = function (evt) {
  evt.stopPropagation();
  evt.preventDefault();

  let files = evt.dataTransfer.files;
  let reader = new FileReader();
  reader.onload = function (event) {
    let str = document.getElementById("sourceXml");
    str.value = event.target.result;
  };
  reader.readAsText(files[0], "UTF-8");
};

//handles dragOver event
var handleDragOver = function (evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "copy";
};

//pretty print xml with xslt
var prettifyXml = function (sourceXml) {
  let xmlDoc = new DOMParser().parseFromString(sourceXml, "application/xml");
  let err = xmlDoc.documentElement.getElementsByTagName("parsererror").length;
  if (!err) {
    let xsltText = document.getElementById("xslt").innerText;
    let xsltDoc = new DOMParser().parseFromString(xsltText, "text/xml");
    let xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);
    let resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    let resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
  } else {
    return false;
  }
};

var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], { type: "text/plain" });
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  };

var attachEvents = function () {
  document
    .getElementById("sourceXml")
    .addEventListener("dragover", handleDragOver, false);
  document
    .getElementById("sourceXml")
    .addEventListener("drop", handleDrop, false);
  document.getElementById("btnConvert").addEventListener("click", onClick);
};

var onClick = function () {
  let str = document.getElementById("sourceXml").value;
  let output = document.getElementById("outputXml");
  let btnDownload = document.getElementById("btnDownload");
  let alert = document.getElementById("alert");
  let formattedXml = prettifyXml(str);

  if (formattedXml) {
    output.value = formattedXml;
    btnDownload.href = makeTextFile(output.value);
    btnDownload.style.display = "block";
    alert.style.display = "none";
    //if there is a parse error show alert
  } else {
    btnDownload.style.display = "none";
    alert.style.display = "block";
  }
};

window.onload = function (e) {
  attachEvents();
};