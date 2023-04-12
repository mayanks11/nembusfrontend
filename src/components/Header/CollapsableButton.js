
import React, { Component, Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { withRouter } from "react-router-dom";
// actions
import { collapsedSidebarAction } from "Actions";

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


function CollapsableButton(props) {

    const styles = useStyles();
    const navCollapsed = props.settings.navCollapsed;
    const { collapsedSidebarAction } = props;
    const handleCollapseClick = () => {
        collapsedSidebarAction(!navCollapsed);
    };

    return (
        <Fragment>
            {navCollapsed ? (
                <Tooltip title="Sidebar Expand" placement="bottom">
                    <div className={styles.collapseBackground}>
                        <ChevronRightIcon
                            fontSize="small"
                            className={styles.collapseButton}
                            onClick={handleCollapseClick}
                        />
                    </div>
                </Tooltip>
            ) : (
                <Tooltip title="Sidebar collapse" placement="bottom">
                    <div className={styles.collapseBackground}>
                        <ChevronLeftIcon
                            fontSize="small"
                            className={styles.collapseButton}

                            onClick={handleCollapseClick}
                        />
                    </div>
                </Tooltip>
            )}
        </Fragment>
    );
}

const mapStateToProps = (state) => ({
    settings: state.settings,
    userinfo: state.firebase.auth,
})

export default withRouter(
    connect(mapStateToProps, {
        collapsedSidebarAction,
    })(CollapsableButton)
);
