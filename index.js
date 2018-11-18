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
  document.getElementById('importConversation').style = 'display: none';
  document.getElementById('selectConversation').style = 'display: none';
  document.getElementById('conHeader').style = 'display: none';
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
  document.getElementById('importMessage').style = 'display: none';
  document.getElementById('selectMessage').style = 'display: none';
  document.getElementById('mesHeader').style = 'display: none';
};

/**
 * Returns a dictionary mapping user_id to a list of their messages
 */
function mapUserToMessages() {
  members = conversation.members;
  result = {}
  
  messages.forEach(m => {
    if (result.hasOwnProperty(m.user_id)) {
      result[m.user_id].push(m);
    } else {
      result[m.user_id] = [m]
    }
  });

  return result;
}

/**
 * Returns dictionary mapping user_id to number of messages sent
 */
function countMessages() {
  members = conversation.members;
  result = {}
  
  messages.forEach(m => {
    if (result.hasOwnProperty(m.user_id)) {
      result[m.user_id]++;
    } else {
      result[m.user_id] = 1;
    }
  });

  return result;
}

/**
 * Returns dictionary mapping user_id to number of likes receieved
 */
function countLikes() {
  members = conversation.members;
  result = {}
  messages.forEach(m => {
    if (result.hasOwnProperty(m.user_id)) {
      result[m.user_id] += m.favorited_by.length;
    } else {
      result[m.user_id] = m.favorited_by.length;
    }
  })
  return result;
}