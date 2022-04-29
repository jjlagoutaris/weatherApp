// basic info selectors
const locationName = document.querySelector('.locationName');
const temperature = document.querySelector('.temperature');
const tempSystemBtn = document.querySelector('.temperatureSystemBtn');
const date = document.querySelector('.date');
const weatherIcon = document.querySelector('.weatherIcon');
const weatherDescription = document.querySelector('.basicWeatherDescription');
const cityInput = document.getElementById('cityInput');
const errorMessage = document.querySelector('.error');

// misc info selectors
const searchBtn = document.getElementById('searchBtn');
const feelsLike = document.querySelector('.feelsLikeTemp');
const humidity = document.querySelector('.humidityPercentage');
const precipitation = document.querySelector('.precipitationPercentage');
const windSpeed = document.querySelector('.windSpeed');

// forecast selectors
const forecast = document.getElementById('forecast');
const forecastBtns = document.querySelector('.forecastHeader');
const dailyBtn = document.querySelector('.dailyBtn');
const hourlyBtn = document.querySelector('.hourlyBtn');
const dotDiv = document.querySelector('.dotDiv');
const dotBtn1 = document.querySelector('.btn1');

// global variables
let place = 'Framingham';
let unitSystem = 'imperial';
let unitTemp = '°F';
let unitSpeed = 'mph';
let forecastSetting = 'daily';
let activeDotBtn = 1;

// get geocoordinates and current weather data

async function getCurrentData() {

  // get coordinates
  let response1 = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=032f71daed3f927e8fcbd0d51217898c`, { mode: 'cors' });

  let response2;

  if (response1.status == '200') {
    let dataR1 = await response1.json();
    response2 = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${dataR1.coord.lat}&lon=${dataR1.coord.lon}&exclude=minutely&appid=032f71daed3f927e8fcbd0d51217898c&units=${unitSystem}`);
  } else if (response1.status == '404') {
    errorMessage.classList.add('visible');
  }

  if (response2.status == '200') {
    let data = await response2.json();
    temperature.textContent = `${Math.round(data.current.temp)} ${unitTemp}`;
    feelsLike.textContent = `${Math.round(data.current.feels_like)} ${unitTemp}`;
    windSpeed.textContent = `${Math.round(data.current.wind_speed)} ${unitSpeed}`;
    precipitation.textContent = `${data.current.weather[0].description.toUpperCase()}`;
    humidity.textContent = `${Math.round(data.current.humidity)}%`;
    locationName.textContent = place;
    date.textContent = `${convertDate(data.current.dt, data.timezone_offset, 0, 21)}`;
    weatherDescription.textContent = `${capitalize(data.current.weather[0].description)}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
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

// switch daily/hourly forecast

forecastBtns.addEventListener('click', (e) => {

  if(e.target.classList.contains('dailyBtn') && forecastSetting !== 'daily'){
     updateDot();
     forecastSetting = 'daily';
     e.target.classList.add('activeChoice');
     forecastBtns.children[1].classList.remove('activeChoice');
     updateData();
  } else if(e.target.classList.contains('hourlyBtn') && forecastSetting !== 'hourly'){
    updateDot();
    forecastSetting = 'hourly';
    e.target.classList.add('activeChoice');
    forecastBtns.children[0].classList.remove('activeChoice');
    updateData();
  }
});

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


// adds forecast to dom

function generateForecast(data) {

  let slotCount = 1;
  forecast.innerHTML = '';

  function generateDailyForecast(){

    hideDotDiv();

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

      let iconDiv = document.createElement('div');
      iconDiv.classList = `iconDiv slot${slotCount}`;

      let icon = document.createElement('img');
      icon.classList = `icon slot${slotCount}`;
      icon.src = `https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;

      let description = document.createElement('p');
      description.classList = `dayDescription slot${slotCount}`;
      description.textContent = `${data.daily[i].weather[0].description.toUpperCase()}`;
  
      pContainer.append(p1, p2);
      iconDiv.append(icon, description);
      dayContainer.append(h3, pContainer, iconDiv);
      forecast.append(dayContainer);
      slotCount++;
    }
  }

  function generateHourlyForecast(){

    makeDotDivVisible();

    function hourSwitching(startHr, endHr){
      for (let i = startHr; i < endHr; i++) {

        let hourContainer = document.createElement('div');
        hourContainer.classList = `hourContainer slot${slotCount}`;
  
        let h3 = document.createElement('h3');
        h3.classList = `hourHeader slot${slotCount}`;
        h3.textContent = `${convertDate(data.hourly[i].dt, data.timezone_offset, 16, 18)}`;
  
        let p1 = document.createElement('p');
        p1.classList = `hourTemp slot${slotCount}`;
        p1.textContent = `${Math.round(data.hourly[i].temp)} ${unitTemp}`;
  
        let iconDiv = document.createElement('div');
        iconDiv.classList = `iconDiv slot${slotCount}`;
  
        let icon = document.createElement('img');
        icon.classList = `icon slot${slotCount}`;
        icon.src = `https://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}@2x.png`;
        
        let description = document.createElement('p');
        description.classList = `hourDescription slot${slotCount}`;
        description.textContent = `${data.hourly[i].weather[0].description.toUpperCase()}`;
    
        iconDiv.append(icon, description);
        hourContainer.append(h3, p1, iconDiv);
        forecast.append(hourContainer);
        slotCount++;
      }
    }
    if(activeDotBtn == 1){
      hourSwitching(0, 8);
    } else if(activeDotBtn == 2){
      hourSwitching(8, 16);
    } else if(activeDotBtn == 3){
      hourSwitching(16, 24);
    } else{
      console.error('Error during hour switching.');
    }
    
  }

  if (forecastSetting == 'daily'){
    generateDailyForecast();
  } else{
    generateHourlyForecast();
  }
}


