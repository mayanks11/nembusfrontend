import { fireStore, auth } from "../firebase";

const projectRef = fireStore.collection("PROJECT");

export const  getSimulationConfig = async ({
  projectId,
  simulationId,
  configurationId,
  setSimulationHandler
}) => {

  console.log("calling function =======================================================>",
  
  projectId,
  simulationId,
  configurationId,)
  try {
    const configuration = await projectRef
      .doc(projectId)
      .collection("Simulation")
      .doc(simulationId)
      .collection("Configuration")
      .doc(configurationId)
      .get();

      if(configuration.exists) {

        console.log("Simulation ===>",configuration.data())
        setSimulationHandler({id:configuration.id,...configuration.data()})

      }else{
        console.log("Simulation ===> Nothing",)
      }



  } catch (err) {
    console.error(err)
  }
};
