const locationName = document.querySelector('.locationName');
const temperature = document.querySelector('.temperature');
const tempSystemBtn = document.querySelector('.temperatureSystemBtn');
const date = document.querySelector('.date');
const weatherIcon = document.querySelector('.weatherIcon');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const feelsLike = document.querySelector('.feelsLikeTemp');
const humidity = document.querySelector('.humidityPercentage');
const precipitation = document.querySelector('.precipitationPercentage');
const windSpeed = document.querySelector('.windSpeed');
const errorMessage = document.querySelector('.error');
const forecast = document.getElementById('forecast');

let place = 'Framingham';
let unitSystem = 'imperial';
let unitTemp = '°F';
let unitSpeed = 'mph';

// get geocoordinates and current weather data

async function getCurrentData() {

  // get coordinates
  let response1 = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=032f71daed3f927e8fcbd0d51217898c`, { mode: 'cors' });

  let response2;

  if (response1.status == '200') {
    let dataR1 = await response1.json();
    response2 = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${dataR1.coord.lat}&lon=${dataR1.coord.lon}&exclude=minutely&appid=032f71daed3f927e8fcbd0d51217898c&units=${unitSystem}`);
  }

  if (response2.status == '200') {
    let data = await response2.json();
    console.log(data);
    temperature.textContent = `${Math.round(data.current.temp)} ${unitTemp}`;
    feelsLike.textContent = `${Math.round(data.current.feels_like)} ${unitTemp}`;
    windSpeed.textContent = `${Math.round(data.current.wind_speed)} ${unitSpeed}`;
    precipitation.textContent = `${data.current.weather[0].description.toUpperCase()}`;
    humidity.textContent = `${Math.round(data.current.humidity)}%`;
    locationName.textContent = place;
    date.textContent = `${convertDate(data.current.dt, 0, 24)}`;
    return data;
  } else if (response2.status == '404') {
    errorMessage.classList.add('visible');
  }

}

// switch unit systems
tempSystemBtn.addEventListener('click', function () {
  if (unitSystem == 'imperial') {
    tempSystemBtn.textContent = 'Metric';
    unitSystem = 'metric';
    unitTemp = '°C';
    unitSpeed = 'km/h';
    getCurrentData().catch(err => {
      console.error(err);
    });
  }
  else {
    tempSystemBtn.textContent = 'Imperial';
    unitSystem = 'imperial';
    unitTemp = '°F';
    unitSpeed = 'mph';
    getCurrentData().catch(err => {
      console.error(err);
    });
  }
});


// filter out whitespace, commas, and add plus where necessary for successful url request
function getInput() {
  const input = cityInput.value;

  if (input) {
    return input
      .replace(/(\s+$|^\s+)/g, '')
      .replace(/(,\s+)/g, ',')
      .replace(/(\s+,)/g, ',')
  }
  return '';
}

function capitalizeInput(input) {
  return `${input.substring(0, 1).toUpperCase()}${input.substring(1, input.length).toLowerCase()}`;
}


// enter new location

searchBtn.addEventListener('click', function () {
  if (errorMessage.classList.contains('visible')) {
    errorMessage.classList.remove('visible');
  }

  let input = getInput();
  place = capitalizeInput(input);

  getCurrentData().catch(err => {
    console.error(err);
    errorMessage.classList.add('visible');
  });
  cityInput.value = '';
});

// set icons
// http://openweathermap.org/img/wn/10d@2x.png

function convertDate(time, startEl, endEl){

  let unix_timestamp = time;
  let date = (new Date(unix_timestamp*1000)+'').slice(startEl,endEl);

  console.log(date);
  return date;
}


// generate forecast section

function generateForecast(data) {

  let slotCount = 1;

  for (let i = 0; i < 7; i++) {
    let dayContainer = document.createElement('div');
    dayContainer.classList = `dayContainer ${slotCount}`;
    let h3 = document.createElement('h3');
    h3.classList = `dayHeader ${slotCount}`;
    h3.textContent = `${convertDate(data.daily[i].dt, 0, 10)}`;
    let p1 = document.createElement('p');
    p1.classList = `highTemp ${slotCount}`;
    p1.textContent = `${Math.round(data.daily[i].temp.max)} ${unitTemp}`;
    let p2 = document.createElement('p');
    p2.classList = `lowTemp ${slotCount}`;
    p2.textContent = `${Math.round(data.daily[i].temp.min)} ${unitTemp}`;
    let icon = document.createElement('img');
    icon.classList = `icon ${slotCount}`;
    icon.src = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
    let description = document.createElement('p');
    description.classList = `dayDescription ${slotCount}`;
    description.textContent = `${data.daily[i].weather[0].description.toUpperCase()}`;

    dayContainer.append(h3);
    dayContainer.append(p1);
    dayContainer.append(p2);
    dayContainer.append(icon);
    dayContainer.append(description);
    forecast.append(dayContainer);
  }
}

// IIFE to start program
(function runProgram() {

  getCurrentData().then((response) => {
    console.log("response: ", response);
    generateForecast(response);
  }).catch(err => {
    console.error(err);
  });

})();
