import React, { useState, useEffect } from "react";
import { forwardRef } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import { NotificationManager } from "react-notifications";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/Save";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import { updateGroundstationValues, deleteGroundstationListItem } from "Api/GroundstationAPI";
import { updateGroundStationItem, deleteGroundStationItem } from "Actions/GroundStationActions";

import * as firebase from "firebase";
import { loadRunData, setIsLoading } from '../../../../actions/RunData';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

function MaterialTableDemo(props) {
  // const [iserror, setIsError] = useState(false);
  const [columndata, setColumnData] = React.useState([]);
  const { simulate } = props;
  const projectId = simulate.getIn(["project", "id"]);
  const simulationId = simulate.getIn(["case", "id"]);
  useEffect(() => {
    // if (props.groundStation.get("GroundStationList").size > 0) {
    //   let groundstationList = props.groundStation
    //     .get("GroundStationList")
    //     .toJS();
    let groundstationList = props.groundStation.GroundStationCollection;

    const dataList = Object.entries(groundstationList).map(
      ([key, values]) => ({
        groundstationName: values.groundstationname,
        lattitude: values.latitude.value,
        lattitude_unit: values.latitude.unit,
        longitude: values.longitude.value,
        longitude_unit: values.longitude.unit,
        height: values.height.value,
        height_unit: values.height.unit,
        id: values.id,
        projectid: values.projectID,
        simulationid: values.simulationID,
        key: key,
      })
    );

    setColumnData(dataList);

    // }
  }, []);

  const columns = [
    {
      title: "Groundstation Name",
      field: "groundstationName",
      editComponent: (props) => (
        <TextField
          type="text"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        />
      ),
    },
    {
      title: "Lattitude",
      field: "lattitude",
      editComponent: (props) => (
        <TextField
          type="numeric"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        />
      ),
    },
    {
      title: "Unit",
      field: "lattitude_unit",
      editComponent: (props) => (
        <Select
          labelId="lattitude-unit-select-label"
          id="lattitude-unit-select"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        >
          <MenuItem value="radian">radian</MenuItem>
          <MenuItem value="degree">degree</MenuItem>
        </Select>
      ),
    },
    {
      title: "longitude ",
      field: "longitude",
      editComponent: (props) => (
        <TextField
          type="numeric"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        />
      ),
    },
    {
      title: "Unit",
      field: "longitude_unit",
      editComponent: (props) => (
        <Select
          labelId="longitude-unit-select-label"
          id="longitude-unit-select"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        >
          <MenuItem value="radian">radian</MenuItem>
          <MenuItem value="degree">degree</MenuItem>
        </Select>
      ),
    },
    {
      title: "height",
      field: "height",
      editComponent: (props) => (
        <TextField
          type="numeric"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        />
      ),
    },
    {
      title: "Unit",
      field: "height_unit",
      editComponent: (props) => (
        <Select
          labelId="height-unit-select-label"
          id="height-unit-select"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        >
          <MenuItem value="meter">meter</MenuItem>
          <MenuItem value="kilometer">kilometer</MenuItem>
        </Select>
      ),
    },
  ];

  return (
    <MaterialTable
      icons={tableIcons}
      localization={{
        pagination: {
          labelDisplayedRows: "{from}-{to} of {count}",
        },
        toolbar: {
          nRowsSelected: "{0} row(s) selected",
        },
        header: {
          actions: "Actions",
        },
        body: {
          emptyDataSourceMessage: "No records to display",
          filterRow: {
            filterTooltip: "Filter",
          },
          editRow: {
            saveTooltip: "Save to Update",
          },
        },
      }}
      columns={columns}
      data={columndata}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(async () => {
              const error = [];
              if (oldData) {

                if (newData.groundstationName !== oldData.groundstationName) {
                  if (!newData.groundstationName.trim()) {
                    error.push("Ground station is required");
                  }
                }

                if (
                  newData.lattitude !== oldData.lattitude ||
                  newData.lattitude_unit !== oldData.lattitude_unit
                ) {
                  let lattitude_degree = newData.lattitude;
                  if (newData.lattitude_unit === "radian") {
                    lattitude_degree = newData.lattitude * (180 / Math.PI);
                  }

                  if (lattitude_degree < -90 || lattitude_degree > 90) {
                    error.push(" Lattitude range is not correct");
                  }
                }

                if (
                  newData.longitude !== oldData.longitude ||
                  newData.longitude_unit !== oldData.longitude_unit
                ) {
                  let longitude_degree = newData.longitude;

                  if (newData.longitude_unit === "radian") {
                    longitude_degree = newData.longitude * (180 / Math.PI);
                  }

                  if (longitude_degree < -180 || longitude_degree > 180) {
                    error.push("Longitude range is not correct");
                  }
                }

                if (newData.height !== oldData.height) {
                  if (newData.height < 0) {
                    error.push(" Height should not be negative");
                  }
                }

                if (error.length > 0) {
                  NotificationManager.error(error[0], "Error");

                  reject();
                } else {
                  //TODO : Update the value

                  const updtenewValue = {
                    groundstationname: newData.groundstationName,
                    latitude: {
                      unit: newData.lattitude_unit,
                      value: newData.lattitude,
                    },
                    longitude: {
                      unit: newData.longitude_unit,
                      value: newData.longitude,
                    },
                    height: {
                      unit: newData.height_unit,
                      value: newData.height,
                    },
                  };

                  updateGroundstationValues(
                    updtenewValue,
                    projectId,
                    simulationId,
                    newData.id
                  );
                  props.updateGroundStationItem(
                    {
                      ...updtenewValue,
                      id: newData.id,
                      projectID: projectId,
                      simulationID: simulationId,
                    },
                  );

                  const dataUpdate = [...columndata];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setColumnData([...dataUpdate]);

                  props.setIsLoading(true);
                  try {
                    const getAnalysisFile = firebase
                      .app()
                      .functions('us-central1')
                      .httpsCallable('generateAnalysisTree');

                    let data = await getAnalysisFile({
                      projectid: projectId,
                      simulationid: simulationId,
                    });
                    console.log("RunData", data);
                    props.loadRunData(data);

                  } catch (error) {
                    props.loadRunData(null);
                    props.setIsLoading(false);
                  }

                  resolve();
                }
              }
            }, 1000);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(async () => {
              deleteGroundstationListItem(
                projectId,
                simulationId,
                oldData.id
              );
              const dataDelete = [...columndata];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setColumnData([...dataDelete]);
              props.deleteGroundStationItem(oldData);


              props.setIsLoading(true);
              try {
                const getAnalysisFile = firebase
                  .app()
                  .functions('us-central1')
                  .httpsCallable('generateAnalysisTree');

                let data = await getAnalysisFile({
                  projectid: projectId,
                  simulationid: simulationId,
                });
                console.log("RunData", data);
                props.loadRunData(data);

              } catch (error) {
                props.loadRunData(null);
                props.setIsLoading(false);
              }

              resolve();
            }, 600);
          }),
      }}
      options={{
        actionsColumnIndex: -1,

        showTitle: false,
      }}
    />
  );
}

const stateProp = (state) => ({
  // groundStation: state.groundStationState,
  groundStation: state.GroundStationDetails,
  simulate: state.simulate
});

const dispatchProps = {
  updateGroundStationItem,
  deleteGroundStationItem,
  loadRunData,
  setIsLoading
};

export default connect(stateProp, dispatchProps)(MaterialTableDemo);
