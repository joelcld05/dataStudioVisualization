const dscc = require('@google/dscc');
const local = require('/src/localMessage.js');
const am4core = require('@amcharts/amcharts4/core.js');
const wordCloud = require('@amcharts/amcharts4/plugins/wordCloud');




export const LOCAL = false;
// write viz code here
const drawViz = (data) => {
  var fields = data.fields;
  var processedData = [];
  var exclude = data.style.excludeWords.value.split(',');

  data.tables.DEFAULT.forEach(element => {
    if (!exclude.includes(element.dimID[0])) {
      var valueTag = element.dimID[0].split(";");
      processedData.push({
        "tag": valueTag[0],
        "weight": parseInt(element.metricID[0])
      });
    }
  });

  function interactionFilterNetwork(id) {
    var idMention = 0;
    data.tables.DEFAULT.forEach(element => {
      if (!exclude.includes(element.dimID[0])) {
        var valueTag = element.dimID[0].split(";");
        if (id === valueTag[0]) {
          idMention = valueTag[1];
        }
      }
    });
    console.log("🚀 ~ file: index.js ~ line 30 ~ interactionFilterNetwork ~ idMention", idMention)
    const interactionId = "interactionsConfigIdWordcloud";
    const dimensionId = fields.dimID[0].id;
    const FILTER = dscc.InteractionType.FILTER;
    let interactionData = {
      "concepts": [dimensionId],
      "values": [[idMention + ""]]
    };
    dscc.sendInteraction(interactionId, FILTER, interactionData);
  }

  if (!document.getElementById('container')) {
    var containerElement = document.createElement('div');
    containerElement.id = 'container';
    const height = dscc.getHeight();
    const width = dscc.getWidth();
    containerElement.style.height = height + "px";
    containerElement.style.width = width + "px";
    document.body.appendChild(containerElement);
    am4core.ready(function () {

      var chart = am4core.create("container", wordCloud.WordCloud);
      var series = chart.series.push(new wordCloud.WordCloudSeries());
      chart.height = height;
      chart.width = width;
      series.accuracy = 1;
      series.rotationThreshold = 0.7;
      series.maxCount = 250;
      series.excludeWords = exclude;
      series.maxFontSize = am4core.percent(10);
      series.minFontSize = am4core.percent(2.5);

      series.dataFields.word = "tag";
      series.dataFields.value = "weight";
      series.data = processedData;
      series.labels.template.tooltipText = "{tag}: {weight}";
      series.colors = new am4core.ColorSet();
      series.colors.passOptions = {};
      series.angles = [0];

      series.labels.template.events.on("hit", function (ev) {
        interactionFilterNetwork(ev.target.currentText);
      }, this);

    });
  }



};

// renders locally
if (LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
