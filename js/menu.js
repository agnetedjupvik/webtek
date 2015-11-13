/*
 * FILE NAME: menu.js
 * WRITTEN BY: Agnete Djupvik, Camilla Tran, Emil Taylor Bye & Vemund Santi
 * WHEN: October 2015
 * PURPOSE: Makes the menu interactive, handles dropdown-events and the mobile
 * menu.
*/

/*
 * Some events fire rapidly, but we will probably not want an event for every
 * callback that is fired. This function will register a throttled event
 * handler for the given (window) event.
 *
 * Usage: registerThrottledEvent(event, callback)
 */
var registerThrottledEvent = function(eventString, callback) {
  /*
   * Whether the callback has been fired since the last time the callback was
   * executed.
   */
  var isEventFired = false;

  window.addEventListener(eventString, function(e) {
    /*
     * If we haven't called the callback since last time this event was fired,
     * just ignore the event.
     */
    if (!isEventFired) {
      isEventFired = true;

      /*
       * requestAnimationFrame asks the browser to execute the given function
       * before the next time the page is redrawn.
       */
      window.requestAnimationFrame(function() {
        callback(e);

        isEventFired = false;
      });
    }
  });
};

/*
 * This function will bind all the events for the menu with the proper
 * callbacks.
 *
 * Usage: menu() - Only call this once per page.
 */
var menu = function() {
  /* If the page width is less than 992 pixels, we use the mobile menu. */
  var isMobile = window.innerWidth <= 860;

  /* The object resposible for handling events for the full menu */
  var fullMenu = (function() {
    /* This function handles click events for the dropdowns on touch screens. */
    var touchDropdownClickCallback = function(e) {
      e.preventDefault();
      this.parentNode.getElementsByClassName("dropdown")[0].classList.toggle("open");
    };

    /*
     * If the user double clicks a dropdown menu, we want to go to the page
     * that link points to.
     */
    var touchDropdownDblClickCallback = function() {
      window.location = this.href;
    };

    /*
     * If the user clicks anywhere on the page that's not the open dropdown
     * menu, we want to close the dropdown menu.
     */
    var touchGlobalClickCallback = function(e) {
      var i;
      var openDropdowns = document.querySelectorAll(".dropdown.open");

      for (i = 0; i < openDropdowns.length; i++) {
        if (!e.target.parentNode.contains(openDropdowns[i])) {
          openDropdowns[i].classList.remove("open");
        }
      }
    };

    /*
     * If the user scrolls the page while a dropdown menu is open, we close the
     * dropdown menu unless they touched the dropdown menu while scrolling.
     */
    var touchScrollCallback = function(e) {
      var i;
      var openDropdowns = document.querySelectorAll(".dropdown.open");

      for (i = 0; i < openDropdowns.length; i++) {
        if (!openDropdowns[i].contains(e.target)) {
          openDropdowns[i].classList.remove("open");
        }
      }
    }

    /* When the user hovers over a dropdown menu, we want to display it. */
    var dropdownMouseoverCallback = function() {
      this.getElementsByClassName("dropdown")[0].classList.add("open");
    };

    /*
     * When the mouse leaves the dropdown menu, we want to wait a little while
     * and then check whether the mouse still is away from the dropdown menu,
     * and close it if that's the case.
     *
     * We need to use bind for the callback given to setTimeout as this would
     * otherwise point to window.
     */
    var dropdownMouseleaveCallback = function() {
      var mouseoutHandler = function() {
        if (this.parentNode.querySelector(":hover") !== this) {
          this.getElementsByClassName("dropdown")[0].classList.remove("open");
        }
      }.bind(this);

      window.setTimeout(mouseoutHandler, 200);
    };

    /*
     * Detect whether we are displaying on a touch screen. Line copied from:
     * https://github.com/Modernizr/Modernizr/blob/eac743c52474609e457bf9bdf6fd114ea14ebe2a/feature-detects/touchevents.js
     */
    var isTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);

    /* The functions this object want to export for use by other programmers. */
    var exports = {
      /*
       * Whenever we want to start displaying the full menu (either on page
       * load, or on screen resize)
       */
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

      /*
       * If we are displaying the full menu, but the screen is resized so we
       * want to display the mobile menu this function is called.
       * It removes the callbacks set by setUp.
       */
      tearDown: function() {
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

  /* The object resposible for handling events for the mobile menu */
  var mobileMenu = (function() {
    /*
     * The function responsible for toggling the menu on clicking the menu
     * toggle button.
     */
    var toggleButtonClickCallback = function () {
      this.classList.toggle("close");

      document.querySelector("header > ul").classList.toggle("hidden");
    };

    /* The functions this object want to export for use by other programmers. */
    var exports = {

      /*
       * Whenever we want to start displaying the mobile menu (either on page
       * load, or on screen resize)
       */
      setUp: function() {
        document.body.classList.add("mobile");
        document.getElementsByTagName("header")[0].classList.add("mobile");
        document.querySelector("header > ul").classList.add("hidden");
        document.getElementsByClassName("togglebutton")[0].classList.remove("close");
        document.getElementsByClassName("togglebutton")[0].addEventListener("click", toggleButtonClickCallback);
      },

      /*
       * If we are displaying the mobile menu, but the screen is resized so we
       * want to display the full menu this function is called.
       * It removes the callbacks and classes set by setUp.
       */
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
    var isResizedMobile = window.innerWidth <= 860;

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
