import React from 'react';
import {
  Button,
  Chip,
  Grid,
  input,
  InputLabel,
  FormHelperText
} from '@material-ui/core';
import { storage } from '../../../firebase';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { nanoid } from 'nanoid';

const CHIP_MAX_WIDTH = 100;
const CHIP_ICON_WIDTH = 30;
const EllipsisText = props => {
  const { children } = props;

  return (
    <div
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: CHIP_MAX_WIDTH - CHIP_ICON_WIDTH
      }}
    >
      {children}
    </div>
  );
};

const styles = {
  fileView: {
    borderBottom: '1px solid rgb(221,221,221)',
    marginRight: 20
  },
  tdsView: {
    borderBottom: '1px solid rgb(221,221,221)',
    marginRight: 5,
    'min-height': 30
  },
  tdsViewError: {
    borderBottom: "1px solid rgb(255,0,0)",
    marginRight: 5,
    "min-height": 30,
  },
  mb20: {
    marginBottom: 5
  },
  inputlabel: {
    textAlign: 'left'
  },
  addTdsBtn: {
    height: 30,
    minwidth: '50%'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2,
    'min-weight': 30
  }
};

class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    console.log('Fileuploder props', props);
    // Object.entries(props.data).forEach(([key, value]) => {
    //   console.log("key",key,"value",value)
    // });

    this.state = {
      filecollection: { ...props.data }
    };
    this.fileref = null;
  }
  onChangeFile = (event) => {
    const file = {...event.target.files};
    
    // event.target.value ={};
    event.target.value = "";
    console.log("onChangeFile ---->",event.target.files)

    let filecol = {};
    Object.entries(file).forEach(([key, value]) => {
      console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
      console.log(value, value.size);
      filecol[nanoid()] = {
        data: value,
        size: value.size,
        filename: value.name,
        Url: ''
      };
    });

    let newstate;
    console.log(filecol);
    if (this.props.schema.ismultiple) {
      newstate = { ...this.state.filecollection, ...filecol };
    } else {
      newstate = { ...filecol };
    }

    this.setState({
      filecollection: { ...newstate }
    });

    this.props.handleChange(this.props.path, { ...newstate });
  };
  onDeletefunction = index_value => {
    console.log('delet index', index_value);

    const { filecollection } = this.state;
    let filtered = {};
    console.log('filecollection', filecollection);

    Object.keys(filecollection).map(async key => {
      if (key !== index_value) {
        let obj = {
          [key]: filecollection[key]
        };
        filtered = { ...filtered, ...obj };
      } else {
        if (filecollection[key].Url) {
          console.log('url>>', filecollection[key].Url);
          await storage.ref(filecollection[key].Url).delete();
        }
      }
      console.log('filecollection', filecollection[key]);
    });

    console.log('filtered>>', filtered);
    this.setState({
      filecollection: { ...filtered }
    });

    this.props.handleChange(this.props.path, { ...filtered });
  };
  render() {
    const { filecollection } = this.state;
    const { classes,errors } = this.props;

    console.log('file uploader', this.props);

    return (
      <div id='#/properties/fileupload'>
        <React.Fragment>
          <Grid
            container
            spacing={3}
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item xs={12}>
              <InputLabel id="demo-mutiple-chip-label" className={classes.inputlabel} error={errors?true:false}>
                {this.props.label ? this.props.label : "Upload File"}
              </InputLabel>
            </Grid>
          </Grid>
          <Grid container >
            <Grid item xs={10}>
              <div className= {errors?classes.tdsViewError:classes.tdsView}>
                {filecollection
                  ? (<div className={classes.chips}> 
                 { Object.entries(filecollection).map(([key, value]) => (
                      <Chip
                        label= {<EllipsisText>{value.filename}</EllipsisText>}
                        key={key}
                        onDelete={() => {
                          this.onDeletefunction(key);
                        }}
                        size="small"
                        color="primary"
                        variant="outlined"
                        className={classes.chip}
                      />
                    ))}
                    </div>)
                  : ""}
              </div>
            </Grid>
            <Grid item xs={2}>
              <input
                className={`d-none`}
                id='contained-button-file'
                accept={
                  this.props.schema.accept ? this.props.schema.accept : ''
                }
                type='file'
                ref={ref => (this.fileref = ref)}
                onChange={this.onChangeFile}
                hidden={true}
                multiple={
                  this.props.schema.ismultiple
                    ? this.props.schema.ismultiple
                    : false
                }
                disabled={filecollection.length > 10 || !this.props.enabled}
              />
              <Button
                type='button'
                variant='contained'
                className='btn-primary'
                className={classes.addTdsBtn}
                onClick={() => {
                  this.fileref.click();
                }}
                disabled={filecollection.length > 10 || !this.props.enabled}
              >
                {this.props.schema.buttonName
                  ? this.props.schema.buttonName
                  : 'Upload'}
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            direction='row'
            justify='flex-start'
            alignItems='flex-start'
          >
            <Grid item xs={12}>
              <FormHelperText id="demo-mutiple-chip-label" error={errors?true:false}>
              { errors? "Please upload the file": (this.props.description ? this.props.description : "")}
              </FormHelperText>
            </Grid>
          </Grid>
        </React.Fragment>
      </div>
    );
  }
}

export default withStyles(styles)(FileUploader);
