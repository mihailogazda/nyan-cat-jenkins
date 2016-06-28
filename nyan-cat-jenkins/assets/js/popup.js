function validateSettings(settings) {
  return true;
}

function updateSettings(settings) {
  chrome.storage.sync.set({
    'jenkinsUrl': settings.jenkinsUrl
  }, null);
}

function fillSettings() {
  chrome.storage.sync.get(function(settings) {
    console.log(settings);

    if (settings.jenkinsUrl != null) document.getElementById("settings-jenkins-url").value = settings.jenkinsUrl;
  });
}

document.getElementById("settings-form").addEventListener("submit", function() {
  var settings = {
    "jenkinsUrl": document.getElementById("settings-jenkins-url").value
  };

  if (validateSettings(settings)) {
    updateSettings(settings);
    fillSettings();
    //TODO Something flashy to say yay!
  }
}, false);

fillSettings();