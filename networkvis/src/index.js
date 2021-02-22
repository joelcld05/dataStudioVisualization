const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');
const visData = require('vis-data');
const visNetwork = require('vis-network');
//require('highcharts/modules/exporting')(Highcharts);

var containerElement = document.createElement('div');
containerElement.id = 'container';
//const margin = { top: 10, bottom: 50, right: 10, left: 10 };
const height = dscc.getHeight();
const width = dscc.getWidth();
containerElement.style.height = height + "px";
containerElement.style.width = width + "px";
document.body.appendChild(containerElement);

export const LOCAL = false;
// write viz code here
const drawViz = (data) => {

  let yData = JSON.parse(data.tables.DEFAULT[0].metricID[0].replace("},];","}]"));
  let link = JSON.parse(data.tables.DEFAULT[1].metricID[0].replace("},];","}]"));

  var nodes = new visData.DataSet(yData);
  var edges = new visData.DataSet(link);
  
  var container = document.getElementById("container");
    var data = {
      nodes: nodes,
      edges: edges,
    };
    var options = {
      nodes: {
        shape: "dot",
        size: 16,
      },
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -26,
          centralGravity: 0.005,
          springLength: 230,
          springConstant: 0.18,
        },
        maxVelocity: 146,
        solver: "forceAtlas2Based",
        timestep: 0.35,
        stabilization: { iterations: 150 },
      },
    };
  new visNetwork.Network(container, data, options);

};

// renders locally
if (LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
