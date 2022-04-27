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

let place = 'Framingham';
let unitSystem = 'imperial';

// get location name -> convert to geocoordinates -> get data for geocoordinates

async function getCurrentData(){

  let response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=032f71daed3f927e8fcbd0d51217898c&units=${unitSystem}`, { mode: 'cors'});

  if(response.status == '200'){
    let data = await response.json();
    if(unitSystem === 'imperial'){
      temperature.textContent = `${Math.round(data.main.temp)}°F`;
      feelsLike.textContent = `${Math.round(data.main.feels_like)}°F`;
      windSpeed.textContent = `${Math.round(data.wind.speed)}mph`;
      console.log(data);
    } else{
      temperature.textContent = `${Math.round(data.main.temp)}°C`;
      feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
      windSpeed.textContent = `${Math.round(data.wind.speed)}km/h`;
      console.log(data);
    }

    if(!data.rain){
      precipitation.textContent = '0%';
    } else{
      precipitation.textContent = `${Math.round(data.rain["1h"]*100)}%`;
    }
    
    humidity.textContent = `${Math.round(data.main.humidity)}%`;
    locationName.textContent = place;
  } else if(response.status == '404'){
    errorMessage.classList.add('visible');
  }

}

// switch unit systems
tempSystemBtn.addEventListener('click', function(){
  if(unitSystem == 'imperial'){
    tempSystemBtn.textContent = 'Metric';
    unitSystem = 'metric';
    getCurrentData().catch(err => {
      console.error(err);
    });
  }
  else{
    tempSystemBtn.textContent = 'Imperial';
    unitSystem = 'imperial';
    getCurrentData().catch(err => {
      console.error(err);
    });
  }
});


// enter new location

searchBtn.addEventListener('click', function (){
  if(errorMessage.classList.contains('visible')){
    errorMessage.classList.remove('visible');
  }
  // IIFE to filter text and set place
  (function filterInput(){
    let commaIndex = cityInput.value.indexOf(',');
    let firstLetter = String(cityInput.value).slice(0, 1).toUpperCase();
    let remainder = String(cityInput.value).slice(1, commaIndex).toLowerCase();
    place = String(firstLetter + remainder);
  })();

  getCurrentData().catch(err => {
    console.error(err);
    errorMessage.classList.add('visible');
  });
  cityInput.value = '';
});


// START PROGRAM
getCurrentData().catch(err => {
  console.error(err);
});