let count = 0;
const counterElement = document.getElementById('counter');
const incrementButton = document.getElementById('incrementButton');

// Dodajemy modal i przycisk zamykający modal
let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];

function updateCounter() {
  counterElement.textContent = count;
}

function incrementCounter() {
  count++;
  updateCounter();
  
  // Store the count value in localStorage
  localStorage.setItem('visitorCount', count);
  
  // Wyświetl modal
  modal.style.display = "block";

  // Wyłącz przycisk
  incrementButton.disabled = true;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Check if the count value is already stored in localStorage
if (localStorage.getItem('visitorCount')) {
  count = parseInt(localStorage.getItem('visitorCount'));
}

// Update the counter value on the page
updateCounter();

incrementButton.addEventListener('click', incrementCounter);