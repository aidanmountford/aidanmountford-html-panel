'use strict';

System.register(['app/plugins/sdk', 'lodash', 'app/core/utils/kbn', 'app/core/time_series', './rendering', './node_modules/brace/index.js', './node_modules/brace/ext/language_tools.js', './node_modules/brace/theme/tomorrow_night_bright.js', './node_modules/brace/mode/javascript.js'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, _, kbn, TimeSeries, rendering, ace, _typeof, _createClass, GrafanaJSCompleter, HTMLCtrl;

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_appPluginsSdk) {
            MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
        }, function (_lodash) {
            _ = _lodash.default;
        }, function (_appCoreUtilsKbn) {
            kbn = _appCoreUtilsKbn.default;
        }, function (_appCoreTime_series) {
            TimeSeries = _appCoreTime_series.default;
        }, function (_rendering) {
            rendering = _rendering.default;
        }, function (_node_modulesBraceIndexJs) {
            ace = _node_modulesBraceIndexJs.default;
        }, function (_node_modulesBraceExtLanguage_toolsJs) {}, function (_node_modulesBraceThemeTomorrow_night_brightJs) {}, function (_node_modulesBraceModeJavascriptJs) {}],
        execute: function () {
            _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                return typeof obj;
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };

            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            GrafanaJSCompleter = function () {
                function GrafanaJSCompleter($lang_tools, $control, $panel) {
                    _classCallCheck(this, GrafanaJSCompleter);

                    this.$lang_tools = $lang_tools;
                    this.$control = $control;
                    this.$panel = $panel;
                }

                _createClass(GrafanaJSCompleter, [{
                    key: 'getCompletions',
                    value: function getCompletions(editor, session, pos, prefix, callback) {
                        var pos = editor.getCursorPosition();
                        var line = editor.session.getLine(pos.row);

                        prefix = line.substring(0, pos.column).match(/this\.\S*/g);
                        if (prefix) {
                            prefix = prefix[prefix.length - 1];
                            prefix = prefix.substring(0, prefix.lastIndexOf('.'));

                            var panelthis = this.$panel;
                            var evalObj = eval('panel' + prefix);
                            this.evaluatePrefix(evalObj, callback);
                            return;
                        }

                        prefix = line.substring(0, pos.column).match(/ctrl\.\S*/g);
                        if (prefix) {
                            prefix = prefix[prefix.length - 1];
                            prefix = prefix.substring(0, prefix.lastIndexOf('.'));

                            var ctrl = this.$control;
                            var evalObj = eval(prefix);
                            this.evaluatePrefix(evalObj, callback);
                            return;
                        }

                        prefix = line.substring(0, pos.column).match(/htmlnode\.\S*/g);
                        if (prefix) {
                            prefix = prefix[prefix.length - 1];
                            prefix = prefix.substring(0, prefix.lastIndexOf('.'));

                            var htmlnode = document.querySelector('.html-object');
                            var evalObj = eval(prefix);
                            this.evaluatePrefix(evalObj, callback);
                            return;
                        }

                        if (prefix == '') {
                            var wordList = ['ctrl', 'htmlnode', 'this'];

                            callback(null, wordList.map(function (word) {
                                return {
                                    caption: word,
                                    value: word,
                                    meta: 'Grafana keyword'
                                };
                            }));
                        }
                    }
                }, {
                    key: 'evaluatePrefix',
                    value: function evaluatePrefix(evalObj, callback) {
                        var wordList = [];
                        for (var key in evalObj) {
                            wordList.push(key);
                        }
                        callback(null, wordList.map(function (word) {
                            return {
                                caption: word + ': ' + (Array.isArray(evalObj[word]) ? 'Array[' + (evalObj[word] || []).length + ']' : _typeof(evalObj[word])),
                                value: word,
                                meta: "Grafana keyword"
                            };
                        }));
                        return;
                    }
                }]);

                return GrafanaJSCompleter;
            }();

            _export('HTMLCtrl', HTMLCtrl = function (_MetricsPanelCtrl) {
                _inherits(HTMLCtrl, _MetricsPanelCtrl);

                function HTMLCtrl($scope, $injector, $rootScope) {
                    _classCallCheck(this, HTMLCtrl);

                    var _this = _possibleConstructorReturn(this, (HTMLCtrl.__proto__ || Object.getPrototypeOf(HTMLCtrl)).call(this, $scope, $injector));

                    _this.$rootScope = $rootScope;

                    var panelDefaults = {
                        links: [],
                        datasource: null,
                        maxDataPoints: 3,
                        interval: null,
                        targets: [{}],
                        cacheTimeout: null,
                        nullPointMode: 'connected',
                        aliasColors: {},
                        format: 'short',

                        css_data: '',
                        html_data: '',
                        js_code: '',
                        js_init_code: ''
                    };

                    _.defaults(_this.panel, panelDefaults);

                    _this.events.on('render', _this.onRender.bind(_this));
                    _this.events.on('refresh', _this.onRender.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));

                    _this.initialized = 0;
                    _this.editors = {};
                    return _this;
                }

                _createClass(HTMLCtrl, [{
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.addEditorTab('HTML', 'public/plugins/aidanmountford-html-panel/partials/editor_html.html', 2);
                        this.addEditorTab('Events', 'public/plugins/aidanmountford-html-panel/partials/editor_events.html', 3);
                        this.unitFormats = kbn.getUnitFormats();
                        this.aceLangTools = ace.acequire("ace/ext/language_tools");
                        this.aceLangTools.addCompleter(new GrafanaJSCompleter(this.aceLangTools, this, this.panel));
                    }
                }, {
                    key: 'doShowAceHtml',
                    value: function doShowAceHtml(nodeId) {
                        setTimeout(function () {
                            if ($('#' + nodeId).length === 1) {
                                this.editors[nodeId] = ace.edit(nodeId);
                                $('#' + nodeId).attr('id', nodeId + '_initialized');
                                this.editors[nodeId].setValue(this.panel[nodeId], 1);
                                this.editors[nodeId].getSession().on('change', function () {
                                    var val = this.editors[nodeId].getSession().getValue();
                                    this.panel[nodeId] = val;
                                    try {
                                        this.resetHTML();
                                        this.render();
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }.bind(this));
                                this.editors[nodeId].setOptions({
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    theme: 'ace/theme/tomorrow_night_bright',
                                    showPrintMargin: false
                                });
                            }
                        }.bind(this), 100);
                        return true;
                    }
                }, {
                    key: 'doShowAceCSS',
                    value: function doShowAceCSS(nodeId) {
                        setTimeout(function () {
                            if ($('#' + nodeId).length === 1) {
                                this.editors[nodeId] = ace.edit(nodeId);
                                $('#' + nodeId).attr('id', nodeId + '_initialized');
                                this.editors[nodeId].setValue(this.panel[nodeId], 1);
                                this.editors[nodeId].getSession().on('change', function () {
                                    var val = this.editors[nodeId].getSession().getValue();
                                    this.panel[nodeId] = val;
                                    try {
                                        this.resetHTML();
                                        this.render();
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }.bind(this));
                                this.editors[nodeId].setOptions({
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    theme: 'ace/theme/tomorrow_night_bright',
                                    showPrintMargin: false
                                });
                            }
                        }.bind(this), 100);
                        return true;
                    }
                }, {
                    key: 'doShowAceJs',
                    value: function doShowAceJs(nodeId) {
                        setTimeout(function () {
                            if ($('#' + nodeId).length === 1) {
                                this.editors[nodeId] = ace.edit(nodeId);
                                $('#' + nodeId).attr('id', nodeId + '_initialized');
                                this.editors[nodeId].setValue(this.panel[nodeId], 1);
                                this.editors[nodeId].getSession().on('change', function () {
                                    var val = this.editors[nodeId].getSession().getValue();
                                    this.panel[nodeId] = val;
                                    try {
                                        this.setInitFunction();
                                        this.setHandleMetricFunction();
                                        this.render();
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }.bind(this));
                                this.editors[nodeId].setOptions({
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    theme: 'ace/theme/tomorrow_night_bright',
                                    mode: 'ace/mode/javascript',
                                    showPrintMargin: false
                                });
                            }
                        }.bind(this), 100);
                        return true;
                    }
                }, {
                    key: 'setUnitFormat',
                    value: function setUnitFormat(subItem) {
                        this.panel.format = subItem.value;
                        this.render();
                    }
                }, {
                    key: 'onDataError',
                    value: function onDataError() {
                        this.data = [];
                        this.render();
                    }
                }, {
                    key: 'changeSeriesColor',
                    value: function changeSeriesColor(series, color) {
                        series.color = color;
                        this.panel.aliasColors[series.alias] = series.color;
                        this.render();
                    }
                }, {
                    key: 'setHandleMetricFunction',
                    value: function setHandleMetricFunction() {
                        this.panel.handleMetric = Function('ctrl', 'htmlnode', this.panel.js_code);
                    }
                }, {
                    key: 'setInitFunction',
                    value: function setInitFunction() {
                        this.initialized = 0;
                        this.panel.doInit = Function('ctrl', 'htmlnode', this.panel.js_init_code);
                    }
                }, {
                    key: 'onRender',
                    value: function onRender() {
                        if (!_.isFunction(this.panel.handleMetric)) {
                            this.setHandleMetricFunction();
                        }

                        if (!_.isFunction(this.panel.doInit)) {
                            this.setInitFunction();
                        }
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {
                        this.data = [];

                        if (dataList.length > 0 && dataList[0].type === 'table') {
                            this.data = dataList.map(this.tableHandler.bind(this));
                            this.table = this.data; // table should be regarded as deprecated
                        } else if (dataList.length > 0 && dataList[0].type === 'docs') {
                            this.data = dataList.map(this.docsHandler.bind(this));
                        } else {
                            this.data = dataList.map(this.seriesHandler.bind(this));
                            this.series = this.data; // series should be regarded as deprectated
                        }

                        this.render();
                    }
                }, {
                    key: 'resetHTML',
                    value: function resetHTML() {
                        this.initialized = 0;
                    }
                }, {
                    key: 'seriesHandler',
                    value: function seriesHandler(seriesData) {
                        var series = new TimeSeries({
                            datapoints: seriesData.datapoints,
                            alias: seriesData.target
                        });

                        series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
                        return series;
                    }
                }, {
                    key: 'docsHandler',
                    value: function docsHandler(seriesData) {
                        return seriesData;
                    }
                }, {
                    key: 'tableHandler',
                    value: function tableHandler(tableData) {

                        var columnNames = tableData.columns.map(function (column) {
                            return column.text;
                        });

                        var rows = tableData.rows.map(function (row) {
                            var datapoint = {};

                            row.forEach(function (value, columnIndex) {
                                var key = columnNames[columnIndex];
                                datapoint[key] = value;
                            });

                            return datapoint;
                        });

                        return { columnNames: columnNames, rows: rows };
                    }
                }, {
                    key: 'getSeriesIdByAlias',
                    value: function getSeriesIdByAlias(aliasName) {
                        for (var i = 0; i < this.data.length; i++) {
                            if (this.data[i].alias == aliasName) {
                                return i;
                            }
                        }
                        return -1;
                    }
                }, {
                    key: 'getSeriesElementByAlias',
                    value: function getSeriesElementByAlias(aliasName) {
                        var i = this.getSeriesIdByAlias(aliasName);
                        if (i >= 0) {
                            return this.data[i];
                        }
                        return null;
                    }
                }, {
                    key: 'getDecimalsForValue',
                    value: function getDecimalsForValue(value) {
                        if (_.isNumber(this.panel.decimals)) {
                            return { decimals: this.panel.decimals, scaledDecimals: null };
                        }

                        var delta = value / 2;
                        var dec = -Math.floor(Math.log(delta) / Math.LN10);

                        var magn = Math.pow(10, -dec);
                        var norm = delta / magn; // norm is between 1.0 and 10.0
                        var size;

                        if (norm < 1.5) {
                            size = 1;
                        } else if (norm < 3) {
                            size = 2;
                            // special case for 2.5, requires an extra decimal
                            if (norm > 2.25) {
                                size = 2.5;
                                ++dec;
                            }
                        } else if (norm < 7.5) {
                            size = 5;
                        } else {
                            size = 10;
                        }

                        size *= magn;

                        // reduce starting decimals if not needed
                        if (Math.floor(value) === value) {
                            dec = 0;
                        }

                        var result = {};
                        result.decimals = Math.max(0, dec);
                        result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

                        return result;
                    }
                }, {
                    key: 'formatValue',
                    value: function formatValue(value) {
                        var decimalInfo = this.getDecimalsForValue(value);
                        var formatFunc = kbn.valueFormats[this.panel.format];
                        if (formatFunc) {
                            return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                        }
                        return value;
                    }
                }, {
                    key: 'formatValueWithFormatter',
                    value: function formatValueWithFormatter(value, formatter) {
                        var decimalInfo = this.getDecimalsForValue(value);
                        var formatFunc = kbn.valueFormats[formatter];
                        if (formatFunc) {
                            return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                        }
                        return value;
                    }
                }, {
                    key: 'link',
                    value: function link(scope, elem, attrs, ctrl) {
                        rendering(scope, elem, attrs, ctrl);
                    }
                }]);

                return HTMLCtrl;
            }(MetricsPanelCtrl));

            _export('HTMLCtrl', HTMLCtrl);

            HTMLCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=html_ctrl.js.map
