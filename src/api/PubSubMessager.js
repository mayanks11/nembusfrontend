import { fireStore, auth, storage } from "../firebase";

export async function getPubSubOffSetValue(uid) {
  try {
    const pubsubMessagerref = fireStore.collection("PubSubMessager");

    const snapshot = await pubsubMessagerref.doc(uid).get();
    
    if (!snapshot.exists) {
      
      return {}
        
      } else {
        
        return {...snapshot.data()}
      }
  } catch (err) {
    console.error(err);
  }
}
