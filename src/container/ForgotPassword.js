/**
 * Reset Password Firebase
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link, withRouter } from 'react-router-dom';
import { Form, FormGroup, Input, FormFeedback, FormText } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { Fab } from "@material-ui/core";

// components
// import {
//    SessionSlider
// } from 'Components/Widgets';

// app config
import AppConfig from 'Constants/AppConfig';

// redux action
import {
  emailPasswordResetOtp,
  resetPasswordUsingOtp,
  resetForgotPasswordState,
  emailPasswordResetLink
} from 'Actions';
import { NotificationManager } from 'react-notifications';

//Auth File
// import Auth from '../Auth/Auth';

// const auth = new Auth();

class ForgotPassword extends Component {

  state = {
    email: '',
    otp: '',
    password: '',
    rePassword: ''
  }

	/**
	 * On User Login
	 */
  //    onUserLogin() {
  //       if (this.state.email !== '' && this.state.password !== '') {
  //          this.props.signinUserInFirebase(this.state, this.props.history);
  //       }
  //    }
  /**
   * On Password Reset Action
   */
  onPasswordReset() {
    this.props.emailPasswordResetLink(this.state.email)
  }

  onSetNewPassword() {
    const { email, password, otp, rePassword } = this.state
    if (password.length < 8) return NotificationManager.error("Password length must be atleat 8")
    if (!password.match(/[a-z]/)) return NotificationManager.error("Password must contain one lowercase alphabet")
    if (!password.match(/[A-Z]/)) return NotificationManager.error("Password must contain one uppercase alphabet")
    if (!password.match(/\d+/)) return NotificationManager.error("Password should contain atleast one digit")
    if (!password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) return NotificationManager.error("Password should containe atleast one special character")
    if (password && password != rePassword) {
      return NotificationManager.error('passwords do not match!')
    }

    this.props.resetPasswordUsingOtp(email, otp, password)

  }

  onGoToLoginPage() {
    this.props.resetForgotPasswordState()
    this.props.history.push('/signin')
  }

	/**
	 * On User Sign Up
	 */
  //    onUserSignUp() {
  //       this.props.history.push('/signup');
  //    }

  //    //Auth0 Login
  //    loginAuth0() {
  //       auth.login();
  //    }

  render() {
    const { email, otp, password, rePassword } = this.state;
    const { forgotPassword } = this.props;
    if (forgotPassword && forgotPassword == "success") {
      return (
        <QueueAnim type="bottom" duration={2000}>
          <div className="rct-session-wrapper">
            {/* {loading &&
                  <LinearProgress />
               } */}
            <AppBar position="static" className="session-header">
              <Toolbar>
                <div className="container">
                  <div className="d-flex justify-content-between">
                    <div className="session-logo">
                      <Link to="/">
                        <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
                      </Link>
                    </div>
                    {/* <div>
                              <a className="mr-15" onClick={() => this.onUserSignUp()}>Create New account?</a>
                              <Button variant="contained" className="btn-light" onClick={() => this.onUserSignUp()}>Sign Up</Button>
                           </div> */}
                  </div>
                </div>
              </Toolbar>
            </AppBar>
            <div className="session-inner-wrapper">
              <div className="container">
                <div className="row row-eq-height">
                  <div className="col-sm-7 col-md-7 col-lg-8">
                    <div className="session-body text-center">
                      <div className="session-head mb-30">
                        <h2 className="font-weight-bold">Your Password is Reseted.</h2>
                        {/* <p className="mb-0">Enter your email address and we will send you a link to reset your password</p> */}
                      </div>
                      <Form>
                        <FormGroup className="mb-15">
                          <Button
                            color="primary"
                            className="btn-block text-white w-100"
                            variant="contained"
                            size="large"
                            onClick={() => this.onGoToLoginPage()}
                          > Go to Login Page </Button>
                        </FormGroup>
                      </Form>
                      {/* <p className="mb-0"><Link to="/signin">Already Have an account? SignIn</Link></p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </QueueAnim>
      );
    }

    if (forgotPassword && forgotPassword == "enterOtp") {
      const { email, password, otp, rePassword } = this.state
      let isPasswordStrong = password.length >= 8 && password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/\d+/) && password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)
      let isPasswordInvalid = password.length > 0 ? !isPasswordStrong : false
      let isPasswordValid = password.length > 0 ? isPasswordStrong : false
      return (
        <QueueAnim type="bottom" duration={2000}>
          <div className="rct-session-wrapper">
            {/* {loading &&
                   <LinearProgress />
                } */}
            <AppBar position="static" className="session-header">
              <Toolbar>
                <div className="container">
                  <div className="d-flex justify-content-between">
                    <div className="session-logo">
                      <Link to="/">
                        <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
                      </Link>
                    </div>
                    {/* <div>
                               <a className="mr-15" onClick={() => this.onUserSignUp()}>Create New account?</a>
                               <Button variant="contained" className="btn-light" onClick={() => this.onUserSignUp()}>Sign Up</Button>
                            </div> */}
                  </div>
                </div>
              </Toolbar>
            </AppBar>
            <div className="session-inner-wrapper">
              <div className="container">
                <div className="row row-eq-height">
                  <div className="col-sm-7 col-md-7 col-lg-8">
                    <div className="session-body text-center">
                      <div className="session-head mb-30">
                        <h2 className="font-weight-bold">Reset Your Password</h2>
                        <p className="mb-0">Enter Otp sent to your mail and new password</p>
                      </div>
                      <Form>
                        <FormGroup className="has-wrapper">
                          <Input
                            type="text"
                            value={otp}
                            name="otp"
                            id="otp"
                            className="has-input input-lg"
                            placeholder="Enter Otp"
                            onChange={(event) => this.setState({ otp: event.target.value })}
                          />
                          <span className="has-icon"><i className="ti-otp"></i></span>
                        </FormGroup>
                        <FormGroup className="has-wrapper">
                          <Input
                            type="password"
                            value={password}
                            name="password"
                            id="password"
                            className="has-input input-lg"
                            placeholder="Enter New Password"
                            onChange={(event) => this.setState({ password: event.target.value })}
                            valid={isPasswordValid}
                            invalid={isPasswordInvalid}
                          />
                          <span className="has-icon"><i className="ti-lock"></i></span>
                          {
                            isPasswordInvalid &&
                          <FormFeedback invalid={true}>'password is too weak.'</FormFeedback>
                          }
                          <FormText>Password must be of minimum 8 characters with atleast one uppercase letter, lowercase leter, digit and special character.</FormText>
                        </FormGroup>
                        <FormGroup className="has-wrapper">
                          <Input
                            type="password"
                            value={rePassword}
                            name="re-password"
                            id="re-password"
                            className="has-input input-lg"
                            placeholder="Re-enter password"
                            onChange={(event) => this.setState({ rePassword: event.target.value })}
                          />
                          <span className="has-icon"><i className="ti-lock"></i></span>
                        </FormGroup>
                        <FormGroup className="mb-15">
                          <Button
                            color="primary"
                            className="btn-block text-white w-100"
                            variant="contained"
                            size="large"
                            onClick={() => this.onSetNewPassword()}
                          > Update Password </Button>
                        </FormGroup>
                      </Form>
                      {/* <p className="mb-0"><Link to="/signin">Already Have an account? SignIn</Link></p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </QueueAnim>
      );
    }

    return (
      <QueueAnim type="bottom" duration={2000}>
        <div className="rct-session-wrapper">
          {/* {loading &&
                  <LinearProgress />
               } */}
          <AppBar position="static" className="session-header">
            <Toolbar>
              <div className="container">
                <div className="d-flex justify-content-between">
                  <div className="session-logo">
                    <Link to="/">
                      <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
                    </Link>
                  </div>
                  {/* <div>
                              <a className="mr-15" onClick={() => this.onUserSignUp()}>Create New account?</a>
                              <Button variant="contained" className="btn-light" onClick={() => this.onUserSignUp()}>Sign Up</Button>
                           </div> */}
                </div>
              </div>
            </Toolbar>
          </AppBar>
          <div className="session-inner-wrapper">
            <div className="container">
              <div className="row row-eq-height">
                <div className="col-sm-7 col-md-7 col-lg-8">
                  <div className="session-body text-center">
                    <div className="session-head mb-30">
                      <h2 className="font-weight-bold">{forgotPassword == 'error' ? 'Please Try Again!' : 'Reset Your Password'}</h2>
                      <p className="mb-0">{forgotPassword == 'error' ? 'Could not reset your password, make sure you enter valid otp' : 'Enter your email address and we will send you a link to reset your password'}</p>
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
                          onChange={(event) => this.setState({ email: event.target.value })}
                        />
                        <span className="has-icon"><i className="ti-email"></i></span>
                      </FormGroup>
                      <FormGroup className="mb-15">
                        <Button
                          color="primary"
                          className="btn-block text-white w-100"
                          variant="contained"
                          size="large"
                          onClick={() => this.onPasswordReset()}
                        > Send Password Reset Email </Button>
                      </FormGroup>
                    </Form>
                    <p className="mb-0"><Link to="/signin">Already Have an account? SignIn</Link></p>
                  </div>
                </div>
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
  const { forgotPassword } = authUser
  return { forgotPassword }
}

export default withRouter(connect(mapStateToProps, {
  emailPasswordResetOtp,
  resetPasswordUsingOtp,
  resetForgotPasswordState,
  emailPasswordResetLink
}
)(ForgotPassword));
