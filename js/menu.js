/*
 * Some events fire rapidly, but we will probably not want an event for every
 * callback that is fired. This function will register a throttled event
 * handler for the given (window) event.
 */
var registerThrottledEvent = function(eventString, callback) {
  var isEventFired = false;
  var callbackFunction = function(e) {
    callback();

    isEventFired = false;
  };

  window.addEventListener(eventString, function(e) {
    if (!isEventFired) {
      isEventFired = true;

      window.requestAnimationFrame(function() {
        callback(e);

        isEventFired = false;
      });
    }
  });
};

var menu = function() {
  var isMobile = window.innerWidth <= 992;
  var fullMenu = (function() {
    var touchDropdownClickCallback = function(e) {
      e.preventDefault();
      this.parentNode.getElementsByClassName("dropdown")[0].classList.toggle("open");
    };

    var touchDropdownDblClickCallback = function() {
      window.location = this.href;
    };

    var touchGlobalClickCallback = function(e) {
      var i;
      var openDropdowns = document.querySelectorAll(".dropdown.open");

      for (i = 0; i < openDropdowns.length; i++) {
        if (!e.target.parentNode.contains(openDropdowns[i])) {
          openDropdowns[i].classList.remove("open");
        }
      }
    };

    var touchScrollCallback = function(e) {
      var i;
      var openDropdowns = document.querySelectorAll(".dropdown.open");

      for (i = 0; i < openDropdowns.length; i++) {
        if (!openDropdowns[i].contains(e.target)) {
          openDropdowns[i].classList.remove("open");
        }
      }
    }

    var dropdownMouseoverCallback = function() {
      this.getElementsByClassName("dropdown")[0].classList.add("open");
    };

    var dropdownMouseleaveCallback = function() {
      var mouseoutHandler = function() {
        if (this.parentNode.querySelector(":hover") !== this) {
          this.getElementsByClassName("dropdown")[0].classList.remove("open");
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
    };

    /*
     * If we think the user is on a touch device. Code copied from:
     * https://github.com/Modernizr/Modernizr/blob/eac743c52474609e457bf9bdf6fd114ea14ebe2a/feature-detects/touchevents.js
     */
    var isTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);

    var exports = {
      setUp: function() {
        var i;
        var elements = document.getElementsByClassName("dropdown");

        if (isTouch) {
          /*
           * For touch screens we make it possible to click to toggle the display
           * state of the drop down menus.
           */
          for (i = 0; i < elements.length; i++) {
            elements[i].parentNode.getElementsByTagName("a")[0].addEventListener("click", touchDropdownClickCallback);

            /*
             * In case touch screen users want to visit the top-level links of
             * dropwdowns, they can double click the links.
             */
            elements[i].parentNode.getElementsByTagName("a")[0].addEventListener("dblclick", touchDropdownDblClickCallback);
          }

          /*
           * We want to close all open dropdowns if the user clicks on anywhere
           * else on the page.
           */
          document.addEventListener("click", touchGlobalClickCallback);

          /* If the user scrolls to view the content, hide the dropdowns */
          document.addEventListener("touchmove", touchScrollCallback);
        } else {
          /* It's not a touch screen, so we want dropdowns on hover */
          for (i = 0; i < elements.length; i++) {
            /* Show the dropdown on hovering the correct link */
            elements[i].parentNode.addEventListener("mouseover", dropdownMouseoverCallback);

            /* Hide the dropdown then the user moves the mouse away */
            elements[i].parentNode.addEventListener("mouseleave", dropdownMouseleaveCallback);
          }
        }
      },
      tearDown: function() {
        /* This function is basically setUp in reverse */
        var i;
        var elements = document.getElementsByClassName("dropdown");

        if (isTouch) {
          for (i = 0; i < elements.length; i++) {
            elements[i].parentNode.getElementsByTagName("a")[0].removeEventListener("click", touchDropdownClickCallback);
            elements[i].parentNode.getElementsByTagName("a")[0].removeEventListener("dblclick", touchDropdownDblClickCallback);
          }

          document.removeEventListener("click", touchGlobalClickCallback);
          document.removeEventListener("touchmove", touchScrollCallback);
        } else {
          for (i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeEventListener("mouseover", dropdownMouseoverCallback);
            elements[i].parentNode.removeEventListener("mouseleave", dropdownMouseleaveCallback);
          }
        }
      }
    };

    return exports;
  } ());
  var mobileMenu = (function() {
    var toggleButtonClickCallback = function () {
      this.classList.toggle("close");

      document.querySelector("header > ul").classList.toggle("hidden");
    };

    var exports = {
      setUp: function() {
        document.body.classList.add("mobile");
        document.getElementsByTagName("header")[0].classList.add("mobile");
        document.querySelector("header > ul").classList.add("hidden");
        document.getElementsByClassName("togglebutton")[0].classList.remove("close");
        document.getElementsByClassName("togglebutton")[0].addEventListener("click", toggleButtonClickCallback);
      },
      tearDown: function() {
        document.body.classList.remove("mobile");
        document.getElementsByTagName("header")[0].classList.remove("mobile");
        document.querySelector("header > ul").classList.remove("hidden");
        document.getElementsByClassName("togglebutton")[0].removeEventListener("click", toggleButtonClickCallback);
      }
    };

    return exports;
  } ());

  /*
   * Setup common for both menus. We put this inside an anonymous function as a
   * mean of variable "scoping".
   */
  (function () {
    var menuItems = document.querySelectorAll("header ul li a");

    for (i = 0; i < menuItems.length; i++) {
      if (menuItems[i].href === window.location.href) {
        if (menuItems[i].parentNode.parentNode.classList.contains("dropdown")) {
          /*
           * This is a dropdown-element, so we want to add active to the
           * "parent" link.
           */
          menuItems[i].parentNode.parentNode.parentNode.classList.add("active");

          /*
           * Add a copy of the sub-menu to another place in the DOM so that it
           * can be displayed properly on mobile displays.
           */
          document.getElementById("mobilemenu").appendChild(menuItems[i].parentNode.parentNode.cloneNode(true));
        } else {
          menuItems[i].classList.add("active");
        }

        break;
      }
    }

    if (isMobile) {
      mobileMenu.setUp();
    } else {
      fullMenu.setUp();
    }
  } ());

  /* Global event handlers */
  registerThrottledEvent("resize", function(e) {
    var isResizedMobile = window.innerWidth <= 992;

    if (isMobile && !isResizedMobile) {
      /* The mobile menu was shown, but now we want to show the full menu. */
      mobileMenu.tearDown();
      fullMenu.setUp();
    } else if (!isMobile && isResizedMobile) {
      /* The full menu was shown, but now we want to show the mobile menu. */
      fullMenu.tearDown();
      mobileMenu.setUp();
    }

    isMobile = isResizedMobile;
  });
};
