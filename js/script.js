let count = 0;
const counterElement = document.getElementById("counter");
const incrementButton = document.getElementById("incrementButton");

// Add modals and modal close buttons
let modal = document.getElementById("myModal");
let alreadyClickedModal = document.getElementById("alreadyClickedModal");
let span = document.getElementsByClassName("close")[0];
let alreadyClickedSpan = document.getElementsByClassName(
  "alreadyClickedClose"
)[0];

function updateCounter() {
  counterElement.textContent = count;
}


// Check if the count value is already stored in localStorage
const storedCount = localStorage.getItem("visitorCount");

if (storedCount) {
  // If it's stored, use the stored value
  count = parseInt(storedCount);
} else {
  // If it's not stored, save the initial count value in localStorage
  localStorage.setItem("visitorCount", count);
}

// Update the counter value on the page
updateCounter();

function incrementCounter() {
  // Check if 'hasClicked' exists in localStorage
  if (localStorage.getItem("hasClicked")) {
    // If it exists, display the "You did it! 😏" modal
    alreadyClickedModal.style.display = "block";
  } else {
    // If it doesn't exist, increment the counter and display the modal
    count++;
    localStorage.setItem("hasClicked", true);
    localStorage.setItem("visitorCount", count); // Update the count value in localStorage
    updateCounter();
    modal.style.display = "block";
  }
}

// When the user clicks anywhere outside of the modals, close them
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == alreadyClickedModal) {
    alreadyClickedModal.style.display = "none";
  }
};

function closeModalsOnTouch() {
  let startX, startY;

  document.addEventListener('touchstart', function(e) {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
  });

  document.addEventListener('touchend', function(e) {
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let modal = document.getElementById("myModal");
    let alreadyClickedModal = document.getElementById("alreadyClickedModal");

    if (Math.abs(endX - startX) < 10 && Math.abs(endY - startY) < 10) {
      if (modal.style.display === "block") {
        modal.style.display = "none";
      }
      if (alreadyClickedModal.style.display === "block") {
        alreadyClickedModal.style.display = "none";
      }
    }
  });
}


incrementButton.addEventListener("click", incrementCounter);

function changeVideoSpeed(speed) {

  const videos = document.querySelectorAll('video');

  
  videos.forEach(video => {
    video.playbackRate = speed;
  });
}