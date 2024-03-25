/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TooltipHelpComponent from '../../components/TooltipHelpComponent';
import TooltipMarkerComponent from '../TooltipMarkerComponent';
import CreateWeatherModalComponent from './CreateWeatherModalComponent';
//import WeatherViewComponent from './WeatherViewComponent';

/**
 * Defines the weather page card view
 * @returns Weather page element
 */
export default function WeatherDetailComponent() {

	return (
		<div className='flexGrowOne'>
			<div>
				<TooltipHelpComponent page='weather' />
				<div className='container-fluid'>
					<h2 style={titleStyle}>
						<FormattedMessage id='weather' />
						<div style={tooltipStyle}>
							<TooltipMarkerComponent page='weather' helpTextId={tooltipStyle.tooltipWeatherView} />
						</div>
					</h2>
					<div className="edit-btn">
						{/* The actual button for create is inside this component. */}
						< CreateWeatherModalComponent />
					</div>
					<div className="card-container">
						{/* <WeatherViewComponent /> */}
					</div>
				</div>
			</div>
		</div>
	);
}

const titleStyle: React.CSSProperties = {
	textAlign: 'center'
};

const tooltipStyle = {
	display: 'inline-block',
	fontSize: '50%',
	// For now, only an admin can see the unit page.
	tooltipWeatherView: 'help.admin.weatherview'
};
