let count = 0;
const counterElement = document.getElementById('counter');
const incrementButton = document.getElementById('incrementButton');

function updateCounter() {
  counterElement.textContent = count;
}

function incrementCounter() {
  count++;
  updateCounter();
  
  // Store the count value in localStorage
  localStorage.setItem('visitorCount', count);
}

incrementButton.addEventListener('click', incrementCounter);

// Check if the count value is already stored in localStorage
if (localStorage.getItem('visitorCount')) {
  count = parseInt(localStorage.getItem('visitorCount'));
}

// Update the counter value on the page
updateCounter();
