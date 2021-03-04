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
  
  var textString= "";

  data.tables.DEFAULT.forEach(element => {
    var stringL=parseInt(element.metricID[0]);
    stringL=stringL>=200?200:stringL;
    textString = textString + (element.dimID[0] + " ").repeat(parseInt(stringL));
  });
  

  am4core.ready(function() {

    var chart = am4core.create("container", wordCloud.WordCloud);
    var series = chart.series.push(new wordCloud.WordCloudSeries());
    chart.height=height;
    chart.width=width;
    //series.accuracy = 4;
    //series.step = 15;
    //eries.rotationThreshold = 0.7;
    //series.maxCount = 200;
    series.minWordLength = 2;
    series.labels.template.margin(4,4,4,4);
    series.maxFontSize = am4core.percent(15);
    
    series.text = textString;

    series.colors = new am4core.ColorSet();
    //series.colors.passOptions = {}; // makes it loop
    
    //series.labelsContainer.rotation = 45;
    series.angles = [0,0];
    //series.fontWeight = "700"

    
    setInterval(function () {
          series.dataItems.getIndex(Math.round(Math.random() * (series.dataItems.length - 1))).setValue("value", Math.round(Math.random() * 10));
     }, 100020*1000)
    
    });
    
 

};

// renders locally
if (LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
