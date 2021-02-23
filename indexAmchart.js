const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./networkvis/src/localMessage.js');
const am4core = require('@amcharts/amcharts4/core.js');
const am4charts = require('@amcharts/amcharts4/charts.js');
const forceDirected = require('@amcharts/amcharts4/plugins/forceDirected.js');

//require('highcharts/modules/exporting')(Highcharts);

var containerElement = document.createElement('div');
containerElement.id = 'container';
const margin = { top: 10, bottom: 50, right: 10, left: 10 };
const height = dscc.getHeight() - margin.top - margin.bottom;
const width = dscc.getWidth() - margin.left - margin.right;
containerElement.style.height = height + "px";
containerElement.style.width = width + "px";
document.body.appendChild(containerElement);

export const LOCAL = false;
// write viz code here
const drawViz = (data) => {


  am4core.ready(function (data) {
    
    var chart = am4core.create("container", forceDirected.ForceDirectedTree);
    chart.height = height / 2;
    //chart.legend = new am4charts.Legend();
    var networkSeries = chart.series.push(new forceDirected.ForceDirectedSeries())

    


    networkSeries.data = dataItems;

    networkSeries.dataFields.name = "description";
    networkSeries.dataFields.id = "name";
    networkSeries.dataFields.value = "value";
    networkSeries.dataFields.children = "children";
    networkSeries.dataFields.linkWith = "linkWith";

    networkSeries.nodes.template.tooltipText = "{name}";
    networkSeries.nodes.template.fillOpacity = 1;
    networkSeries.nodes.template.label.text = "[gray font-size: {fontSize}px]{name}"
    //networkSeries.nodes.template.label.dy =

    networkSeries.nodes.template.label.hideOversized = false;
    networkSeries.nodes.template.label.truncate = false;

    //networkSeries.nodes.template.outerCircle.disabled = true;
    //networkSeries.nodes.template.outerCircle.propertyFields.fill = "fill";
    //networkSeries.nodes.template.circle.propertyFields.fill = "fill";
    //networkSeries.nodes.template.circle.propertyFields.opacity = "";
    //networkSeries.nodes.template.circle.propertyFields.stroke = "fill";
    networkSeries.nodes.template.togglable = false;

    networkSeries.maxRadius = am4core.percent(6);
    networkSeries.manyBodyStrength = -16;

    networkSeries.links.template.propertyFields.strokeWidth = "linkWidth";
    //networkSeries.links.template.propertyFields.stroke = "fill";

    //networkSeries.nodes.template.circle.disabled = true;

    chart.zoomable = true;

    networkSeries.nodes.template.events.on("hit", function (event) {
      if (event.target.isActive) {
        chart.zoomToDataItem(event.target.dataItem, 3, true)
      }
      else {
        chart.zoomOut();
      }
    });
  }); // end am4core.ready()

};

// renders locally
if (LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
