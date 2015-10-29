/*
 * Loads the document in url and append it to the given DOM element
 */
var include = function (element, url) {
  "use strict";

  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    var i;
    for (i = 0; i < xhr.responseXML.body.children.length; i++) {
      element.appendChild(xhr.responseXML.body.children[i]);
    }
  };

  xhr.open("GET", url);
  xhr.responseType = "document";
  xhr.send();
};
