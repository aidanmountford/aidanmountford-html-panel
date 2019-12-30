'use strict';

System.register(['./polyfills.js', 'lodash', './html_ctrl'], function (_export, _context) {
    "use strict";

    var _, HTMLCtrl;

    return {
        setters: [function (_polyfillsJs) {}, function (_lodash) {
            _ = _lodash.default;
        }, function (_html_ctrl) {
            HTMLCtrl = _html_ctrl.HTMLCtrl;
        }],
        execute: function () {
            _export('PanelCtrl', HTMLCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map
