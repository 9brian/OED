/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 const database = require('./database');

 const sqlFile = database.sqlFile;
 
 class WeatherLocation {
     /**
      * @param id This weather location's ID. 
      * @param identifier This weather location's identifier
      * @param gps in format of GIS coordinates
      * @param note The weather location's note
      */
     constructor(id, identifier, gps, note) {
         this.id = id;
         this.identifier = identifier;
         this.gps = gps;
         this.note = note;
     }
 
     /**
      * Returns a promise to create the weather locations table
      * @param conn is the connection to use.
      * @returns {Promise.<>}
      */
     static createTable(conn) {
         return conn.none(sqlFile('weather_location/create_weather_location_table.sql'));
     }
 
     /**
      * Returns a promise to retrieve the weather location with the given id from the database.
      * @param conn is the connection to use.
      * @param id
      * @returns {Promise.<WeatherLocation>}
      */
     static async getByID(id, conn) {
         const row = await conn.one(sqlFile('weather_location/get_weather_location_by_id.sql'), { id: id });

         return WeatherLocation.mapRow(row);
     }
 
     /**
      * Returns a promise to retrieve the weather location with the given coordinates from the database.
      * @param gps the gps to look up
      * @param conn the connection to use.
      * @returns {Promise.<WeatherLocation>} either the weather_location object with info or null if does not exist.
      */
     static async getByGPS(gps, conn) {
         const row = await conn.oneOrNone(sqlFile('weather_location/get_weather_location_by_gps.sql'), { gps: gps });
         return WeatherLocation.mapRow(row);
     }

     /**
      * Creates a new weather location from the data in a row.
      * @param row the row from which the weather location is to be created
      * @returns Weather Location from row
      */

     static mapRow(row) {
        var weatherLocation = new WeatherLocation(row.id, row.identifier, row.gps, row.note);
        return weatherLocation;
     }
 
     /**
      * Returns a promise to get all of the weather locations from the database
      * @param conn is the connection to use.
      * @returns {Promise.<array.<WeatherLocation>>}
      */
     static async getAll(conn) {
         const rows = await conn.any(sqlFile('weather_location/get_weather_all_weather_locations.sql'));
         return rows.map(WeatherLocation.mapRow)
     }
 
     /**
      * Returns a promise to insert this weather location into the database
      * @param conn is the connection to use.
      * @returns {Promise.<>}
      */
     async insert(conn) {
         const weatherLocation = this;
         if (weatherLocation.id !== undefined) {
             throw new Error('Attempted to insert a weatherLocation that already has an ID');
         }
         return await conn.none(sqlFile('weather_location/insert_new_weather_location.sql'), weatherLocation);
     }
 }
 
 module.exports = WeatherLocation;
 