import { Button, TextareaAutosize } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ShareSimulationService from "Api/ShareSimulate";
import * as firebase from "firebase";
import { NotificationManager } from "react-notifications";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";

const ShareMessage = (props) => {
    const { users, missionId, simulationId, userProfile, userInfo, resetChips } = props;
    useEffect(() => {
        console.log("userProfile", userProfile);
        console.log("userinfo", userInfo);
    }, []);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleMessageChange = (e) => {
        setMessage(e.target.value)
    }
    const handleSend = async () => {
        //list of emailId's
        //loggedin userid
        if (message !== '') {
            let fromUserObj = {
                userId: userInfo.uid,
                userName: userProfile.FirstName,
                email: userInfo.email
            }

            // let toUserObj={
            //     emailid:"",
            //     userId:""
            // }
            try {
                setIsLoading(true);
                const addInvitationRecord = firebase
                    .app()
                    .functions("us-central1")
                    .httpsCallable("addInvitationRecord");

                let result = await addInvitationRecord({
                    missionId: missionId,
                    simulationId: simulationId,
                    fromUserObj: fromUserObj,
                    toUserEmailList: users,
                    invitationMessage: message
                })
                console.log("result ", result);
                if (result.data.status === "ok") {
                    setIsLoading(false)
                    NotificationManager.success("Succesfully sent invitation");
                    setMessage('');
                    resetChips();
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
        else {
            NotificationManager.error("Enter Message before sending");
        }

    }
    return (
        <div className="d-flex flex-column ">
            {isLoading ? (
                <div>
                    <RctSectionLoader />
                    <React.Fragment>
                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3}
                            placeholder="Enter Message"
                            className="mt-3 shadow-lg p-3"
                            value={message}
                            style={{ width: 400, minHeight: 100, border: "none", backgroundColor: "#e6e6e6" }}
                            onChange={handleMessageChange}
                        />

                        <Button className="btn btn-primary align-self-end" onClick={handleSend}>Send</Button>
                    </React.Fragment>
                </div>
            ) :
                <React.Fragment>
                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={3}
                        placeholder="Enter Message"
                        className="mt-3 shadow-lg p-3"
                        value={message}
                        style={{ width: 400, minHeight: 100, border: "none", backgroundColor: "#e6e6e6" }}
                        onChange={handleMessageChange}
                    />

                    <Button className="btn btn-primary align-self-end" onClick={handleSend}>Send</Button>
                </React.Fragment>}
        </div>
    )
}

export default ShareMessage