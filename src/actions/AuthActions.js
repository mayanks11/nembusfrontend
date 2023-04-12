/**
 * Auth Actions
 * Auth Action With Google, Facebook, Twitter and Github
 */
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/analytics';;
// import {analytics} from "../firebase"
import { NotificationManager } from "react-notifications";
import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT_USER,
  RESET_FORGOT_PASSWORD_STATE,
} from "Actions/types";
import Axios from "axios";
import { memo } from "react";
import { fireStore, auth } from "../firebase";

/**
 * inactivity duration in milliseconds.
 */
const inactivityTime = 60 * 60 * 1000;
var signoutTimer;

window.addEventListener("click", () => {
  window.clearTimeout(signoutTimer);
  signoutTimer =
    localStorage.getItem("user_id") === null
      ? null
      : window.setTimeout(() => {
          firebase
            .auth()
            .signOut()
            .then(() => {
              localStorage.removeItem("user_id");
              localStorage.setItem("isUserLoggedIn", "false");
              NotificationManager.error("session timed out.");
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch((error) => {});
        }, inactivityTime);
});

/**
 * Redux Action To Sigin User With Firebase
 */
export const signinUserInFirebase = (user, history) => (dispatch) => {
  dispatch({ type: LOGIN_USER });
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      return firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password);
    })
    .then(async (user) => {

      if(user.user.emailVerified === false) {
        firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem("user_id");
          localStorage.setItem("isUserLoggedIn", "false");
          NotificationManager.error("Please verify your email.");
          dispatch({ type: LOGIN_USER_FAILURE });
        })
        .catch((error) => {});
      } else {
          /**
           * add signout timer
           */
          window.clearTimeout(signoutTimer);
          signoutTimer = window.setTimeout(() => {
            firebase
            .auth()
            .signOut()
            .then(() => {
            localStorage.removeItem("user_id");
            localStorage.setItem("isUserLoggedIn", "false");
            NotificationManager.error("session timed out.");
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch((error) => {});
        }, inactivityTime);
        localStorage.setItem("isUserLoggedIn", "true");
        firebase.analytics().logEvent("login",{
              id:user.user.uid,
              email:user.user.email
          });

        await dispatch({
          type: LOGIN_USER_SUCCESS,
          payload: localStorage.getItem("user_id"),
        });
        history.push("/");
        NotificationManager.success("User Login Successfully!");
      }
    })
    .catch((error) => {
      dispatch({ type: LOGIN_USER_FAILURE });

      switch (error.code) {
        case "auth/user-not-found":
          NotificationManager.error(
            "User records does not exists, please contact DeltaV Robotics to create new record"
          );
          break;
        case "auth/wrong-password":
          NotificationManager.error(
            "Invalid password, please click forgot password to reset your password"
          );
          break;
        default:
          NotificationManager.error(error.message);
          break;
      }
    });
};

/**
 * Redux Action To Signup User With Firebase
 */
export const signupUserInFirebase = (user, history) => (dispatch) => {

  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(async (userCredential) => {
    try {
      const ref = fireStore
      .collection("users")
      .doc(userCredential.user.uid);

      userCredential.user.sendEmailVerification();
      console.log("firebase-user", userCredential.user);

      ref.set({
        CompanyName: user.company,
        Email: user.email,
        FirstName: user.firstName,
        LastName: user.lastName,
        id: userCredential.user.uid,
        CreatedDate: userCredential.user.metadata.creationTime,
        LoginDate: userCredential.user.metadata.lastSignInTime,
        Country: user.country,
        IsServerUp: true,
        IsPasswordUpdated: false
      })
      .then(async function(docRef) {
        console.log("user-signup", userCredential, docRef);
        history.push("/signin");
        NotificationManager.success("User Sign Up Successfully!");
      })
      .catch(function(error) {
          console.error("Error", error);
      });
    } catch(error) {
      console.log(error);
    }
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
    NotificationManager.error(errorMessage);
  });
}

/**
 * Redux Action to send forget password link
 */
export const emailPasswordResetLink = (email) => (dispatch) => {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function() {
      // Email sent.

      NotificationManager.success("Password reset link sent to your mail!");
    })
    .catch(function(error) {
      NotificationManager.error("Could not find your account");
    });
};
/**
 * Redux Action To Signout User From  Firebase
 */
