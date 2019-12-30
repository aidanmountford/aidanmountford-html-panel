'use strict';

System.register(['lodash', 'jquery', 'jquery.flot', 'jquery.flot.pie'], function (_export, _context) {
  "use strict";

  var _, $;

  function link(scope, elem, attrs, ctrl) {
    var panel;
    var htmlelem = elem[0].getElementsByClassName('html-object')[0];
    elem = elem.find('.html-panel');
    var plotCanvas = elem.find('.plot-canvas');
    var htmlnode;
    var htmlShadow;

    ctrl.events.on('render', function () {
      render();
      ctrl.renderingCompleted();
    });

    function setElementHeight() {
      try {
        var height = ctrl.height || panel.height || ctrl.row.height;
        if (_.isString(height)) {
          height = parseInt(height.replace('px', ''), 10);
        }

        height -= 5; // padding
        height -= panel.title ? 24 : 9; // subtract panel title bar

        elem.css('height', height + 'px');

        return true;
      } catch (e) {
        // IE throws errors sometimes
        return false;
      }
    }

    function formatter(label, slice) {
      return "<div style='font-size:" + ctrl.panel.fontSize + ";text-align:center;padding:2px;color:" + slice.color + ";'>" + label + "<br/>" + Math.round(slice.percent) + "%</div>";
    }

    function addHTML() {
      if (!htmlnode.shadowRoot) {
        htmlnode.attachShadow({ mode: 'open' });
      }
      htmlnode.shadowRoot.innerHTML = "<style>" + panel.css_data + "</style>" + panel.html_data;
    }

    function resizePlotCanvas() {
      var width = elem.width();
      var height = elem.height();

      var size = Math.min(width, height);

      var plotCss = {
        top: '10px',
        margin: 'auto',
        position: 'relative',
        height: size + 'px'
      };
      plotCanvas.css(plotCss);
    }

    function render() {
      panel = ctrl.panel;

      if (setElementHeight()) {
        if (htmlelem) {
          htmlnode = htmlelem;

          if (htmlnode.getAttribute("name") == 'isInitial') {
            htmlnode.removeAttribute("name");
            ctrl.initialized = 0;
          }

          resizePlotCanvas();

          if (!ctrl.initialized) {
            addHTML();
            panel.doInit(ctrl, htmlnode.shadowRoot);
            ctrl.initialized = 1;
          }

          panel.handleMetric(ctrl, htmlnode.shadowRoot);

          htmlnode = null;
        } else {
          ctrl.initialized = 0;
        }
      }
    }
  }

  _export('default', link);

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_jqueryFlot) {}, function (_jqueryFlotPie) {}],
    execute: function () {}
  };
});
//# sourceMappingURL=rendering.js.map
