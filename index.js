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
  let result = {};
  
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
  let result = {};
  
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
function countLikesReceived() {
  let result = {};
  messages.forEach(m => {
    if (result.hasOwnProperty(m.user_id)) {
      result[m.user_id] += m.favorited_by.length;
    } else {
      result[m.user_id] = m.favorited_by.length;
    }
  });
  return result;
}

function countLikesGiven() {
  members = conversation.members;
  let result = {};
  messages.forEach(m => {
    m.favorited_by.forEach(uid => {
      if (result.hasOwnProperty(uid)) {
        result[uid]++;
      } else {
        result[uid] = 1;
      }
    });
  });
  return result;
}

/**
 * Returns average likes per message for each active member
 */
function likesPerMessage() {
  let result = {};
  const received = countLikesReceived();
  const messages = countMessages();
  
  for (const member of conversation.members) {
    let uid = member.user_id;
    result[uid] = received[uid] / messages[uid];
  }

  return result;
}

function mostLikedPerson() {
  const received = countLikesReceived();
  return Object.keys(received).reduce((a, b) => received[a] > received[b] ? a : b);
}