/*
 * FILE NAME: js/elevator.js
 * WRITTEN BY: Agnete Djupvik, Camilla Tran, Emil Taylor Bye & Vemund Santi
 * WHEN: October 2015
 * PURPOSE: Provide elevator animation.
*/

(function() {
  /* We only want the users to see the elevator once per session */
  if (!window.sessionStorage.getItem('elevator_seen')) {
    /* Create a canvas that will display the animation. */
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    /* Variables used throughout the animation */
    var x, y, r, g, b, grd, intervalId, animationProgress = 1;

    window.sessionStorage.setItem('elevator_seen', true);

    canvas.width = 600;
    canvas.height = 480;

    canvas.id = "elevator";

    document.body.appendChild(canvas);

    /* Draw the background for the elevator "frame" */
    ctx.fillStyle = "#BEBEBE";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* Draw the background for the doors. */
    grd = ctx.createLinearGradient(100, 0, 500, 0);
    grd.addColorStop(0, "#8B8B8B");
    grd.addColorStop(0.1, "#A5A5A5");
    grd.addColorStop(0.9, "#A5A5A5");
    grd.addColorStop(1, "#8B8B8B");

    ctx.fillStyle = grd;
    ctx.fillRect(100, 0, 400, canvas.height);

    /* A little noise makes the elevator look more metallic and real. */
    for (x = 0; x < canvas.width; x++) {
      for (y = 0; y < canvas.height; y++) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
        ctx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", 0.07)";

        ctx.fillRect(x, y, 1, 1);
      }
    }

    /*
     * The animation, which gradually removes the doors from the middle in order
     * to give the illusion that the doors are opening.
     */
    intervalId = window.setInterval(function() {
      ctx.strokeStyle = "rgba(0, 0, 0, 1)";

      ctx.beginPath();
      ctx.moveTo(300 - animationProgress, 0);
      ctx.lineTo(300 - animationProgress, canvas.height);
      ctx.moveTo(300 + animationProgress, 0);
      ctx.lineTo(300 + animationProgress, canvas.height);
      ctx.stroke();
      ctx.closePath();

      ctx.clearRect(300 - animationProgress + 1, 0, (animationProgress - 1) * 2, canvas.height);

      animationProgress += 1;

      if (animationProgress === 200) {
        window.clearInterval(intervalId);

        window.setTimeout(function() {
          document.body.removeChild(canvas);
        },
        300);
      }
    },
    20);
  }
} ());
