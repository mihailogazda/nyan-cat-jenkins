function chromeSettings() {
  return chrome.storage.sync
}

function definedValueOrDefault(value, defaultValue) {
  return typeof value !== 'undefined' ? value : defaultValue;
}

function disableElementAndChildren(element, disabled) {
  disabled = definedValueOrDefault(disabled, true);

  element.disabled = disabled;
  element.style.opacity = disabled ? 0.5 : 1.0;

  Array.from(element.children).forEach(function(child) {
    disableElementAndChildren(child, disabled);
  });

  if (element.id == 'disable-stars-toggle-container') {
    if (document.getElementById('settings-disable-background').checked) {
      Array.from(element.children).forEach(function(child) {
        disableElementAndChildren(child, true);
      });
    }
  }
}

function setExtensionEnabledListener() {
  var settingsEnabledCheckbox = document.getElementById('settings-enabled');

  settingsEnabledCheckbox.addEventListener('change', function() {
    chromeSettings().set({
      enabled: settingsEnabledCheckbox.checked
    });

    var extensionSettings = document.getElementById('extension-settings');
    disableElementAndChildren(extensionSettings, !settingsEnabledCheckbox.checked)
  });
}

function updateUrlRules() {
  var urlTypeCombobox = document.getElementById('settings-url-type');
  var urlTextEntries = Array.from(document.getElementsByClassName('settings-url-entry'));

  var urlArray = [];
  urlTextEntries.forEach(function(urlEntry) {
    urlArray.push(urlEntry.value);
  });

  chromeSettings().set({
    urlRules: {
      type: urlTypeCombobox.value,
      urls: urlArray
    }
  }, null);

  disableElementAndChildren(document.getElementById('settings-url-list'), urlTypeCombobox.value == 'any')
}

function setUrlRulesListeners() {
  document.getElementById('settings-url-type').addEventListener('change', updateUrlRules);
  Array.from(document.getElementsByClassName('settings-url-entry')).forEach(function(urlEntry) {
    urlEntry.addEventListener('change', updateUrlRules);
  });
}

function setBackgroundDisabledListener() {
  var backgroundDisabledCheckbox = document.getElementById('settings-disable-background');

  backgroundDisabledCheckbox.addEventListener('change', function() {
    chromeSettings().set({
      disableBackground: backgroundDisabledCheckbox.checked
    });

    disableElementAndChildren(document.getElementById('disable-stars-toggle-container'), backgroundDisabledCheckbox.checked);
  });
}

function setStarsDisabledListener() {
  var starsDisabledCheckbox = document.getElementById('settings-disable-stars');

  starsDisabledCheckbox.addEventListener('change', function() {
    chromeSettings().set({
      disableStars: starsDisabledCheckbox.checked
    });
  });
}

function setListeners() {
  setExtensionEnabledListener();
  setUrlRulesListeners();
  setBackgroundDisabledListener();
  setStarsDisabledListener();
}

function migrateJenkinsUrlToUrlRules(settings) {
  // Transform the single jenkinsUrl definition into a urlRules one for url matching (1.3.0 to 1.4.0)

  settings.urlRules = {
    type: 'include',
    urls: [
      settings.jenkinsUrl
    ]
  };

  chromeSettings().set({
    urlRules: settings.urlRules
  });
  chromeSettings().remove('jenkinsUrl');
}

function checkMigrations(settings) {
  if (settings.jenkinsUrl != null) migrateJenkinsUrlToUrlRules(settings);
}

function refillSettings(settings) {
  checkMigrations(settings);

  document.getElementById('settings-enabled').checked = definedValueOrDefault(settings.enabled, true);

  settings.urlRules = definedValueOrDefault(settings.urlRules, {});
  document.getElementById('settings-url-type').value = definedValueOrDefault(settings.urlRules.type, 'any');
  document.getElementById('settings-url-' + definedValueOrDefault(settings.urlRules.type, 'any')).selected = 'selected';

  if (definedValueOrDefault(settings.urlRules.type, 'any') == 'any') disableElementAndChildren(document.getElementById('settings-url-list'));

  // TODO url entrIES
  document.getElementsByClassName('settings-url-entry')[0].value = definedValueOrDefault(settings.urlRules.urls, [''])[0];

  document.getElementById('settings-disable-background').checked = definedValueOrDefault(settings.disableBackground, false);
  document.getElementById('settings-disable-stars').checked = definedValueOrDefault(settings.disableStars, false);
}

setListeners();
chromeSettings().get(refillSettings);