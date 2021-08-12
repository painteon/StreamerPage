let startingValue = 1;

function prev (n) {
  slideShift(n);
}

function next (n) {
  slideShift(n);
}

function slideShift(n) {
  let slide = document.getElementsByClassName("dog");

  let slideIndex = startingValue += n;

  if (slideIndex === 0) {startingValue = 1}
  else if (slideIndex > slide.length) {startingValue = 3}

  if (!(slideIndex === 0) && !(slideIndex > slide.length) ){
    for (i = 0; i < slide.length; i++) {
      slide[i].style.display = "none";
      }
    slide[slideIndex - 1].style.display = "inherit";
  }

}
