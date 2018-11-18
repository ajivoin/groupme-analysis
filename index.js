var conversation;
var messages;

document.getElementById('importConversation').onclick = function() {
  var files = document.getElementById('selectConversation').files;
  console.log(files);
  if (files.length <= 0) {
    return false;
  }

  var fr = new FileReader();

  fr.onload = function(e) { 
    console.log(e);
    conversation = JSON.parse(e.target.result);
  }

  fr.readAsText(files.item(0));
};

document.getElementById('importMessage').onclick = function() {
  var files = document.getElementById('selectMessage').files;
  console.log(files);
  if (files.length <= 0) {
    return false;
  }

  var fr = new FileReader();

  fr.onload = function(e) { 
    console.log(e);
    messages = JSON.parse(e.target.result);
  }

  fr.readAsText(files.item(0));
};

function mostMessages() {
  members = conversation.members;
  
}