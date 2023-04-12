import * as React from "react";

import {
  Input,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  FormControl,
  FormHelperText,
  Chip
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles, withStyles,useTheme } from "@material-ui/core/styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

  const styles = (theme) => ({
    formControl: {
      margin: theme.spacing(2),
      minWidth: 200
    },
    chips: {
      display: "flex",
      flexWrap: "wrap"
    },
    chip: {
      margin: 2
    },
    noLabel: {
      marginTop: theme.spacing(3)
    }
  });
class Multiselect extends React.Component {
  constructor(props) {
    super(props);
    console.log("Multiselect ---------->",props);
    let defaultIteam = [];
    if (props.data)
    {
      defaultIteam=[...props.data]
    }
    this.state ={
      selectedItems:defaultIteam
    }
    this.items=[...props.schema.items.enum]
    console.log(this.items)
    this.label = this.props.label;
  }

//   static getDerivedStateFromProps = (nextProps, prevState) => {
//     console.log("nextProps",nextProps.data);
//     console.log("prevState",prevState.data);
//     let istoPush = false;


//     if (istoPush){

//     }
//     return null;

//   };

handleChange = (event) => {
  const { value } = event.target;
  this.setState({
    selectedItems:[...value]
  });
  this.props.handleChange(this.props.path, [...value]);
 
};


 
  render() {
    const classes =this.props.classes;

    console.log(classes.formControl)
    

    return (
      <div id="#/properties/multiselect" >
        <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-chip-label">{this.label}</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={this.state.selectedItems}
          onChange={this.handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {selected.map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
         
          MenuProps={MenuProps}
        >
          {this.items.map(name => (
            <MenuItem
              key={name}
              value={name}
  
            >
              {name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText id="demo-mutiple-chip-label">
                {this.props.description ? this.props.description : ""}
        </FormHelperText>
      </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(Multiselect);
