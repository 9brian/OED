/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

CREATE TABLE IF NOT EXISTS weather_data (
    id SERIAL PRIMARY KEY NOT NULL,
    weather_location_id INTEGER REFERENCES weather_location(id),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    temperature FLOAT
);