const heading = document.querySelector('.heading');
const locationInput = document.querySelector('.location-input');
const searchBtn = document.querySelector('.search-btn');
const background = document.querySelector('.container');
const errorContainer = document.querySelector('.error-container');
const forecastDiv = document.querySelector('.forecast');
const switchContainer = document.querySelector('.switch-container');
const switchInput = document.getElementById('switch');
const loader = document.getElementById('loader');

background.removeChild(forecastDiv);
background.removeChild(errorContainer);
background.removeChild(switchContainer);

function getLocation() {
  return locationInput.value.trim();
}

async function getData(location) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=G8QR9JUEYEAHBZ7SFL5FARTF4`, { mode: 'cors' });
    errorContainer.textContent = '';
    switchContainer.style.display = 'flex';

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const locationData = await response.json();
    const { address, days, description, currentConditions } = locationData;

    const properties = { address, days, description, currentConditions };
    console.log(properties);
    return properties;


  } catch (error) {
    heading.textContent = `Something went wrong :/`
    errorContainer.textContent = `City ${locationInput.value} not found, please try again`;
    background.style.backgroundColor = 'white';
    switchContainer.style.display = 'none';
  }
}

searchBtn.addEventListener('click', async () => {
  background.insertBefore(forecastDiv, background.childNodes[3]);
  background.insertBefore(switchContainer, background.childNodes[4]);
  background.insertBefore(errorContainer, background.childNodes[2]);

  const location = getLocation();
  if (!location) return console.error('Enter city name');

  loader.style.display = 'block';
  forecastDiv.innerHTML = ''

  try {
    const properties = await getData(location);

    locationInput.value = '';
    locationInput.focus();

    const description = document.createElement('p');
    description.textContent = `${properties.description}`;
    forecastDiv.appendChild(description);

    switchContainer.innerHTML = `
  <div>
  <span class="icon">
  <img src="img/76706.png" alt="celcium to farenheit icon">
  </span>
  <p>Switch to Celcium</p>
  </div>
  <label for="switch" class="switch">
  <input type="checkbox" id="switch">
  <span class="slider"></span>
  </label>`

    const switchInput = document.getElementById('switch');

    const daysContainer = document.createElement('div');
    daysContainer.classList.add('days-container');

    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const dayDivs = properties.days.slice(0, 7).map((day, index) => {
      const dayDiv = document.createElement('div');
      dayDiv.textContent = `${dayNames[index]} temperature: ${day.temp}F`
      daysContainer.appendChild(dayDiv);
      return { dayDiv, day };
    });

    switchInput.addEventListener('change', () => {
      dayDivs.forEach(({ dayDiv, day }, index) => {
        if (switchInput.checked) {
          const celsiusTemp = ((day.temp - 32) * 5) / 9;
          dayDiv.textContent = `${dayNames[index]} temperature: ${celsiusTemp.toFixed(1)}°C`;
        } else {
          dayDiv.textContent = `${dayNames[index]} temperature: ${day.temp}°F`;
        }
      });
    });

    forecastDiv.appendChild(daysContainer);

    const icons = {
      'cloudy': '☁️',
      'partly-cloudy-day': '⛅',
      'partly-cloudy-night': '⛅',
      'snow': '❄️',
      'rain': '🌧️',
      'fog': '🌫️',
      'wind': '💨',
      'clear-day': '☀️',
      'clear-night': '☀️',
      'thunder-rain': '⛈️',
      'thunder-showers-day': '⛈️',
      'thunder-showers-night': '⛈️'
    };

    const icon = properties.currentConditions.icon;
    heading.textContent = `Forecast in ${(properties.address).charAt(0).toUpperCase() + properties.address.slice(1)} ${icons[icon] || ''}`;

    changeBackground(icon);
  } catch (error) {
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
});

function changeBackground(icon) {
  const backgroundColors = {
    'cloudy': 'gray',
    'partly-cloudy-day': 'lightgray',
    'partly-cloudy-night': 'lightgray',
    'snow': '#02aed4',
    'rain': 'gray',
    'fog': 'gray',
    'wind': 'gray',
    'clear-day': '#ffcc33',
    'clear-night': '#ffcc33',
    'thunder-rain': '#5d538f',
    'thunder-showers-day': '#5d538f',
    'thunder-showers-night': '#5d538f'
  };

  background.style.backgroundColor = backgroundColors[icon] || 'white';
}