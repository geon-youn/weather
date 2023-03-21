const __WEATHER_API_KEY = '2b2036749d1e91eb2b35d7e9077e8ccb';

const weather = document.querySelector('.weather');
const form = document.querySelector('#weather-form');
const loc = document.querySelector('#weather-location');

async function getWeatherData(loc) {
    const resource = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${
            loc ?? 'Hamilton, CA'
        }&appid=${__WEATHER_API_KEY}`,
        { mode: 'cors' }
    );
    const data = await resource.json();
    const weatherData = {
        main: data.weather[0].main,
        desc: data.weather[0].description,
        temp: data.main.temp, // kelvin
        feels: data.main.feels_like, // kelvin
        min: data.main.temp_min, // kelvin
        max: data.main.temp_max, // kelvin
        humidity: data.main.humidity,
        wind: data.wind.speed, // meters per second
        dir: data.wind.deg, // http://snowfence.umn.edu/Components/winddirectionanddegrees.htm
        clouds: data.clouds.all,
        country: data.sys.country,
        city: data.name,
    };
    return weatherData;
}

function displayWeather(data) {

}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let data = await getWeatherData(location.value);
    displayWeather(data);
});
