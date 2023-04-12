/**
 * Nirmalya Saha
 * B2B - B2C
 * Sign Up
 */
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';
import QueueAnim from 'rc-queue-anim';
import { Fab } from '@material-ui/core';
import { NotificationManager } from 'react-notifications';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import axios from 'axios';
import * as firebase from "firebase";

// redux action
import { signupUserInFirebase } from "Actions";

// app config
import AppConfig from 'Constants/AppConfig';

//country
import Country from './country';

function Signup(props) {

  // Constants
  const urlToGetLinkedInAccessToken = 'https://www.linkedin.com/oauth/v2/accessToken';
  const urlToGetUserProfile ='https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))'
  const urlToGetUserEmail = 'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))';

  //states
   const [name, setName] = useState("");
   const [lastName, setLastName] = useState("");
   const [email, setEmail] = useState("demo@example.com");
   const [password, setPassword] = useState("test#123");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [companyName, setCompanyName] = useState("");
   const [country, setCountry] = useState("");
   const [isChecked, setIsChecked] = useState(false);

   const regex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

	/**
	 * On User Signup
	 */
   const onUserSignUp = () => {
        if(email === "" || password === "") {
            NotificationManager.error("email or password cannot be empty");
        }else if(!isChecked) {
            NotificationManager.error("Please check in Terms of services and privacy policy checkbox to Sign up");
        } else if(name === "" || lastName == "" || companyName == "" || country == "") {
            NotificationManager.error("Required fields cannot be empty");
        } else if(password !== confirmPassword) {
          NotificationManager.error("Password miss match");
        } else if(!regex.test(password)) {
          NotificationManager.error("Please enter a valid password");
        }else {
          const user = {
            email: email,
            password: password,
            company: companyName,
            firstName: name,
            lastName: lastName,
            country: country
          }
          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
            'callback': (response) => {
              props.signupUserInFirebase(user, props.history);
            },
            'expired-callback': () => {
              NotificationManager.error("Recapcha expired please refresh the page");
            }
          })
          window.recaptchaVerifier.render();
        }
   }



   /**
    * LinkedIn Authentication
    */
  const { linkedInLogin } = useLinkedIn({
    clientId: '86x4qlmmuykyfh',
    redirectUri: `${window.location.origin}/linkedin`,
    onSuccess: (code) => {
      getData(code);
      NotificationManager.success(`${code}`);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const getData = async (code) => {
    // const accessToken = await getAccessToken(code);
    // const userProfile = await getUserProfile(accessToken);
    // const email = await getUserEmail(accessToken);
    try {
      const getLinkedInUserData = firebase
        .app()
        .functions('us-central1')
        .httpsCallable('linkedInAuth');

      const data = await getLinkedInUserData({
        code: code
      });
      console.log("get-data", code, data);
    } catch(err) {
      console.log("get-data-error", err);
    }
    
  }
    /**
   * Get access token from LinkedIn
   * @param code returned from step 1
   * @returns accessToken if successful or null if request fails 
   */
    const getAccessToken = async (code) => {
      var accessToken = null;
      try {
        // const response = await fetch(urlToGetLinkedInAccessToken,{
        //   mode: 'no-cors',
        //   method: 'POST',
        //   headers: {
        //     "Content-Type": 'application/x-www-form-urlencoded'
        //   },
        //   body: JSON.stringify({
        //     "grant_type": "authorization_code",
        //     "code": code,
        //     "redirect_uri": `${window.location.origin}/linkedin`,
        //     "client_id": "86x4qlmmuykyfh",
        //     "client_secret": "BEua44CWrsoztPZY",
        //   })
        // });
        const client_id = "86x4qlmmuykyfh";
        const client_secret = "BEua44CWrsoztPZY";
        const redirect_uri = `${window.location.origin}/linkedin`;

        const response = await axios.post(`https://www.linkedin.com/oauth/v2/accessToken?code=${code}&grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}`,
         {mode: "no-cors",
        headers: {
          'Access-Control-Allow-Origin':'*'
        }});
  
        accessToken = response;
        console.log("access-token", accessToken, response);
      } catch (error) {
        console.log("error in accessing token");
      }
      return accessToken;
    }
  /**
   * Get user first and last name and profile image URL
   * @param accessToken returned from step 2
   */
  const getUserProfile = async (accessToken) => {
    var userProfile = null;
    try {
      const config = {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      }
      const response = await axios.get(urlToGetUserProfile, config);
      // const response = await fetch(urlToGetUserProfile,{
      //   method: 'GET',
      //   headers: {
      //     "Authorization": `Bearer ${accessToken}`
      //   }
      // });

      userProfile = response;
      console.log("user-profile", userProfile, response);
    } catch (error) {
      console.log("error in accessing user profile");
    }
    return userProfile;
  }
  /**
   * Get user email
   * @param accessToken returned from step 2
   */
  const getUserEmail = async (accessToken) => {
    var email = null;
    try {
      const config = {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      }
      const response = await axios.get(urlToGetUserEmail, config);
      // const response = await fetch(urlToGetUserEmail,{
      //   method: 'GET',
      //   headers: {
      //     "Authorization": `Bearer ${accessToken}`
      //   }
      // });

      email = response;
      console.log("user-profile", email, response);
    } catch (error) {
      console.log("error in accessing user profile");
    }
    return email;
  }


 
      return (
         <QueueAnim type="bottom" duration={2000}>
            <div className="rct-session-wrapper">
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
                    <Link to="/signin" className="mr-15 text-white">Already have an account?</Link>
                      <Button
                        component={Link}
                        to="/signin"
                        variant="contained"
                        className="btn-light"
                    >
                      Sign In
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
                          type="text"
                          value={name}
                          name="First Name"
                          id="user-name"
                          className="has-input input-lg"
                          placeholder="Enter First Name"
                          onChange={(event) =>
                            setName(event.target.value)
                          }
                         />
                        <span className="has-icon">
                          <i className="ti-user"></i>
                        </span>
                      </FormGroup>
                      <FormGroup className="has-wrapper">
                        <Input
                          type="text"
                          value={lastName}
                          name="Last Name"
                          id="user-name-last"
                          className="has-input input-lg"
                          placeholder="Enter Last Name"
                          onChange={(event) =>
                            setLastName(event.target.value)
                          }
                         />
                        <span className="has-icon">
                          <i className="ti-user"></i>
                        </span>
                      </FormGroup>
                      <FormGroup className="has-wrapper">
                        <Input
                          type="text"
                          value={companyName}
                          name="Company Name"
                          id="user-company-name"
                          className="has-input input-lg"
                          placeholder="Enter Company Name"
                          onChange={(event) =>
                            setCompanyName(event.target.value)
                          }
                         />
                        <span className="has-icon">
                          <i className="ti-company"></i>
                        </span>
                      </FormGroup>
                      <FormGroup className="has-wrapper">
                        <Input
                          style={{ height: "auto" }}
                          type="select"
                          value={country}
                          name="Country"
                          id="user-country"
                          className="has-input input-lg"
                          placeholder="Enter Country"
                          onChange={(event) =>
                            setCountry(event.target.value)
                          }
                         >
                          {
                            Country.map((element, index) => {
                              return (
                                <option value={element.code}>{element.name}</option>
                              )
                            })
                          }
                         </Input>
                        <span className="has-icon">
                          <i className="ti-country"></i>
                        </span>
                      </FormGroup>
                      <FormGroup className="has-wrapper">
                        <Input
                          type="mail"
                          value={email}
                          name="user-mail"
                          id="user-mail"
                          className="has-input input-lg"
                          placeholder="Enter Email Address"
                          onChange={(event) =>
                            setEmail(event.target.value)
                          }
                         />
                        <span className="has-icon">
                          <i className="ti-email"></i>
                        </span>
                      </FormGroup>
                      <FormGroup className="has-wrapper">
                        <Input
                          value={password}
                          invalid={regex.test(password) === false ? true : false}
                          type="Password"
                          name="user-pwd"
                          id="pwd"
                          className="has-input input-lg"
                          placeholder="Password"
                          onChange={(event) =>
                            setPassword(event.target.value)
                          }
                        />
                        <span className="has-icon">
                          <i className="ti-lock"></i>
                        </span>
                      </FormGroup>
                      <FormGroup className="has-wrapper">
                        <Input
                          valid={password === confirmPassword ? true : false}
                          invalid={password !== confirmPassword ? true : false}
                          value={confirmPassword}
                          type="Password"
                          name="user-pwd"
                          id="-confirm-pwd"
                          className="has-input input-lg"
                          placeholder="Confirm Password"
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
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
                              setIsChecked(!isChecked)
                            }}
                          />
                          <label style={{paddingLeft:'10px'}}>
                            I agree to <a href= 'https://deltavrobo.com/terms-and-conditions/' target="_blank" style={{color: '#4166AA'}}>terms of services </a> &  
                            <a href = 'https://deltavrobo.com/privacy-policy/' target="_blank" style={{color: '#4166AA'}}> privacy policy</a>
                          </label>
                        </div>
                      </FormGroup>
                      <div id="recaptcha"></div>
                      <FormGroup className="mb-15">
                        <Button
                          color="primary"
                          className="btn-block text-white w-100"
                          variant="contained"
                          size="large"
                          onClick={()=> onUserSignUp()}
                        >
                          Sign Up
                        </Button>
                      </FormGroup>
                      <p className="mb-20">or sign up with</p>
                     <Fab size="small" variant="round" className="btn-facebook mr-15 mb-20 text-white"  
                        onClick={linkedInLogin}
                     >
                        <i className="zmdi zmdi-linkedin"></i>
                     </Fab>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </div>
         </QueueAnim>
      );
}

// map state to props
const mapStateToProps = ({ authUser }) => {

};

export default connect(mapStateToProps, {
  signupUserInFirebase
})(Signup);
