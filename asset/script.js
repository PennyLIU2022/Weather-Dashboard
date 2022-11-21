const locationEl=document.querySelector("#location");
const temperatureEl=c=document.querySelector("#temperature");
const windEl=document.querySelector("#wind");
const humidityEl=document.querySelector("#humidity");
const historyEl=document.querySelector("#history");
let searchHistory=localStorage.searchHistory?JSON.parse(localStorage.searchHistory):[];

//show result for last research
window.onload=fetchWwather(searchHistory[searchHistory.length-1]);

//display search history
function initialize(){
    historyEl.innerHTML='';
    searchHistory.forEach(function(item){
        historyEl.innerHTML += `<li class="list-group-item" onclick="fetchWwather('${item}')">${item}</li>` 
    })
}

//get city name
function getCityName(){
    let cityName = document.querySelector("#searchBox").value;
    return cityName;
}



// fetch weather information based on the input city name
async function fetchWwather(cityName){
    let APIWEATHER = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=c6f6f0d5ef4d5464dfe745e65c596599`;
    let APIFORCAST = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=c6f6f0d5ef4d5464dfe745e65c596599`;
    const weatherResult = await fetch(APIWEATHER).then((response)=>response.json());
    const forecastResult = await fetch(APIFORCAST).then((response)=>response.json());
    //Complete One Call url with returned results
    let apiOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherResult.coord.lat}&lon=${weatherResult.coord.lon}&appid=c6f6f0d5ef4d5464dfe745e65c596599`;
    const onecallResult = await fetch( apiOneCall ).then((response)=>response.json());
    // display weather information
    if(weatherResult){
        displayWeather(weatherResult, forecastResult, onecallResult);
    }else{
        document.querySelector("#DisplayWindow").innerHTML=`<h4>City not found, please try again.</h4>`;
    }
}

function displayWeather(currentdata, forecastdata){
    let currentdate=dayjs().format('MM/DD/YYYY');
    //display current weather conditions
    locationEl.innerHTML=`${currentdata.name}(${currentdate})<img src="http://openweathermap.org/img/wn/${currentdata.weather[0].icon}@2x.png">`;
    temperatureEl.textContent=`Temp: ${currentdata.main.temp} °F`;
    windEl.textContent=`Wind: ${currentdata.wind.speed} MPH`;
    humidityEl.textContent=`Humidity: ${currentdata.main.humidity} %`;
    //display forecast weather
    document.querySelector("#forecast").innerHTML='';
    forecastdata.list.forEach(displayForecast);
    //save searched city to local storage
    searchHistory.push(`${currentdata.name}`);
    localStorage.searchHistory=JSON.stringify(searchHistory);
    initialize();
}

function displayForecast(item,index){
    if(index %8 == 0 && index<40){
        let date=dayjs().add(index/8+1,'days').format('M/D/YYYY');
        document.querySelector("#forecast").innerHTML+=
        `<div class="card-body forecast">
          <h4>${date}</h4>
          <p class="icon"><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"></p>
          <p class="Temperature">Temp: ${item.main.temp} °F</p>
          <p class="Wind">Wind: ${item.wind.speed} MPH</p>
          <p class="Humidity">Humidity: ${item.main.humidity} %</p>
        </div>`
    }
}

function ClearHistory(){
    localStorage.clear();
    historyEl.innerHTML = '';
}

initialize();