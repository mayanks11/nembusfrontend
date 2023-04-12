/**
 * Delete Confirmation Dialog
 */
import React, { useState, useEffect } from 'react';
import Proptypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const DeleteConfirmationDialog = ({
  isDialogOpen,
  deleteHandler,
  title,
  deleteMessage,
  cancelHandler
}) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={cancelHandler}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {deleteMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelHandler}>Cancel</Button>
        <Button color='primary' autoFocus onClick={deleteHandler}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmationDialog.propTypes = {
  open: Proptypes.bool.isRequired,
  deleteHandler: Proptypes.func.isRequired,
  title: Proptypes.string.isRequired,
  deleteMessage: Proptypes.string,
  cancelHandler: Proptypes.string.isRequired
};
export default DeleteConfirmationDialog;
