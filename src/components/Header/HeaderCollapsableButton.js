
import React, { Component, Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { withRouter } from "react-router-dom";
// actions
import { toggleHeader } from "Actions/AppSettingsActions";

const useStyles = makeStyles((theme) => ({
    collapseButton: {
        // backgroundColor: "#ffffff",
        color: "grey",
        "&:hover": {
            // backgroundColor: "#ffffff",
            color: "#ffffff",
        },
    },
    collapseBackground: {
        position: "absolute", left: "90%", top: "15%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid grey",
        borderRadius: "120px",
        backgroundColor: "#ffffff",
        "&:hover": {
            backgroundColor: "#183b56",
        },
    },

}));


function HeaderCollapsableButton(props) {

    const styles = useStyles();
    const navCollapsed = props.settings.navCollapsed;
    const { toggleHeader, isHeaderCollapsed } = props;
    const handleCollapseClick = () => {
        toggleHeader(!isHeaderCollapsed);
    };

    return (
        <Fragment>
            {isHeaderCollapsed ? (
                <Tooltip title="Header collapse" placement="bottom">
                    <div className={styles.collapseBackground} onClick={handleCollapseClick}>
                        {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline></svg> */}
                        {/* <ChevronRightIcon
                            fontSize="small"
                            className={styles.collapseButton}
                            onClick={handleCollapseClick}
                        /> */}

                        <ArrowDropUpIcon />
                    </div>
                </Tooltip>
            ) : (
                <Tooltip title="Header Expand" placement="bottom">
                    <div className={styles.collapseBackground} onClick={handleCollapseClick}>
                        {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline></svg> */}

                        <ArrowDropDownIcon />
                        {/* <ChevronLeftIcon
                            fontSize="small"
                            className={styles.collapseButton}

                            onClick={handleCollapseClick}
                        /> */}
                    </div>
                </Tooltip>
            )}
        </Fragment>
    );
}

const mapStateToProps = (state) => ({
    settings: state.settings,
    userinfo: state.firebase.auth,
    isHeaderCollapsed: state.settings.isHeaderCollapsed
})

export default withRouter(
    connect(mapStateToProps, {
        toggleHeader,
    })(HeaderCollapsableButton)
);


