// Variables globales
const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');
const searchBar = document.getElementById('searchBar');
let travelData = [];
// Coloca esto al inicio de tu archivo JavaScript
const cityTimeZones = {
    "Australia": "Australia/Sydney",
    "Japan": "Asia/Tokyo",
    "Brazil": "America/Sao_Paulo",
    "Sydney, Australia": "Australia/Sydney",
    "Melbourne, Australia": 'Australia/Melbourne',
    "Tokyo, Japan": "Asia/Tokyo",
    "Kyoto, Japan": "Asia/Tokyo",
    "Rio de Janeiro, Brazil": "America/Sao_Paulo",
    "São Paulo, Brazil": "America/Sao_Paulo",
    "Angkor Wat, Cambodia": "Asia/Phnom_Penh",
    "Taj Mahal, India": "Asia/Kolkata",
    "Bora Bora, French Polynesia": "Pacific/Tahiti",
    "Copacabana Beach, Brazil": "America/Sao_Paulo"
};

/**
 * Función para encontrar coincidencias de viajes (COUNTRIES, TEMPLES or BEACHES)
 */
function searchRecommendations() {
    const input = document.getElementById('searchBar').value.toLowerCase();
    const resultsContainer = document.getElementById('resultsContainer');

    // Limpiar resultados anteriores
    resultsContainer.innerHTML = '';
    travelData = [];

    // Ocultar resultados si la búsqueda está vacía
    if (!input) {
        resultsContainer.style.display = 'none';
        return;
    }

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            // Buscar por país específico
            const country = data.countries.find(item => item.name.toLowerCase() === input);
            if (country) {

                country.cities.forEach(city => {
                    travelData.push(city);
                });

                // Buscar por tipo de destino (beach, temple, country)
            } else if (input === "country" || input === "countries") {
               
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        travelData.push(city);
                    });
                    // travelData.push(country);
                });

            } else if (input === "temples" || input === "temple") {
               
                data.temples.forEach(temple => {
                    travelData.push(temple);
                });

            } else if (input === "beach" || input === "beaches") {
                    
                data.beaches.forEach(beach => {
                    travelData.push(beach);
                });

            }/*else {
                
                // Búsqueda general en ciudades
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(input)) {
                            travelData.push(city);
                        }
                    });
                });
            }*/

            // Mostrar resultados
            displayResults();

        })
        .catch(error => {
            console.error('Error:', error);
            showMessage("An error occurred while fetching data", "error");
        });
}

/**
 * Función para mostrar los resultados
 */
function displayResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    
    // Mostrar el contenedor
    resultsContainer.style.display = 'block';
    
    if (travelData.length === 0) {
        showMessage("No results found. Try keywords like 'Australia', 'beach', or 'temple'.", "info");
        return;
    }
    
    // Título de resultados
    const resultsTitle = document.createElement('h3');
    resultsTitle.textContent = `Search Results (${travelData.length})`;
    resultsTitle.style.marginBottom = '15px';
    resultsTitle.style.color = '#2c3e50';
    resultsTitle.style.borderBottom = '2px solid #3498db';
    resultsTitle.style.paddingBottom = '10px';
    resultsContainer.appendChild(resultsTitle);
    
    // Crear elementos para cada resultado
    travelData.forEach(item => {
        const resultCard = createResultCard(item);
        resultsContainer.appendChild(resultCard);
    });
}

/**
 * Función para crear una tarjeta de resultado
 */
function createResultCard(item) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    // Nombre del destino
    const name = document.createElement('h2');
    name.textContent = item.name;
    card.appendChild(name);
    
    // Imagen (usando URL real)
    const image = document.createElement('div');
    image.className = 'result-image';
    if (item.imageUrl && item.imageUrl !== 'enter_your_image_for_') {
        image.style.backgroundImage = `url('${item.imageUrl}')`;
        image.textContent = ''; // Limpiar texto si hay imagen
    } else {
        image.textContent = 'Image not available';
        image.style.display = 'flex';
        image.style.alignItems = 'center';
        image.style.justifyContent = 'center';
        image.style.background = 'linear-gradient(135deg, #3498db, #2c3e50)';
    }
    card.appendChild(image);
    
    // Descripción
    const description = document.createElement('p');
    description.textContent = item.description;
    card.appendChild(description);

    // Fecha y hora del destino
    const fechaHs = document.createElement('p');
    fechaHs.textContent = "Current time: " + getFechaHs(item.name);
    card.appendChild(fechaHs);
    console.log(fechaHs.textContent);
    
    
    // Botón "Visit"
    const visitButton = document.createElement('button');
    visitButton.className = 'visit-btn';
    visitButton.textContent = 'Visit';
    
    visitButton.addEventListener('click', () => {
        alert(`Planning your visit to ${item.name}!`);
    });
    
    card.appendChild(visitButton);
    
    return card;
}

/**
 * Función para obtener fecha y hora del destino
 */
function getFechaHs(cityName) {
    const timeZone = cityTimeZones[cityName];
    
    if (!timeZone) {
        return "Time not available";
    }
    
    const now = new Date();
    
    return now.toLocaleTimeString('en-US', {
        timeZone: timeZone,
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Función para mostrar mensajes
 */
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `result-message ${type === "error" ? "result-error" : "result-info"}`;
    messageDiv.textContent = message;
    
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.appendChild(messageDiv);
}

/**
 * Función para limpiar la búsqueda
 */
function clearSearch() {
    searchBar.value = '';
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'none';
    travelData = [];
}

/**
 * Cerrar resultados al hacer clic fuera
 */
document.addEventListener('click', function(event) {
    const resultsContainer = document.getElementById('resultsContainer');
    const isClickInsideSearch = searchBar.contains(event.target) || 
                               btnSearch.contains(event.target) ||
                               btnReset.contains(event.target);
    
    const isClickInsideResults = resultsContainer.contains(event.target);
    
    if (resultsContainer.style.display === 'block' && !isClickInsideSearch && !isClickInsideResults) {
        resultsContainer.style.display = 'none';
    }
});

// Event listeners
btnSearch.addEventListener('click', searchRecommendations);
btnReset.addEventListener('click', clearSearch);

// Buscar al presionar Enter
searchBar.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchRecommendations();
    }
});

// Mostrar resultados cuando la barra de búsqueda tiene foco
searchBar.addEventListener('focus', function() {
    const resultsContainer = document.getElementById('resultsContainer');
    if (travelData.length > 0) {
        resultsContainer.style.display = 'block';
    }
});