import { fireStore, auth } from "../firebase";
import { NotificationManager } from "react-notifications";

export const UpdatetheAnlysis = async ({
  projectId,
  simulationId,
  analysisSheetId,
  data,
}) => {
  const { drop_area, form_data } = data;
  try {
    const projectRef = fireStore.collection("PROJECT");

    await projectRef
      .doc(projectId)
      .collection("Simulation")
      .doc(simulationId)
      .collection("Analysis")
      .doc(analysisSheetId)
      .update({
        drop_area: drop_area,
        form_data: form_data,
        file_location: null,
        file_name: null,
        plot_graph_collection: {},
        plot_graph_template: [],
        plot_graph_options: {},
      })
      .then(() => {
        NotificationManager.success("Update");
      });
  } catch (err) {
    console.error(err);
    console.log(err);
    NotificationManager.error("Error, While updating sheet");
  }
};

export const removetheDropPath = async ({
  projectId,
  simulationId,
  analysisSheetId,
}) => {
  try {
    const projectRef = fireStore.collection("PROJECT");

    await projectRef
      .doc(projectId)
      .collection("Simulation")
      .doc(simulationId)
      .collection("Analysis")
      .doc(analysisSheetId)
      .update({
        "drop_area.value": null,
        file_location: null,
        file_name: null,
        form_data: null,
        analysisstatus: -1,
        plot_graph_collection: null,
        plot_graph_template: null,
        plot_graph_options: null,
      })
      .then(() => {
        NotificationManager.success("Removed sucessfully");
      });
  } catch (err) {
    console.error(err);
    console.log(err);
    NotificationManager.error("Error, While updating sheet");
  }
};

export const setErrorStatus = async ({
  projectId,
  simulationId,
  analysisSheetId,
}) => {
  try {
    const projectRef = fireStore.collection("PROJECT");

    await projectRef
      .doc(projectId)
      .collection("Simulation")
      .doc(simulationId)
      .collection("Analysis")
      .doc(analysisSheetId)
      .update({
        analysisstatus: 0,
      })
      .then(() => {
        NotificationManager.error("Error Occured");
      });
  } catch (err) {
    console.error(err);
    console.log(err);
    NotificationManager.error("Error Occured");
  }
};

export const getSimulationAnalysisSnapshot = async (
  projectId,
  caseId,
  callback
) => {
  try {
    await fireStore
      .collection("PROJECT")
      .doc(projectId)
      .collection("Simulation")
      .doc(caseId)
      .collection("Analysis")
      .orderBy("sheetname")
      .onSnapshot(function(snapshot) {
        callback(snapshot);
      });

    // const analysisData = (await q.get()).docs.map((doc)=>({
    //  id: doc.id,
    //   ...doc.data()
    // }))
    // return analysisData
  } catch (error) {
    console.log("error: ", error);
  }
};

export const getSimulationAnalysis = async (
  projectId,
  simulationId,
  setAnalysisTab
) => {
  try {
    const querysnapshot = await fireStore
      .collection("PROJECT")
      .doc(projectId)
      .collection("Simulation")
      .doc(simulationId)
      .collection("Analysis")
      .orderBy("sheetname")
      .get();

    let result = [];
    querysnapshot.forEach((element) => {

      console.log("element ==>",element.id)
      setAnalysisTab((draft) => {
        draft.simulationAnalysisCollection.push({ id: element.id, ...element.data() });
      });
    });

    setAnalysisTab((draft) => {
      draft.isloaded = true;
    });

    return result;
  } catch (error) {
    console.log("error: ", error);
  }
};
