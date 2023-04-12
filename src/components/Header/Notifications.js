/**
 * Notification Component
 */
import React, { Component, useEffect, useState } from 'react';
import SimulationService from "Api/Simulate";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import {
    setProject,
    setCase,
    clearParameter,
    clearSimulationConfigList,
    clearRunSimulationConfigList,
    clearSimulationActiveConfig,
    clearSelectSimulationConfig,
} from "Actions/Simulate";
import { setGroundStationList, resetGroundStationList } from "Actions/GroundStationActions";
import { Scrollbars } from 'react-custom-scrollbars';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { Badge } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import * as firebase from "firebase";
import { NotificationManager } from "react-notifications";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
// api
import api from 'Api';
import ShareSimulationService from "Api/ShareSimulate.js";
import { getGroundstationList } from "Api";
// intl messages
import IntlMessages from 'Util/IntlMessages';

const Notifications = (props) => {

	const [notifications, setNotifications] = useState([]);
	const { userInfo } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [trigger, setTrigger] = useState(false);

	// get notifications
	useEffect(() => {
		console.log("indisisisd use efect")
		const getNotifications = async () => {
			console.log("hieeeeee", userInfo);

			ShareSimulationService.getInvitationRequestsSnapShot(
				userInfo.uid,
				(snapshot) => {
					console.log("realtime update ", snapshot)
					var notifications = [];
					snapshot.forEach((s) => {
						notifications.push({
							message: s.data().message,
							fromUserName: s.data().fromUserObj.userName,
							createdDate: s.data().CreatedOn,
							id: s.id,
							simulationId: s.data().simulationId,
							missionId: s.data().missionId
						});
					});

					// const result = await ShareSimulationService.getInvitationRequests(userInfo.uid);
					// console.log("result", result);

					const sortTimeNotification = [...notifications].sort((a,b) => b.createdDate.seconds - a.createdDate.seconds);
					console.log("Sorted Accept", sortTimeNotification);

					setNotifications(sortTimeNotification);
				}
			)
		}
		getNotifications();
	}, [])
	useEffect(() => {

	}, [notifications])
	useEffect(() => {

		console.log("indisisisd use efect of trigger")
		const getNotifications = async () => {
			console.log("hieeeeee", userInfo);
			const result = await ShareSimulationService.getInvitationRequests(userInfo.uid);
			console.log("result", result);
			const sortTimeNotification = [...result].sort((a,b) => b.createdDate.seconds - a.createdDate.seconds);
			console.log("Sorted Accept", sortTimeNotification);
			setNotifications(sortTimeNotification);
		}

		getNotifications();
	}, [trigger])

	const handleAccept = async (notification) => {
		try {
			let cloudFunctionParameters = {
				invitationId: notification.id,
				missionId: notification.missionId,
				simulationId: notification.simulationId,
			}
			console.log("parmaeters", cloudFunctionParameters)
			setIsLoading(true);
			const acceptInvitationRecord = firebase
				.app()
				.functions("us-central1")
				.httpsCallable("acceptInvitationRecord");

			let result = await acceptInvitationRecord({
				invitationId: notification.id,
				missionId: notification.missionId,
				simulationId: notification.simulationId,
			})
			console.log("result ", result);
			if (result.data.status === "ok") {
				setIsLoading(false);
				setTrigger(!trigger);
				NotificationManager.success("Succesfully Accepted invitation");
				props.resetGroundStationList();
				let response = await getGroundstationList(notification.missionId, notification.simulationId);
				props.setGroundStationList(response);

				const missionData = await SimulationService.getProjectDetails(notification.missionId);

				const simData = await SimulationService.getSimulationDetails(
					notification.missionId,
					notification.simulationId
				);
				
				props.setProjectAction({
					id: notification.missionId,
					ProjectName: missionData.ProjectName,
					Description: missionData.Description,
				});
				props.setCaseAction(simData);

				props.history.push("/app/simulation/simulate");
			}
			else {
				setIsLoading(false)
				NotificationManager.error("Retry");
			}
		}
		catch (error) {
			console.log("error", error)
		}
	}

	const handleReject = async (notification) => {
		setIsLoading(true);
		const result = await ShareSimulationService.setSharingStatus(notification.id);
		if (result.status === "ok") {
			setTrigger(!trigger);
			setIsLoading(false);
		}
		else {
			setIsLoading(false)
			NotificationManager.error("Retry");
		}
	}
	return (
		<UncontrolledDropdown nav className="list-inline-item notification-dropdown">
			<DropdownToggle nav className="p-0">
				<Tooltip title="Notifications" placement="bottom">
					<IconButton className={`${notifications.length > 0} ? "shake" : ""`} aria-label="bell">
						<i className="zmdi zmdi-notifications-active"></i>
						<Badge color="danger" className="badge-xs badge-top-right rct-notify">{notifications.length > 0 && notifications.length}</Badge>
					</IconButton>
				</Tooltip>
			</DropdownToggle>
			<DropdownMenu right>
				<div className="dropdown-content">
					<div className="dropdown-top d-flex justify-content-between rounded-top bg-primary">
						<span className="text-white font-weight-bold">
							<IntlMessages id="Active Requests" />
						</span>
						{/* <Badge color="warning">1 NEW</Badge> */}
					</div>
					{isLoading && <RctSectionLoader />}
					<Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={280}>

						<ul className="list-unstyled dropdown-list">
							{notifications.length > 0 ? notifications.map((notification) => (
								<li key={notification.id}>
									<div className="media">
										{/* <div className="mr-10">
											<img src={notification.userAvatar} alt="user profile" className="media-object rounded-circle" width="50" height="50" />
										</div> */}
										<div className="media-body pt-5">
											<div className="d-flex justify-content-between">
												<h5 className="mb-5 text-primary">{notification.fromUserName}</h5>
												{/* <span className="text-muted fs-12">{notification.createdDate}</span> */}
											</div>
											<span className="text-muted fs-12 d-block">{notification.message}</span>
											<Button className="btn-primary mr-10" onClick={() => handleAccept(notification)}>
												<i className="zmdi zmdi-thumb-up mr-2"></i> Accept
											</Button>
											<Button className="btn-danger" onClick={() => handleReject(notification)}>
												<i className="zmdi zmdi-thumb-down mr-2"></i> Reject
											</Button>
										</div>
									</div>
								</li>
							)) : <React.Fragment><div className="d-flex flex-row align-items-center justify-content-center"><p>No Active Requests Available</p></div></React.Fragment>}
						</ul>
					</Scrollbars>
				</div>
				{/* <div className="dropdown-foot p-2 bg-white rounded-bottom">
					<Button
						variant="contained"
						color="primary"
						className="mr-10 btn-xs bg-primary"
					>
						View all
					</Button>
				</div> */}
			</DropdownMenu>
		</UncontrolledDropdown>
	);
}

const mapStateToProps = (state) => ({
    socket: state.simulate.get("socket"),
    userinfo: state.firebase.auth,
    userprofile: state.firebase.profile,
});

const mapDispatchToProps = {
    setCaseAction: setCase,
    setProjectAction: setProject,
    clearParameter,
    clearSimulationConfigList,
    clearRunSimulationConfigList,
    clearSimulationActiveConfig,
    clearSelectSimulationConfig,
    //added new
    setGroundStationList,
    resetGroundStationList
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Notifications));

// export default Notifications;
