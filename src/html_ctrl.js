import {MetricsPanelCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import TimeSeries from 'app/core/time_series';
import rendering from './rendering';
import ace from './node_modules/brace/index.js';
import './node_modules/brace/ext/language_tools.js';
import './node_modules/brace/theme/tomorrow_night_bright.js';
import './node_modules/brace/mode/javascript.js';
//import './node_modules/brace/mode/plain_text.js';

class GrafanaJSCompleter {
    constructor($lang_tools, $control, $panel) {
        this.$lang_tools = $lang_tools;
        this.$control = $control;
        this.$panel = $panel;
    }

    getCompletions(editor, session, pos, prefix, callback) {
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

    evaluatePrefix(evalObj, callback) {
        var wordList = [];
        for (var key in evalObj) {
            wordList.push(key);
        }
        callback(null, wordList.map(function (word) {
            return {
                caption: word + ': ' + (Array.isArray(evalObj[word]) ? 'Array[' + (evalObj[word] || []).length + ']' : typeof evalObj[word]),
                value: word,
                meta: "Grafana keyword"
            };
        }));
        return;
    }
}


export class HTMLCtrl extends MetricsPanelCtrl {

    constructor($scope, $injector, $rootScope) {
        super($scope, $injector);
        this.$rootScope = $rootScope;

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
            js_init_code: '',
        };

        _.defaults(this.panel, panelDefaults);

        this.events.on('render', this.onRender.bind(this));
        this.events.on('refresh', this.onRender.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));

        this.initialized = 0;
        this.editors = {};
    }

    onInitEditMode() {
        this.addEditorTab('HTML', 'public/plugins/aidanmountford-html-panel/partials/editor_html.html', 2);
        this.addEditorTab('Events', 'public/plugins/aidanmountford-html-panel/partials/editor_events.html', 3);
        this.unitFormats = kbn.getUnitFormats();
        this.aceLangTools = ace.acequire("ace/ext/language_tools");
        this.aceLangTools.addCompleter(new GrafanaJSCompleter(this.aceLangTools, this, this.panel));
    }

    doShowAceHtml(nodeId) {
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
    doShowAceCSS(nodeId) {
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
    doShowAceJs(nodeId) {
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

    setUnitFormat(subItem) {
        this.panel.format = subItem.value;
        this.render();
    }

    onDataError() {
        this.data = [];
        this.render();
    }

    changeSeriesColor(series, color) {
        series.color = color;
        this.panel.aliasColors[series.alias] = series.color;
        this.render();
    }

    setHandleMetricFunction() {
        this.panel.handleMetric = Function('ctrl', 'htmlnode', this.panel.js_code);
    }

    setInitFunction() {
        this.initialized = 0;
        this.panel.doInit = Function('ctrl', 'htmlnode', this.panel.js_init_code);
    }

    onRender() {
        if (!_.isFunction(this.panel.handleMetric)) {
            this.setHandleMetricFunction();
        }

        if (!_.isFunction(this.panel.doInit)) {
            this.setInitFunction();
        }
    }

    onDataReceived(dataList) {
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

    resetHTML() {
        this.initialized = 0;
    }

    seriesHandler(seriesData) {
        const series = new TimeSeries({
            datapoints: seriesData.datapoints,
            alias: seriesData.target
        });

        series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
        return series;
    }


    docsHandler(seriesData) {
        return seriesData;
    }

    tableHandler(tableData) {

        const columnNames = tableData.columns.map(column => column.text);

        const rows = tableData.rows.map(row => {
            const datapoint = {};

            row.forEach((value, columnIndex) => {
                const key = columnNames[columnIndex];
                datapoint[key] = value;
            });

            return datapoint;
        });

        return {columnNames: columnNames, rows: rows};
    }

    getSeriesIdByAlias(aliasName) {
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].alias == aliasName) {
                return i;
            }
        }
        return -1;
    }

    getSeriesElementByAlias(aliasName) {
        var i = this.getSeriesIdByAlias(aliasName);
        if (i >= 0) {
            return this.data[i];
        }
        return null;
    }

    getDecimalsForValue(value) {
        if (_.isNumber(this.panel.decimals)) {
            return {decimals: this.panel.decimals, scaledDecimals: null};
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

    formatValue(value) {
        var decimalInfo = this.getDecimalsForValue(value);
        var formatFunc = kbn.valueFormats[this.panel.format];
        if (formatFunc) {
            return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
        }
        return value;
    }

    formatValueWithFormatter(value, formatter) {
        var decimalInfo = this.getDecimalsForValue(value);
        var formatFunc = kbn.valueFormats[formatter];
        if (formatFunc) {
            return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
        }
        return value;
    }

    link(scope, elem, attrs, ctrl) {
        rendering(scope, elem, attrs, ctrl);
    }

}

HTMLCtrl.templateUrl = 'module.html';
