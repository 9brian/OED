/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2024-02-25&end_date=2024-03-10&hourly=temperature_2m&temperature_unit=fahrenheit

// Attribution
// <a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>

// TODO: Fetch data by user gps/ user input
const { fetchWeatherApi } = require('openmeteo');

const params = {
    "latitude": 36.6537,
    "longitude": 121.799,
    "start_date": "2024-02-25",
    "end_date": "2024-02-25",
    "hourly": "temperature_2m",
    "temperature_unit": "fahrenheit",
    "timezone": "America/Los_Angeles"
};
const url = "https://archive-api.open-meteo.com/v1/archive";
fetchWeatherApi(url, params).then(responses => {
    // Helper function to form time ranges
    const range = (start, stop, step) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    console.log(utcOffsetSeconds);
    const timezone = response.timezone();
    console.log(timezone);
    const timezoneAbbreviation = response.timezoneAbbreviation();
    console.log(timezoneAbbreviation);
    const latitude = response.latitude();
    const longitude = response.longitude();

    const hourly = response.hourly();

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {

        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0).valuesArray(),
        },

    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
        console.log(
            weatherData.hourly.time[i].toISOString(),
            weatherData.hourly.temperature2m[i]
        );
    }
}).catch(err => {
    console.error('Error fetching weather data:', err);
});
