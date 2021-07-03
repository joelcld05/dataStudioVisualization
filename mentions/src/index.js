const dscc = require('@google/dscc');
const local = require('./localMessage.js');

// write viz code here
const drawVizMentions = (data) => {
  
  var mentions = {mentions:[]};
  var strx = data.tables.DEFAULT[1].metricID3[0];

  if (strx !==""){
    mentions = JSON.parse(strx);
  }

  let dia = document.getElementById("dialog");
  if(dia){
    dia.remove()
  }
  
  var dialogHeader = document.createElement('div');
  var dialog = document.createElement('div');
  var title = document.createElement('div');
  //var close = document.createElement('div');
  var content = document.createElement('div');
  //var loader = document.createElement('div');
  content.innerHTML="";
  function createDialod() {
    dialog.id = "dialog";
    dialogHeader.id = "dialogHeader";
    content.id = "dialogContent";
    title.id = "titleHeader";
    title.textContent = "Menciones";
    //close.addEventListener("click", closeDialog);
    //close.textContent = "X"
    //close.id = "closebtn";
    dialogHeader.append(title);
    //dialogHeader.append(close);

    //loader.className = "loader";
    //content.append(loader);
    mentions.mentions.forEach((data)=>{      
      createMention(data);
    });

    dialog.append(dialogHeader);
    dialog.append(content);
    document.body.prepend(dialog);
  }

  function createMention(data) {
    var mention = document.createElement('div');
    mention.className = "mentionBox";
    var mentiondatacontent = document.createElement('div');
    mentiondatacontent.className = "mentionContentBox";
    var image = document.createElement('div');
    image.className = "imageMentionBox";
    
    /*var imagetag = document.createElement('img');
    imagetag.className = "imagenUsuario";
    imagetag.src = data.authorAvatar;
    image.append(imagetag);*/

    var mentiondata = document.createElement('div');
    mentiondata.className = "mentionData";
    var mentiontext = document.createElement('div');
    mentiontext.className = "metiontext";


    var mentionFooterText = document.createElement('div');
    mentionFooterText.className = "metionFooterText";
    var date = document.createElement('span');
    date.className="date bold float";
    date.textContent=data.date;
    mentionFooterText.append(date);

    data.terms.forEach((t)=>{
      var term = document.createElement('span');
      term.className="term bold float";
      term.textContent=t.name;
      mentionFooterText.append(term);
    });

    var userMention = document.createElement('p');
    var userName = document.createElement('span');
    userName.textContent='@'+data.author;
    var nameDisplay = document.createElement('span');
    nameDisplay.className = "bold";
    nameDisplay.textContent = data.authorDisplayName + " ";

    if (data.mediaType !== 35){
      userMention.append(nameDisplay);    
      userMention.append(userName);    
    }else{
      nameDisplay.textContent = "Instagram";
      userMention.append(nameDisplay);   
    }

    var userTxt = document.createElement('p');
    userTxt.className = "mentionDescription";
    userTxt.innerHTML = data.description;

    mentiontext.append(userMention);
    mentiontext.append(userTxt);
    mentiontext.append(mentionFooterText);
    mentiondatacontent.append(mentiondata);
    mentiondatacontent.append(mentiontext);
    // mention.append(image);
    mention.append(mentiondatacontent);
    content.append(mention);
  }

  function closeDialog() {
    // var dialog = document.getElementById('dialog');
    // dialog.style.display = "none";
  }

  createDialod();
  var anchors = content.getElementsByTagName("a");
  for (var i = 0; i < anchors.length; i++) {
      anchors[i].onclick = function() {return false;};
  }
};

// renders locally
const isLocal = false;
if (isLocal) {
  drawVizMentions(local.message);
} else {
  dscc.subscribeToData(drawVizMentions, { transform: dscc.objectTransform });
}
