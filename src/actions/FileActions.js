import firebase, { auth, fireStore } from '../firebase';
import { NotificationManager } from 'react-notifications';
import {
  FILE__SET_IS_FORM_OPEN,
  FILE__SET_FORM_TYPE,
  FILE__SET_EDIT_FORM_DATA,
  FILE__SET_IS_DELETE_DIALOG_OPEN,
  FILE__ENABLE_DELETE_DIALOG,
  FILE__DISABLE_DELETE_DIALOG,
  FILE__SET_FILE,
  FILE__STOP_FILE_LOADING,
  FILE__START_FILE_LOADING
} from './types';
import { getProjectDetails } from './ProjectDetailsActions';
import { getCurrentUserData } from '../helpers/helpers';

export function getFiles() {
  return async (dispatch, getState) => {
    dispatch({ type: FILE__START_FILE_LOADING });
    try {
      const collectionRef = fireStore.collection('File');
      const projectDetails = getState().projectDetails.details;
      const response = await collectionRef
        .where('ProjectDocumentID', '==', projectDetails.uid)
        .where('IsDelete', '==', false)
        .get();

      let dataArray = [];
      response.docs.forEach(value => {
        dataArray.push({
          ...value.data(),
          file: {
            name: value.data().FileName,
            size: value.data().size * 1000,
            type: 'image/jpeg',
            isDummy: true
          },
          lastModified: value.data().LastModifiedBy,
          createByOn: value.data().CreatedBy,
          '': value.data(),
          uid: value.id
        });
      });

      // Sort by LastModifiedOn
      dataArray = dataArray.sort(
        (a, b) => b.LastModifiedOn.seconds - a.LastModifiedOn.seconds
      );

      dispatch({ type: FILE__SET_FILE, data: dataArray });
    } catch (err) {
      console.error({ err });
      NotificationManager.error('Error occurred while fetching Files.');
    }
    dispatch({ type: FILE__STOP_FILE_LOADING });
  };
}

export function addFile(values, setSubmitting) {
  return async (dispatch, getState) => {
    try {
      const { userData } = await getCurrentUserData(dispatch, getState);
      const projectDetails = getState().projectDetails.details;

      const fileDocumentRef = fireStore.collection('File').doc();

      const file = {
        FileName: values.FileName,
        Description: values.Description,
        Extension: values.file.name.split('.').pop(),
        size: parseInt(values.file.size / 1024 + 0.5),
        Status: 'active',
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
        ProjectDocumentID: projectDetails.uid,
        IsDelete: false
      };

      // Upload file
      const path = `files/${projectDetails.uid}/${fileDocumentRef.id}.${file.Extension}`;
      const FileURL = await uploadFile({ path, file: values.file });

      // Add file
      file.FileURL = FileURL;
      await fileDocumentRef.set(file);
      NotificationManager.success('New File added successfully');

      // Close the form
      dispatch(setIsFormOpenFile(false));

      dispatch(getFiles());
    } catch (err) {
      console.error({ err });;
      NotificationManager.error('Error occurred while adding new File.');
      setSubmitting(false);
    }
  };
}

export async function uploadFile({ path, file }) {
  // Upload file
  var storageRef = firebase.storage().ref();
  var imageRef = storageRef.child(path);
  var uploadTask = imageRef.put(file);

  await new Promise(resolve => {
    uploadTask.on('state_changed', function(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log("Upload is " + progress + "% done at path:" + path);
      if (snapshot.bytesTransferred == snapshot.totalBytes) {
        setTimeout(resolve, 1000);
      }
    });
  });
  console.log('fullPath', imageRef.fullPath);
  return await imageRef.getDownloadURL();
}

export async function uploadFileAndGetFullPath({ path, file }) {
  console.log('path', path);
  console.log('file', file);

  // Upload file
  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(path);
  const uploadTask = fileRef.put(file);

  return new Promise(resolve => {
    uploadTask.on('state_changed', function(snapshot) {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done at path:' + path);
      if (snapshot.bytesTransferred == snapshot.totalBytes) {
        console.log('fileRef.fullPath:', fileRef.fullPath);
        setTimeout(resolve(fileRef.fullPath), 100);
      }
    });
  });
}

export function deleteFile(index) {
  return async (dispatch, getState) => {
    dispatch({ type: FILE__DISABLE_DELETE_DIALOG });
    try {
      const file = getState().files.files[index];

      const docRef = fireStore.collection('File').doc(file.uid);
      await docRef.update({
        IsDelete: true,
        Status: ''
      });

      NotificationManager.success('File deleted successfully.');

      // Close the delete dialog
      dispatch(setIsDeleteDialogOpenFile(false));

      // Reload the projects
      dispatch(getFiles());
    } catch (err) {
      console.error({ err });
      NotificationManager.error('Error occurred while deleting the project.');
    }
    dispatch({ type: FILE__ENABLE_DELETE_DIALOG });
  };
}

export function updateFile(values, setSubmitting) {
  return async (dispatch, getState) => {
    try {
      const { userData } = await getCurrentUserData(dispatch, getState);
      const projectDetails = getState().projectDetails.details;

      const docRef = fireStore
        .collection('File')
        .doc(getState().files.editFormData.uid);
      const fileData = {
        FileName: values.FileName,
        Description: values.Description,
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date()
      };

      // Upload the file if there are changes
      if (!values.file.isDummy) {
        console.log('Inside');
        fileData.Extension = values.file.name.split('.').pop();
        fileData.size = parseInt(values.file.size / 1024 + 0.5);

        // Upload file
        const path = `files/${projectDetails.uid}/${docRef.id}.${fileData.Extension}`;
        const FileURL = await uploadFile({ path, file: values.file });

        // Update fileData
        fileData.FileURL = FileURL;
      }

      await docRef.update(fileData);

      NotificationManager.success('File updated successfully.');

      // Close the form
      dispatch(setIsFormOpenFile(false));

      // Reload the project
      dispatch(getFiles());
    } catch (err) {
      console.error({ err });
      NotificationManager.error('Error occurred while updating the File.');
      setSubmitting(false);
    }
  };
}

export function setIsFormOpenFile(data) {
  return async dispatch => {
    dispatch({ type: FILE__SET_IS_FORM_OPEN, data });
  };
}

export function setFormTypeFile(data) {
  return async dispatch => {
    dispatch({ type: FILE__SET_FORM_TYPE, data });
  };
}

export function setEditFormDataFile(data) {
  return async dispatch => {
    dispatch({ type: FILE__SET_EDIT_FORM_DATA, data });
  };
}

export function setIsDeleteDialogOpenFile(data) {
  return async dispatch => {
    dispatch({ type: FILE__SET_IS_DELETE_DIALOG_OPEN, data });
  };
}