// switches which hour forecast is displayed & updates dot buttons accordingly

forecastBtns.addEventListener('click', (e) => {

  let target = e.target.classList;
  let divChildren = dotDiv.getElementsByTagName('*');

  if(target.contains('btn1') && activeDotBtn !== 1){
    clearActiveDot();
    target.add('activeDot');
    activeDotBtn = 1;
    updateData();
  }
  else if (target.contains('btn2') && activeDotBtn !== 2){
    clearActiveDot();
    target.add('activeDot');
    activeDotBtn = 2;
    updateData();
  } else if (target.contains('btn3') && activeDotBtn !== 3){
    clearActiveDot();
    target.add('activeDot');
    activeDotBtn = 3;
    updateData();
  } else if(target.contains('leftBtn')){
    if(activeDotBtn !== 1){
      clearActiveDot();
      activeDotBtn--;
      divChildren[activeDotBtn].classList.add('activeDot');
      updateData();
    } else{
      clearActiveDot();
      activeDotBtn = 3;
      divChildren[activeDotBtn].classList.add('activeDot');
      updateData();
    }
  } else if(target.contains('rightBtn')){
    if(activeDotBtn !== 3){
      clearActiveDot();
      activeDotBtn++;
      divChildren[activeDotBtn].classList.add('activeDot');
      updateData();
    } else{
      clearActiveDot();
      activeDotBtn = 1;
      divChildren[activeDotBtn].classList.add('activeDot');
      updateData();
    }
  }

});




// --------- helper / side functions --------------------




// set visible / hide for dot selector menu

function makeDotDivVisible(){
  if(dotDiv.classList.contains('invisibleDotDiv')){
    dotDiv.classList.remove('invisibleDotDiv');
  }
}

function hideDotDiv(){
  if(!dotDiv.classList.contains('invisibleDotDiv')){
    dotDiv.classList.add('invisibleDotDiv');
  }
}

// clear the activeDot - helper function

function clearActiveDot(){
  let dotDivChildren = dotDiv.getElementsByTagName('*');
  for(let i = 0; i < dotDivChildren.length; i++){
    if(dotDivChildren[i].classList.contains('activeDot')){
      dotDivChildren[i].classList.remove('activeDot');
    }
  }
}

// reset active dot to 1st slot

function updateDot(){
  clearActiveDot();
  dotBtn1.classList.add('activeDot');
  activeDotBtn = 1;
}


function capitalize(text){

  function capitalizeInput(input) {
    return `${input.substring(0, 1).toUpperCase()}${input.substring(1, input.length).toLowerCase()}`;
  }

  let words = text.split(" ");
  for(let i=0; i < words.length; i++){
    words[i] = capitalizeInput(words[i]);
  }
  let result = words.join(' ');
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

// simulates click of searchBtn if cityInput has 'enter' keyboard button pressed

cityInput.addEventListener('keypress', function(e){
  if(e.key === 'Enter'){
    searchBtn.click();
  }
});

// converts from unix time 

function convertDate(time, offset, startEl, endEl = 0){

  let unix_timestamp = time + offset + 14400;
  let date;

  if (endEl != 0){
    date = (new Date(unix_timestamp*1000)+'').slice(startEl,endEl);
  } else{
    date = (new Date(unix_timestamp*1000)+'').slice(startEl);
  }

  if(forecastSetting == 'daily'){
    return date;
  } else{
    if(date > 12){
      date = `${(date % 12)} PM`;
      return date;
    } else if(date == 12){
      date = `${date} PM`;
      return date;
    } else if (date == 00){
      date = `12 AM`;
      return date;
    } else{
      date = `${date} AM`;
      if(date[0] == '0'){
        return date.slice(1);
      }
      return date;
    }
  }
}



// run program




// calls the getCurrentData function so I don't have to keep copy & pasting it
const updateData = () => {
  getCurrentData().then((response) => {
    generateForecast(response);
  }).catch(err => {
    console.error(err);
  });
}

// IIFE to start program
(function runProgram() {
  updateData();
})();
