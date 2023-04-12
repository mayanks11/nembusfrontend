/**
 * Signin Firebase
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";
import { Form, FormGroup, Input } from "reactstrap";
import LinearProgress from "@material-ui/core/LinearProgress";
import QueueAnim from "rc-queue-anim";
// import LinkMaterila from "@material-ui/core/Link";
// import SatelliteImage from '../../assets/login.jpg';
// app config
import AppConfig from "Constants/AppConfig";

// redux action
import { signinUserInFirebase } from "Actions";

import { NotificationManager } from 'react-notifications';



//Auth File
import Auth from "../../Auth/Auth";

import "./index.scss";

const auth = new Auth();

class Signin extends Component {
  state = {
    email: "demo@example.com",
    password: "test#123",
    isChecked:false,
    opentermsandcondition:false
  };

  /**
   * On User Login
   */
  onUserLogin() {

   if(!(this.state.email !== "" && this.state.password !== "")){
      NotificationManager.error(" Username or password cannot be empty ");

   }else if(!this.state.isChecked){

      NotificationManager.error("Please check in Terms of services and privacy policy checkbox to Sign in");

   }else if (this.state.email !== "" && this.state.password !== "") {
      this.props.signinUserInFirebase(this.state, this.props.history);
    }
  }

  /**
   * On User Sign Up
   */
  onUserSignUp() {
    this.props.history.push("/signup");
  }

  //Auth0 Login
  loginAuth0() {
    auth.login();
  }

//   openTermandCondition(){
//      console.log("hii")
//    //   this.setState({opentermsandcondition:true})
//   }

  render() {
    const { email, password ,isChecked} = this.state;
    const { loading } = this.props;
    return (
      <QueueAnim type="bottom" duration={2000}>
        <div className="rct-session-wrapper">
          {loading && <LinearProgress />}
          <AppBar position="static" className="session-header">
            <Toolbar>
              <div className="container">
                <div className="d-flex justify-content-between">
                  <div className="session-logo">
                    <Link to="/">
                      <img
                        src={AppConfig.appLogo}
                        alt="session-logo"
                        className="img-fluid"
                        width="110"
                        height="35"
                      />
                    </Link>
                  </div>
                  <div style={{ margin: "10px" }}>
                    <Link to="/signup" className="mr-15 text-white">Already have an account?</Link>
                      <Button
                        onClick={()=> this.onUserSignUp()}
                        component={Link}
                        to="/signup"
                        variant="contained"
                        className="btn-light"
                    >
                      Sign Up
										</Button>
                  </div>
                </div>
              </div>
            </Toolbar>
          </AppBar>
          <div className="session-inner-wrapper">
            <div className="container">
              <div className="row row-eq-height myrow">
                <div className="col-sm-8 col-md-8 col-lg-8">
                  <div className="session-body text-center">
                    <div className="session-head mb-30">
                      <h2 className="font-weight-bold">
                        Get started with {AppConfig.brandName}
                      </h2>
                      <p className="mb-0">
                        One-Click solution for Satellite Planning, Analysis,
                        Simulation & Selection{" "}
                      </p>
                    </div>
                    <Form>
                      <FormGroup className="has-wrapper">
                        <Input
                          type="mail"
                          value={email}
                          name="user-mail"
                          id="user-mail"
                          className="has-input input-lg"
                          placeholder="Enter Email Address"
                          onChange={(event) =>
                            this.setState({ email: event.target.value })
                          }
                         />
                        <span className="has-icon">
                          <i className="ti-email"></i>
                        </span>
                      </FormGroup>
                      <FormGroup className="has-wrapper">
                        <Input
                          value={password}
                          type="Password"
                          name="user-pwd"
                          id="pwd"
                          className="has-input input-lg"
                          placeholder="Password"
                          onChange={(event) =>
                            this.setState({ password: event.target.value })
                          }
                        />
                        <span className="has-icon">
                          <i className="ti-lock"></i>
                        </span>
                      </FormGroup>
                      <FormGroup className="has-wrapper">
                        <div>
                          <input
                            type="checkbox"
                            defaultChecked={isChecked}
                            id="agree"
                         
                            onChange={(event) => {
                               console.log(event.target.value)
                              this.setState({isChecked: !isChecked})
                            }}
                          />
                          <label style={{paddingLeft:'10px'}}>
                            I agree to <a href= 'https://deltavrobo.com/terms-and-conditions/' target="_blank" style={{color: '#4166AA'}}>terms of services </a> &  
                            <a href = 'https://deltavrobo.com/privacy-policy/' target="_blank" style={{color: '#4166AA'}}> privacy policy</a>
                          </label>

                    
      
                        </div>
                     
                      </FormGroup>
                      <FormGroup className="mb-15">
                        <Button
                          color="primary"
                          className="btn-block text-white w-100"
                          variant="contained"
                          size="large"
                          onClick={() => this.onUserLogin()}
                        >
                          Sign In
                        </Button>
                      </FormGroup>
                    </Form>
                    <p className="mb-0">
                      <Link to="/forgot-password">Forgot password?</Link>
                    </p>
                  </div>
                </div>
              

                
                {/* <div className="col-sm-3 col-md-3 myimg">
                           <img src={SatelliteImage} />
                        </div> */}
              </div>
            </div>
          </div>
        </div>
      </QueueAnim>
    );
  }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return { user, loading };
};

export default connect(mapStateToProps, {
  signinUserInFirebase,
})(Signin);
