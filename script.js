const heading = document.querySelector('.heading');
const locationInput = document.querySelector('.location-input');
const searchBtn = document.querySelector('.search-btn');

function getLocation() {
  return locationInput.value.trim();
}

async function getData(location) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=G8QR9JUEYEAHBZ7SFL5FARTF4`, { mode: 'cors' });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const locationData = await response.json();
    const { address, days, description, currentConditions } = locationData;

    const properties = { address, days, description, currentConditions };
    console.log(properties);
    return properties;


  } catch (error) {
    console.error('Something went wrong!', error);
  }
}

searchBtn.addEventListener('click', async () => {
  const location = getLocation();
  if (!location) return console.error('Enter city name');

  const properties = await getData(location);
  locationInput.value = '';
  locationInput.focus();

  heading.textContent = `Forecast in ${properties.address}: `;

  const forecastDiv = document.querySelector('.forecast');
  forecastDiv.innerHTML = '';

  const description = document.createElement('p');
  description.textContent = `${properties.description}`;
  forecastDiv.appendChild(description);

  const daysContainer = document.createElement('div');
  properties.days.slice(0, 7).forEach((day, index) => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayDiv = document.createElement('div');
    dayDiv.textContent = `${dayNames[index]} temperature: ${day.temp}F`;
    daysContainer.classList.add('days-container');
    daysContainer.appendChild(dayDiv);
  });

  forecastDiv.appendChild(daysContainer);

  if (properties.currentConditions.icon === 'cloudy') {
    heading.textContent = `Forecast in ${properties.address} ☁️`;
  }

});