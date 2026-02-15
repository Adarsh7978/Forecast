const apiKey = "d7ce7c445929f95cf5f90283e48649cd";

// UI Elements
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temperature");
const desc = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const minMax = document.getElementById("minMax");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

// Main Fetch Function
async function fetchWeather(url) {
    try {
        cityName.innerText = "Loading...";

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod != 200) {
            cityName.innerText = "City not found ⚠";
            return;
        }

        updateUI(data);
        changeBackground(data.weather[0].main);

    } catch (err) {
        cityName.innerText = "Network Error ⚠";
    }
}

//  Update UI
function updateUI(data) {
    cityName.innerText = data.name;
    temp.innerText = Math.round(data.main.temp) + "°C";
    desc.innerText = data.weather[0].description;

    humidity.innerText = data.main.humidity + "%";
    wind.innerText = data.wind.speed + " m/s";

    feelsLike.innerText = Math.round(data.main.feels_like) + "°C";
    minMax.innerText = `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`;

    sunrise.innerText = formatTime(data.sys.sunrise);
    sunset.innerText = formatTime(data.sys.sunset);
}

// ⏰ Format Unix Time
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
}

// 🎨 Dynamic Background
function changeBackground(condition) {
    const body = document.body;

    if (condition === "Clear")
        body.style.background = "linear-gradient(to right, #f7971e, #ffd200)";
    else if (condition === "Clouds")
        body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
    else if (condition === "Rain")
        body.style.background = "linear-gradient(to right, #4e73df, #1cc88a)";
    else if (condition === "Snow")
        body.style.background = "linear-gradient(to right, #83a4d4, #b6fbff)";
    else
        body.style.background = "linear-gradient(to right, #1d2671, #c33764)";
}

// 🔎 Search by City
function getWeather() {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
        alert("Please enter a city name !");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchWeather(url);
}

//  Current Location Weather
function getLocationWeather() {
    navigator.geolocation.getCurrentPosition(position => {

        const { latitude, longitude } = position.coords;

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        fetchWeather(url);

    }, () => alert("Location access denied ⚠"));
}

// ⌨ Enter Key Support
document.getElementById("cityInput").addEventListener("keyup", e => {
    if (e.key === "Enter") getWeather();
});

// ⏱ Live Clock
setInterval(() => {
    document.getElementById("time").innerText =
        new Date().toLocaleString();
}, 1000);
