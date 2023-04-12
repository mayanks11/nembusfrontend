import { fireStore } from "../firebase";

export const  getGenericcomponents = async (setGenericComponents) => {
  try {
    const Components = fireStore.collection("GENERICCOMPONENTS");
    const conponents = await Components.get();

    let response = conponents.docs.map((conf) => ({
      id: conf.id,
      ...conf.data(),
    }));
    setGenericComponents(draft=>{
      draft.componentsList=response
    })

    setGenericComponents(draft=>{
      draft.isLoading=true
    })

  } catch (error) {
    console.log("error: ", error);
  }
};
