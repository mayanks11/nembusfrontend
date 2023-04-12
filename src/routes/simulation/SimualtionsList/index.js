import React, { useState, useEffect } from "react";
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
import MaterialTable from "material-table";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import EditSimulationDialog from "./EditSimulationDialog.js";
import DeleteSimulationDialog from "./DeleteSimulationDialog.js";
import CloneSimulationDialog from "./CloneSimulationDialog.js";
import { useImmer } from "use-immer";
import { isEmpty } from "lodash";
import { Button } from "@material-ui/core";

import { getGroundstationList } from "Api"
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import Typography from "@material-ui/core/Typography";

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

const SimulationsList = (props) => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);

  const [selectedRowData, setSelectedRowData] = useImmer({
    selectedData: {},
    isLoading: false,
    isEditOpen: false,
    isDeleteOpen: false,
    isCloneOpen: false,
  });

  const getRowsData = async () => {
    setIsLoading(true);
    const result = await SimulationService.fetchAllCases();

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
    setRows(rowsData);
    setIsLoading(false);
  };

  useEffect(() => {
    getRowsData();
    props.resetGroundStationList();
  }, []);

  useEffect(() => {
    if (!isEmpty(selectedRowData.selectedData)) {
      getRowsData();
    }
  }, [isTriggered]);

  const handleEditClick = (rowData) => {
    setSelectedRowData((draft) => {
      draft.selectedData = rowData;
      draft.isEditOpen = true;
    });
  };

  const handleDeleteClick = (rowData) => {
    setSelectedRowData((draft) => {
      draft.selectedData = rowData;
      draft.isDeleteOpen = true;
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
        title="Simulation List"
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
                icon: "delete",
                tooltip: "Delete Simulation",
                onClick: (event, rowData) => handleDeleteClick(rowData),
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
      <DeleteSimulationDialog
        isDialogOpened={selectedRowData.isDeleteOpen}
        handleCloseDialog={() => {
          setSelectedRowData((draft) => {
            (draft.isDeleteOpen = false), (draft.selectedData = {});
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
  );
};

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
)(withRouter(SimulationsList));
