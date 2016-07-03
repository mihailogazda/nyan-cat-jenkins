function isJenkinsSite() {
  // body should have id of 'jenkins'
  return !!document.getElementById('jenkins');
}

function injectStyle(settings) {
  var link = document.createElement('link');
  link.href = chrome.extension.getURL('nyan-cat-jenkins/nyan-cat-jenkins.css');
  link.type = 'text/css';
  link.rel = 'stylesheet';

  document.getElementsByTagName('head')[0].appendChild(link);

  addExtraStyles(settings);
  new MutationObserver(function() {
    addExtraStyles(settings);
  }).observe(document.getElementById('side-panel'), {
    childList: true,
    subtree: false
  });
}

function addExtraStyles(settings) {
  var progressBarsArray = Array.prototype.slice.call(document.getElementsByClassName('progress-bar'));

  if (settings['disableBackground']) {
    progressBarsArray.forEach(disableBackground);
  } else {
    progressBarsArray.forEach(addStars);
  }
}

function disableBackground(element) {
  element.classList.add('no-background');
}

function addStars(element) {
  var starContainer = document.createElement('div');
  starContainer.classList.add('star-container');

  var star = document.createElement('div');
  star.classList.add('star');
  starContainer.appendChild(star);
  randomlyMoveStar(star);

  element.parentNode.appendChild(starContainer);
}

function randomlyMoveStar(star) {
  star.style.visibility = 'visible';

  star.style.backgroundPositionY = Math.random() * 18 + 'px';
  star.style.backgroundPositionX = Math.random() * 150 + 100 + 'px';

  setTimeout(function () {
    star.style.visibility = 'hidden';
    randomlyMoveStar(star);
  }, 600);
}

function checkUrlMatch(url) {
  // '/' for good measure, eg. if url is 'a.com' but set url is 'a.com/'
  return (window.location.href + '/').indexOf(url) > -1;
}

function urlRulesMatch(urlRules) {
  if (urlRules) {
    if (urlRules.type == 'include') {
      return urlRules.urls.some(checkUrlMatch);
    } else if (urlRules.type == 'exclude') {
      return !urlRules.urls.some(checkUrlMatch);
    }
  }

  return true;  // By default, or by 'any'
}

function checkUrlAndApplyStyle() {
  chrome.storage.sync.get(function(settings) {
    var enabled = settings['enabled'];
    var urlRules = settings['urlRules'];

    if (enabled != false && urlRulesMatch(urlRules)) injectStyle(settings);
  });
}

if (isJenkinsSite()) {
  checkUrlAndApplyStyle();
}