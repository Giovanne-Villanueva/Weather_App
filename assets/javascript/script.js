var formEl = document.querySelector("#search")
var inputEl = document.querySelector("#city")
var dayForecast = document.querySelector(".today")
var weekForecast = document.querySelector(".week")
var previousCity =  document.querySelector(".savedCity")

//Put your special API Key here in case this one does not work
var APIkey = '121ce69c3820f72e5b1832dd7dff06ad';

//Global variable used in helping keep track of certain data passed form the weather api
var index=[];

//Global variables used in helping keep track of the search history
var ulList = [];
var historyCount = 0;
var lastHistory = 0;

//This is the inital function to get users input and it clears previous data assuiming we get a valid input
var formHandler = function(event){
    event.preventDefault();
    var city = inputEl.value.trim();
    if(city){
        getWeather(city);
        index = [];
        inputEl.value = "";
        dayForecast.innerHTML = "";
        weekForecast.innerHTML = "";
    }
    else{
        alert("Error please put in a City name")
    }
}

//This function is picking an icon for the weather based on a keyword from the weather api and adding the icon to a heading element
function weatherIcon(heading, sky){
    //var icon = document.createElement("i");
    if( sky === "Clear"){
        //make sun icon
        heading.innerHTML= heading.innerHTML + "<i class='fa-solid fa-sun' style='color: #f77102;'></i>";
    }
    else if( sky === "Clouds"){
        //make cloud icon
        heading.innerHTML= heading.innerHTML + "<i class='fa-solid fa-cloud' style='color: #74777b;'></i>"
    }
    else if(sky === "Thunderstorm"){
        //make cloud with thunder bolt
        heading.innerHTML= heading.innerHTML + "<i class='fa-solid fa-cloud-bolt' style='color: #9da187;'></i>"
    }
    else if( sky === "Rain"){
        //make cloud with rain icon
        heading.innerHTML= heading.innerHTML + "<i class='fa-solid fa-cloud-rain' style='color: #728097;'></i>"
    }
    else if( sky === "Snow"){
        //make cloud with snowflaks icon
        heading.innerHTML= heading.innerHTML + "<i class='fa-solid fa-snowflake' style='color: #01225b;'></i>"
    }
    else{
        //make mist like cloud icon for ash, mist, smoke, etc ...
        heading.innerHTML= heading.innerHTML + "<i class='fa-solid fa-sun-haze' style='color: #6a6d71;'></i>"
    }
    //heading.appendChild(icon);
}

//here we are displaying the weather for today given the data from the weather api
var dayDisplay = function(data, city){
    dayForecast.textContent="";

    var heading = document.createElement("h2");
    var date = data.dt_txt.split(' ');
    console.log("This is in the first one \n");
    console.log(data);
    console.log(date);
    heading.textContent=city +":"+ " " +dayjs(date[0]).format("MM/DD/YYYY")+ " ";
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

//Here we are getting data retreived from the weather api and displaying the next 5 day weather forecasts
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
            heading.textContent= dayjs(firstday[0]).format("MM/DD/YYYY")+ " ";

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

//Here we are checking to see if the current searched item is new if not we do not need to display anything new. If it is a new searched item then we will display searched item
//We are limiting our previous search history to 10 results any more than that will be discarded the oldest search and replacing its spot with the new search
function cityHistory(city){
    if(localStorage.getItem(city.toLowerCase()) !== null ){
        localStorage.removeItem(city.toLowerCase());
        return;
    }
    if(historyCount < 10){
        var list= document.createElement("li");
        list.setAttribute("data-City", city.toLowerCase());
        list.textContent= city;
        ulList.push(list);
        previousCity.appendChild(list);
        historyCount++;
    }
    else{
        var list = ulList[lastHistory];
        var previous = list.textContent;
        localStorage.removeItem(previous.toLowerCase());
        list.setAttribute("data-City", city.toLowerCase());
        list.textContent= city;
        lastHistory++
        if(lastHistory >= 10){
            lastHistory=0;
        }
    }
}

//This function is saving users current search in local storage to see later and calling another function to display the searched item 
var saveCity = function(data, city){
    //
    var cityWeather= [];
    cityWeather.push(data[0]);
    for(var i=0; i <index.length; i++){
        cityWeather.push(data[index[i]]);
    }

    cityHistory(city);
    
    localStorage.setItem(city.toLowerCase(), JSON.stringify(cityWeather));
    
}

//This function is making an api call to the weather api and given that data we will call other functions to handel the data
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

//This function is loading a users previous search history result for users
var reloadCity = function(event){
    var element = event.target;

    if(element.matches("li")){
        var city=  element.textContent               // future code element.getAttribute("data-City");
        
        console.log(city)
        var weather = JSON.parse( localStorage.getItem(city.toLowerCase()) );
        console.log(weather);
        if(weather !== null){
            dayDisplay(weather[0], city)
            weekDisplay(weather)
        }
    }
}


formEl.addEventListener("submit", formHandler);
previousCity.addEventListener("click", reloadCity);