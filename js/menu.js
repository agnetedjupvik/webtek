var menu = (function(window, document) {
  var bindDropdownEvents = function() {
    var i,
        elements = document.getElementsByClassName("dropdown");

    /*
     * If we think the user is on a touch device. Code copied from:
     * https://github.com/Modernizr/Modernizr/blob/eac743c52474609e457bf9bdf6fd114ea14ebe2a/feature-detects/touchevents.js
     */
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      /*
       * For touch screens we make it possible to click to toggle the display
       * state of the drop down menus.
       */
      for (i = 0; i < elements.length; i++) {
        elements[i].parentNode.getElementsByTagName("a")[0].addEventListener("click", function(e) {
          e.preventDefault();

          this.parentNode.getElementsByClassName("dropdown")[0].classList.toggle("active");
        });

        /*
         * In case touch screen users want to visit the top-level links of
         * dropwdowns, they can double click the links.
         */
        elements[i].parentNode.getElementsByTagName("a")[0].addEventListener("dblclick", function() {
          window.location = this.href;
        });

        /*
         * We want to close all open dropdowns if the user clicks on anywhere
         * else on the page.
         */
        document.addEventListener("click", function(e) {
          var i,
              activeDropdowns = document.querySelectorAll(".dropdown.active");

          for (i = 0; i < activeDropdowns.length; i++) {
            if (!e.target.parentNode.contains(activeDropdowns[i])) {
              activeDropdowns[i].classList.remove("active");
            }
          }
        });

        /* If the user scrolls to view the content, hide the dropdowns */
        document.addEventListener("touchmove", function(e) {
          var i,
              activeDropdowns = document.querySelectorAll(".dropdown.active");

          for (i = 0; i < activeDropdowns.length; i++) {
            if (!activeDropdowns[i].contains(e.target)) {
              activeDropdowns[i].classList.remove("active");
            }
          }
        });
      }
    } else {
      /* It's not a touch screen, so we want dropdowns on hover */
      for (i = 0; i < elements.length; i++) {
        /* Show the dropdown on hovering the correct link */
        elements[i].parentNode.addEventListener("mouseover", function() {
          this.getElementsByClassName("dropdown")[0].classList.add("active");
        });

        /* Hide the dropdown then the user moves the mouse away */
        elements[i].parentNode.addEventListener("mouseleave", function() {
          var mouseoutHandler = function() {
            if (this.parentNode.querySelector(":hover") !== this) {
              this.getElementsByClassName("dropdown")[0].classList.remove("active");
            }
          }.bind(this);

          /*
           * Wait a little time to let the user regret closing the dropdown,
           * and then close it if the mouse is not hovering the list.
           *
           * We need to use the function we've called bind on (above), otherwise
           * "this" would point to the window object and not the list we want to
           * close.
           */
          window.setTimeout(mouseoutHandler, 200);
        });
      }
    }
  };

  return bindDropdownEvents;
} (window, document));
