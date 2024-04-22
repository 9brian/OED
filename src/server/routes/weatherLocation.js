/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  const express = require('express');
  const { log } = require('../log');
  const { getConnection } = require('../db');
  const WeatherLocation = require('../models/WeatherLocation');
  const validate = require('jsonschema').validate;
  const { success, failure } = require('./response');
  
  const router = express.Router();
  
  function formatWeatherLocationForResponse(item) {
      return {
          id: item.id, name: item.name, identifier: item.identifier,
          longitude: item.longitude, latitude: item.latitude, note: item.note
      };
  }
  
  /**
   * Route for getting all weather locations.
   */
  router.get('/', async (req, res) => {
      const conn = getConnection();
      try {
          const rows = await WeatherLocation.getAll(conn);
          res.json(rows.map(formatWeatherLocationForResponse));
      } catch (err) {
          log.error(`Error while performing GET weather location details query: ${err}`, err);
      }
  });
  
  /**
   * Route for POST add weather location.
   */
  router.post('/addWeatherLocation', async (req, res) => {
      const validWeatherLocation = {
          type: 'object',
          required: ['identifier', 'longitude', 'latitude'],
          properties: {
              // Removed id from properties list since it is set to undefined no matter what is passed.
            //   name: {
            //       type: 'string',
            //       minLength: 1
            //   },
              identifier: {
                  type: 'string',
                  minLength: 1
              },
              longitude: {
                  type: 'string',
                  minLength: 1
              },
              latitude: {
                  type: 'string',
                  minLength: 1
              },
              note: {
                  oneOf: [
                      { type: 'string' },
                      { type: 'null' }
                  ]
              }
          }
      };
      const validationResult = validate(req.body, validWeatherLocation);
      if (!validationResult.valid) {
          log.error(`Got request to edit weather location with invalid weather data, errors: ${validationResult.errors}`);
          failure(res, 400, `Got request to add weather location with invalid weather data, errors: ${validationResult.errors}`);
      } else {
          const conn = getConnection();
          try {
              await conn.tx(async t => {
                  const newLocation = new WeatherLocation(
                      undefined, // id
                      //req.body.name,
                      req.body.identifier,
                      parseFloat(req.body.latitude),
                      parseFloat(req.body.longitude),
                      req.body.note
                  );
                  await newLocation.insert(t);
              });
              success(res);
          } catch (err) {
              log.error(`Error while inserting new weather location ${err}`, err);
              failure(res, 500, `Error while inserting new weather location ${err}`);
          }
      }
  });
  
  /**
   * Route for POST, delete unit.
   */
  router.post('/delete', async (req, res) => {
      const validParams = {
          type: 'object',
          maxProperties: 1,
          required: ['id'],
          properties: {
              id: { type: 'integer' }
          }
      };
  
      // Ensure delete request is valid
      const validatorResult = validate(req.body, validParams);
      if (!validatorResult.valid) {
          const errorMsg = `Got request to delete a weather location with invalid data, error(s):  ${validatorResult.errors}`;
          log.warn(errorMsg);
          failure(res, 400, errorMsg);
      } else {
          const conn = getConnection();
          try {
              // Don't worry about checking if the weather location already exists
              // Just try to delete it to save the extra database call, since the database will return an error anyway if the row does not exist
              await WeatherLocation.delete(req.body.id, conn);
          } catch (err) {
              const errorMsg = `Error while deleting conversion with error(s): ${err}`;
              log.error(errorMsg);
              failure(res, 500, errorMsg);
          }
          success(res, 'Successfully deleted conversion');
      }
  });
  
  module.exports = router;
  