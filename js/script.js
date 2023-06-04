// Pobierz elementy
const counterElement = document.getElementById('counter');
const incrementButton = document.getElementById('incrementButton');

// Ustaw początkową wartość licznika
let count = 0;

// Funkcja do aktualizacji licznika
function updateCounter() {
  counterElement.textContent = count;
}

// Funkcja do zwiększania licznika
function incrementCounter() {
  count++;
  updateCounter();
}

// Przypisz funkcję do obsługi kliknięcia przycisku
incrementButton.addEventListener('click', incrementCounter);

// Zaktualizuj licznik na starcie
updateCounter();

