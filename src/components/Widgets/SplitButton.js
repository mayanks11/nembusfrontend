import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import {formatAMPM} from 'Util/formateTime';

export default function SplitButton(props) {
  const {options, selected, className} = props;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedOption, setSelectedOption] = React.useState(selected);

  React.useEffect(()=> {
    console.log();
      setSelectedOption(props.selected)
  });

  const handleClick = () => {
    console.info(`You clicked ${selectedOption.id}`);
  };

  const handleMenuItemClick = (option) => {
    props.onChange(option);
    setSelectedOption(option);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid container direction="column" className={className}>
      <Grid item xs={12}>
        <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button" size="small">
          <Button onClick={handleClick}>{(new Date(selectedOption.createdAt)).toLocaleString()}</Button>
          <Button
            color="primary"
            size="small"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{zIndex: 1}}>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option) => (
                      <MenuItem
                        key={option.createdAt}
                        selected={option.id === selectedOption.id}
                        onClick={() => handleMenuItemClick(option)}
                      >
                        {(new Date(option.createdAt)).toUTCString()}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
}