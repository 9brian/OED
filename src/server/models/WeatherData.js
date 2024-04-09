/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 const database = require('./database');

 const sqlFile = database.sqlFile;
 
 // TODO: WeatherData Class
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
    
 }
 
 module.exports = WeatherData;
 