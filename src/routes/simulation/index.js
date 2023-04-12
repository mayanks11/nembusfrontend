/**
 * Dasboard Routes
 */
import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import useStateRef from "react-usestateref";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { get, includes, isEmpty } from "lodash";

import {
  AsynSimulateComponent,
  AsynMySimulationComponent,
  AsynNewSimulationComponent,
  AsynSimulationHomeComponent,
  AsyncSharedSimulationsComponent
} from "Components/AsyncComponent/AsyncComponent";

import {
  updateEngineStatus,
  addErrorMessage,
  resetErrorMessage,
  updateExpectedStatus
} from "Actions/SimEngineActions";
import { fromPairs } from "lodash";
import moment from "moment";

import SimulateUtil from "Utils/simulate";

const Simulation = ({
  match,
  user_id,
  socket,
  updateEngineStatusValue,
  simengineValueEpoach,
  addErrorMessage,
  resetErrorMessage,
  updateExpectedStatusValue
}) => {
  useEffect(() => {
    if (timerId) {
      return () => clearInterval(timerId);
    }
  }, []);

  const [
    statusoffsetcollection,
    setOffsetCollection,
    statusoffsetcollectionRef,
  ] = useStateRef([]);

  useEffect(() => {
    if (socket) {
      const topic = `FromClient-${user_id}`;
      socket.emit(topic, { Command: "whatsup" }, (ackResult) => {
        if (ackResult === true) {
        } else {
        }
      });

      const topic_status = `simulation-status-${user_id}`;
      socket.on(topic_status, (message) => {
        const recentmessages = JSON.parse(message);
        recentmessages.forEach((recentmessage) => {

          const statusinfo = JSON.parse(recentmessage.message);

          const offset = recentmessage.offset;
          if (statusinfo) {
            // TODO : Push the code to comlink
            //
            const enginestatus = get(statusinfo, "status");
            const epoch = get(statusinfo, "epoch");
            const time = moment().valueOf();
            const timepass = Math.round((time - epoch) / 1000);

            if (!(timepass > 60 * 1)) {

              if (isEmpty(statusoffsetcollectionRef.current)) {
                setOffsetCollection((oldArray) => [...oldArray, offset]);
                const information = get(statusinfo, ["information"]);

                updateEngineStatusValue({
                  status: enginestatus,
                  epoch: epoch,
                  information: information,
                });

                if (enginestatus === "Error") {
                  const error_message = get(statusinfo, "error_message");
                  addErrorMessage({ error_message: error_message });
                }
                else if (enginestatus === "RUNNING" || enginestatus === "STARTING") {

                  updateExpectedStatusValue({
                    status: enginestatus,
                    epoch: epoch,
                    information: information,
                  })
                  SimulateUtil.updatedExpected_simulation({
                    status: enginestatus,
                    epoch: epoch,
                    information: information,
                  })
                  resetErrorMessage();

                }
                else {
                  resetErrorMessage();
                }


              } else {
                if (!includes(statusoffsetcollectionRef.current, offset)) {
                  setOffsetCollection((oldArray) => [...oldArray, offset]);

                  const information = get(statusinfo, ["information"]);
                  updateEngineStatusValue({
                    status: enginestatus,
                    epoch: epoch,
                    information: information,
                  });


                  if (enginestatus == "Error") {
                    const error_message = get(statusinfo, "error_message");
                    addErrorMessage({ error_message: error_message });
                  }
                  else if (enginestatus == "RUNNING" || enginestatus == "STARTING") {

                    const expected_value = {
                      status: enginestatus,
                      epoch: epoch,
                      information: information,
                    }
                    updateExpectedStatusValue(expected_value, information)

                    SimulateUtil.updatedExpected_simulation(expected_value)
                    console.log("Excpected", expected_value,)
                    resetErrorMessage();

                  }
                  else {
                    resetErrorMessage();
                  }
                }
              }
            }
          }
        });
      });

      const intervalId = setInterval(() => {
        const time = moment().valueOf();
        const timepass = Math.round((time - simengineValueEpoach) / 1000);
        // 120 second that is 3 minute
        if (timepass > 60 * 3) {
          socket.emit(topic, { Command: "whatsup" }, (ackResult) => {
            if (ackResult === true) {
            } else {
            }
          });
        }
      }, 1000 * 60);

      setTimerId(intervalId);
    }
    if (timerId) {
      return () => clearInterval(timerId);
    }
  }, [socket && socket.connected]);

  const [timerId, setTimerId] = useState(null);

  return (
    <div className="content-wrapper">
      <Helmet>
        <title>Simulation | SAT-PASS</title>
        <meta name="description" content="SAT-PASS Simulation" />
      </Helmet>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/home`} />
        <Route
          exact
          path={`${match.url}/home`}
          component={AsynSimulationHomeComponent}
        />
        <Route
          exact
          path={`${match.url}/mysimulation`}
          component={AsynMySimulationComponent}
        />
        <Route
          exact
          path={`${match.url}/newsimulation`}
          component={AsynNewSimulationComponent}
        />
        <Route
          exact
          path={`${match.url}/simulate`}
          component={AsynSimulateComponent}
        />
        <Route
          exact
          path={`${match.url}/sharedsimulations`}
          component={AsyncSharedSimulationsComponent}
        />
      </Switch>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user_id: state.firebase.auth.uid,
  socket: state.simulate.get("socket"),
  simengineValueEpoach: get(state.simengine, [
    "current_engine_states",
    "epoch",
  ]),
});

const mapDispatchToProps = {
  updateEngineStatusValue: updateEngineStatus,
  addErrorMessage: addErrorMessage,
  resetErrorMessage: resetErrorMessage,
  updateExpectedStatusValue: updateExpectedStatus
};



export default connect(mapStateToProps, mapDispatchToProps)(Simulation);
