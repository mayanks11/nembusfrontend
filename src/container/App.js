/**
 * App.js Layout Start Here
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import { auth } from "../firebase";
import {
  initSocket,
  closeSocket,
  setSimulationStatus,
} from "../actions/Simulate";

// rct theme provider
import RctThemeProvider from "./RctThemeProvider";

//Horizontal Layout
import HorizontalLayout from "./HorizontalLayout";

//Agency Layout
// import AgencyLayout from './AgencyLayout';

//Main App
import RctDefaultLayout from "./DefaultLayout";

// boxed layout
import RctBoxedLayout from "./RctBoxedLayout";
// CRM layout
// import CRMLayout from './CRMLayout';

// app signin
import AppSignIn from "./SignIn";

//app signup
import Signup from "./Signup";
import { LinkedInCallback } from 'react-linkedin-login-oauth2';

// Forgot Password
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

import { useSelector } from "react-redux";
import { isLoaded, isEmpty } from "react-redux-firebase";

import * as actions from "../actions/AuthActions";
/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */

import Loader from "../components/PreloadLayout/PreloadContent";
const InitialPath1 = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => <Component {...props} />} />
);

const InitialPath = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        (isLoaded(authUser) && !isEmpty(authUser)) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      isConnectedSocket:false,
      timeIntervalaId:null
    };
    this.checkLoginStatus = this.checkLoginStatus.bind(this);
 
  }

  componentDidMount() {
    const isLoading =
      localStorage.getItem("isUserLoggedIn") === "true" && !auth.currentUser;
    // if (isLoading) {
    //   setTimeout(this.checkLoginStatus, 1000);
    // }

    const interval = setInterval(() => {
      this.checkLoginStatus();
    }, 1000)

    this.setState(state => ({
      isLoading: isLoading,
      isConnectedSocket: state.isConnectedSocket,
      timeIntervalaId:interval
    }))
  }

  componentWillUnmount() {
    this.props.closeSocket();
    global.dataSource = null;
  }

  componentDidUpdate(oldProps) {
    const { simulate: oldSimulate } = oldProps;
    const { simulate: newSimulate } = this.props;
    const oldSocket = oldSimulate.get("socket");
    const newSocket = newSimulate.get("socket");
    
    if (!oldSocket && newSocket) {
      
      newSocket.on("simulation_status", (payload) => {
        
        this.props.setSimulationStatus(payload);
      });
    }
  }

  checkLoginStatus(){
    
    if(isLoaded(this.props.user) && !isEmpty(this.props.user))
    {
      this.props.initSocket(this.props.user.uid);
      clearInterval(this.state.timeIntervalaId);
    }
  }

  render() {
    const { location, match, user } = this.props;

    if (!isLoaded(user) ) {
      return <Loader />;
    }

    if (location.pathname != "/signin" && location.pathname != "/forgot-password") {
      if ((isLoaded(user) && isEmpty(user)) && location.pathname !== "/reset-password" && location.pathname !== "/signup" && location.pathname !== "/linkedin") {
        return <Redirect to={"/signin"} />;
      }
    }

    if (location.pathname == "/" || location.pathname == "/app") {
      return <Redirect to={"/app/home"} />;
    }
    
    return (
      <RctThemeProvider>
        <NotificationContainer />
        <InitialPath
          path={`${match.url}app`}
          authUser={user}
          component={RctDefaultLayout}
        />
        <Route path="/signin" exact component={AppSignIn} />
        <Route path="/forgot-password" exact component={ForgotPassword} />
        <Route path="/reset-password" exact component={ResetPassword} />
        <Route path="/signup" exact component={Signup} />
        <Route exact path="/linkedin" component={LinkedInCallback} />
      </RctThemeProvider>
    );
  }
}

// map state to props
const mapStateToProps = ({ firebase, simulate }) => {
  const user = firebase.auth;
  const profile = firebase.profile;


  return {
    user,
    profile,
    simulate,
  };
};

const mapDispatch = {
  initSocket,
  closeSocket,
  setSimulationStatus,
};

export default connect(mapStateToProps, mapDispatch)(App);
