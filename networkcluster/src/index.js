const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');
const visData = require('vis-data');
const visNetwork = require('vis-network');


// write viz code here
/*const drawViz = (data) => {
  viz.readmeViz();
  vz.firstViz(data);
};*/

export const LOCAL = true;


const drawViz = (data) => {
  var dialogHeader = document.createElement('div');
  var dialog = document.createElement('div');
  var title = document.createElement('div');
  var close = document.createElement('div');
  var content = document.createElement('div');
  var loader = document.createElement('div');
  


  function createDialod(){
    dialog.id="dialog";
    dialogHeader.id="dialogHeader";
    content.id="dialogContent";

    title.id= "titleHeader";
    title.textContent="Header Title";
    close.addEventListener("click",closeDialog);
    close.textContent="X"
    close.id="closebtn";
    dialogHeader.append(title);
    dialogHeader.append(close);

    loader.className="loader";
    //content.append(loader);
    createMention();
    createMention();
    createMention();
    createMention();
    createMention();
    createMention();
    createMention();
    createMention();
    
    dialog.append(dialogHeader);
    dialog.append(content);
    document.body.prepend(dialog);
  }

  function createMention(){
    var mention = document.createElement('div');
    mention.className ="mentionBox";

    var mentiondatacontent = document.createElement('div');
    mentiondatacontent.className="mentionContentBox";

    var image = document.createElement('div');
    image.className="imageMentionBox";

    var mentiondata = document.createElement('div');
    mentiondata.className="mentionData";

    var mentiontext = document.createElement('div');
    mentiontext.className="metiontext";

    var userMention=document.createElement('p');
    userMention.textContent="@usuario";

    var userTxt=document.createElement('p');
    userTxt.textContent="Mira Luiscito, aqui no tiene nada que ver quien es el patron, ni tiene que ver quien lo denuncia, el hecho es que es corrupción aunque sea el niño dios el que lo haga y hay que denunciarlo, aunque no vaya a pasar nada…";
    
    mentiontext.append(userMention);
    mentiontext.append(userTxt);
    
    mentiondatacontent.append(mentiondata);
    mentiondatacontent.append(mentiontext);

    mention.append(image);
    mention.append(mentiondatacontent);
    
    content.append(mention);
  }


function showDialog(id){
  var dialog = document.getElementById('dialog');
  dialog.style.display = "block";
}


function closeDialog(){
  var dialog = document.getElementById('dialog');
  dialog.style.display = "none";
}



  let error;
  let colorGroups = {};

  try {
    document.getElementById('container').remove();
    document.getElementById('dialog').remove();
  } catch (e) {
    error = "";
  }
  createDialod();

  var containerElement = document.createElement('div');
  containerElement.id = 'container';
  //const margin = { top: 10, bottom: 50, right: 10, left: 10 };
  const height = dscc.getHeight();
  const width = dscc.getWidth();
  containerElement.style.height = height + "px";
  containerElement.style.width = width + "px";
  document.body.appendChild(containerElement);

  var stry=data.tables.DEFAULT[0].metricID[0]
  .replace("},];", "}]")
  .replace(/:'/g,':"')
  .replace(/',/g,'",')
  .replace(/{/g,'{"')
  .replace(/, /g,',"')
  .replace(/:/g,'":');

  var strx=data.tables.DEFAULT[1].metricID[0]
  .replace("},];", "}]")
  .replace(/{/g,'{"')
  .replace(/, /g,',"')
  .replace(/:/g,'":')
  .replace(/:'/g,':"')
  .replace(/',/g,'",')

  let yData = JSON.parse(stry);
  let link = JSON.parse(strx);

  let merge = {};

  var colors = [];
  while (colors.length < 100) {
    do {
      var color = Math.floor((Math.random() * 50000000) + 1);
    } while (colors.indexOf(color) >= 0);
    colors.push("#" + ("000000" + color.toString(16)).slice(-6));
  }

  yData.forEach((item) => {
    if(!item.font){
      item.font={}
    }
    item.font.strokeColor = "white";
    item.font.strokeWidth = 5;
    item.opacity=0.1
    if (item.group in colorGroups) {
      item.font.color = colorGroups[item.group];
      item.color = colorGroups[item.group];
    } else {
      var count = Object.keys(colorGroups).length;
      colorGroups[item.group] = colors[count];
      item.font.color = colors[count];
      item.color = colors[count];
    }
  })

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

  var container = document.getElementById("container");


  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
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
  let networkG = new visNetwork.Network(container, data, options);
  networkG.on('click',(params)=>{
  console.log("🚀 ~ file: index.js ~ line 176 ~ networkG.on ~ params", params)
    
    let node = networkG.getNodeAt(params.pointer.DOM);
    console.log("🚀 ~ file: index.js ~ line 159 ~ networkG.on ~ node", node);
    showDialog(node);
  });
};

// renders locally
if (LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
