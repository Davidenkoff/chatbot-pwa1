const button = document.getElementById('start-button');
const resultsDiv = document.getElementById('results');

button.addEventListener('click', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    resultsDiv.innerHTML = "<p style='color:red;'>❌ Вашето устройство/браузър не поддържа гласово разпознаване.</p>";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'bg-BG';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.start();

  recognition.onstart = () => {
    resultsDiv.innerHTML = "<p>🎤 Слушам… говорете!</p>";
  };

  recognition.onerror = (event) => {
    resultsDiv.innerHTML = `<p style="color:red;">⚠️ Грешка: ${event.error}</p>`;
  };

  recognition.onresult = async (event) => {
    const query = event.results[0][0].transcript;
    resultsDiv.innerHTML = '<p>🔎 Търсене на: <strong>' + query + '</strong>...</p>';
    try {
      const response = await fetch('https://tshirton.bg/api/catalog/products?term=' + encodeURIComponent(query), {
        headers: {
          'Authorization': 'Token M5ZB5HR9O0IMYZEY2A6HCYPGJLNNGVW1UJKO54AMLE5RWWMEAV8WMUSGMTROGOWO'
        }
      });
      const data = await response.json();
      resultsDiv.innerHTML = '';
      data.products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `<a href="${product.url}" target="_blank">
          <img src="${product.image}" alt="${product.name}" />
          <p>${product.name}</p>
        </a>`;
        resultsDiv.appendChild(div);
      });
    } catch (error) {
      resultsDiv.innerHTML = "<p style='color:red;'>❌ Грешка при търсенето: " + error.message + "</p>";
    }
  };
});