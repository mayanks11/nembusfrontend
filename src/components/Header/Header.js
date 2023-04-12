/**
 * App Header
 */
import React, { Component, useState } from "react";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";
import screenfull from "screenfull";
import Tooltip from "@material-ui/core/Tooltip";
import { withRouter } from "react-router-dom";
import $ from "jquery";
import FindInPageIcon from "@material-ui/icons/FindInPage";
// actions
import { collapsedSidebarAction } from "Actions";
// components
import Notifications from "./Notifications";
import CollapsableButton from './CollapsableButton';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  MuiToolbar: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    [theme.breakpoints.up('sm')]: {
      height: "48px",
      minHeight: "48px"
    },
    [theme.breakpoints.down('sm')]: {
      height: "64px",
      minHeight: "64px"
    },
  },
  MuiToolbarCollapsed: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    [theme.breakpoints.up('sm')]: {
      height: "0px",
      minHeight: "0px"
    },
    [theme.breakpoints.down('sm')]: {
      height: "0px",
      minHeight: "0px"
    },
  }
}))

const Header = (props) => {
  // state = {
  //   customizer: false,
  //   isMobileSearchFormVisible: false,
  // };
  const [isMobileSearchFormVisible, setIsMobileSearchFormVisible] = useState(false);

  // function to change the state of collapsed sidebar
  const onToggleNavCollapsed = (event) => {
    const val = !props.navCollapsed;
    props.collapsedSidebarAction(val);
  };

  // open dashboard overlay
  // const openDashboardOverlay = () => {
  //   $(".dashboard-overlay").toggleClass("d-none");
  //   $(".dashboard-overlay").toggleClass("show");
  //   if ($(".dashboard-overlay").hasClass("show")) {
  //     $("body").css("overflow", "hidden");
  //   } else {
  //     $("body").css("overflow", "");
  //   }
  // }

  // // close dashboard overlay
  // function closeDashboardOverlay() {
  //   $(".dashboard-overlay").removeClass("show");
  //   $(".dashboard-overlay").addClass("d-none");
  //   $("body").css("overflow", "");
  // }

  // toggle screen full
  function toggleScreenFull() {
    screenfull.toggle();
  }

  // mobile search form
  function openMobileSearchForm() {
    setIsMobileSearchFormVisible(true)

  }

  // $("body").click(function () {
  //   $(".dashboard-overlay").removeClass("show");
  //   $(".dashboard-overlay").addClass("d-none");
  //   $("body").css("overflow", "");
  // });

  const { horizontalMenu, agencyMenu, isHeaderCollapsed } = props;
  const classes = useStyles();
  return (
    <Fade in={isHeaderCollapsed}>
      <AppBar position="static" className="rct-header">
        <Toolbar className={isHeaderCollapsed ? classes.MuiToolbar : classes.MuiToolbarCollapsed}>
          <div className="d-flex align-items-center">
            {(horizontalMenu || agencyMenu) && (
              <div className="site-logo">
                <Link to="/" className="logo-mini">
                  <img
                    src={require("Assets/img/appLogo.png")}
                    className="mr-15"
                    alt="site logo"
                  />
                </Link>
                <Link to="/" className="logo-normal">
                  <img
                    src={require("Assets/img/appLogoText.png")}
                    className="img-fluid"
                    alt="site-logo"
                    width="67"
                    height="17"
                  />
                </Link>
              </div>
            )}
            {!agencyMenu && (
              <ul className="list-inline mb-0 navbar-left">
                {!horizontalMenu ? (
                  <li
                    className="list-inline-item"
                  // onClick={(e) => this.onToggleNavCollapsed(e)}
                  >
                    <CollapsableButton />
                  </li>
                ) : (
                  <li className="list-inline-item" >
                    <Tooltip title="Sidebar Toggle" placement="bottom">
                      <IconButton
                        color="inherit"
                        aria-label="Menu"
                        className="humburger p-0"
                        component={Link}
                        to="/"
                      >
                        <i className="ti-layout-sidebar-left"></i>
                      </IconButton>
                    </Tooltip>
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <ul className="list-inline mb-0 mt-1">
              <Notifications userInfo={props.userinfo} />
              {/* <NotificationsIcon style={{ color: "black", fontSize: "24px" }}>
            </NotificationsIcon> */}
            </ul>
            <ul className="list-inline mb-0 mt-1">
              <li className="list-inline-item">
                <Tooltip title="click for documentation" placement="bottom">
                  <a
                    href="https://app.archbee.io/public/bziqq5P_YbH1e8h4_GGnM"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FindInPageIcon
                      style={{ color: "black", fontSize: "24px" }}
                    ></FindInPageIcon>
                  </a>
                </Tooltip>
              </li>
            </ul>

            <ul className="navbar-right list-inline mb-0">
              <li className="list-inline-item">
                <Tooltip title="Full Screen" placement="bottom">
                  <IconButton
                    aria-label="settings"
                    onClick={() => this.toggleScreenFull()}
                  >
                    <i className="zmdi zmdi-crop-free"></i>
                  </IconButton>
                </Tooltip>
              </li>
            </ul>
          </div>
        </Toolbar>
      </AppBar>
    </Fade>
  );

}

// map state to props
const mapStateToProps = (state) => ({
  settings: state.settings,
  userinfo: state.firebase.auth,
  isHeaderCollapsed: state.settings.isHeaderCollapsed
})

export default withRouter(
  connect(mapStateToProps, {
    collapsedSidebarAction,
  })(Header)
);
