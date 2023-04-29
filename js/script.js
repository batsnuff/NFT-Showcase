const slider = document.querySelector('.slider');
const slides = document.querySelector('.slides');
const slideImages = document.querySelectorAll('.slides img');
const arrowLeft = document.querySelector('.arrow.left');
const arrowRight = document.querySelector('.arrow.right');

let currentSlide = 0;
const slideWidth = slideImages[0].clientWidth;

// Set the initial position of the slides
slides.style.transform = `translateX(-${slideWidth * currentSlide}px)`;

arrowLeft.addEventListener('click', () => {
  if (currentSlide === 0) {
    currentSlide = slideImages.length - 1;
  } else {
    currentSlide--;
  }
  slides.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
});

arrowRight.addEventListener('click', () => {
  if (currentSlide === slideImages.length - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  slides.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
});
