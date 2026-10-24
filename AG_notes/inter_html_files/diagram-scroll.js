/*
 * Shared by the Algebraic Geometry notes (main.html) and the interactive diagrams in this
 * folder, so that no diagram captures the reader's scrolling of the notes.
 *
 * zoomGesture(e)               A wheel event zooms a diagram only with Ctrl or Cmd held, which is
 *                              also how Chrome, Edge and Firefox report a trackpad pinch. A plain
 *                              wheel or two-finger scroll moves the page.
 * zoomOnlyOnGesture(el)        For three.js OrbitControls, which zoom on every wheel event over
 *                              `el` and cancel the page scroll: a plain wheel event is stopped
 *                              before it reaches them. Their touch pinch-zoom is unaffected.
 * animateWhileVisible(el, fn)  Calls fn() once per animation frame while `el` is on screen and not
 *                              at all while it is off screen, so diagrams the reader has scrolled
 *                              past stop competing with the scrolling. Returns a function that
 *                              stops it for good (for a React effect's cleanup).
 */
function zoomGesture(e) {
  return e.ctrlKey || e.metaKey;
}

function zoomOnlyOnGesture(el) {
  window.addEventListener('wheel', function (e) {
    if (!zoomGesture(e) && el.contains(e.target)) e.stopPropagation();
  }, { capture: true, passive: true });
}

function animateWhileVisible(el, fn) {
  var visible = !('IntersectionObserver' in window), running = false, stopped = false, io = null;
  function tick(t) {
    if (!visible || stopped) { running = false; return; }
    requestAnimationFrame(tick);
    fn(t);
  }
  function start() {
    if (visible && !running && !stopped) { running = true; requestAnimationFrame(tick); }
  }
  if (!visible) {
    io = new IntersectionObserver(function (entries) {
      visible = entries[entries.length - 1].isIntersecting;
      start();
    });
    io.observe(el);
  }
  start();
  return function stop() { stopped = true; if (io) io.disconnect(); };
}
