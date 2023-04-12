import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import $ from "jquery";
import moment from "moment";
import { NotificationManager } from "react-notifications";
import ReactSelect from "react-select";
import styled from "styled-components";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Grid,
  FormLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
} from "@material-ui/core";

import SimulationService from "Api/Simulate";
import SimulationCloneService from "Api/CloneSimulate";
import { setCloneGroundStationList } from 'Api/GroundstationAPI.js'
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { useImmer } from "use-immer";
import {
  setProject,
  setCase,
  clearParameter,
  clearSimulationConfigList,
  clearRunSimulationConfigList,
  clearSimulationActiveConfig,
  clearSelectSimulationConfig,
  setIsLoading,
} from "Actions/Simulate";
import { resetAnalysisCollection } from "Actions/SimAnalysisActions";
// import $ from "jquery";
import { setGroundStationList, resetGroundStationList } from "Actions/GroundStationActions";
import { isLoaded, isEmpty } from "react-redux-firebase";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import _ from "lodash";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";


const steps = ["Create / Select Mission", "Create New Simulation"];

const ProjectForm = styled.div`
  width: 100%;
`;

const StyledStep = styled.div`
  margin: 20px;
`;
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "black" : "black",
    backgroundColor: state.isSelected ? "lightblue" : "white",
    padding: 4,
  }),
};
const useStyles = makeStyles((theme) => ({
  closeIcon: {
    color: "#677080",
    cursor: "pointer",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "#d10003",
      borderRadius: "5px",
      color: "#ffffff",
      fontWeight: 200,
    },
  },
}));

