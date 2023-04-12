/**
 * Firebase Login
 * Reactify comes with built in firebase login feature
 * You Need To Add Your Firsebase App Account Details Here
 */
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import "firebase/functions";
import 'firebase/analytics';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBTgSkIZUfTm-M0akdhbyB5biUfxze-8A0",
  authDomain: "react-project-1555f.firebaseapp.com",
  databaseURL: "https://react-project-1555f.firebaseio.com",
  projectId: "react-project-1555f",
  storageBucket: "react-project-1555f.appspot.com",
  messagingSenderId: "482105859840",
  appId: "1:482105859840:web:b2b063ae775a316d",
  measurementId: "G-1W6ML671VC"
};

//nembus
// const firebaseConfig = {
//   apiKey: "AIzaSyDrY--34sIxhZHarNZjANbzCXlEQZXv60s",
//   authDomain: "nembus-a2933.firebaseapp.com",
//   projectId: "nembus-a2933",
//   storageBucket: "nembus-a2933.appspot.com",
//   messagingSenderId: "900793597209",
//   appId: "1:900793597209:web:4e265e8e05bf3f1040d988",
//   measurementId: "G-BPF2B22NV3"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyAJmE8hxDB21h_Y-OM2Qdy8rJVHysg55Cw",
//   authDomain: "sat-pass-prod.firebaseapp.com",
//   projectId: "sat-pass-prod",
//   storageBucket: "sat-pass-prod.appspot.com",
//   messagingSenderId: "38172321863",
//   appId: "1:38172321863:web:d027136dbe573f33dda962",
//   measurementId: "G-Z47NQ1LYYX"
// };

firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const auth = firebase.auth();

// const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
// const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
// const githubAuthProvider = new firebase.auth.GithubAuthProvider();
// const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
const database = firebase.database();
const fireStore = firebase.firestore();
const storage = firebase.storage();
const functions = firebase.functions();
const analytics = firebase.analytics();

// firebase.auth().onAuthStateChanged(function(user) {

//   console.log("user---------->",user)
//   if (user) {
//     localStorage.setItem('isUserLoggedIn',"true")

//    const getDoc = fireStore.collection('users').doc(auth.currentUser.uid).get()
//     .then(doc => {
//     if (!doc.exists) {
//       console.log('No such document!');
//       localStorage.setItem('userinfo',NULL)

//     } else {
//       console.log('Document data:', doc.data());
//       localStorage.setItem('userinfo',JSON.stringify(doc.data()))
//     }
//   })
//   .catch(err => {
//     console.log('Error getting document', err);
//   });

//   } else {
//     localStorage.setItem('isUserLoggedIn',"false")
//     localStorage.setItem('userinfo',NULL)

//   }
// });

export {
  auth,
  //    googleAuthProvider,
  //    githubAuthProvider,
  //    facebookAuthProvider,
  //    twitterAuthProvider,
  database,
  fireStore,
  storage,
  functions,
  analytics
};

export default firebase;
