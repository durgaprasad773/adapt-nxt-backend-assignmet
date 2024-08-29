const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static('views'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

app.post('/weather', async (req, res) => {
    const city = req.body.city;
    const apiKey = process.env.WEATHERSTACK_API_KEY;
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

    try {
        const response = await axios.get(url);
        const weatherData = response.data;

        if (weatherData.error) {
            res.send(`<h3>Error: ${weatherData.error.info}</h3>`);
        } else {
            res.send(`
                <h1>Weather Information for ${weatherData.location.name}</h1>
                <p>Temperature: ${weatherData.current.temperature}°C</p>
                <p>Weather Descriptions: ${weatherData.current.weather_descriptions.join(', ')}</p>
                <p>Humidity: ${weatherData.current.humidity}%</p>
                <p>Wind Speed: ${weatherData.current.wind_speed} km/h</p>
                <br>
                <a href="/">Search Again</a>
            `);
        }
    } catch (error) {
        res.send('<h3>Unable to fetch weather information. Please try again later.</h3>');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
