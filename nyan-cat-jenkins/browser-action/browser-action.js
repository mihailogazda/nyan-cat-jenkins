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
  chrome.storage.sync.set(settings, null);
}

function fillSettings(settings) {
  if (settings.enabled != null) document.getElementById('settings-enabled').checked = settings.enabled;
  if (settings.jenkinsUrl != null) document.getElementById('settings-jenkins-url').value = settings.jenkinsUrl;
  if (settings.disableBackground != null) document.getElementById('settings-disable-background').checked = settings.disableBackground;

  if (settings.enabled == false) enableExtensionSettings(false);
}

function refillSettings(settings) {
  if (settings == null) {
    chrome.storage.sync.get(fillSettings);
  } else {
    fillSettings(settings);
  }
}

function setFormSubmissionListener() {
  document.getElementById('settings-form').addEventListener('submit', function(e) {
    e.preventDefault();

    var settings = {
      'enabled': document.getElementById('settings-enabled').checked,
      'jenkinsUrl': document.getElementById('settings-jenkins-url').value,
      'disableBackground': document.getElementById('settings-disable-background').checked
    };

    if (validateSettings(settings)) {
      updateSettings(settings);
      refillSettings();
    } else {
      refillSettings(settings);
    }
  }, false);
}

function enableExtensionSettings(enabled) {
  enabled = typeof enabled !== 'undefined' ? enabled : true;

  var form = document.getElementById('settings-form')
  var elements = form.elements;
  for (var i = 0, len = elements.length; i < len; ++i) {
    if (!(elements[i].id == 'settings-enabled') && !(elements[i].id == 'settings-form-submit')) elements[i].disabled = !enabled;
  }
}

function setEnabledListener() {
  var settingsEnabledCheckbox = document.getElementById('settings-enabled');
  settingsEnabledCheckbox.addEventListener('change', function(e) {
    if (settingsEnabledCheckbox.checked) {
      enableExtensionSettings();
    } else {
      enableExtensionSettings(false);
    }
  });
}

function setListeners() {
  setFormSubmissionListener();
  setEnabledListener();
}

setListeners();
refillSettings();