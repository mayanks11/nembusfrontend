/**
 * Simple Menu
 */
import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

export default class ActionMenu extends React.Component {
   state = {
      anchorEl: null,
      selectedIndex: 1,
      disabled: false,
      isAdmin: true
   };
   button = undefined;
   handleClickListItem = event => {
      this.setState({ anchorEl: event.currentTarget });
   };
   handleMenuItemClick = (event, index) => {
      this.setState({ selectedIndex: index, anchorEl: null });
   };
   handleClose = () => {
      this.setState({ anchorEl: null });
   };
   addToModalHandler = () => {
      this.props.addToModalHandler();
      this.setState({ anchorEl: null });
   };
   updateVersionStatusModalHandler = () => {
      this.props.updateVersionStatusModalHandler();
      this.setState({ anchorEl: null });
   };
   updateComponentStatusModalHandler = () => {
      this.props.updateComponentStatusModalHandler();
      this.setState({ anchorEl: null });
   };
   handleClick = event => {
      this.setState({ 
         anchorEl: event.currentTarget, 
         disabled: this.props.addToModelState,
         isAdmin: this.props.isAdmin
      });
   };
   
   render() {
      const { anchorEl, disabled , isAdmin} = this.state;

      return (
         <div>
            <Button variant="contained" className="text-white pull-right btn-primary mr-10 w-10" aria-owns={anchorEl ? 'action-menu' : null} aria-haspopup="true" onClick={this.handleClick} >
               Actions <span className='ti-angle-down ml-10'></span></Button>
            <Menu id="action-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose} >
               { !disabled?
                  (<MenuItem disabled onClick={this.addToModalHandler}><span className="material-icons mr-10">add_box</span> Add to Model Repo</MenuItem>)
                  :
                  (<MenuItem  onClick={this.addToModalHandler}><span className="material-icons mr-10">add_box</span> Add to Model Repo</MenuItem>)
               }
               {isAdmin?
                 (
                     <MenuItem onClick={this.updateComponentStatusModalHandler}><span className='mr-10'>(<small>(<sub>*</sub>)</small>)</span> Update Component Status</MenuItem>
                 ):''
               }
               {isAdmin?
                 (
                     <MenuItem onClick={this.updateVersionStatusModalHandler}><span className='mr-10'>(<small>(<sub>*</sub>)</small>)</span> Update Version Status</MenuItem>
                 ):'' 
               }
            </Menu>
         </div>
      );
   }
}
