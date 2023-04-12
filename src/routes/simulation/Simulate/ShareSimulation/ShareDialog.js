import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid,
    TextareaAutosize,
    InputLabel,
    TextField,
    Button,
    CircularProgress,
} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import * as firebase from "firebase";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import ShareStatusList from './ShareStatusList.js';
import ShareMessage from './ShareMessage.js';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ChipInput from 'material-ui-chip-input'
import CloseIcon from "@material-ui/icons/Close";
import WarningIcon from "@material-ui/icons/Warning";
import CancelIcon from "@material-ui/icons/Cancel";
import { NotificationManager } from "react-notifications";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
    groupIconBg: {
        borderRadius: "20px",
        width: "32px",
        height: "32px",
        backgroundColor: "blue",
        padding: "4px"
    },
    groupIcon: {
        fontSize: "20px",
        color: "#ffffff"
    },
    closeIcon: {
        color: "#677080",
        cursor: "pointer",
        fontWeight: 500,
        "&:hover": {
            backgroundColor: "#d10003",
            borderRadius: "5px",
            color: "#ffffff",
            fontWeight: 200,
        },
    },
    backIconBg: {
        borderRadius: "20px",
        width: "32px",
        height: "32px",
        padding: "4px"
    },
    backIcon: {
        color: "#677080",
        cursor: "pointer",
        fontWeight: 500,
        "&:hover": {
            backgroundColor: "#E6E6E3",
            borderRadius: "50px",
            color: "#ffffff",
            fontWeight: 200,
        },
    },
}));


