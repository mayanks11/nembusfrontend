/**
 * Main App
 */
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import "./assets/scss/index.scss";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import { JsonFormsDispatch } from "@jsonforms/react";
import { JsonFormsReduxContext } from "@jsonforms/react";
// css
import "./lib/reactifyCss";
import "cesium/Widgets/widgets.css";
import "cesium/Widgets/CesiumWidget/CesiumWidget.css";

// firebase
import firebase from "./firebase";

// app component
import App from "./container/App";

import { configureStore } from "./store";
import { createFirestoreInstance } from "redux-firestore";
import { useSelector } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import history from "./helpers/history";

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
};

const store = configureStore();
const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

const MainApp = () => {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Router history={history}>
          <Switch>
            <Route path="/" component={App} />
          </Switch>
        </Router>
      </MuiPickersUtilsProvider>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
};

export default MainApp;
