const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');
const visData = require('vis-data');
const visNetwork = require('vis-network');



// write viz code here
/*const drawViz = (data) => {
  viz.readmeViz();
  viz.firstViz(data);
};*/

export const LOCAL = true;

const drawViz = (data) => {
  let error;
  let colorGroups={};

  try{
    document.getElementById('container').remove();
  }catch(e){
    error="";
  }

  var containerElement = document.createElement('div');
  containerElement.id = 'container';
  //const margin = { top: 10, bottom: 50, right: 10, left: 10 };
  const height = dscc.getHeight();
  const width = dscc.getWidth();
  containerElement.style.height = height + "px";
  containerElement.style.width = width + "px";
  document.body.appendChild(containerElement);
  

  let yData = JSON.parse(data.tables.DEFAULT[0].metricID[0].replace("},];","}]"));
  let link = JSON.parse(data.tables.DEFAULT[1].metricID[0].replace("},];","}]"));
  let merge={};

  var colors = [];
  while (colors.length < 100) {
      do {
          var color = Math.floor((Math.random()*50000000)+1);
      } while (colors.indexOf(color) >= 0);
      colors.push("#" + ("000000" + color.toString(16)).slice(-6));
  }

  yData.forEach((item)=>{
    item.font.strokeColor= "white";
    item.font.strokeWidth= 5;
    if (item.group in colorGroups){
      item.font.color=colorGroups[item.group];
      item.color=colorGroups[item.group];
    }else{
      var count = Object.keys(colorGroups).length;
      colorGroups[item.group]=colors[count];
      item.font.color=colors[count];
      item.color=colors[count];
    }
  })

  try{
    let semiColonArray=data.style.excludeWords.value.split(';');
    semiColonArray.forEach(element => {
      let dobleColon=element.split(':');
      merge[dobleColon[0]]=dobleColon[1].split(',');
    });
  }catch(e){
    merge={};
  }
  
  var replateLink={};
  for (const key in merge) {
    if (Object.hasOwnProperty.call(merge, key)) {
      let objFather = yData.find(obj => obj.label == key);
      merge[key].forEach(element => {
        let child=yData.find(obj => obj.label == element);
        
        const index = yData.indexOf(child);
        if (index > -1) {
          yData.splice(index, 1);
        }
      });
    }
  }

  for (const key in link) {    
    
    if (Object.hasOwnProperty.call(replateLink, link[key].from)){
      link[key].from=replateLink[link[key].from];
      //link.splice(key, 1);
    }
    
    if(Object.hasOwnProperty.call(replateLink, link[key].to)){
      link[key].to=replateLink[link[key].to];
      //link.splice(key, 1);
    }
  }
  
  
  
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
        size: 2,
      },
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -150,
          centralGravity: 0.0065,
          springLength: 350,
          springConstant: 0.8,
        },
        maxVelocity: 200,
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
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}
