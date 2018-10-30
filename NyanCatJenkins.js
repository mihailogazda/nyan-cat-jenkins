function letsAddStars()
{
	var progressBarsArray = Array.prototype.slice.call(document.getElementsByClassName('progress-bar'));
	progressBarsArray.forEach(addStars);
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

letsAddStars();
