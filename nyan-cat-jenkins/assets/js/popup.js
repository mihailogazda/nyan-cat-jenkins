function validateSettings(settings) {
  if (settings.jenkinsUrl == '') {
    document.getElementById('settings-jenkins-url').style['border-bottom'] = '1px solid #cc0000';
    return false;
  } else {
    document.getElementById('settings-jenkins-url').style['border-bottom'] = '1px solid #88cc00';
  }

  return true;
}

function updateSettings(settings) {
  chrome.storage.sync.set({
    'jenkinsUrl': settings.jenkinsUrl
  }, null);
}

function fillSettings(settings) {
  if (settings.jenkinsUrl != null) document.getElementById('settings-jenkins-url').value = settings.jenkinsUrl;
}

function refillSettings(settings) {
  if (settings == null) {
    chrome.storage.sync.get(fillSettings);
  } else {
    fillSettings(settings);
  }
}

document.getElementById('settings-form').addEventListener('submit', function(e) {
  e.preventDefault();

  var settings = {
    'jenkinsUrl': document.getElementById('settings-jenkins-url').value
  };

  if (validateSettings(settings)) {
    updateSettings(settings);
    refillSettings();
  } else {
    refillSettings(settings);
  }
}, false);

refillSettings();