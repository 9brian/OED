/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Container, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import '../../styles/modal.css';
import TooltipMarkerComponent from '../TooltipMarkerComponent';
import TooltipHelpComponent from '../../components/TooltipHelpComponent';
import { weatherLocationApi } from '../../redux/api/weatherLocationApi';
import { tooltipBaseStyle } from '../../styles/modalStyle';
import { useTranslate } from '../../redux/componentHooks';
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';

/**
 * Defines the create weather modal form
 * @returns Weather create element
 */
export default function CreateWeatherModalComponent() {
	const [submitCreateWeatherLocation] = weatherLocationApi.useAddWeatherLocationMutation();
	const translate = useTranslate();

	const defaultValues = {
		identifier: '',
		longitude: '',
		latitude: '',
		note: '',
		// The client code makes the id for the selected unit and default graphic unit be -99
		id: -99
	};

	const [showModal, setShowModal] = useState(false);
	const handleClose = () => {
		setShowModal(false);
		resetState();
	};
	const handleShow = () => setShowModal(true);

	// Handlers for each type of input change
	const [state, setState] = useState(defaultValues);

	const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, [e.target.name]: e.target.value });
	};


	/* Create Weather Location Validation:
		Identifier cannot be blank
		Longitude cannot be blank
		Latitude cannot be blank
	*/

	const [validUnit, setValidUnit] = useState(false);
	useEffect(() => {
		setValidUnit(state.identifier !== '' && state.longitude !== '' && state.latitude !== '');
	}, [state.identifier, state.longitude, state.latitude]);

	const resetState = () => {
		setState(defaultValues);
	};

	// Submit
	const handleSubmit = () => {
		// Close modal first to avoid repeat clicks
		setShowModal(false);

		// Regular expression that check for a floating point format
		const longitudeRegex = /^-?\d+\.\d+$/;
		const latitudeRegex = /^-?\d+\.\d+$/;

		// Test to see if the regex matches a floating point format
		if (!longitudeRegex.test(state.longitude) || !latitudeRegex.test(state.latitude)) {
			showErrorNotification('Longitude and latitude must be valid floating-point numbers.');
			return;
		}

		// Convert longitude and latitude to numbers
		const longitude = parseFloat(state.longitude);
		const latitude = parseFloat(state.latitude);


		// Submit the form with updated state
		submitCreateWeatherLocation({
			...state,
			longitude,
			latitude
		})
			.unwrap()
			.then(()=> {
				showSuccessNotification(translate('weather.successfully.create.location'));
			})
			.catch(() => {
				showErrorNotification(translate('weather.failed.to.create.location'));
			});
		resetState();
	};


	const tooltipStyle = {
		...tooltipBaseStyle,
		tooltipCreateWeatherView: 'help.admin.weathercreate'
	};

	return (
		<>
			<Button color='secondary' onClick={handleShow}>
				<FormattedMessage id="create.weather" />
			</Button>
			<Modal isOpen={showModal} toggle={handleClose} size='lg'>
				<ModalHeader>
					<FormattedMessage id="create.weather" />
					<TooltipHelpComponent page='weather-create' />
				</ModalHeader>
				<ModalBody>
					<Container>
						<FormGroup>
							<Label for='identifier'>{translate('identifier')}</Label>
							<Input
								id='identifier'
								name='identifier'
								type='text'
								autoComplete='on'
								onChange={e => handleStringChange(e)}
								value={state.identifier}
								invalid={state.identifier === ''} />
							<FormFeedback>
								<FormattedMessage id="error.required" />
							</FormFeedback>
						</FormGroup>
						<Row xs='1' lg='2'>
							<Col>
								<FormGroup>
									<Label for='longitude'>{translate('longitude')}</Label>
									<Input
										id='longitude'
										name='longitude'
										type='text'
										autoComplete='on'
										onChange={e => handleStringChange(e)}
										value={state.longitude.toString()}
										invalid={state.longitude == ''} />
									<FormFeedback>
										<FormattedMessage id="error.required" />
									</FormFeedback>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label for='latitude'>{translate('latitude')}</Label>
									<Input
										id='latitude'
										name='latitude'
										type='text'
										autoComplete='on'
										onChange={e => handleStringChange(e)}
										value={state.latitude.toString()}
										invalid={state.latitude == ''} />
									<FormFeedback>
										<FormattedMessage id="error.required" />
									</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<FormGroup>
							<Label for='note'>{translate('note')}</Label>
							<Input
								id='note'
								name='note'
								type='textarea'
								onChange={e => handleStringChange(e)}
								value={state.note} />
						</FormGroup>
					</Container>
				</ModalBody>
				<ModalFooter>
					<Button color='secondary' onClick={handleClose}>
						<FormattedMessage id="discard.changes" />
					</Button>
					<Button color='primary' onClick={handleSubmit} disabled={!validUnit}>
						<FormattedMessage id="save.all" />
					</Button>
				</ModalFooter>
				<TooltipMarkerComponent page='weather-create' helpTextId={tooltipStyle.tooltipCreateWeatherView} />
			</Modal>
		</>
	);
}
