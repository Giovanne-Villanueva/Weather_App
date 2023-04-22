var formEl = document.querySelector("#search")
var inputEl = document.querySelector("#city")
var dayForecast = document.querySelector(".today")
var weekForecast = document.querySelector(".week")
var previousCity =  document.querySelector(".savedCity")

var APIkey = 'fb09fa06e857cf3dbf48e269aa3ed2e7'
var index=[];

var formHandler = function(event){
    event.preventDefault();
    var city = inputEl.value.trim();
    if(city){
        getWeather(city);
        inputEl.value = "";
        dayForecast.innerHTML = "";
        weekForecast.innerHTML = "";
    }
    else{
        alert("Error please put in a City name")
    }
}

function weatherIcon(heading, sky){
    var icon = document.createElement("i");
    if( sky === "Clear"){
        //make sun icon
    }
    else if( sky === "Clouds"){
        //make cloud icon
    }
    else if(sky === "Thunderstorm"){
        //make cloud with thunder bolt
    }
    else if( sky === "Rain"){
        //make cloud with rain icon
    }
    else if( sky === "Snow"){
        //make cloud with snowflaks icon
    }
    else{
        //make mist like cloud icon for ash, mist, smoke, etc ...
    }
    heading.appendChild(icon);
}

var dayDisplay = function(data, city){
    dayForecast.textContent="";

    var heading = document.createElement("h2");
    var date = data.dt_txt.split(' ');
    console.log("This is in the first one \n");
    console.log(data);
    console.log(date);
    heading.textContent=city + " " +dayjs(date[0]).format("MM/DD/YYYY");
    var sky= data.weather["0"].main;
    weatherIcon(heading, sky)
    var temp = document.createElement("p");
    temp.textContent = "Tempture: " + data.main.temp + String.fromCharCode(176)+"F";
    var wind = document.createElement("p");
    wind.textContent = "Wind: "+ data.wind.speed + "MPH";
    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: "+ data.main.humidity+"%";
    dayForecast.appendChild(heading);
    dayForecast.appendChild(temp);
    dayForecast.appendChild(wind);
    dayForecast.appendChild(humidity);
}

var weekDisplay = function(data){
    if(data.length === 0){
        return;
    }

    //
    console.log("This is in the second one \n")
    console.log(data);
    var check= 0;
    var firstday = data[0].dt_txt.split(' ')
    console.log(firstday[0])
    weekForecast.textContent="";
    for(var i=0; i<data.length; i++){
        if(!data[i].dt_txt.includes( (firstday[0]) ) ){
            firstday= data[i].dt_txt.split(' ')
            var day = document.createElement("div");
            day.setAttribute("class","day");

            var heading = document.createElement("h3");
            heading.textContent= dayjs(firstday[0]).format("MM/DD/YYYY");

            var sky= data[i].weather["0"].main;
            weatherIcon(heading, sky)

            var temp = document.createElement("p");
            temp.textContent = "Tempture: " + data[i].main.temp + String.fromCharCode(176)+"F";

            var wind = document.createElement("p");
            wind.textContent = "Wind: "+ data[i].wind.speed + "MPH";

            var humidity = document.createElement("p");
            humidity.textContent = "Humidity: "+ data[i].main.humidity+"%";

            day.appendChild(heading)
            day.appendChild(temp)
            day.appendChild(wind)
            day.appendChild(humidity)

            weekForecast.appendChild(day)
            check++;
            index.push(i);
        }
        if(check >= 5){
            break;
        }
    }
}

var saveCity = function(data, city){
    //
    var cityWeather= [];
    cityWeather.push(data[0]);
    for(var i=0; i <index.length; i++){
        cityWeather.push(data[index[i]]);
    }
    localStorage.setItem(city, JSON.stringify(cityWeather));
    var list= document.createElement("li");
    list.setAttribute("data-City", city);
    list.textContent= city;
    previousCity.appendChild(list);
}

var getWeather = function(city){
    var url = "https://api.openweathermap.org/data/2.5/forecast?q="+ city +"&appid=" + APIkey + "&units=imperial"
    fetch(url)
        .then( function(response){
            if(response.ok){
                response.json().then( function(data){
                    //console.log(data);
                    dayDisplay(data.list[0], city);
                    weekDisplay(data.list);
                    saveCity(data.list, city);
                })
            }
        })
        .catch( function(error){
            alert("Failed to get data from weather API")
        });

}

var reloadCity = function(event){
    var element = event.target;

    if(element.matches("li")){
        var city=  element.textContent               // future code element.getAttribute("data-City");
        console.log(city)
        var weather = JSON.parse( localStorage.getItem(city) );
        console.log(weather);
        if(weather !== null){
            dayDisplay(weather[0], city)
            weekDisplay(weather)
        }
    }
}


//formEl.addEventListener("submit", formHandler);
previousCity.addEventListener("click", reloadCity);