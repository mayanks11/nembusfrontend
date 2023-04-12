import React, { useState, useEffect } from "react";
import SimulationService from "Api/Simulate";
import ShareSimulationService from "Api/ShareSimulate";
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
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import MaterialTable from "material-table";
import { Button } from "@material-ui/core";
import { getGroundstationList } from "Api";
import Typography from "@material-ui/core/Typography";
import EditSimulationDialog from "../SimualtionsList/EditSimulationDialog";
import CloneSimulationDialog from "../SimualtionsList/CloneSimulationDialog";
import { useImmer } from "use-immer";


const MyNewTitle = ({ text, variant }) => (
    <Typography
        variant={variant}
        style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
        }}
    >
        {text}
    </Typography>
);

const SharedSimulations = (props) => {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRowData, setSelectedRowData] = useImmer({
        selectedData: {},
        isLoading: false,
        isEditOpen: false,
        isDeleteOpen: false,
        isCloneOpen: false,
    });
    const getRowsData = async () => {
        setIsLoading(true);
        const result = await ShareSimulationService.fetchSharedCases();

        const rowsData = result.map(
            ({
                missionId,
                missionName,
                missionCreatedOn,
                missionDescription,
                simulationId,
                simulationName,
                simulationCreatedOn,
                simulationLastModifiedOn,
                simulationDescription,
                simulationStartDate,
                simulationEndDate
            }) => ({
                created_date: `${moment(simulationLastModifiedOn.seconds * 1000)
                    .local()
                    .format("YYYY-MM-DD HH:mm")}(${moment().diff(
                        moment(simulationLastModifiedOn.seconds * 1000).utc(),
                        "days"
                    )} days ago)`,
                simulation_name: simulationName,
                simulation_description: simulationDescription,
                mission_name: missionName,
                mission_objective: missionDescription,
                mission_id: missionId,
                simulation_id: simulationId,
                simulationStartDate: simulationStartDate,
                simulationEndDate: simulationEndDate
            })
        );
        console.log("rowsData", rowsData);
        setRows(rowsData);
        setIsLoading(false);
    };

    useEffect(() => {
        getRowsData();
        props.resetGroundStationList();
    }, []);
    const handleEditClick = (rowData) => {
        setSelectedRowData((draft) => {
            draft.selectedData = rowData;
            draft.isEditOpen = true;
        });
    };

    const handleCloneClick = async (rowData) => {
        setSelectedRowData((draft) => {
            draft.selectedData = rowData;
            draft.isCloneOpen = true;
        });
        const { mission_id, simulation_id } = rowData;
        let response = await getGroundstationList(mission_id, simulation_id);
        props.setGroundStationList(response);
    };

    const handleRowClick = async (event, rowData) => {
        const {
            mission_id,
            simulation_id,
            mission_name,
            mission_objective,
        } = rowData;

        props.resetGroundStationList();
        let response = await getGroundstationList(mission_id, simulation_id);
        props.setGroundStationList(response);

        const simData = await SimulationService.getSimulationDetails(
            mission_id,
            simulation_id
        );
        props.setProjectAction({
            id: mission_id,
            ProjectName: mission_name,
            Description: mission_objective,
        });
        props.setCaseAction(simData);

        props.history.push("/app/simulation/simulate");
    };
    return (
        <React.Fragment>
            <PageTitleBar
                title="Shared Simulations"
                match={props.match}
                enableBreadCrumb={true}
            />
            {isLoading && <RctSectionLoader />}
            {rows && (
                <React.Fragment>
                    <MaterialTable
                        title={<MyNewTitle variant="subtitle1" text="Simulation List" />}
                        columns={[
                            {
                                title: "Mission Name",
                                field: "mission_name",
                            },
                            {
                                title: "Simulation Name",
                                field: "simulation_name",
                                grouping: false,
                            },
                            {
                                title: "Simulation Description",
                                field: "simulation_description",
                                type: "string",
                                grouping: false,
                            },
                            {
                                title: "Updated",
                                field: "created_date",
                                type: "date",
                                filtering: false,
                            },
                        ]}
                        data={rows}
                        onRowClick={(event, rowData) => handleRowClick(event, rowData)}
                        actions={[
                            {
                                icon: "edit",
                                tooltip: "Edit Simulation",
                                onClick: (event, rowData) => handleEditClick(rowData),
                            },
                            {
                                icon: () => (
                                    <Button variant="outlined" size="small" color="primary">
                                        Clone
                                    </Button>
                                ),
                                tooltip: "clone",
                                onClick: (event, rowData) => handleCloneClick(rowData),
                            },
                        ]}
                        options={{
                            headerStyle: {
                                backgroundColor: "#464D69",
                                color: "#FFF",
                                zIndex: 0,
                            },
                            grouping: true,
                            search: true,
                            filtering: true,
                            actionsColumnIndex: -1,
                        }}
                    />
                </React.Fragment>
            )}
            <EditSimulationDialog
                isDialogOpened={selectedRowData.isEditOpen}
                handleCloseDialog={() => {
                    setSelectedRowData((draft) => {
                        draft.isEditOpen = false;
                    });
                }}
                handleTrigger={() => setIsTriggered(!isTriggered)}
                rowData={selectedRowData}
            />
            <CloneSimulationDialog
                isDialogOpened={selectedRowData.isCloneOpen}
                handleCloseDialog={() => {
                    setSelectedRowData((draft) => {
                        (draft.isCloneOpen = false), (draft.selectedData = {});
                    });
                    props.resetGroundStationList();
                }}
                handleTrigger={() => setIsTriggered(!isTriggered)}
                rowData={selectedRowData}
            />
        </React.Fragment>
    )
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
)(withRouter(SharedSimulations));