export const logoutUserFromFirebase = () => (dispatch) => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch({ type: LOGOUT_USER });
      localStorage.removeItem("user_id");
      localStorage.setItem("isUserLoggedIn", "false");
      location.assign("/");
      NotificationManager.success("User Logout Successfully");
    })
    .catch((error) => {
      NotificationManager.error(error.message);
    });
};

/**
 * Redux Action to reset forgot password state to initial
 */
export const resetForgotPasswordState = () => (dispatch) => {
  dispatch({
    type: RESET_FORGOT_PASSWORD_STATE,
  });
};

/**
 * Redux Action To Signup User In Firebase
 */
// export const signupUserInFirebase = (user, history) => (dispatch) => {
//    dispatch({ type: SIGNUP_USER });
//    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
//       .then((success) => {
//          localStorage.setItem("user_id", "user-id");
//          dispatch({ type: SIGNUP_USER_SUCCESS, payload: localStorage.getItem('user_id') });
//          history.push('/');
//          NotificationManager.success('Account Created Successfully!');
//       })
//       .catch((error) => {
//          dispatch({ type: SIGNUP_USER_FAILURE });
//          NotificationManager.error(error.message);
//       })
// }

// /**
//  * Redux Action To Signin User In Firebase With Facebook
//  */
// export const signinUserWithFacebook = (history) => (dispatch) => {
//    dispatch({ type: LOGIN_USER });
//    const provider = new firebase.auth.FacebookAuthProvider();
//    firebase.auth().signInWithPopup(provider).then(function (result) {
//       localStorage.setItem("user_id", "user-id");
//       dispatch({ type: LOGIN_USER_SUCCESS, payload: localStorage.getItem('user_id') });
//       history.push('/');
//       NotificationManager.success(`Hi ${result.user.displayName}!`);
//    }).catch(function (error) {
//       dispatch({ type: LOGIN_USER_FAILURE });
//       NotificationManager.error(error.message);
//    });
// }

// /**
//  * Redux Action To Signin User In Firebase With Google
//  */
// export const signinUserWithGoogle = (history) => (dispatch) => {
//    dispatch({ type: LOGIN_USER });
//    const provider = new firebase.auth.GoogleAuthProvider();
//    firebase.auth().signInWithPopup(provider).then(function (result) {
//       localStorage.setItem("user_id", "user-id");
//       dispatch({ type: LOGIN_USER_SUCCESS, payload: localStorage.getItem('user_id') });
//       history.push('/');
//       NotificationManager.success(`Hi ${result.user.displayName}!`);
//    }).catch(function (error) {
//       dispatch({ type: LOGIN_USER_FAILURE });
//       NotificationManager.error(error.message);
//    });
// }

// /**
//  * Redux Action To Signin User In Firebase With Github
//  */
// export const signinUserWithGithub = (history) => (dispatch) => {
//    dispatch({ type: LOGIN_USER });
//    const provider = new firebase.auth.GithubAuthProvider();
//    firebase.auth().signInWithPopup(provider).then(function (result) {
//       localStorage.setItem("user_id", "user-id");
//       dispatch({ type: LOGIN_USER_SUCCESS, payload: localStorage.getItem('user_id') });
//       history.push('/');
//       NotificationManager.success(`Hi ${result.user.displayName}!`);
//    }).catch(function (error) {
//       dispatch({ type: LOGIN_USER_FAILURE });
//       NotificationManager.error(error.message);
//    });
// }

// /**
//  * Redux Action To Signin User In Firebase With Twitter
//  */
// export const signinUserWithTwitter = (history) => (dispatch) => {
//    dispatch({ type: LOGIN_USER });
//    const provider = new firebase.auth.TwitterAuthProvider();
//    firebase.auth().signInWithPopup(provider).then(function (result) {
//       localStorage.setItem("user_id", "user-id");
//       dispatch({ type: LOGIN_USER_SUCCESS, payload: localStorage.getItem('user_id') });
//       history.push('/');
//       NotificationManager.success('User Login Successfully!');
//    }).catch(function (error) {
//       dispatch({ type: LOGIN_USER_FAILURE });
//       NotificationManager.error(error.message);
//    });
// }
