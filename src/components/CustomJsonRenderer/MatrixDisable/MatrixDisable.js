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

class MatrixDisable extends React.Component {
  constructor(props) {
    super(props);
    console.log("this.props.schema. ---------->", this.props.schema.disable_rowcol.length);

    let dispabled_row = this.props.schema.disable_rowcol

    console.log("dispabled_row new ",dispabled_row)
    

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
      dispabled_row:dispabled_row
    };
    props.handleChange(props.path, { ...this.state.data });
  }


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
    console.log("newValue", newValue);
    this.setState({
      data: { ...newValue},
    });

    
    this.props.handleChange(this.props.path, { ...sendValue });
  };

  render() {
    const path = this.props.path;
    const { classes } = this.props;
    console.log("row=>", this.props,this.props.errors,this.props.jsonFormerros);
    console.log("Matrix",this.props)

    const errorsList = this.props.jsonFormerros.filter(errorpath=>
     { 
         const isNotNull= errorpath.keyword==="isNotNull" || errorpath.keyword==="minimum" || errorpath.keyword==="type"
         const isparent = (errorpath.dataPath).startsWith(path)

         return (isNotNull && isparent);
    
    } );
    let rowvalue=null;
    let colvalue = -1;
    let errorList2 = [
      [false, false,false],
      [false, false,false],
      [false, false,false]
    ];
    let message ="Please Enter Valid Number";
    errorsList.forEach(element => {
      const rowerrorData = (element.dataPath).replace(path+'.', "")
      console.log("rowerrorData.substring(0, 3)",rowerrorData.substring(0, 3))
      console.log("rowerrorData.substring(0, 3)",rowerrorData.substring(0, 3))
      console.log("element",);

      rowvalue = rowerrorData.substring(0, 4);
      colvalue = parseInt(rowerrorData.substring(5));
      const row = parseInt(rowerrorData.substring(3,4))

      
      errorList2[row-1][colvalue] = true;
      console.log("colvalue ---------->",colvalue,errorList2)
      message = element.message;
    });

    console.log("rowvalue -->",rowvalue,"colvalue",colvalue);
  

    
    let inputFields = [];
    for (let row = 1; row <= this.props.schema.row; row++) {
      let columnFields = [];
      for (let col = 0; col < this.props.schema.col; col++) {
        let isdisable=false;
        console.log("this.state.dispabled_row 1",this.state.dispabled_row[`row${row}`])
        const current_row = this.state.dispabled_row[`row${row}`]
          if(current_row){

            if (current_row[col]==1){
              isdisable = true;
            }
            
          }
        
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
              disabled={isdisable}
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
      <div id="#/properties/matrixdisable" className={classes.matrixdiv}>
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
const Matrix_Redux = connect(mapStateToProps, mapDispachToProps)(MatrixDisable);

export default withStyles(styles)(Matrix_Redux);
