let count = 0;
const counterElement = document.getElementById("counter");
const incrementButton = document.getElementById("incrementButton");

// Dodajemy modale i przyciski zamykające modale
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
  // Sprawdź, czy 'hasClicked' istnieje w localStorage
  if (localStorage.getItem("hasClicked")) {
    // Jeśli istnieje, wyświetl modal "You did it! 😏"
    alreadyClickedModal.style.display = "block";
  } else {
    // Jeśli nie istnieje, zwiększ licznik i zapisz 'hasClicked' w localStorage
    count++;
    updateCounter();

    // Store the count value in localStorage
    localStorage.setItem("visitorCount", count);

    // Wyświetl modal "Thank you! 😁"
    modal.style.display = "block";

    // Wyłącz przycisk
    incrementButton.disabled = true;

    // Zapisz 'hasClicked' w localStorage
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
