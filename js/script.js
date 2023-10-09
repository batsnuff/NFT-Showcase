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

function incrementCounter() {
  // Check if 'hasClicked' exists in localStorage
  if (localStorage.getItem("hasClicked")) {
    // If it exists, display the "You did it! 😏" modal
    alreadyClickedModal.style.display = "block";
  } else {
    // If it doesn't exist, increment the counter and store 'hasClicked' in localStorage
    count++;
    updateCounter();

    // Store the count value in localStorage
    localStorage.setItem("visitorCount", count);

    // Display the "Thank you! 😁" modal
    modal.style.display = "block";

    // Disable the button
    incrementButton.disabled = true;

    // Store 'hasClicked' in localStorage
    localStorage.setItem("hasClicked", true);
  }
}

// When the user clicks on <span> (x), close the modals
span.onclick = function () {
  modal.style.display = "none";
};

alreadyClickedSpan.onclick = function () {
  alreadyClickedModal.style.display = "none";
};

// When the user clicks anywhere outside of the modals, close them
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == alreadyClickedModal) {
    alreadyClickedModal.style.display = "none";
  }
};

// Check if the count value is already stored in localStorage
if (localStorage.getItem("visitorCount")) {
  count = parseInt(localStorage.getItem("visitorCount"));
}

// Update the counter value on the page
updateCounter();

incrementButton.addEventListener("click", incrementCounter);
