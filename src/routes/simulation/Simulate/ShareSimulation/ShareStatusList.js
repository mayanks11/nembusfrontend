import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import ShareSimulationService from "Api/ShareSimulate";
import { Button } from "@material-ui/core";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import * as firebase from "firebase";
import { NotificationManager } from "react-notifications";

const useStyles = makeStyles((theme) => ({
    groupIconBg: {
        borderRadius: "20px",
        width: "24px",
        height: "24px",
        backgroundColor: "blue",
        padding: "4px"
    },
    groupIcon: {
        fontSize: "12px",
        color: "#ffffff"
    },
    tableStructure: {
        borderCollapse: "collapse",
        width: "100%"
    },

}));

const ShareStatusList = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const { missionId, simulationId } = props;
    const [trigger, setTrigger] = useState(false);

    const getRowsData = async () => {
        setIsLoading(true);

        ShareSimulationService.fetchSharedStatusListSnapShot(missionId, simulationId,
            (snapshot) => {
                var rowsData = [];
                snapshot.forEach((s) => {
                    rowsData.push({

                        name: s.data().toUserObj.userName,
                        status: s.data().status,
                        invitationId: s.id,
                        emailId: s.data().toUserObj.Email,
                    });
                });

                // const result = await ShareSimulationService.getInvitationRequests(userInfo.uid);
                // console.log("result", result);
                setRows(rowsData);
            }
        )

        // const result = await ShareSimulationService.fetchSharedStatusList(missionId, simulationId);

        // const rowsData = result.map(
        //     ({
        //         toUserObj, status, id
        //     }) => ({
        //         name: toUserObj.userName,
        //         status: status,
        //         invitationId: id,
        //         emailId: toUserObj.Email
        //     })
        // );
        // setRows(rowsData);
        setIsLoading(false);
    };

    useEffect(() => {

    }, [rows]);

    useEffect(() => {
        getRowsData();
    }, [trigger]);

    const handleRemoveInvitationClick = async (rowData) => {
        try {
            setIsLoading(true);
            const removeInvitationRecord = firebase
                .app()
                .functions("us-central1")
                .httpsCallable("removeInvitationRecord");

            const cloudParameters = {
                invitationId: rowData.invitationId,
                missionId: missionId,
                simulationId: simulationId,
                email: rowData.emailId
            }
            // console.log("cloud params", cloudParameters);
            let result = await removeInvitationRecord({
                invitationId: rowData.invitationId,
                missionId: missionId,
                simulationId: simulationId,
                email: rowData.emailId
            })
            console.log("result ", result);
            if (result.data.status === "ok") {
                setIsLoading(false);
                setTrigger(!trigger);
                NotificationManager.success("Succesfully removed invitation");
            }
            else {
                setIsLoading(false)
                NotificationManager.error("Retry");
            }
        }
        catch (error) {
            console.log("error", error)
        }

        console.log("row to be removed data", rowData);
    }

    return (
        <div className="mt-4">
            {isLoading && <RctSectionLoader />}
            {rows && (

                <MaterialTable
                    title="Sharing Status"
                    columns={[
                        {
                            title: 'Name', field: 'name', cellStyle: {
                                backgroundColor: '#f2f2f2',
                                color: '#000000'
                            },
                        },
                        {
                            title: 'Status', field: 'status', cellStyle: {
                                backgroundColor: '#f2f2f2',
                                color: '#000000'
                            },
                        },
                        // {
                        //     title: 'Acion', field: 'action', cellStyle: {
                        //         backgroundColor: '#f2f2f2',
                        //         color: '#000000'
                        //     },
                        // },
                    ]}
                    // data={[
                    //     { name: 'Anvesh', status: 'Pending', action: "Remove", },
                    //     { name: 'Naushad', status: 'Done', action: "Edit" },
                    //     { name: 'Ar', status: 'Pending', action: "Remove", },
                    //     { name: 'Nr', status: 'Done', action: "Edit" },
                    //     { name: 'Niha', status: 'Done', action: "Edit" },
                    // ]}
                    data={rows}
                    actions={[

                        {
                            icon: () => (
                                <Button variant="outlined" size="small" className="btn btn-danger">
                                    Remove
                                </Button>
                            ),
                            tooltip: "remove invitation",
                            onClick: (event, rowData) => handleRemoveInvitationClick(rowData),
                        },
                    ]}
                    options={{
                        headerStyle: {
                            backgroundColor: '#ffffff',
                            color: '#000000',
                            fontWeight: "bolder"
                        },
                        search: false,
                        actionsColumnIndex: -1,
                        // showTitle: false,
                    }}
                />)}
        </div>
    )
}

export default ShareStatusList