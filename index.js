var conversation;
var messages;
var conversationUploaded = false;
var messagesUploaded = false;

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

  conversationUploaded = true;
  
  console.log(conversationUploaded && messagesUploaded);

  if (conversationUploaded && messagesUploaded) {
    document.getElementById('LOADING').style = 'display: block';
    document.getElementById('helpText').style = 'display: none';
    setTimeout(() => setCharts(), 3000);
  }
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

  messagesUploaded = true;
  
  console.log(conversationUploaded && messagesUploaded);

  if (conversationUploaded && messagesUploaded) {
    document.getElementById('LOADING').style = 'display: block';
    
    document.getElementById('helpText').style = 'display: none';
    setTimeout(() => setCharts(), 3000);
  }
};

function idToAvatar(id) {
  for (const member of conversation.members) {
    if (member.user_id === id) {
      return member.image_url;
    }
  }

  return "avatar.jpeg";
}

function idToUser(id) {
  for (const member of conversation.members) {
    if (member.user_id === id) {
      return member.name;
    }
  }

  return "User not found";
}

function setCharts() {
  document.getElementById('chartSection').style = 'display: block';
  // we need to process data here
  document.getElementById('LOADING').style = 'display: none';
  addMissingMembers();
  const likesReceived = countLikesReceived();
  const max = Object.keys(likesReceived).reduce((a, b) => likesReceived[a] > likesReceived[b] ? a : b);
  const mostLikedName = idToUser(max);

  const groupName = conversation.name;
  document.getElementById('groupNameLabel').textContent = ' - ' + groupName;

  document.getElementById('likesLabel').textContent = mostLikedName;
  document.getElementById('likesAvatar').src = idToAvatar(max);

  var props = Object.keys(likesReceived).map((key) => {
    return { key: key, value: likesReceived[key] };
  }, likesReceived);
  props.sort(function(p1, p2) { return p2.value - p1.value; });
  var top5 = props.slice(0, 5);
  console.log(top5);

  var top5obj = top5.reduce(function(obj, prop) {
    obj[prop.key] = prop.value;
    return obj;
  }, {});
  // const top5 = likesReceived.slice(0, 5);
  var ctx = document.getElementById("likesChart").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: Object.keys(top5obj).map(s => idToUser(s)),
          datasets: [{
              label: 'Total Likes',
              data: Object.values(top5obj),
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });

  const mentionCounts = timesMentioned();
  const mostMentionedID = mostMentioned();
  document.getElementById('mentionsLabel').textContent = idToUser(mostMentionedID);
  document.getElementById('mentionsCount').textContent = mentionCounts[mostMentionedID];

  const messageCounts = countMessages();
  const mostMessagesID = mostMessages();

  document.getElementById('msgLabel').textContent = idToUser(mostMessagesID);
  document.getElementById('msgAvatar').src = idToAvatar(mostMessagesID);

  props = Object.keys(messageCounts).map((key) => {
    return { key: key, value: messageCounts[key] };
  }, messageCounts);
  props.sort(function(p1, p2) { return p2.value - p1.value; });
  top5 = props.slice(0, 5);

  top5obj = top5.reduce(function(obj, prop) {
    obj[prop.key] = prop.value;
    return obj;
  }, {});

  ctx = document.getElementById("msgChart").getContext('2d');
  myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: Object.keys(top5obj).map(s => idToUser(s)),
          datasets: [{
              label: 'Total Messages',
              data: Object.values(top5obj),
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });


  ctx = document.getElementById("weekChart").getContext('2d');
  myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          datasets: [{
              label: 'Messages',
              data: messagesPerDay(),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });


  ctx = document.getElementById("hourChart").getContext('2d');
  myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: ['Midnight','','','3 AM','','','6 AM','','','9 AM','','','Noon','','','3 PM','','','6 PM','','','9 PM','',''],
          datasets: [{
              label: 'Messages',
              data: messagesPerHour(),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });

}

function addMissingMembers() {
  let members = conversation.members.map(m => m.user_id);
  messages.forEach(m => {
    if (!members.includes(m.user_id) && m.user_id !== 'system') {
      conversation.members.push({ 'user_id': m.user_id, 'name': m.name });
      members.push(m.user_id);
    }
  });
}

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
    if (m.user_id !== 'system') {
      if (result.hasOwnProperty(m.user_id)) {
        result[m.user_id]++;
      } else {
        result[m.user_id] = 1;
      }
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

function mostMessages() {
  const received = countMessages();
  return Object.keys(received).reduce((a, b) => received[a] > received[b] ? a : b);
}

function timesMentioned() {
  let result = {};
  messages.forEach(m => {
    for (const att of m.attachments) {
      if (att.type === "mentions") {
        for (const mention of att.user_ids) {
          if (result.hasOwnProperty(mention)) {
            result[mention]++;
          } else {
            result[mention] = 1;
          }
        }
      }
    }
  });
  return result;
}

function mostMentioned() { 
  const mentioned = timesMentioned();
  return Object.keys(mentioned).reduce((a, b) => mentioned[a] > mentioned[b] ? a : b);
}

function messagesPerDay() {
  result = [0, 0, 0, 0, 0, 0, 0]
  messages.forEach(m => {
    let d = new Date(parseInt(m.created_at) * 1000);
    result[d.getDay()]++;
  });

  return result;
}

function messagesPerHour() {
  result = [];
  for (let i = 0; i < 24; i++) {
    result.push(0);
  }
  messages.forEach(m => {
    let d = new Date(parseInt(m.created_at) * 1000);
    result[d.getHours()]++;
  });

  return result;
}
