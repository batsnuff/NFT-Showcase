let count = 0;
const counterElement = document.getElementById('counter');
const incrementButton = document.getElementById('incrementButton');
const thankYouMessage = document.getElementById('thankYouMessage'); // Dodaj element dla komunikatu

function updateCounter() {
  counterElement.textContent = count;
}

function incrementCounter() {
  if (count === 0) { // Sprawdź, czy licznik wynosi 0 (czyli użytkownik jeszcze nie kliknął)
    count++;
    updateCounter();
    
    // Store the count value in localStorage
    localStorage.setItem('visitorCount', count);
    
    // Wyświetl komunikat "Thank you! 😁"
    thankYouMessage.textContent = 'Thank you! 😁';
  }
}

incrementButton.addEventListener('click', incrementCounter);

// Check if the count value is already stored in localStorage
if (localStorage.getItem('visitorCount')) {
  count = parseInt(localStorage.getItem('visitorCount'));
}

// Update the counter value on the page
updateCounter();

// Sprawdź, czy użytkownik już kliknął, i wyświetl komunikat
if (count > 0) {
  thankYouMessage.textContent = 'Thank you! 😁';
}
