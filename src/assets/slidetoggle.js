!(function(root, factory) {
  "use strict";
  "function" == typeof define && define.amd
    ? define("nst", factory)
    : "object" == typeof exports
      ? (exports = module.exports = factory())
      : (root.nst = factory());
})(this, function() {
  "use strict";
  function $$(expr, context) {
    return [].slice.call((context || document).querySelectorAll(expr), 0);
  }
  function rAF(callback) {
    window.requestAnimationFrame(callback);
  }
  function nextFrame(callback) {
    window.requestAnimationFrame(function() {
      window.requestAnimationFrame(callback);
    });
  }
  function getSlideToggleComponent(element) {
    for (var root = element; root; )
      if (
        ((root = root.parentElement),
        root && root.classList.contains(componentCss))
      )
        return root;
    return void 0;
  }
  function toggle(event) {
    function collapse(component, content) {
      function transitionEnd(event) {
        "max-height" === event.propertyName &&
          (component.classList.contains(collapsingCss) &&
            (component.classList.remove(collapsingCss),
            component.classList.add(collapsedCss)),
          content.removeEventListener(
            eventNameTransitionEnd,
            transitionEnd,
            !1
          ));
      }
      component.classList.add(collapsingCss),
        content.classList.add(fixSafariBugCss),
        (content.style.maxHeight = "none");
      var BCR = content.getBoundingClientRect(),
        height = BCR.height;
      return 0 === height
        ? void content.classList.remove(fixSafariBugCss)
        : ((content.style.maxHeight = height + "px"),
          content.addEventListener(eventNameTransitionEnd, transitionEnd, !1),
          void nextFrame(function() {
            content.classList.remove(fixSafariBugCss),
              (content.style.maxHeight = "0px");
          }));
    }
    function expand(component, content) {
      nextFrame(function() {
        function transitionEnd(event) {
          "max-height" === event.propertyName &&
            (component.classList.contains(expandingCss) &&
              (component.classList.remove(expandingCss),
              component.classList.add(expandedCss),
              content.classList.add(fixSafariBugCss),
              (content.style.maxHeight = ""),
              nextFrame(function() {
                content.classList.remove(fixSafariBugCss);
              })),
            content.removeEventListener(
              eventNameTransitionEnd,
              transitionEnd,
              !1
            ));
        }
        component.classList.add(expandingCss),
          content.classList.add(fixSafariBugCss),
          (content.style.maxHeight = "none");
        var BCR = content.getBoundingClientRect();
        (content.style.maxHeight = "0px"),
          content.addEventListener(eventNameTransitionEnd, transitionEnd, !1),
          rAF(function() {
            content.classList.remove(fixSafariBugCss),
              (content.style.maxHeight = BCR.height + "px");
          });
      });
    }
    var toggle = event.target,
      component = getSlideToggleComponent(toggle);
    if (!component)
      return void error(
        "nst: the markup is wrong, nst-component css class is missing"
      );
    if (
      component.classList.contains(collapsingCss) ||
      component.classList.contains(expandingCss)
    )
      return void log("nst: skipped action because still animating");
    var content = component.querySelector("." + contentCss);
    return content
      ? (component.classList.remove(expandingCss),
        component.classList.remove(collapsingCss),
        void (component.classList.contains(collapsedCss)
          ? (component.classList.remove(collapsedCss),
            expand(component, content))
          : (component.classList.remove(expandedCss),
            collapse(component, content))))
      : void error(
          "nst: the markup is wrong, nst-content css class is missing"
        );
  }
  function destroy(component) {
    if (component) {
      var toggles = $$(toggleSelector, component);
      toggles &&
        toggles.length &&
        toggles.forEach(function(toggleElement) {
          toggleElement.removeEventListener("click", toggle);
        });
    }
    return this;
  }
  function destroyAll() {
    var allToggles = $$(toggleSelector);
    return (
      allToggles &&
        allToggles.length &&
        allToggles.forEach(function(toggleElement) {
          toggleElement.removeEventListener("click", toggle);
        }),
      this
    );
  }
  function init(component) {
    if (component) {
      component.classList.contains(collapsedCss) &&
        (component.querySelector("." + contentCss).style.maxHeight = "0px");
      var toggles = $$(toggleSelector, component);
      toggles.forEach(function(toggleElement) {
        toggleElement.addEventListener("click", toggle);
      });
    }
    return this;
  }
  function initAll(config) {
    var component,
      isAutoInit = config && config.autoInit,
      allToggles = $$(toggleSelector);
    return (
      config && config.log && log(config.log),
      allToggles.forEach(function(toggleElement) {
        if (((component = getSlideToggleComponent(toggleElement)), !component))
          return error("nst component not found: " + component), this;
        var isManualInit = component.classList.contains(manualInitCss),
          skip = isAutoInit && isManualInit;
        skip ||
          (component.classList.contains(collapsedCss) &&
            (component.querySelector("." + contentCss).style.maxHeight = "0px"),
          toggleElement.addEventListener("click", toggle));
      }),
      this
    );
  }
  var log = console.log.bind(console),
    error = console.error.bind(console),
    fixSafariBugCss = "nst-fix-safari-bug",
    componentCss = "nst-component",
    manualInitCss = "nst-manual-init",
    contentCss = "nst-content",
    toggleSelector = ".nst-toggle",
    collapsingCss = "nst-is-collapsing",
    collapsedCss = "nst-is-collapsed",
    expandingCss = "nst-is-expanding",
    expandedCss = "nst-is-expanded",
    eventNameTransitionEnd = "transitionend";
  return (
    initAll({ autoInit: !0 }),
    { init: init, initAll: initAll, destroy: destroy, destroyAll: destroyAll }
  );
});
