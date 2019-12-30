# Summary
Grafana panel for displaying metric sensitive or arbitary HTML.

This only works with Grafana 3.X or later

The control allows the specification of CSS, HTML and JS for
both initialisation and metric updates. 

This is based on the work by Marcus Calidus and the SVG plugin.



## Installation

It is possible to clone this repo directly into your plugins directory.
(var/lib/grafana/plugins)

Afterwards restart grafana-server and the plugin should be automatically detected and used.

```
npm install
grunt
sudo service grafana-server restart
```


## Clone into a directory of your choice

If the plugin is cloned to a directory that is not the default plugins directory then you need to edit your grafana.ini config file (Default location is at /etc/grafana/grafana.ini) and add this:

```ini
[plugin.svg]
path = /home/your/clone/dir/svg-panel
```

Note that if you clone it into the grafana plugins directory you do not need to add the above config option. That is only
if you want to place the plugin in a directory outside the standard plugins directory. Be aware that grafana-server
needs read access to the directory.

# Options

## HTML Data and CSS

HTML & CSS is encapsulated in a shadow root and will therefore not "leak" outside the control. 

## Events
### onHandleMetric
this code is execute upon **every Rerfresh**

```
onHandleMetric(ctrl: MetricsPanelCtrl, svgnode: HTMLElement)
```

`ctrl` passes a grafana `MetricsPanelCtrl` object. This object contains all relevant data pertainig the current panel. 
You may want to use the `ctrl.data` array property to access the current measurement data.

`htmlnode` passes the HTMLElement of the html content on the panel.   THis allows direct access to and editing of the html
content

```
htmlnode.innerHTML = "Hello World";
```


### onInit
this event is executed **once**, right after the first initializiation of the SVG.
```
onHandleMetric(ctrl: MetricsPanelCtrl, svgnode: HTMLElement)
```

`ctrl` passes a grafana `MetricsPanelCtrl` object. This object contains all relevant data pertainig the current panel. 
You may want to use the `ctrl.data` array property to access the current measurement data.

`htmlnode` passes the HTMLElement of the html content on the panel.   THis allows direct access to and editing of the html

```
htmlnode.innerHTML = "Hello World";
```

# Changelog

## 0.0.1
* Initial build


# To do

* Fix syntax highlighting for CSS and HTML
* Build "code snippet" library to allow commonly used HTML constructs to be stored and retrieved (including the relevant CSS and JS) 


# Attributions

## Marcus Calidus
SVG Grafana plugin on which this HTML plugin is based

## Simran Singh
Icons used in this plugin
