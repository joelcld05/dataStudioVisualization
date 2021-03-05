const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('/src/localMessage.js');
const am4core = require('@amcharts/amcharts4/core.js');
const wordCloud = require('@amcharts/amcharts4/plugins/wordCloud');
var containerElement = document.createElement('div');
containerElement.id = 'container';
const height = dscc.getHeight();
const width = dscc.getWidth();
containerElement.style.height = height + "px";
containerElement.style.width = width + "px";
document.body.appendChild(containerElement);

export const LOCAL = false;
// write viz code here
const drawViz = (data) => {


  var processedData = [];
  var exclude=data.style.excludeWords.value.split(',');
  data.tables.DEFAULT.forEach(element => {
    if (!exclude.includes(element.dimID[0])){
      processedData.push({
        "tag": element.dimID[0],
        "weight": parseInt(element.metricID[0])
      });
    }
  });
  

  am4core.ready(function () {
    
    var chart = am4core.create("container", wordCloud.WordCloud);
    var series = chart.series.push(new wordCloud.WordCloudSeries());
    chart.height = height;
    chart.width = width;
    series.accuracy = 1;
    series.rotationThreshold = 0.7;
    series.maxCount = 250;
    series.excludeWords=exclude;
    series.maxFontSize = am4core.percent(10);
    series.minFontSize = am4core.percent(2.5);

    series.dataFields.word = "tag";
    series.dataFields.value = "weight";
    
    series.data = processedData;
    
    series.labels.template.tooltipText = "{tag}: {weight}";

    series.colors = new am4core.ColorSet();
    series.colors.passOptions = {}; 
    series.angles = [0];

  });



};

// renders locally
if (LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
