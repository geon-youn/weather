const __WEATHER_API_KEY = '2b2036749d1e91eb2b35d7e9077e8ccb';
const __GIPHY_API_KEY = 'Avw3U47KX0qnq9DFSAKuRJbzKfpPgYcu';

const weather = document.querySelector('.weather');
const form = document.querySelector('#weather-form');
const loc = document.querySelector('#weather-location');

function kelvinToCelcius(k) {
    return Math.round((k - 273.15) * 10) / 10;
}

function MPSToKMH(mps) {
    return Math.round(mps * 3.6 * 10) / 10;
}

function GeoDegToCard(deg) {
    deg %= 360;
    if (deg > 326.25 || deg < 11.25) {
        return 'N';
    } else if (deg < 56.25) {
        return 'NE';
    } else if (deg < 101.25) {
        return 'E';
    } else if (deg < 146.25) {
        return 'SE';
    } else if (deg < 191.25) {
        return 'S';
    } else if (deg < 236.25) {
        return 'SE';
    } else if (deg < 281.25) {
        return 'W';
    } else {
        return 'NW';
    }
}

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
        desc: await getGiphy(data.weather[0].description),
        temp: kelvinToCelcius(data.main.temp),
        feels: kelvinToCelcius(data.main.feels_like),
        humidity: data.main.humidity,
        wind: MPSToKMH(data.wind.speed),
        dir: GeoDegToCard(data.wind.deg),
        country: data.sys.country,
        city: data.name,
    };
    return weatherData;
}

async function getGiphy(q) {
    const obj = await fetch(
        `https://api.giphy.com/v1/gifs/translate?api_key=${__GIPHY_API_KEY}&s=${q}`,
        { mode: 'cors' }
    );
    const data = await obj.json();
    return data.data.images.original.url;
}

function displayWeather(data) {
    weather.textContent = '';
    const div = document.createElement('div');
    div.textContent = `Current weather for ${data.city}, ${data.country}: ${data.main.toLowerCase()} with a temperature of ${data.temp}°C (Feels like ${data.feels}°C) with ${data.humidity}% humidity and ${data.wind} km/h winds from ${data.dir}.`
    const img = document.createElement('img');
    img.src = data.desc;
    weather.append(div, img);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let data = await getWeatherData(loc.value);
    loc.value = '';
    displayWeather(data);
});
