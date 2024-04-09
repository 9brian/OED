/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 const database = require('./database');

 const sqlFile = database.sqlFile;
 
 class WeatherData {
    /**
     * @param id This weather data's id
     * @param weather_location_id The weather location id
     * @param start_time The weather data's start_time
     * @param end_time The weather data's end_time
     * @param temperature The actual weather data (temperature)
     */
    constructor(id, weather_location_id, start_time, end_time, temperature){
        this.id = id;
        this.weather_location_id = weather_location_id;
        this.start_time = start_time;
        this.end_time = end_time;
        this.temperature = temperature;
    }

    /**
      * Returns a promise to create the weather data table
      * @param conn is the connection to use.
      * @returns {Promise.<>}
      */
    static createTable(conn) {
        return conn.none(sqlFile('weather_data/create_weather_data_table.sql'));
    }

    /**
      * Returns a promise to retrieve the weather data with the given id from the database.
      * @param conn is the connection to use.
      * @param id
      * @returns {Promise.<WeatherData>}
      */
    static async getByID(id, conn) {
        const row = await conn.one(sqlFile('weather_data/get_weather_data_by_id.sql'), { id: id });
        return new WeatherData(row.id, row.weather_location_id, row.start_time, row.end_time, row.temperature);
    }

    /**
      * Returns a promise to retrieve the weather data with the given start_time from the database.
      * @param conn is the connection to use.
      * @param start_time
      * @returns {Promise.<WeatherData>}
      */
    static async getByStartTime(start_time, conn) {
        const row = await conn.one(sqlFile('weather_data/get_weather_data_by_start_time.sql'), { start_time: start_time });
        return new WeatherData(row.id, row.weather_location_id, row.start_time, row.end_time, row.temperature);
    }

    /**
      * Returns a promise to insert this weather data entry into the database
      * @param conn is the connection to use.
      * @returns {Promise.<>}
      */
    async insert(conn) {
        const weatherData = this;
        if (weatherData.id !== undefined) {
            throw new Error('Attempted to insert a weatherData entry that already has an ID');
        }
        return await conn.none(sqlFile('weather_data/insert_new_weather_data.sql'), WeatherData);
    }
    
 }
 
 module.exports = WeatherData;
 