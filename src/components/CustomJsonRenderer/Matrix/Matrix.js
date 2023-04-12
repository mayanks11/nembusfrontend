import * as React from "react";
import {
  Input,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import {cloneDeep} from 'lodash'
import Grid from "@material-ui/core/Grid";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

const styles = (theme) => ({
  matrixdiv: {
    margin: "0",
  },
  title: {
    textalign: "left",
    margin: 0,
  },
});

class Matrix extends React.Component {
  constructor(props) {
    super(props);
    console.log("Matrix ---------->", props);

    let defaultMatrix;
    let errorMatrix = {};

    if (props.data) {
      defaultMatrix = props.data;

    } else {
      let defaultdata = {};

      for (let row = 1; row <= this.props.schema.row; row++) {
        let columnFields = [];
        for (let col = 0; col < this.props.schema.col; col++) {
          columnFields.push(0);
        }

        defaultdata[`row${row}`] = columnFields;
        
      }
      defaultMatrix = defaultdata;
    }

    this.state = {
      data: defaultMatrix,
    };
    props.handleChange(props.path, { ...this.state.data });
  }

  // static getDerivedStateFromProps = (nextProps, prevState) => {
  //   console.log("nextProps", nextProps.data);
  //   console.log("prevState", prevState.data);
  //   let istoPush = false;

  //   if (istoPush) {
  //   }
  //   return null;

  //   // if (prevState.rating !== nextProps.data) {
  //   //   return {
  //   //     rating: nextProps,
  //   //     hoverAt: prevState.hoverAt
  //   //   };
  //   // }
  //   // return null;
  // };

  handleMatrixValueChange = (e, row , col ) => {
    let newValue = this.state.data;
    let sendValue = this.state.data;

    let newEnterValue     = 0.0 ;
    let sendNewEnterValue = 0.0 ;
  
    if(!e.target.value)
    {
      
      newEnterValue=e.target.value;
      sendNewEnterValue = e.target.value;
    }else
    {
      newEnterValue = e.target.value;
      sendNewEnterValue = parseFloat(e.target.value);
    }

    // console.log("e.target.value -------->",e.target.value,newValue)
    // let newEnterValue = parseFloat(e.target.value);

   
    newValue[`row` + row][col] = newEnterValue;
    sendValue[`row` + row][col] = sendNewEnterValue;
    
    this.setState({
      data: { ...newValue},
    });

    
    this.props.handleChange(this.props.path, { ...sendValue });
  };

  render() {
    const path = this.props.path;
    const { classes } = this.props;
    

    const errorsList = this.props.jsonFormerros.filter(errorpath=>
     { 
         const isNotNull= errorpath.keyword==="isNotNull" || errorpath.keyword==="minimum" || errorpath.keyword==="type"
         const isparent = (errorpath.dataPath).startsWith(path)

         return (isNotNull && isparent);
    
    } );
    let rowvalue=null;
    let colvalue = -1;
    let errorList2 = [];
    for (let row = 1; row <= this.props.schema.row; row++) {
      let errorvalue = [];
      for (let col = 0; col < this.props.schema.col; col++) {
        errorvalue.push(false);
      }

      errorList2.push(cloneDeep(errorvalue));

    }
    let message ="Please Enter Valid Number";
    errorsList.forEach(element => {
      const rowerrorData = (element.dataPath).replace(path+'.', "")
      

      rowvalue = rowerrorData.substring(0, 4);
      colvalue = parseInt(rowerrorData.substring(5));
      const row = parseInt(rowerrorData.substring(3,4))

      
      errorList2[row-1][colvalue] = true;
      
      message = element.message;
    });

    
  

    
    let inputFields = [];
    for (let row = 1; row <= this.props.schema.row; row++) {
      let columnFields = [];
      for (let col = 0; col < this.props.schema.col; col++) {
        
      
        columnFields.push(
          <Grid item xs key={`Grid-row${row}col${col}`}>
            <TextField
              size="small"
              type="number"
              variant="outlined"
              error={errorList2[row-1][col]}
              fullWidth
              key={`Input-row${row}col${col}`}
              value={this.state.data ? (this.state.data[`row${row}`][col]) : 0}
              onChange={(e) => this.handleMatrixValueChange(e, row, col)}
              onKeyDown={(e) => this.handleMatrixValueChange(e, row, col)}
              onKeyUp={(e) => this.handleMatrixValueChange(e, row, col)}
              required={this.props.required}
            />
          </Grid>
        );
      }
      inputFields.push(
        <Grid
          container
          spacing={3}
          justify="space-around"
          key={`Grid2-row${row}`}
        >
          {columnFields}
        </Grid>
      );
    }

    return (
      <div id="#/properties/matrix" className={classes.matrixdiv}>
        <InputLabel id="demo-mutiple-chip-label" className={classes.inputlabel}>
          {this.props.label ? this.props.label : "Matrix"}
        </InputLabel>
        {inputFields}
        <FormHelperText id="demo-mutiple-chip-label" error={errorsList.length?true:false}>
          {errorsList.length? message: (this.props.description ? this.props.description : "")}
        </FormHelperText>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
   
    jsonFormerros: state.jsonforms.core.errors,
   
  };
};

const mapDispachToProps = (dispatch) => {
  return {

  };
};
const Matrix_Redux = connect(mapStateToProps, mapDispachToProps)(Matrix);

export default withStyles(styles)(Matrix_Redux);