const CreateSelect = ({
  createOrSelect,
  setCreateOrSelect,
  handleChange,
  ProjectName,
  e_name,
  handleExistingProjectChange,
  e_description,
  projectsList,
  ProjectDescription,
}) => (
  <div className="d-flex flex-row justify-content-between">
    <div style={{ marginBottom: "16px", width: "45%" }}>
      <div className="d-flex flex-column project">
        <FormControlLabel
          control={
            <Radio
              size="small"
              checked={createOrSelect === "c"}
              onChange={() => setCreateOrSelect("c")}
            />
          }
          label="New Mission"
          labelPlacement="end"
        />
        <TextField
          label="Name"
          size="small"
          variant="outlined"
          value={ProjectName}
          onChange={handleChange("ProjectName")}
          classes={{
            root: "field",
          }}
          disabled={createOrSelect !== "c"}
        />
        <TextField
          label="Description"
          size="small"
          variant="outlined"
          value={ProjectDescription}
          multiline
          rowsMax="4"
          onChange={handleChange("ProjectDescription")}
          classes={{
            root: "field",
          }}
          style={{ marginTop: "12px" }}
          disabled={createOrSelect !== "c"}
        />
      </div>
    </div>
    <div style={{ width: "45%" }}>
      <div className="d-flex flex-column selected_project">
        <FormControlLabel
          control={
            <Radio
              size="small"
              checked={createOrSelect === "s"}
              onChange={() => setCreateOrSelect("s")}
            />
          }
          label="Select Mission"
          labelPlacement="end"
        />
        <div style={{ minWidth: "300px", maxWidth: "500px" }}>
          <ReactSelect
            value={e_name}
            onChange={(e) => {
              handleExistingProjectChange(e.value);
            }}
            styles={customStyles}
            placeholder="Select Mission"
            isDisabled={createOrSelect !== "s"}
            options={projectsList.map((p) => ({
              label: p.ProjectName,
              value: p.id,
            }))}
          />
        </div>

        <TextField
          label="Description"
          value={e_description}
          variant="outlined"
          size="small"
          // multiline
          // rowsMax="4"
          classes={{
            root: "field",
          }}
          disabled
          style={{ marginTop: "12px" }}
        />
      </div>
    </div>
  </div>
);
const NewSimulation = ({
  simulation: { CaseName, CaseDescription },
  changeSimulation,
  simulationTime: {
    startDate,
    startHour,
    startMinute,
    startsecond,
    starttimeScale,
    endDate,
    endHour,
    endMinute,
    endsecond,
    endtimeScale,
  },
  setSimulationTime,
}) => {
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <TextField
            label="Simulation Name"
            size="small"
            fullWidth
            variant="outlined"
            value={CaseName}
            onChange={changeSimulation("CaseName")}
            classes={{
              root: "field",
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Description"
            multiline
            rowsMax="4"
            value={CaseDescription}
            onChange={changeSimulation("CaseDescription")}
            classes={{
              root: "field",
            }}
          />
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={2}>
            <FormLabel for="StartDate" labelPlacement="top">
              Start Date
            </FormLabel>
          </Grid>
          <Grid item xs={10}>
            <div className="rct-picker">
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  ampm={false}
                  value={startDate}
                  format="YYYY-MM-DD"
                  style={{ width: "100px" }}
                  label="Date"
                  onChange={(val) => {
                    const tmp = startDate;
                    tmp.date(val.date());
                    tmp.month(val.month());
                    tmp.year(val.year());

                    setSimulationTime((draft) => {
                      draft.startDate = tmp;
                    });
                  }}
                />

                <TextField
                  id="number"
                  value={startHour}
                  // size="small"
                  label="Hour"
                  onChange={(val) => {
                    let hour = val.target.value;

                    if (val.target.value > 23) {
                      hour = 23;
                    } else if (val.target.value < 0) {
                      hour = 0;
                    }

                    const tmp = startDate;
                    tmp.hour(hour);

                    // const tmp = startDate;

                    setSimulationTime((draft) => {
                      draft.startDate = tmp;
                      draft.startHour = hour;
                    });
                  }}
                  style={{ width: "60px", marginLeft: "5px" }}
                  type="integer"
                  InputLabelProps={{
                    shrink: true,
                    min: 0,
                    max: 23,
                  }}
                />

                <TextField
                  id="number"
                  value={startMinute}
                  label="Minute"
                  // size="small"
                  onChange={(val) => {
                    let min = val.target.value;

                    if (val.target.value > 59) {
                      min = 59;
                    } else if (val.target.value < 0) {
                      min = 0;
                    }

                    const tmp = startDate;
                    tmp.minute(min);

                    // const tmp = startDate;

                    setSimulationTime((draft) => {
                      draft.startDate = tmp;
                      draft.startMinute = min;
                    });
                  }}
                  style={{ width: "60px", marginLeft: "5px" }}
                  type="integer"
                  InputLabelProps={{
                    shrink: true,
                    min: 0,
                    max: 23,
                  }}
                />

                <TextField
                  id="number"
                  value={startsecond}
                  label="Second"
                  // size="small"
                  onChange={(val) => {
                    let sec = val.target.value;

                    if (val.target.value > -1 && val.target.value < 60) {
                      sec = val.target.value;
                    } else if (val.target.value < 0) {
                      sec = 0;
                    } else {
                      if (_.isEmpty(sec)) {
                        sec = val.target.value;
                      } else {
                        sec = startsecond;
                      }
                    }
                    const tmp = startDate;
                    if (!_.isEmpty(sec)) {
                      const second = Math.floor(sec);
                      const millisecond = (sec - second) * 1000;
                      tmp.second(second);
                      tmp.millisecond(millisecond);
                    } else {
                      tmp.second(0);
                      tmp.millisecond(0);
                    }

                    // const tmp = startDate;

                    setSimulationTime((draft) => {
                      draft.startDate = tmp;
                      draft.startsecond = sec;
                    });
                  }}
                  style={{ width: "60px", marginLeft: "5px" }}
                  type="integer"
                  InputLabelProps={{
                    shrink: true,
                    min: 0,
                    max: 60,
                  }}
                />
                {/* 
                  <TimePicker
                    ampm={false}
                    openTo="hours"
                    views={["hours", "minutes", "seconds"]}
                    format="HH:mm:ss.SSSZ"
                    style={{ width: "170px", marginLeft: "5px" }}
                    label="Time"
                    value={startDate}
                    onChange={(val) => {
                      const tmp = startDate;
                      tmp.hour(val.hour());
                      tmp.minute(val.minute());
                      tmp.second(val.second());
                      setSimulationTime((draft) => {
                        draft.startDate = tmp;
                      });
                    }}
                  /> */}
                <FormControl>
                  <InputLabel id="demo-simple-select-label">
                    Time Scale
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={starttimeScale}
                    style={{ width: "170px", marginLeft: "5px" }}
                    onChange={(event) => {
                      setSimulationTime((draft) => {
                        draft.starttimeScale = event.target.value;
                      });
                    }}
                  >
                    <MenuItem value={"UTC"}>UTC</MenuItem>
                  </Select>
                </FormControl>
              </MuiPickersUtilsProvider>
            </div>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={2}>
            <InputLabel for="EndDate" labelPlacement="center">
              End Date
            </InputLabel>
          </Grid>
          <Grid item xs={10}>
            <div className="rct-picker">
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  ampm={false}
                  value={endDate}
                  format="YYYY-MM-DD"
                  style={{ width: "100px" }}
                  label="Date"
                  onChange={(val) => {
                    const tmp = endDate;
                    tmp.date(val.date());
                    tmp.month(val.month());
                    tmp.year(val.year());

                    setSimulationTime((draft) => {
                      draft.endDate = tmp;
                    });
                  }}
                />

                <TextField
                  id="number"
                  value={endHour}
                  label="Hour"
                  onChange={(val) => {
                    let hour = val.target.value;

                    if (val.target.value > 23) {
                      hour = 23;
                    } else if (val.target.value < 0) {
                      hour = 0;
                    }

                    const tmp = endDate;
                    tmp.hour(hour);

                    // const tmp = startDate;

                    setSimulationTime((draft) => {
                      draft.endDate = tmp;
                      draft.endHour = hour;
                    });
                  }}
                  style={{ width: "60px", marginLeft: "5px" }}
                  type="integer"
                  InputLabelProps={{
                    shrink: true,
                    min: 0,
                    max: 23,
                  }}
                />

                <TextField
                  id="number"
                  value={endMinute}
                  label="Minute"
                  onChange={(val) => {
                    let min = val.target.value;

                    if (val.target.value > 59) {
                      min = 59;
                    } else if (val.target.value < 0) {
                      min = 0;
                    }

                    const tmp = endDate;
                    tmp.minute(min);

                    // const tmp = startDate;

                    setSimulationTime((draft) => {
                      draft.endDate = tmp;
                      draft.endMinute = min;
                    });
                  }}
                  style={{ width: "60px", marginLeft: "5px" }}
                  type="integer"
                  InputLabelProps={{
                    shrink: true,
                    min: 0,
                    max: 23,
                  }}
                />

                <TextField
                  id="number"
                  value={endsecond}
                  label="Second"
                  onChange={(val) => {
                    let sec = val.target.value;

                    if (val.target.value > -1 && val.target.value < 60) {
                      sec = val.target.value;
                    } else if (val.target.value < 0) {
                      sec = 0;
                    } else {
                      if (_.isEmpty(sec)) {
                        sec = val.target.value;
                      } else {
                        sec = endsecond;
                      }
                    }
                    const tmp = endDate;
                    if (!_.isEmpty(sec)) {
                      const second = Math.floor(sec);
                      const millisecond = (sec - second) * 1000;
                      tmp.second(second);
                      tmp.millisecond(millisecond);
                    } else {
                      tmp.second(0);
                      tmp.millisecond(0);
                    }

                    // const tmp = startDate;

                    setSimulationTime((draft) => {
                      draft.endDate = tmp;
                      draft.endsecond = sec;
                    });
                  }}
                  style={{ width: "60px", marginLeft: "5px" }}
                  type="integer"
                  InputLabelProps={{
                    shrink: true,
                    min: 0,
                    max: 60,
                  }}
                />

                {/* <TimePicker
                    ampm={false}
                    openTo="hours"
                    views={["hours", "minutes", "seconds"]}
                    format="HH:mm:ss.SSSZ"
                    style={{ width: "170px", marginLeft: "5px" }}
                    label="Time"
                    value={endDate}
                    onChange={(val) => {
                      const tmp = endDate;
                      tmp.hour(val.hour());
                      tmp.minute(val.minute());
                      tmp.second(val.second());
                      setSimulationTime((draft) => {
                        draft.endDate = tmp;
                      });
                    }}
                  /> */}
                <FormControl>
                  <InputLabel id="demo-simple-select-label">
                    Time Scale
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={endtimeScale}
                    style={{ width: "170px", marginLeft: "5px" }}
                    onChange={(event) => {
                      setSimulationTime((draft) => {
                        draft.endtimeScale = event.target.value;
                      });
                    }}
                  >
                    <MenuItem value={"UTC"}>UTC</MenuItem>
                    <MenuItem value={"TAI"}>TAI</MenuItem>
                  </Select>
                </FormControl>
              </MuiPickersUtilsProvider>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

const getContent = (index) => {
  switch (index) {
    case 0: {
      return CreateSelect;
    }
    case 1: {
      return NewSimulation;
    }
    default: {
      return CreateSelect;
    }
  }
};

const toTwoDigits = (val) => String(val).padStart(2, "0");

const getCurrentDateTime = () => {
  const currentMoment = new Date();
  const currDate = [
    currentMoment.getFullYear(),
    toTwoDigits(currentMoment.getMonth() + 1),
    toTwoDigits(currentMoment.getDate()),
  ].join("-");
  const currTime = [
    toTwoDigits(currentMoment.getHours()),
    toTwoDigits(currentMoment.getMinutes()),
    toTwoDigits(currentMoment.getSeconds()),
  ].join(":");
  const currentDateTime =
    currDate + "T" + currTime + "." + currentMoment.getMilliseconds();
  return currentDateTime;
};

function CloneConfigDialog(props) {
  const {
    isDialogOpened,
    handleCloseDialog,
    configObj,
    simulate,
    setIsLoading,
    projectId,
    caseId,
    simData,
    names,
    shareSimulationFlag
  } = props;

  const handleClose = () => {
    setStep(0);
    handleCloseDialog(false);
  };
  const [modalLoading, setModalLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [createOrSelect, setCreateOrSelect] = useState("s");
  const [project, setProject] = useState({
    ProjectName: "",
    ProjectDescription: "",
  });
  const [existingProject, setExistingProject] = useState({
    e_name: "",
    e_description: "",
  });
  const [selectedProjectId, setProjectId] = useState(projectId);
  const [newProjectId, setNewProjectId] = useState("");
  // const [trigger,setTrigger]=useState(true);
  const [simulation, setSimulation] = useState({
    CaseName: simData.simulation_name + configObj.name + "_clone",
    CaseDescription: simData.simulation_description + configObj.name + "_clone",
    CreatedDate: new Date().toISOString(),
    LastModifiedDate: new Date().toISOString(),
  });

  const [isuserinfoLoading, setIsUserInfoLoading] = useState(true);
  const [isuserprofileLoading, setIsUserProfLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  const setStartTime = () => {
    const currentTime = moment().utc();
    currentTime.hour(0);
    currentTime.minute(0);
    currentTime.second(0);
    currentTime.millisecond(0);

    return currentTime;
  };

  const setEndTime = () => {
    const currentTime = moment().utc();
    currentTime.hour(1);
    currentTime.minute(0);
    currentTime.second(0);
    currentTime.millisecond(0);

    return currentTime;
  };

  const [simulationTime, setSimulationTime] = useImmer({
    startDate: setStartTime(),
    startHour: 0,
    startMinute: 0,
    startsecond: 0.0,
    starttimeScale: "UTC",
    endDate: setEndTime(),
    endHour: 1,
    endMinute: 0,
    endsecond: 0.0,
    endtimeScale: "UTC",
  });
  const [projectsList, setProjectList] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      if (isLoaded(props.userinfo) && !isEmpty(props.userinfo)) {
        setIsUserInfoLoading(false);
        const userid = props.userinfo.uid;
        const list = shareSimulationFlag ? await getAllSharedProjects(userid) : await getAllProjects(userid)
        setProjectList(list);
        const project = list.find((p) => p.id === projectId);
        // console.log("clone config dilaog 718 ------>", project);
        // props.setProjectAction(project);
        setExistingProject({
          e_name: { label: project.ProjectName, value: projectId },
          e_description: project.Description,
        });
      }
    };
    initialize();
  }, [props.userinfo.isEmpty, isDialogOpened]);

  useEffect(() => {
    if (isLoaded(props.userprofile) && !isEmpty(props.userprofile)) {
      setIsUserProfLoading(false);
    }
  }, [props.userprofile.isEmpty]);

  const socketConnected = props.socket && props.socket.connected === true;

  async function getAllProjects(userid) {
    const list = await SimulationService.getAllProjects({ userId: userid });
    return list;
  }
  async function getAllSharedProjects(userid) {
    const list = await SimulationService.getAllSharedProjects({ userId: userid });
    return list;
  }

  async function populateCaseInProjectListById(id) {
    const selectedProject = projectsList.find((p) => p.id == id);
    if (selectedProject && selectedProject.Case == undefined) {
      const Case = await SimulationService.getAllCasesForProject(id);
      if (Case) {
        const newList = projectsList.map((p) =>
          p.id == id
            ? {
              ...p,
              Case,
            }
            : p
        );
        setProjectList(newList);
      }
    }
  }

  function handleBack() {
    setStep(step > 0 ? step - 1 : 0);
  }
  function handleMoveStep() {
    if (step < steps.length - 1) setStep(step + 1);
  }

  function changeSimulation(path, data) {
    return function (e) {
      setSimulation({
        ...simulation,
        [path]: e.target.value.replace(/  +/g, " "),
      });
    };
  }

  function resetAll() {
    setProjectId("");
    setNewProjectId("");
    setSimulation({
      CaseName: "",
      CaseDescription: "",
    });

    setSimulationTime((draft) => {
      draft.startDate = setStartTime();
      draft.startHour = 0;
      draft.startMinute = 0;
      draft.startsecond = 0.0;
      draft.starttimeScale = "UTC";
      draft.endDate = setEndTime();
      draft.endHour = 1;
      draft.endMinute = 0;
      draft.endsecond = 0.0;
      draft.endtimeScale = "UTC";
    });
    setProject({
      ProjectName: "",
      ProjectDescription: "",
    });
    setExistingProject({
      e_name: "",
      e_description: "",
    });
  }

  function missionValidation() {
    if (!project.ProjectName && !project.ProjectDescription) {
      NotificationManager.error("Enter All Fields!");
      return false;
    }
    if (!project.ProjectName || project.ProjectName == " ") {
      NotificationManager.error("Enter Project Name !");
      return false;
    } else if (
      !project.ProjectDescription ||
      project.ProjectDescription == " "
    ) {
      NotificationManager.error("Enter Project Description !");
      return false;
    }
    const projectExists = projectsList.find(
      (p) =>
        $.trim(p.ProjectName).toLowerCase() ===
        $.trim(project.ProjectName).toLowerCase()
    );
    if (projectExists && step == 0) {
      NotificationManager.error("Project Name Already Exists !");
      return false;
    }
    return true;
  }

  async function projectValidation() {
    const projectName = $.trim(project.ProjectName);

    const isEligible = await SimulationService.isEligibleMissionPerOrganization(
      projectName,
      props.userprofile.CompanyName
    ).then((result) => {
      if (!result && step == 0) {
        NotificationManager.error(
          "Please choose other name since Mission Name exist in the organization ,"
        );
        setPageLoading(false);
        return false;
      }

      NotificationManager.success(
        "Mission Name is avilable and can be created"
      );
      handleMoveStep();
      setPageLoading(false);
    });
  }

  async function simulationValidation(isExist) {
    const { CaseName, CaseDescription } = simulation;
    const { startDate, starttimeScale, endDate, endtimeScale } = simulationTime;
    const simulationsList = await SimulationService.getAllCasesForProject(
      selectedProjectId
    );

    const simulationExists = isExist ?
      simulationsList.find(
        (c) =>
          c.SimulationName.trim().toLowerCase() === CaseName.trim().toLowerCase()
      )
      : false


    if (!CaseName && !CaseDescription && !startDate && !endDate) {
      NotificationManager.error("Enter All Fields !");
      return false;
    } else if (!CaseName || CaseName == " ") {
      NotificationManager.error("Enter Simulation Name ");
      return false;
    } else if (!CaseDescription || CaseDescription == " ") {
      NotificationManager.error("Enter Simuation Description");
      return false;
    } else if (!startDate) {
      NotificationManager.error("Enter Simuation Start Date");
      return false;
    } else if (!endDate) {
      NotificationManager.error("Enter Simuation End Date");
      return false;
    } else if (!endDate.isAfter(startDate, "second")) {
      NotificationManager.error("End should be grater then Start End");

      return false;
    } else if (endDate.diff(startDate) / 1000 < 3600.0) {
      NotificationManager.error(
        "At Least the duration should greater than 1 hour"
      );
      return false;
    } else if (simulationExists) {
      NotificationManager.error("Case Name Already Exists !");
      return false;
    } else {
      return true;
    }
    // const selectedProject = projectsList.find(
    //   (p) => p.id === selectedProjectId
    // );
    // const simulationExists =
    //   selectedProject &&
    //   selectedProject.Case &&
    //   selectedProject.Case.find(
    //     (c) =>
    //       $.trim(c.SimulationName).toLowerCase() ===
    //       $.trim(simulation.CaseName).toLowerCase()
    //   );
  }

  async function handlecreateSimulation() {
    switch (createOrSelect) {
      case "c": {
        if (!(await simulationValidation(false))) break;
        setPageLoading(true);

        if (props.setAnalysisSheetTab) {
          props.setAnalysisSheetTab((draft) => {
            draft.simulationAnalysisCollection = []
            draft.isloaded = false;
          });
        }

        const result1 = await SimulationCloneService.createProject(
          project,
          props.userprofile,
          simulation,
          simulationTime,
          configObj,
          names.simulationName,
          names.projectName
          // props.setAnalysisSheetTab
        );

        if (result1) {

          props.resetAnalysisCollection();
          // console.log("clone config dilaog 939 ------>", result1);
          props.setProjectAction(result1);
          getAllProjects();
          NotificationManager.success(
            "New Mission with new Simulation Created"
          );
          setNewProjectId(result1.id);

          const simData = await SimulationService.getSimulationDetails(
            result1.id,
            result1.simulation.id
          );

          props.setCaseAction(simData);
          resetAll();
          props.clearParameter();
          props.clearSimulationConfigList();
          props.clearRunSimulationConfigList();
          props.clearSimulationActiveConfig();
          props.clearSelectSimulationConfig();
          let groundstationList = props.groundStation.GroundStationCollection

          const dataList = Object.entries(groundstationList).map(
            ([key, values]) => ({
              groundstationname: values.groundstationname,
              latitude: values.latitude,
              longitude: values.longitude,
              height: values.height,
            })
          );

          let promiseCol = []
          dataList.map(async (ele) => {
            const response = SimulationCloneService.addGroundStationsFromClone(result1.id, result1.simulation.id, ele)

            promiseCol.push(response)

          })

          await Promise.all(promiseCol).then((response) => {

            props.resetGroundStationList();
            props.setGroundStationList(response);
          });
          props.history.push("simulate");
          setPageLoading(false);
        }
        setPageLoading(false);
        break;
      }

      case "s": {
        if (!(await simulationValidation(true))) break;
        setPageLoading(true);
        const project = projectsList.find((p) => p.id === selectedProjectId);
        // console.log("clone config dilaog 994 ------>", project);
        props.setProjectAction(project);
        const result = await SimulationCloneService.addSimulationInProject(
          selectedProjectId,
          simulation,
          simulationTime,
          configObj,
          names.simulationName,
          names.projectName
        );

        if (result) {
          props.resetAnalysisCollection();
          if (props.setAnalysisSheetTab) {
            props.setAnalysisSheetTab((draft) => {
              draft.simulationAnalysisCollection = []
              draft.isloaded = false;
            });
          }

          const simData = await SimulationService.getSimulationDetails(
            selectedProjectId,
            result.id
          );
          props.setCaseAction(simData);
          resetAll();

          props.clearParameter();
          props.clearSimulationConfigList();

          props.clearRunSimulationConfigList();
          props.clearSimulationActiveConfig();
          props.clearSelectSimulationConfig();


          let groundstationList = props.groundStation.GroundStationCollection
          const dataList = Object.entries(groundstationList).map(
            ([key, values]) => ({
              groundstationname: values.groundstationname,
              latitude: values.latitude,
              longitude: values.longitude,
              height: values.height,
            })
          );

          let promiseCol = []
          dataList.map(async (ele) => {
            const response = SimulationCloneService.addGroundStationsFromClone(selectedProjectId, result.id, ele)
            promiseCol.push(response);
          })
          await Promise.all(promiseCol).then((response) => {

            props.resetGroundStationList();
            props.setGroundStationList(response);
          });
          props.history.push("simulate");
          NotificationManager.success("New Simulation Created");
          setPageLoading(false);
        }
        setPageLoading(false);
        break;
      }
    }
  }

  function handleNext() {
    setPageLoading(true);
    switch (createOrSelect) {
      case "c": {
        if (!missionValidation()) {
          setPageLoading(false);
          return;
        }
        const projectVal = projectValidation();

        if (projectVal) {
          setPageLoading(false);
          return;
        }

        break;
      }
      case "s": {
        if (!selectedProjectId) {
          NotificationManager.error("Select A Project !");
          setPageLoading(false);
          break;
        } else {
          handleMoveStep();
          setPageLoading(false);
          break;
        }
      }
      default:
        return;
    }
    // processStep();
  }

  function handleExistingProjectChange(id) {
    if (!id) return;
    setProjectId(id);
    // populateCaseInProjectListById(id);
    const project = projectsList.find((p) => p.id === id);

    // props.setProjectAction(project);
    setExistingProject({
      e_name: { label: project.ProjectName, value: id },
      e_description: project.Description,
    });
  }

  function selectProject(what) {
    return (e) =>
      setProject({
        ...project,
        [what]: e.target.value.replace(/  +/g, " "),
      });
  }

  const stepProps = {
    createOrSelect,
    setCreateOrSelect,
    ...project,
    ...existingProject,
    handleChange: selectProject,
    simulation,
    handleExistingProjectChange,
    projectsList,
    changeSimulation,
    simulationTime,
    setSimulationTime,
  };
  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={isDialogOpened}
        onClose={handleClose}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="max-width-dialog-title">
          <div className="d-flex flex-row justify-content-between">
            <div></div>
            <h3>New Simulation</h3>
            <div>
              <CloseIcon onClick={handleClose} className={classes.closeIcon} />
            </div>
          </div>
        </DialogTitle>
        {/* {modalLoading && <RctSectionLoader />} */}
        {/* <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle> */}
        <DialogContent style={{ minWidth: "960px" }}>
          <React.Fragment>
            {(isuserinfoLoading || isuserprofileLoading || pageLoading) && (
              <RctSectionLoader />
            )}
            <Stepper activeStep={step} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    <StyledStep>{getContent(index)(stepProps)}</StyledStep>
                    <Button
                      variant="contained"
                      disabled={step === 0 || !socketConnected}
                      onClick={handleBack}
                      className="btn btn-primary"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={
                        step === steps.length - 1
                          ? handlecreateSimulation
                          : handleNext
                      }
                      variant="contained"
                      disabled={!socketConnected}
                      className="ml-2 btn btn-primary"
                    >
                      {step === steps.length - 1 ? "Submit" : "Next"}
                    </Button>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </React.Fragment>
        </DialogContent>
        <DialogActions className="d-flex flex-end justify-content-end align-items-center"></DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state) => ({
  socket: state.simulate.get("socket"),
  simulate: state.simulate,
  userinfo: state.firebase.auth,
  userprofile: state.firebase.profile,
  groundStation: state.GroundStationDetails,
  // groundStation: state.groundStationState,
});

const mapDispatchToProps = {
  setCaseAction: setCase,
  setProjectAction: setProject,
  clearParameter,
  clearSimulationConfigList,
  clearRunSimulationConfigList,
  clearSimulationActiveConfig,
  clearSelectSimulationConfig,
  setGroundStationList,
  resetGroundStationList,
  resetAnalysisCollection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CloneConfigDialog));
