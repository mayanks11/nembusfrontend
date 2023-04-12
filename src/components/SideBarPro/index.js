/**
 * Sidebar Component
 * Nembus B2C
 * Nirmalya Saha
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Sidebar,
  Menu,
  MenuItem,
  useProSidebar,
  menuClasses
} from 'react-pro-sidebar';
import { Typography, Tooltip, Popover } from '@material-ui/core';
import { ExitToApp, Home, Launch, HelpOutline, VerifiedUser, KeyboardArrowLeft } from '@material-ui/icons';
import { Link } from "react-router-dom";
import * as firebase from '../../firebase'; 

// redux action
import { logoutUserFromFirebase, miniSidebarAction } from 'Actions';

import './styles.css';

const themes = {
  light: {
    sidebar: {
      backgroundColor: '#fff',
      color: '#607489',
    },
    menu: {
      menuContent: '#fbfcfd',
      icon: '#0098e5',
      hover: {
        backgroundColor: '#e6f2fd',
        color: '#44596e',
      },
      active: {
        backgroundColor: '#13395e',
        color: '#b6c8d9',
      },
      disabled: {
        color: '#3e5e7e',
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: '#0b2948',
      color: '#8ba1b7',
    },
    menu: {
      menuContent: '#082440',
      icon: '#59d0ff',
      hover: {
        backgroundColor: '#0e3052',
        color: '#b6c8d9',
      },
      active: {
        backgroundColor: '#13395e',
        color: '#b6c8d9',
      },
      disabled: {
        color: '#3e5e7e',
      },
    },
  },
};

const SideBarPro = (props) => {
  const { toggleSidebar, collapseSidebar, broken, collapsed } = useProSidebar();
  const theme = 'dark';
  const isRTL = false;

  const [companyName, setCompanyName] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const menuItemStyles = {
    root: {
      fontSize: '13px',
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
    },
    SubMenuExpandIcon: {
      color: '#b6b7b9',
    },
    subMenuContent: {
      backgroundColor: themes[theme].menu.menuContent,
    },
    button: {
      [`&.${menuClasses.active}`]: {
        backgroundColor: themes[theme].menu.active.backgroundColor,
        color: themes[theme].menu.active.color,
      },
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      '&:hover': {
        backgroundColor: themes[theme].menu.hover.backgroundColor,
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  useEffect(()=> {
    const fetch = async () => {
      const { fireStore } = firebase;
      const email = firebase.auth.currentUser.email;
      try {
        const result = await fireStore.collection('users').where('Email', '==', email).get();
  
        result.forEach(doc => {
          const {
            CompanyName
          } = doc.data();
          setCompanyName(CompanyName);
        })
      }
      catch(err) {
        console.log(err);
      }
    }
    fetch();
  },[]);

  const logoutUserPopper = (event) => {
    if(anchorEl === null) {
      setAnchorEl(event.currentTarget);
      console.log("anchor set position", event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const logoutUserPopperClose = () => {
    setAnchorEl(null);
  };

	const logoutUser = () => {
    setAnchorEl(null);
		props.logoutUserFromFirebase();
	}

  const onCollapse = () => {
    props.miniSidebarAction(!collapsed);
    collapseSidebar();
    setAnchorEl(null);
  }

  return (
    <div style={{ display: 'flex', height: '100%', direction: isRTL ? 'rtl' : 'ltr' }}>
      <Sidebar
        image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
        rtl={isRTL}
        backgroundColor={themes[theme].sidebar.backgroundColor}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
      >
       
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="site-logo">
              <Link to="/app/home" className="logo-mini">
                <img
                  src={require("Assets/img/site-logo.png")}
                  className="mr-15"
                  alt="site logo"
                  width="35"
                  height="30"
                />
              </Link>
              <Link to="/app/home" className="logo-normal">
                <img
                  src={require("Assets/img/appLogoText.png")}
                  className="img-fluid"
                  alt="site-logo"
                  width="67"
                  height="17"
                />
              </Link>
          </div>

          <div style={{ display: "flex", flexBasis: "80%", flexDirection: "column" }}>
            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
              <Typography variant='h5'
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                {companyName}
              </Typography>
            </div>

            <Menu style={{ flex: "auto" }} menuItemStyles={menuItemStyles}>
              <Link style={{ color: "inherit", width: "100%" }} to="/app/home">
                <MenuItem icon={
                    <Tooltip title="Overview">
                      <Home />
                    </Tooltip>
                  }>
                    Overview
                </MenuItem>
              </Link>
            </Menu>

            <div style={{ padding: '0 24px' }}>
              <Typography variant='h5'
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                General
              </Typography>
            </div>

            <Menu menuItemStyles={menuItemStyles}>
              <a className='link' href='https://deltavrobo.com/resource/' target='blank'>
                <MenuItem icon={
                    <Tooltip title="Get Started">
                      <Launch />
                    </Tooltip>
                  }>
                    Get Started
                </MenuItem>
              </a>

              <a className='link' href='https://app.archbee.com/public/bziqq5P_YbH1e8h4_GGnM' target='blank'>
              <MenuItem icon={
                <Tooltip title="Help & Support">
                  <HelpOutline />
                </Tooltip>
              }>
                Help & Support
              </MenuItem>
              </a>
              
              <a className='link' href='https://deltavrobo.com/privacy-policy/' target='blank'>
                <MenuItem icon={
                  <Tooltip title="Privacy Policies">
                    <VerifiedUser />
                  </Tooltip>
                }> 
                  Privacy Policies
                </MenuItem>
              </a>
              
              {!collapsed && <div className='company'>Delta-V Analytics &copy; 2023 All rights reserved</div>}

              <MenuItem onClick={() => onCollapse()} icon={
                <Tooltip title="Collapse">
                  <KeyboardArrowLeft/>
                </Tooltip>
              }>
                Collapse
              </MenuItem>
            </Menu>
          </div>
          <div className="nav-footer">
            {!collapsed && (
              <div className="nav-details">
                <img
                  className="nav-footer-avatar"
                  src={require('Assets/avatars/profile.jpg')}
                  alt=""
                />
                <div className="nav-footer-info">
                  <p className="nav-footer-user-name">{props.profile && props.profile.FirstName}</p>
                  <p className="nav-footer-user-position">{props.profile && props.profile.Email}</p>
                </div>
              </div>
            )}
            <Tooltip title="logout">
              <ExitToApp onClick={logoutUserPopper} className='logout-icon'/>
            </Tooltip>
          </div>
        </div>
      </Sidebar>
      <div style={{ zIndex: 25000 }}>
      <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={logoutUserPopperClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
                <Typography onClick={logoutUser} className='popper-logout' color='primary' variant='h6'>LOGOUT</Typography>
            </Popover>
      </div>

    </div>
  );
};

const mapStateToProps = (state) => {
	return {
		settings:state.settings,
		profile:state.firebase.profile
	}
}

export default connect(mapStateToProps, {
	logoutUserFromFirebase,
  miniSidebarAction
})(SideBarPro);