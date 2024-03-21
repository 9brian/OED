/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

CREATE TABLE IF NOT EXISTS weather_location(
  id SERIAL PRIMARY KEY NOT NULL,
  identifier VARCHAR(255),
  longitude FLOAT,
  latitude FLOAT,
  note TEXT
)
