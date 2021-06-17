const dscc = require('@google/dscc');
//const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');
const visData = require('vis-data');
const visNetwork = require('vis-network');
// write viz code here
/*const drawViz = (data) => {
  viz.readmeViz();
  vz.firstViz(data);
};*/

export const LOCAL = false;

const drawViz = (data) => {
  console.log("🚀 ~ file: index.js ~ line 15 ~ drawViz ~ data", data)

  var fields = data.fields;
  var stry = data.tables.DEFAULT[0].dimID[0]
    .replace("},];", "}]")
    .replace(/:'/g, ':"')
    .replace(/',/g, '",')
    .replace(/{/g, '{"')
    .replace(/, /g, ',"')
    .replace(/:/g, '":');

  var strx = data.tables.DEFAULT[1].dimID[0]
    .replace("},];", "}]")
    .replace(/{/g, '{"')
    .replace(/, /g, ',"')
    .replace(/:/g, '":')
    .replace(/:'/g, ':"')
    .replace(/',/g, '",')

  var mentions = data.tables.DEFAULT[1].metricID[0]
    .replace("},];", "}]");


  let yData = JSON.parse(stry);
  let link = JSON.parse(strx);


  var dialogHeader = document.createElement('div');
  var dialog = document.createElement('div');
  var title = document.createElement('div');
  var close = document.createElement('div');
  var content = document.createElement('div');
  var loader = document.createElement('div');

  function createDialod() {
    dialog.id = "dialog";
    dialogHeader.id = "dialogHeader";
    content.id = "dialogContent";

    title.id = "titleHeader";
    title.textContent = "Header Title";
    close.addEventListener("click", closeDialog);
    close.textContent = "X"
    close.id = "closebtn";
    dialogHeader.append(title);
    dialogHeader.append(close);

    loader.className = "loader";
    //content.append(loader);
    //createMention();
    //createMention();
    content.textContent = mentions;

    dialog.append(dialogHeader);
    dialog.append(content);
    document.body.prepend(dialog);
  }

  function createMention() {
    var mention = document.createElement('div');
    mention.className = "mentionBox";
    var mentiondatacontent = document.createElement('div');
    mentiondatacontent.className = "mentionContentBox";
    var image = document.createElement('div');
    image.className = "imageMentionBox";
    var imagetag = document.createElement('img');
    imagetag.className = "imagenUsuario";
    imagetag.src = "https://www.vippng.com/png/detail/202-2026524_person-icon-default-user-icon-png.png";
    image.append(imagetag);
    var mentiondata = document.createElement('div');
    mentiondata.className = "mentionData";
    var mentiontext = document.createElement('div');
    mentiontext.className = "metiontext";
    var userMention = document.createElement('p');
    userMention.textContent = "@usuario";
    var userTxt = document.createElement('p');
    userTxt.textContent = "Mira Luiscito, aqui no tiene nada que ver quien es el patron, ni tiene que ver quien lo denuncia, el hecho es que es corrupción aunque sea el niño dios el que lo haga y hay que denunciarlo, aunque no vaya a pasar nada…";
    mentiontext.append(userMention);
    mentiontext.append(userTxt);
    mentiondatacontent.append(mentiondata);
    mentiondatacontent.append(mentiontext);
    mention.append(image);
    mention.append(mentiondatacontent);
    content.append(mention);
  }

  function interactionFilter(id) {
    const interactionId = "interactionsConfigId";
    const dimensionId = fields.dimID[0].id;
    const FILTER = dscc.InteractionType.FILTER;
    let interactionData = {
      "concepts": [dimensionId],
      "values": [[id + ""]]
    };
    //dscc.sendInteraction(interactionId, FILTER, interactionData);

    var componentId = dscc.getComponentId();
    var interactionMessage = {
      type: dscc.ToDSMessageType.INTERACTION,
      id: interactionId,
      data: interactionData,
      componentId: componentId,
    };
    console.log(interactionMessage);
    window.parent.postMessage(interactionMessage, '*');


  }

  /*function getDarkColor() {
    var allowed = "ABCDEF0123456789", S = "#";
    while(S.length < 7){
        S += allowed.charAt(Math.floor((Math.random()*100)+1));
    }
    return S;
  }*/

  var colors = ["#B927CB", "#524CE5", "#468434", "#8523C3", "#81CED6", "#4F8605", "#DBB401", "#E25744", "#22412D", "#4BD680", "#E2295B", "#464382", "#4B3410", "#4B3DBE", "#55DCF3", "#1C2BD9", "#96CD66", "#F353B0", "#0997C4", "#F203E8", "#434194", "#68B1F5", "#C83114", "#0BF5B6", "#680EEC", "#3CDE65", "#F11F18", "#356710", "#416DBB", "#F966F9", "#C9E792", "#6B7E21", "#37E70E", "#C5EE4C", "#DD182E", "#91F395", "#396977", "#888068", "#4F208F", "#77F54F", "#B203EE", "#F23930", "#E71183", "#D66987", "#647D75", "#98B371", "#B28756", "#57786F", "#D6645E", "#9229B0", "#536935", "#6024B4", "#53CBFB", "#BB8340", "#619059", "#5F5849", "#E1B875", "#8814BF", "#337F5F", "#177F22", "#30E323", "#929713", "#3F9181", "#2E6E94", "#0768C9", "#5876D4", "#CE8C06", "#852B7C", "#CFB559", "#6ED3C4", "#2CBBDE", "#9491C4", "#9D608B", "#42182B", "#562B73", "#710325", "#DE0FB1", "#EFFC11", "#C08567", "#27830D", "#B58CCB", "#CC353D", "#963D54", "#F139D1", "#EBF456", "#D38437", "#B3F30B", "#58E436", "#87EBFC", "#15F238", "#711E46", "#B00B1F", "#44545E", "#4027E1", "#8E2741", "#E318D6", "#93B028", "#80FE80", "#92E9C2", "#CD9158", "#C79DCB", "#BC4588", "#C2083F", "#F2FCC6", "#E98605", "#2004B6", "#E75DB5", "#D1886B", "#5CFE64", "#1F68C1", "#5FD2FB", "#5C34DC", "#32D7F2", "#24B277", "#98F989", "#47E26B", "#83CE35", "#6BCCBD", "#40C0C7", "#4D5F06", "#C6E209", "#75CF25", "#38C06F", "#C5E61C", "#31C71C", "#083709", "#B8F6E3", "#11B6F7", "#E781B5", "#296FE6", "#CC8548", "#C2942C", "#998F39", "#21C719", "#22D0E5", "#95414F", "#8D1F0F", "#7C758E", "#597C5B", "#60D1CE", "#BC8330", "#E5F0BC", "#DF0B6E", "#D50851", "#79C800", "#0DD754", "#C148EF", "#D92E3B", "#CF6533", "#D9661E", "#B39147", "#D920EF", "#D9658D", "#885853", "#245B54", "#D4360D", "#9F8910", "#CE5B28", "#4DD630", "#0723D2", "#0B6B7F", "#37E96C", "#13C6F8", "#709D07", "#5D14F9", "#E88968", "#219646", "#FDDF8E", "#C033FE", "#ED2523", "#0F68B7", "#E63747", "#5923B9", "#D39C97", "#BC4459", "#DD04BB", "#0B9D4E", "#E30780", "#5BDE26", "#E7D01F", "#BC7600", "#ECDB6B", "#18EE80", "#11F31C", "#8FC06C", "#04B4DE", "#BD0420", "#218DC5", "#0FD693", "#354FFB", "#CE7E36", "#0D95CE", "#99D21E", "#171EF3", "#B6FDBE", "#E695C0", "#0D1F21", "#261D92", "#965930", "#489C59", "#36E742"];
  /*for(var i=0;i<=200;i++){
    colors.push(getDarkColor());
  }*/

  //console.log("🚀 ~ file: index.js ~ line 121 ~ colors", JSON.stringify(colors))



  function showDialog(id) {
    var dialog = document.getElementById('dialog');
    dialog.style.display = "block";
  }

  function closeDialog() {
    var dialog = document.getElementById('dialog');
    dialog.style.display = "none";
  }

  let error;
  let colorGroups = {};


  let merge = {};

  yData.forEach((item) => {
    if (!item.font) {
      item.font = {}
    }
    item.font.strokeColor = "white";
    item.font.strokeWidth = 5;
    item.opacity = 0.1

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

  var data = { nodes: nodes, edges: edges, };
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
      let networkG = new visNetwork.Network(container, data, options);
      networkG.on('click', (params) => {

        let node = networkG.getNodeAt(params.pointer.DOM);
        if (node) {
          interactionFilter(node);
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


window.addEventListener("message", (event) => {
console.log("🚀 ~ file: index.js ~ line 277 ~ window.addEventListener ~ event", event)
  

  // ...
}, false);


https://datastudio.google.com/u/0/batchedDataV2?appVersion=20210616_00020056