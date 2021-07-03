const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');
const visData = require('vis-data');
const visNetwork = require('vis-network');
//require('highcharts/modules/exporting')(Highcharts);




export const LOCAL = false;
// write viz code here
const drawViz = (data) => {

  var fields = data.fields;
  function interactionFilternet(id) {
  console.log("🚀 ~ file: index.js ~ line 17 ~ interactionFilternet ~ id", id)
    
    const interactionId = "interactionsConfigIdNetworkVis";
    const dimensionId = fields.dimID[0].id;
    const FILTER = dscc.InteractionType.FILTER;
    let interactionData = {
      "concepts": [dimensionId],
      "values": [[id + ""]]
    };
    dscc.sendInteraction(interactionId, FILTER, interactionData);

  }


  let error;


  let yData = JSON.parse(data.tables.DEFAULT[0].metricID[0].replace("},];", "}]"));
  let link = JSON.parse(data.tables.DEFAULT[1].metricID[0].replace("},];", "}]"));
  let merge = {};
  try {
    let semiColonArray = data.style.excludeWords.value.split(';');
    semiColonArray.forEach(element => {
      let dobleColon = element.split(':');
      merge[dobleColon[0]] = dobleColon[1].split(',');
    });
  } catch (e) {
    merge = {};
  }

  var replateLink = {};
  for (const key in merge) {
    if (Object.hasOwnProperty.call(merge, key)) {
      let objFather = yData.find(obj => obj.label == key);
      merge[key].forEach(element => {
        let child = yData.find(obj => obj.label == element);
        const index = yData.indexOf(child);
        replateLink[child.id] = objFather.id;

        if (index > -1) {
          yData.splice(index, 1);
        }
      });
    }
  }

  for (const key in link) {

    if (Object.hasOwnProperty.call(replateLink, link[key].from)) {
      link[key].from = replateLink[link[key].from];
      //link.splice(key, 1);
    }

    if (Object.hasOwnProperty.call(replateLink, link[key].to)) {
      link[key].to = replateLink[link[key].to];
      //link.splice(key, 1);
    }
  }



  var nodes = new visData.DataSet(yData);
  var edges = new visData.DataSet(link);

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


  try {
    if (!document.getElementById('container')) {
      var containerElement = document.createElement('div');
      containerElement.id = 'container';
      //const margin = { top: 10, bottom: 50, right: 10, left: 10 };
      const height = dscc.getHeight();
      const width = dscc.getWidth();
      containerElement.style.height = height + "px";
      containerElement.style.width = width + "px";
      document.body.appendChild(containerElement);

      var container = document.getElementById("container");
      let networkGn = new visNetwork.Network(container, data, options);

      networkGn.on('click', (params) => {
        let node = networkGn.getNodeAt(params.pointer.DOM);
        if (node) {
          interactionFilternet(node);
        }
      });

    }
  } catch (e) {
    error = "";
  }


};

// renders locally
if (LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
