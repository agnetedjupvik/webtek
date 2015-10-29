var preloader = (function () {
  "use strict";

  var document_loaded = false,
      exports = {},
      images = [];

  exports.load = function(url) {
    var i,
        img;

    if (url instanceof Array) {
      for (i = 0; i < url.length; i++) {
        exports.load(url[i]);
      }
    }

    /*
     * If the document is not loaded yet we don't want to fetch images yet, so
     * we just store the url.
     */
    if (!document_loaded) {
      images.push(url);
    } else {
      img = new Image();
      img.src = url;
      images.push(img);
    }
  };

  window.addEventListener("load", function () {
    var i,
        img;

    document_loaded = true;

    /*
     * Load all the images that were added before the document was loaded fully
     */
    for (i = 0; i < images.length; i++) {
      if (typeof images[i] === "string") {
        img = new Image();
        img.src = images[i];
        images[i] = img;
      }
    }
  });

  return exports;
} ());
