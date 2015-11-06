/*
 * FILE NAME: js/include.js
 * WRITTEN BY: Agnete Djupvik, Camilla Tran, Emil Taylor Bye & Vemund Santi
 * WHEN: October 2015
 * PURPOSE: Usage: include(element, url, optional callback)
 * Append the document found at URL to the DOM element given. If a callback is
 * supplied, it will be called after the URL was added to the DOM.
 */

var include = function (element, url, callback) {
  "use strict";

  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    var i,
        elements = [];

    for (i = 0; i < xhr.responseXML.body.children.length; i++) {
      elements.push(xhr.responseXML.body.children[i]);
      element.appendChild(elements[i]);
    }

    if (callback) {
      callback(elements);
    }
  };

  xhr.open("GET", url);
  xhr.responseType = "document";
  xhr.send();
};
