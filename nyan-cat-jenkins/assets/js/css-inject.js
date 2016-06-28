function injectStyle() {
  var link = document.createElement("link");
  link.href = chrome.extension.getURL("/assets/css/nyan-jenkins.css");
  link.type = "text/css";
  link.rel = "stylesheet";

  document.getElementsByTagName("head")[0].appendChild(link);
}

function checkUrlAndApplyStyle() {
  chrome.storage.sync.get('jenkinsUrl', function(settings) {
    var jenkinsUrl = settings['jenkinsUrl'];
    if (jenkinsUrl == null) jenkinsUrl = "ci.";

    var currentUrl = window.location.href + "/";
    // '/' for good measure, eg. if url is 'a.com' but set url is 'a.com/'

    if (currentUrl.indexOf(jenkinsUrl) > -1) injectStyle();
  });
}

checkUrlAndApplyStyle();