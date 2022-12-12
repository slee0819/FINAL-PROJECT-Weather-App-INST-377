const cover = document.querySelector(".cover"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = cover.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = cover.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Please switch browser to support geolocation");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=764fbbd7a27293806d04e4e543acf0ba`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=764fbbd7a27293806d04e4e543acf0ba`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "More detail...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Try again";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = ` Please enter right city name !!!`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;
        if(id == 800){
            wIcon.src = "image/clear.gif";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "image/storm.gif";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "image/snow.gif";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "image/haze.gif";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "image/cloud.png";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "image/rain.gif";
        }
        
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb_2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        cover.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    cover.classList.remove("active");
});