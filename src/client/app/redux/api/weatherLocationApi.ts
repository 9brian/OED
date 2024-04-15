/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { EntityState, createEntityAdapter } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { WeatherLocationData, WeatherLocationById } from 'types/redux/weather';
import { baseApi } from './baseApi';

export const weatherLocationAdapter = createEntityAdapter<WeatherLocationData>({
	sortComparer: (locationA, locationB) => locationA.identifier?.localeCompare(locationB.identifier, undefined, { sensitivity: 'accent' })
});
export const weatherLocationInitialState = weatherLocationAdapter.getInitialState();
export type WeatherLocationDataState = EntityState<WeatherLocationData, number>;

export const weatherLocationApi = baseApi.injectEndpoints({
	endpoints: builder => ({
		getWeatherLocationDetails: builder.query<WeatherLocationDataState, void>({
			query: () => 'api/weatherLocation',
			transformResponse: (response: WeatherLocationData[]) => {
				return weatherLocationAdapter.setAll(weatherLocationInitialState, response);
			},
			providesTags: ['WeatherLocation']
		}),
		addWeatherLocation: builder.mutation<void, WeatherLocationData>({
			query: weatherLocationDataArgs => ({
				url: 'api/weatherLocation/addWeatherLocation',
				method: 'POST',
				body: { ...weatherLocationDataArgs }
			}),
			invalidatesTags: ['WeatherLocation']
		})
	})
});

export const selectWeatherLocationDataResult = weatherLocationApi.endpoints.getWeatherLocationDetails.select();
export const {
	selectAll: selectAllWeatherLocations,
	selectById: selectWeatherLocationById,
	selectTotal: selectWeatherLocationTotal,
	selectIds: selectWeatherLocationIds,
	selectEntities: selectWeatherLocationDataById
} = weatherLocationAdapter.getSelectors((state: RootState) => selectWeatherLocationDataResult(state).data ?? weatherLocationInitialState);

export const stableEmptyWeatherLocationById: WeatherLocationById = {};
