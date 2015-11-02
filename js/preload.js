/*
 * Usage: preloader.load(URL or Array of URLs)
 *
 * The preloader will preload the given images so that after the first visit,
 * pages will load faster as the browsers have (hopefully) cached the images.
 */
var preloader = (function () {
  "use strict";

  var document_loaded = false,
      /* exports contains the functions to be exposed for use */
      exports = {},
      images = [];

  /* This function will add the image to the queue to be loaded. */
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

  /*
   * We don't want to slow down the initial page load, so we don't start
   * preloading images until after the page has fully loaded.
   */
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

preloader.load([
    "http://folk.ntnu.no/vemundms/webtek/project/images/p15.jpg",
    "http://folk.ntnu.no/vemundms/webtek/project/images/about.jpg",
    "http://folk.ntnu.no/vemundms/webtek/project/images/k.jpg",
    "http://folk.ntnu.no/vemundms/webtek/project/images/1.jpg",
    "http://folk.ntnu.no/vemundms/webtek/project/images/2.jpg",
    "http://folk.ntnu.no/vemundms/webtek/project/images/3.jpg",
    "http://folk.ntnu.no/vemundms/webtek/project/images/4.jpg",
    "http://folk.ntnu.no/vemundms/webtek/project/images/5.jpg",
    "http://folk.ntnu.no/vemundms/webtek/project/images/heiser.jpg",
    "http://folk.ntnu.no/vemundms/webtek/project/images/abakus.jpg",
    "http://folk.ntnu.no/vemundms/webtek/project/images/online.jpg",
    "http://folk.ntnu.no/vemundms/webtek/project/images/kontakt.jpg"
]);
