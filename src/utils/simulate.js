import * as Cesium from "cesium/Cesium";
// import {
//   get,
// } from "immutable";
import { get, includes, isEmpty } from "lodash";

import { CesiumController } from "../components/Visualization/Cesium/CesiumController";

// TODO : Consider the casing options

export default class Simulate {
  topic = "";
  socket = null;
  totalCzml = [];
  currentCzml = null;
  viewer = null;
  dataSource = null;
  cesiumcontroller = null;
  expected_simulation = null;
  file_order_list = [];
  updateprogreeHandler = null;
  updateActualSimulationdetail = null;

  static initCesium(socket, uid) {
    const topic = `toclient-czml-new-${uid}`;

    this.cesiumcontroller = new CesiumController();
    this.dataSource = this.cesiumcontroller.dataSource;
    let czmls = [];
    socket.on(topic, (message) => {
      let newmessage = JSON.parse(message);
      // console.log("got czml:", Object.keys(message),JSON.parse(message),JSON.parse(newmessage[0].message))
     

      newmessage.forEach((message) => {
        const parsedCzml = JSON.parse(message.message);
        // TODO : First discard if the time is above the expected
        // If the simulation detail should match with the expected
        const expected_project_id = get(this.expected_simulation, [
          "information",
          "project_id",
        ]);
        const expected_simulation_id = get(this.expected_simulation, [
          "information",
          "simulation_id",
        ]);
        const expected_configuration_id = get(this.expected_simulation, [
          "information",
          "configuration_id",
        ]);
        const expected_runid = get(this.expected_simulation, [
          "information",
          "runid",
        ]);

        const actual_project_id = get(parsedCzml, [
          "simulatioinfo",
          "Project id",
        ]);
        const actual_simulation_id = get(parsedCzml, [
          "simulatioinfo",
          "Simulation id",
        ]);
        const actual_configuration_id = get(parsedCzml, [
          "simulatioinfo",
          "Parameter id",
        ]);
        const actual_runid = get(parsedCzml, ["simulatioinfo", "Runid"]);

        // console.log(
        //   "which is wrong",
        //   expected_project_id,
        //   actual_project_id,
        //   expected_simulation_id === actual_simulation_id,
        //   expected_configuration_id === actual_configuration_id,
        //   expected_configuration_id ,actual_configuration_id,
        //   expected_runid === actual_runid
        // );

        if (
          expected_project_id === actual_project_id &&
          expected_simulation_id === actual_simulation_id &&
          expected_configuration_id === actual_configuration_id &&
          expected_runid === actual_runid
        ) {
          const fileorder = get(parsedCzml, ["fileinfo", "fileorder"]);
          if (isEmpty(this.file_order_list)) {
            this.file_order_list.push(fileorder);
            czmls = czmls.concat(parsedCzml.data);
            global.czmls = czmls;
            this.dataSource.process(parsedCzml.data);

            if (this.updateprogreeHandler) {
              // this.updateprogreeHandler({
              //   status: "Starting",
              //   epoch: 0,
              //   simulation_done: 0,
              //   simulatioinfo: get(parsedCzml, ["simulatioinfo"])
              // });
            }
          } else {
            if (!includes(this.file_order_list, fileorder)) {
              
              const epoch = get(parsedCzml, ["epoch"]);
              const simulation_done = get(parsedCzml, [
                "fileinfo",
                "simulation_done",
              ]);
              let status = "STARTING";
              if (simulation_done > 0 && simulation_done < 100) {
                status = "RUNNING";
              } else if (simulation_done == 100 || simulation_done > 100) {
                
                status = "COMPLETED";

              }
              if(this.updateprogreeHandler){
                this.updateprogreeHandler({
                  status: status,
                  epoch: epoch,
                  simulation_done: simulation_done,
                  simulatioinfo: get(parsedCzml, ["simulatioinfo"])
                });

              }
              

              this.file_order_list.push(fileorder);
              czmls = czmls.concat(parsedCzml.data);
              global.czmls = czmls;
              this.dataSource.process(parsedCzml.data);
            }
          }
        } else {
        }
      });

      // const parsedCzml = JSON.parse(newmessage[0].message);
      // console.log("parsedCzml ====>",parsedCzml)
      // czmls = czmls.concat(parsedCzml.data);
      // global.czmls = czmls;
      // this.dataSource.process(parsedCzml.data);
    });

    return this.cesiumcontroller;
  }

  static initCesium2(socket, uid) {
    const newViewer = new CesiumController();
    this.dataSource = newViewer.dataSource;

    let czmls = [];
    console.log("attaching czml listener : ", socket);
    socket.off("czml");
    // const topic = `toclient-czml-new-${uid}`
    const topic = "toclient-czml-new-Mgu4FD4pbVUUqqoAv2bv1w6Lqyy1";
    socket.on(topic, (message) => {
      let newmessage = JSON.parse(message);
      console.log(
        "got czml:",
        Object.keys(message),
        JSON.parse(message),
        JSON.parse(newmessage[0].message)
      );
      const parsedCzml = JSON.parse(newmessage[0].message);
      czmls = czmls.concat(parsedCzml);
      global.czmls = czmls;
      this.dataSource.process(parsedCzml);
    });
    return this.dataSource;
  }

  static addProgressHandler(handler, updateActualsimHandler) {
    this.updateprogreeHandler = handler;
    this.updateActualSimulationdetail = updateActualsimHandler;
  }

  static initCesiumCached(socket, uid) {
    if (isEmpty(global.czmls)) {
      this.initCesium(socket, uid);
      return;
    }

    // !global.czmls &&

    this.cesiumcontroller = new CesiumController();
    this.dataSource = this.cesiumcontroller.dataSource;
    const czmls = global.czmls;
    setTimeout(() => {
      for (let i = 0; i < czmls.length; i++) {
        this.dataSource.process(czmls[i]);
      }
    }, 2000);
  }

  static updatedExpected_simulation(data) {
    this.file_order_list = [];
    this.expected_simulation = {
      ...data,
    };
  }
}
