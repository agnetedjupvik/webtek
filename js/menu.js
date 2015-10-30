var menu = (function(window) {
  var bindDropdownEvents = function() {
    var i,
        elements = document.getElementsByClassName("dropdown");

    for (i = 0; i < elements.length; i++) {
      elements[i].parentNode.addEventListener("mouseover", function() {
        this.getElementsByClassName("dropdown")[0].classList.add("active");

        this.addEventListener("mouseout", function() {
          var mouseoutHandler = function() {
            var i,
                hovered = false;
                hoverElements = document.querySelectorAll(":hover");

            for (i = 0; i < hoverElements.length; i++) {
              if (hoverElements[i] === this) {
                hovered = true;
                break;
              }
            }

            if (!hovered) {
              this.getElementsByClassName("dropdown")[0].classList.remove("active");
            }
          };

          window.setTimeout(mouseoutHandler.bind(this), 150);
        });
      });
    }
  };

  return bindDropdownEvents;
} (window));
