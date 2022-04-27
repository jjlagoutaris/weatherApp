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

// const dayContainer = document.querySelector
// const slotOneHeader = document.querySelector('h3.slotOne');
// const slotOneHighTemp = document.querySelector('highTemp.slotOne');
// const slotOneLowTemp = document.querySelector('lowTemp.slotOne');
// const slotOneImg = document.querySelector('img.slotOne');

let place = 'Framingham';
let unitSystem = 'imperial';

// get geocoordinates and current weather data

async function getCurrentData(){

  // get coordinates
  let response1 = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=032f71daed3f927e8fcbd0d51217898c`, { mode: 'cors'});

  let response2;

  if (response1.status == '200'){
    let dataR1 = await response1.json();
    response2 = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${dataR1.coord.lat}&lon=${dataR1.coord.lon}&exclude=minutely&appid=032f71daed3f927e8fcbd0d51217898c&units=${unitSystem}`);
  }

  if(response2.status == '200'){
    let data = await response2.json();
    console.log(data);
    if(unitSystem === 'imperial'){
      temperature.textContent = `${Math.round(data.current.temp)}°F`;
      feelsLike.textContent = `${Math.round(data.current.feels_like)}°F`;
      windSpeed.textContent = `${Math.round(data.current.wind_speed)}mph`;
    } else{
      temperature.textContent = `${Math.round(data.current.temp)}°C`;
      feelsLike.textContent = `${Math.round(data.current.feels_like)}°C`;
      windSpeed.textContent = `${Math.round(data.current.wind_speed)}km/h`;
    }
    humidity.textContent = `${Math.round(data.current.humidity)}%`;
    locationName.textContent = place;
    return data;
  } else if(response2.status == '404'){
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


// filter out whitespace, commas, and add plus where necessary for successful url request
function getInput(){
  const input = cityInput.value;

  if(input){
    return input
    .replace(/(\s+$|^\s+)/g, '')
    .replace(/(,\s+)/g, ',')
    .replace(/(\s+,)/g, ',')
  }
  return '';
}

function capitalizeInput(input){
  return `${input.substring(0, 1).toUpperCase()}${input.substring(1, input.length).toLowerCase()}`;
}


// enter new location

searchBtn.addEventListener('click', function (){
  if(errorMessage.classList.contains('visible')){
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


// generate forecast section

// function generateForecast(data){
//   let slotCount = 1;
//   for(let i = 0; i < 7; i++){
//     let dayContainer = document.createElement('div');
//     dayContainer.classList = `dayContainer ${slotCount}`;
//     let 
//   }
// }

// IIFE to start program
(function runProgram(){

  let data = getCurrentData().catch(err => {
    console.error(err);
  });

  console.log('hi');

})();
