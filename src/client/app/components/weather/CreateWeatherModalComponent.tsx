/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Container, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import '../../styles/modal.css';
//import { TrueFalseType } from '../../types/items';
import TooltipMarkerComponent from '../TooltipMarkerComponent';
import TooltipHelpComponent from '../../components/TooltipHelpComponent';
//import { UnitRepresentType, DisplayableType, UnitType } from '../../types/redux/units';
import { tooltipBaseStyle } from '../../styles/modalStyle';
import { useTranslate } from '../../redux/componentHooks';
//import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';

/**
 * Defines the create weather modal form
 * @returns Weather create element
 */
export default function CreateWeatherModalComponent() {
	const translate = useTranslate();

	const defaultValues = {
		name: '',
		identifier: '',
		note: '',
		// These two values are necessary but are not used.
		// The client code makes the id for the selected unit and default graphic unit be -99
		// so it can tell it is not yet assigned and do the correct logic for that case.
		// The units API expects these values to be undefined on call so that the database can assign their values.
		id: -99
	};

	/* State */
	// Unlike EditUnitModalComponent, there are no props so we don't pass show and close via props.
	// Modal show
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

	// const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	setState({ ...state, [e.target.name]: JSON.parse(e.target.value) });
	// };

	// const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	setState({ ...state, [e.target.name]: Number(e.target.value) });
	// };


	// Reset the state to default values
	const resetState = () => {
		setState(defaultValues);
	};

	// Unlike edit, we decided to discard inputs when you choose to leave the page. The reasoning is
	// that create starts from an empty template.

	// Submit
	const handleSubmit = () => {
		// Close modal first to avoid repeat clicks
		setShowModal(false);
		resetState();
	};

	const tooltipStyle = {
		...tooltipBaseStyle,
		tooltipCreateUnitView: 'help.admin.unitcreate'
	};


	return (
		<>
			{/* Show modal button */}
			<Button color='secondary' onClick={handleShow}>
				<FormattedMessage id="(Need Format) create.weather" />
			</Button>
			<Modal isOpen={showModal} toggle={handleClose} size='lg'>
				<ModalHeader>
					<FormattedMessage id="(Need Format) create.weather" />
					<TooltipHelpComponent page='units-create' />
					<div style={tooltipStyle}>
						<TooltipMarkerComponent page='units-create' helpTextId={tooltipStyle.tooltipCreateUnitView} />
					</div>
				</ModalHeader>
				{/* when any of the unit properties are changed call one of the functions. */}
				<ModalBody><Container>
					<Row xs='1' lg='2'>
						{/* Identifier input */}
						<Col><FormGroup>
							<Label for='identifier'>{translate('identifier')}</Label>
							<Input
								id='identifier'
								name='identifier'
								type='text'
								autoComplete='on'
								onChange={e => handleStringChange(e)}
								value={state.identifier} />
						</FormGroup></Col>
						{/* Name input */}
						<Col><FormGroup>
							<Label for='name'>{translate('name')}</Label>
							<Input
								id='name'
								name='name'
								type='text'
								autoComplete='on'
								onChange={e => handleStringChange(e)}
								value={state.name}
								invalid={state.name === ''} />
							<FormFeedback>
								<FormattedMessage id="error.required" />
							</FormFeedback>
						</FormGroup></Col>
					</Row>
					{/* Note input */}
					<FormGroup>
						<Label for='note'>{translate('note')}</Label>
						<Input
							id='note'
							name='note'
							type='textarea'
							onChange={e => handleStringChange(e)}
							value={state.note} />
					</FormGroup>
				</Container></ModalBody>
				<ModalFooter>
					{/* Hides the modal */}
					<Button color='secondary' onClick={handleClose}>
						<FormattedMessage id="discard.changes" />
					</Button>
					{/* On click calls the function handleSaveChanges in this component */}
					<Button color='primary' onClick={handleSubmit}>
						<FormattedMessage id="save.all" />
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
}
