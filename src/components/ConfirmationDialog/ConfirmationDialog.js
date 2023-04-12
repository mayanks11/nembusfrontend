/**
 * Confirmation dialog component
 */
/* eslint-disable */
import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

const ConfirmationDialog = ({ open, title, onConfirm }) => {
  //Define function for close confirmation dialog box and callback for delete item
  const closeDialog = isTrue => {
    isTrue ? onConfirm(true) : onConfirm(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => closeDialog(false)}
      aria-labelledby="responsive-dialog-title"
      className="confirmation-dialog"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogActions className="px-20 pb-20 justify-content-center" autoFocus>
        <Button
          onClick={() => closeDialog(false)}
          className="btn-danger text-white fw-semi-bold"
        >
          Cancel
        </Button>
        <Button
            onClick={() => closeDialog(true)}
            className="btn-primary text-white fw-semi-bold mr-15"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
