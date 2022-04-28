const locationName = document.querySelector('.locationName');
const temperature = document.querySelector('.temperature');
const tempSystemBtn = document.querySelector('.temperatureSystemBtn');
const date = document.querySelector('.date');
const weatherIcon = document.querySelector('.weatherIcon');
const weatherDescription = document.querySelector('.basicWeatherDescription');
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
  } else if (response1.status == '404') {
    errorMessage.classList.add('visible');
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
    date.textContent = `${convertDate(data.current.dt, data.timezone_offset, 0, 21)}`;
    weatherDescription.textContent = `${capitalize(data.current.weather[0].description)}`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
    return data;
  } else if (response2.status == '404') {
    errorMessage.classList.add('visible');
  }

}

// switch unit systems

tempSystemBtn.addEventListener('click', function () {
  if (unitSystem == 'imperial') {
    tempSystemBtn.textContent = 'Imperial';
    unitSystem = 'metric';
    unitTemp = '°C';
    unitSpeed = 'km/h';
    updateData();
  }
  else {
    tempSystemBtn.textContent = 'Metric';
    unitSystem = 'imperial';
    unitTemp = '°F';
    unitSpeed = 'mph';
    updateData();
  }
});

function capitalize(text){

  function capitalizeInput(input) {
    return `${input.substring(0, 1).toUpperCase()}${input.substring(1, input.length).toLowerCase()}`;
  }

  let words = text.split(" ");
  for(let i=0; i < words.length; i++){
    words[i] = capitalizeInput(words[i]);
  }
  let result = words.join(' ');
  console.log(result);
  return result;
}



// filter out whitespace, commas, and add plus where necessary for successful url request

function getInput() {
  const input = capitalize(cityInput.value);

  if (input) {
    return input
      .replace(/(\s+$|^\s+)/g, '')
      // .replace(/(,\s+)/g, ',')
      .replace(/(\s+,)/g, ',')
  }
  return '';
}

// enter new location

searchBtn.addEventListener('click', function () {
  if (errorMessage.classList.contains('visible')) {
    errorMessage.classList.remove('visible');
  }

  let input = getInput();
  place = input;

  updateData();

  cityInput.value = '';
});

// simulates click of searchBtn if cityInput has 'enter' keyboard button pressed

cityInput.addEventListener('keypress', function(e){
  if(e.key === 'Enter'){
    searchBtn.click();
  }
});

// converts from unix time 

function convertDate(time, offset, startEl, endEl){

  let unix_timestamp = time + offset + 14400;
  let date = (new Date(unix_timestamp*1000)+'').slice(startEl,endEl);

  console.log(date);
  return date;
}

// adds forecast to dom

function generateForecast(data) {

  let slotCount = 1;

  function generateContent(){
    for (let i = 0; i < 7; i++) {
      let dayContainer = document.createElement('div');
      dayContainer.classList = `dayContainer slot${slotCount}`;
      let h3 = document.createElement('h3');
      h3.classList = `dayHeader slot${slotCount}`;
      h3.textContent = `${convertDate(data.daily[i].dt, data.timezone_offset, 0, 10)}`;
      let pContainer = document.createElement('div');
      pContainer.classList = `pContainer slot${slotCount}`;
      let p1 = document.createElement('p');
      p1.classList = `highTemp slot${slotCount}`;
      p1.textContent = `${Math.round(data.daily[i].temp.max)} ${unitTemp}`;
      let p2 = document.createElement('p');
      p2.classList = `lowTemp slot${slotCount}`;
      p2.textContent = `${Math.round(data.daily[i].temp.min)} ${unitTemp}`;
      let icon = document.createElement('img');
      icon.classList = `icon slot${slotCount}`;
      icon.src = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
      let description = document.createElement('p');
      description.classList = `dayDescription slot${slotCount}`;
      description.textContent = `${data.daily[i].weather[0].description.toUpperCase()}`;
  
      pContainer.append(p1, p2);
      dayContainer.append(h3, pContainer, icon, description);
      forecast.append(dayContainer);
      slotCount++;
    }
  }

  forecast.innerHTML = '';
  generateContent();
}

// calls the getCurrentData function so I don't have to keep copy & pasting it
const updateData = () => {
  getCurrentData().then((response) => {
    console.log("response: ", response);
    generateForecast(response);
  }).catch(err => {
    console.error(err);
  });
}

// IIFE to start program
(function runProgram() {
  updateData();
})();
