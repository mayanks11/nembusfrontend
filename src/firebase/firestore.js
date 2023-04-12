import firebase from "./index";

const FieldValue = firebase.firestore.FieldValue;

const getCreatedAt = () => ({
  createdAt: FieldValue.serverTimestamp()
});

const getUpdatedAt = () => ({
  updatedAt: FieldValue.serverTimestamp()
});

export async function isDocumentExistedAtRef(docRef) {
  const documentSnapshot = await docRef.get();
  return documentSnapshot.exists;
}

export async function setDocumentAtRef(docRef, data) {
  const result = {
    ...data,
    ...getCreatedAt(),
    ...getUpdatedAt()
  };
  // console.log(
  //   `setting document at ref: ${docRef.path.toString()} with data: ${JSON.stringify(
  //     result
  //   )}`
  // );
  await docRef.set(result);
}

export async function addDocumentAtCollectionRef(collectionRef, data) {
  const result = {
    ...data,
    ...getCreatedAt(),
    ...getUpdatedAt()
  };
  const docRef = await collectionRef.add(result);
  // console.log(
  //   `add document at ref: ${docRef.path.toString()} with data: ${JSON.stringify(
  //     result
  //   )}`
  // );
}

export async function updateDocumentAtRef(docRef, data) {
  const result = {
    ...data,
    ...getUpdatedAt()
  };
  // console.log(
  //   `updating document at ref: ${docRef.path.toString()} with data: ${JSON.stringify(
  //     result
  //   )}`
  // );
  await docRef.update(result);
}

export async function softDeleteDocumentAtRef(docRef) {
  const data = {
    IsDeleted: true
  };
  await updateDocumentAtRef(docRef, data);
}

export const getDownloadUrl = async filePath => {
  const storageRef = firebase.storage().ref();
  let fileRef = storageRef.child(filePath);

  const downloadUrl = await fileRef.getDownloadURL();
  return downloadUrl;
};