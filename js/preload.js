/*
 * FILE NAME: preload.js
 * WRITTEN BY: Agnete Djupvik, Camilla Tran, Emil Taylor Bye & Vemund Santi
 * WHEN: October 2015
 * PURPOSE: Preload images so that all the images used on the sites are cached
 * by the browser.
*/

/*
 * Usage: preloader.load(URL or Array of URLs)
 *
 * The preloader will preload the given images so that after the first visit,
 * pages will load faster as the browsers have (hopefully) cached the images.
 */
var preloader = (function () {
  "use strict";

  var document_loaded = false;
  /* exports contains the functions to be exposed for use */
  var exports = {};
  /* An array containing all the image elements */
  var images = [];

  /* This function will add the image to the queue to be loaded. */
  exports.load = function(url) {
    var i;
    /* img is used as a temprary variable when creating new array element */
    var img;

    /* If we receive an array, we call load with each array element. */
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
      /*
       * This will create a new image-element and load it, putting it in the
       * brower's cache.
       */
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
    var i;
    var img;

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