const ShareDialog = (props) => {
    const classes = useStyles();
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth] = React.useState("sm");
    const { isDialogOpened, handleCloseDialog, missionId, simulationId, userInfo, userProfile } = props;
    const handleClose = () => {
        handleCloseDialog(false);
    }

    const [chips, setChips] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [trigger, setIsTrigger] = useState(false);
    const [errorKey, setErrorKey] = useState([]);
    const [loadChips, setLoadChips] = useState([]);
    const resetChips = () => {
        setChips([]);
        setErrorKey([]);
        setLoadChips([]);
        console.log("NE", errorKey);
    }
    const handleAddChip = async (chip) => {


        
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let isValidEmail = re.test(String(chip).toLowerCase());
            if (isValidEmail) {
                // TOOD :
                // 1. send email to cloud function , false 
                console.log("eqlaity", String(chip), userProfile.Email, String(chip) === userProfile.Email)
                if (String(chip) === userProfile.Email) {
                    NotificationManager.error("You cannot share with yourself,enter different emailId");
                    // setErrorKey([...errorKey, chip]);
                    // console.log("NE", errorKey);
                }
                else {
                    // setIsLoading(true);
                    setIsLoading(true);
                    setChips([...chips, chip]);
                    const isUserExists = firebase
                        .app()
                        .functions("us-central1")
                        .httpsCallable("isUserExists");

                    let result = await isUserExists({
                        userEmail: chip
                    });
                    console.log("is user exists", result.data)
                    if (result.data) {
                        // 2. if true then add valid chip 
                        // setChips([...chips, chip]);
                        setLoadChips([...loadChips, chip]);
                        setIsTrigger(true);
                        setIsLoading(false)
                    }
                    else {
                        NotificationManager.error(`${chip} user doesn't exist`);
                        setErrorKey([...errorKey, chip]);
                        console.log("NE", errorKey);
                        setIsLoading(false)
                    }

                }
            }
            else {
                NotificationManager.error("Enter valid email");
                // setErrorKey([...errorKey, chip]);
                // console.log("NE", errorKey);
                // setIsLoading(false);
            }

        
    }
    const handleDeleteChip = (chip, index) => {
        chips.splice(index, 1);
        setChips([...chips])
        setErrorKey(errorKey.filter(error => error !== chip));
        setLoadChips(loadChips.filter(load => load !== chip));
        if(chips.length === 0)
        setIsTrigger(false);
        console.log("NE", errorKey,loadChips);
    }
    useEffect(() => {
        console.log("userProfile", userProfile);
        console.log("userinfo", userInfo);
    }, [chips])

    useEffect(() => {

    }, [trigger]);

    const chipRenderer = ({ chip, className, handleClick, handleDelete }, key) => {

        var check = false;
        var check2 = false;
        if(errorKey.includes(chip)){
            check = true;
            // console.log("NEEE", errorKey, check);
        }
        if(chips.includes(chip) && !loadChips.includes(chip)){
            check2 = true;
            console.log("NEEE", loadChips,check2);
        }

        return (
            <div>
            {
                (check2 === true && !check) ? (
                    <Chip
                    className={className}
                    key={key}
                    label={chip}
                    onClick={handleClick}
                    onDelete={handleDelete}
                    size="medium"
                    // color="secondary"
                    // avatar={ <WarningIcon style={{ color: "white" }} />}
                    // style={{ backgroundColor: "#F08080", color: "white" }}
                    deleteIcon={<CancelIcon style={{ color: "white" }}/>}
                />
                ) : (check === true) ? (
                    <Chip
                        className={className}
                        key={key}
                        label={chip}
                        onClick={handleClick}
                        onDelete={handleDelete}
                        size="medium"
                        // color="secondary"
                        avatar={ <WarningIcon style={{ color: "white" }} />}
                        style={{ backgroundColor: "#F08080", color: "white" }}
                        deleteIcon={<CancelIcon style={{ color: "white" }}/>}
                    />
                ) : (
                    <Chip
                    className={className}
                    key={key}
                    label={chip}
                    onClick={handleClick}
                    onDelete={handleDelete}
                    size="medium"
                    style={{ backgroundColor: "green", color: "white" }}
                    deleteIcon={<CancelIcon style={{ color: "white" }}/>}
                />
                )
            }
          </div>
        );
      };


    return (
        <React.Fragment>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={isDialogOpened}
                onClose={handleClose}
                aria-labelledby="max-width-dialog-title"
            ><DialogTitle id="max-width-dialog-title">

                    <div className="d-flex flex-row justify-content-between align-items-end">
                        <div className="d-flex flex-row align-items-end">
                            {
                                chips.length > 0 ? (
                                    <div className={classes.backIconBg}>
                                        <ArrowBackIcon onClick={resetChips} className={classes.backIcon}/>
                                    </div>
                                ) : null
                            }
                            <div className={classes.groupIconBg}>
                                <GroupAddIcon className={classes.groupIcon} />
                            </div>
                            <h2 className="ml-2">Share with people and groups</h2>
                        </div>
                        <div>
                            <CloseIcon onClick={handleClose} className={classes.closeIcon} />
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent className="d-flex flex-column justify-content-between ">
                    {/* <TextField fullWidth label="Add people and groups" variant="standard" /> */}
                    <ChipInput
                        fullWidth
                        label="Add people and groups"
                        // onChange={(chip) => console.log(chip[chip.length-1])}
                        chipRenderer={chipRenderer}
                        value={chips}
                        // onAdd={(chip) => console.log(chip)}
                        // defaultValue={chips}
                        // onChange={(chip) => handleAddChip(chip[chip.length-1])}
                        onAdd={(chip) => handleAddChip(chip)}
                        onDelete={(chip, index) => handleDeleteChip(chip, index)}
                    />
                    {/* {
                        (isLoading && chips.length <= 1 && loadChips.length === 0) ? (
                            <div>
                                <RctSectionLoader />
                                <ShareStatusList missionId={missionId} simulationId={simulationId} />
                            </div>
                        ) : (!isLoading && chips.length === 0) ?
                        <ShareStatusList missionId={missionId} simulationId={simulationId} />
                        : (isLoading && chips.length > 0) ? (
                            <div>
                                <RctSectionLoader /> 
                                <ShareMessage users={chips}
                                    missionId={missionId} simulationId={simulationId}
                                    userProfile={userProfile} userInfo={userInfo}
                                    resetChips={resetChips}
                                />
                            </div>
                        ) : <ShareMessage users={chips}
                        missionId={missionId} simulationId={simulationId}
                        userProfile={userProfile} userInfo={userInfo}
                        resetChips={resetChips}
                    />
                    } */}

                    {
                        (isLoading && chips.length > 0 && trigger) ? (
                            <div>
                                <RctSectionLoader /> 
                                <ShareMessage users={chips}
                                    missionId={missionId} simulationId={simulationId}
                                    userProfile={userProfile} userInfo={userInfo}
                                    resetChips={resetChips}
                                />
                            </div>
                        ) : (chips.length > 0 && trigger) ?
                        <ShareMessage users={chips}
                            missionId={missionId} simulationId={simulationId}
                            userProfile={userProfile} userInfo={userInfo}
                            resetChips={resetChips}
                        /> : (isLoading && chips.length <= 1 && loadChips.length === 0 && !trigger) ? (
                            <div>
                                <RctSectionLoader />
                                <ShareStatusList missionId={missionId} simulationId={simulationId} />
                            </div>
                        ) : <ShareStatusList missionId={missionId} simulationId={simulationId} />
                    }

                    {/* {isLoading ? <RctSectionLoader /> :
                    chips.length > 0 ? <ShareMessage users={chips}
                        missionId={missionId} simulationId={simulationId}
                        userProfile={userProfile} userInfo={userInfo}
                        resetChips={resetChips}
                    />  : <ShareStatusList missionId={missionId} simulationId={simulationId} />} */}

                </DialogContent>

            </Dialog>
        </React.Fragment>
    )
}

export default ShareDialog