const locationEl=document.querySelector("#location");
const temperatureEl=c=document.querySelector("#temperature");
const windEl=document.querySelector("#wind");
const humidityEl=document.querySelector("#humidity");
const historyEl=document.querySelector("#history");
let searchHistory=localStorage.searchHistory?JSON.parse(localStorage.searchHistory):[];

//show result for last research
// window.onload=getapi(searchHistory[searchHistory.length-1]);

//display search history
function initialize(){
    historyEl.innerHTML='';
    searchHistory.forEach(function(item){
        historyEl.innerHTML += `<li class="list-group-item" onclick="fetchWwather('${item}')">${item}</li>` 
    })
}

// //get city name
// function getCityName(){
//     let cityName = document.querySelector("#searchBox").value;
//     return cityName;
// }

$('.submitbutton').click(function(){
    var cityName = $(this).siblings('#searchBox').val();
    console.log(cityName);
    var APIWEATHER = "https://api.openweathermap.org/data/2.5/weather?q" + cityName + "&appid=36c3a4ae85c25a7c383c49b315b441a8";
    var APIFORCAST = "https://api.openweathermap.org/data/2.5/forecast?q" + cityName + "&appid=36c3a4ae85c25a7c383c49b315b441a8";
    fetch(APIWEATHER)
    .then(res=>res.json()).then(data=>{
        console.log(data)
        displayWeather(data);
    });

    fetch(APIFORCAST)
    .then(res=>res.json()).then(data=>{
        console.log(data)
        displayForecast(data);
    });

    }
    )

// fetch weather information based on the input city name
// async function fetchWwather(cityName){
//     let APIWEATHER = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=36c3a4ae85c25a7c383c49b315b441a88`;
//     let APIFORCAST = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=36c3a4ae85c25a7c383c49b315b441a8`;
//     const weatherResult = await fetch(APIWEATHER).then((response)=>response.json());
//     const forecastResult = await fetch(APIFORCAST).then((response)=>response.json());
//     //Complete One Call url with returned results
//     // let apiOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherResult.coord.lat}&lon=${weatherResult.coord.lon}&appid=36c3a4ae85c25a7c383c49b315b441a8`;
//     // const onecallResult = await fetch( apiOneCall ).then((response)=>response.json());
//     // display weather information
//     if(weatherResult){
//         displayWeather(weatherResult, forecastResult);
//     }else{
//         document.querySelector("#DisplayWindow").innerHTML=`<h4>City not found, please try again.</h4>`;
//     }
// }

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
