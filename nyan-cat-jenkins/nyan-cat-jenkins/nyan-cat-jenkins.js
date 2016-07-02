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

function checkUrlAndApplyStyle() {
  chrome.storage.sync.get(function(settings) {
    var jenkinsUrl = settings['jenkinsUrl'];
    var enabled = settings['enabled'];

    // '/' for good measure, eg. if url is 'a.com' but set url is 'a.com/'
    var urlMatch = (window.location.href + '/').indexOf(jenkinsUrl) > -1;
    var allMatcher = jenkinsUrl == null || jenkinsUrl == '';

    if (enabled != false && urlMatch) injectStyle(settings);
  });
}

if (isJenkinsSite()) {
  checkUrlAndApplyStyle();
}