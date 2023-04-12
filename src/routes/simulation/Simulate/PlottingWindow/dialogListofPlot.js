import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import shortid from "shortid";
import _ from "lodash";
import { useImmer } from "use-immer";

export default function ListofPlot({
  open,
  setOpen,
  plot_description,
  addChart,
  comparedList,
  setSelectedPlotname,
  formtype,
  setAddedOnUpdate,
  setRemovedOnUpdate,
  removeOnUpdate,
  addedOnUpdate
}) {
  const [plotInfo, setPlotInfo] = useImmer([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    addChart(plotInfo);
    
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      

      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    } else {
     
      setPlotInfo((draft) => {
        draft.splice(0, draft.length);
      });

      for (var key in comparedList) {
        setSelectedPlotname((draft) => {
          delete draft[key];
        });
      }
    }
  }, [open]);

  React.useEffect(() => {}, [comparedList]);

  const handleChange = (event, id) => {
    console.log(event.target.name);
    console.log(event.target.value);
    console.log(event.target.checked);
    console.log(id);

    if (event.target.checked) {
      setPlotInfo((draft) => {
        draft.push({ id: id, name: event.target.name });
      });
    } else {
      setPlotInfo((draft) => {
        const index = draft.findIndex(
          (plotinfo) =>
            plotinfo.id === id && plotinfo.name === event.target.name
        );
        if (index !== -1) draft.splice(index, 1);
      });
    }
  };

  const updatehandler = (event, id) => {
    console.log(event.target.name);
    console.log(event.target.value);
    console.log(event.target.checked);
    console.log(id);

    

    if (event.target.checked) {

    const index = (removeOnUpdate.current).findIndex(
        (toberemoved) =>
          toberemoved.id === id && toberemoved.name === event.target.name
      );

      console.log("index",index)
      if(index !== -1){
        (removeOnUpdate.current).splice(index, 1)
        
        setRemovedOnUpdate([...removeOnUpdate.current])
      }
      else{
       
        const newdata = { id: id, name: event.target.name }  
        setAddedOnUpdate([...addedOnUpdate.current,newdata]);
      }
      
    }
    else{

      const index = (addedOnUpdate.current).findIndex(
        (toberemoved) =>
          toberemoved.id === id && toberemoved.name === event.target.name
      );
      if(index == -1){
      const newdata = { id: id, name: event.target.name }
      setRemovedOnUpdate([...removeOnUpdate.current,newdata]);
      }
      else
      {(addedOnUpdate.current).splice(index, 1)
        setAddedOnUpdate([...(addedOnUpdate.current)])
      }
      

    }

  
   
   
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{formtype}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <FormControl component="fieldset"></FormControl>
            {Object.entries(plot_description).map(([key, value]) => {
              return value.map((port_name, index) => {
                return (
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value={port_name}
                      control={
                        <Checkbox
                          color="primary"
                          defaultChecked={
                            _.has(comparedList, [key])
                              ? _.findIndex(
                                  _.get(comparedList, [key]),
                                  function(o) {
                                    return o === port_name;
                                  }
                                ) > -1
                                ? true
                                : false
                              : false
                          }
                        />
                      }
                      name={port_name}
                      label={port_name}
                      labelPlacement="end"
                      key={port_name}
                      onChange={(event) =>
                        formtype === "add"
                          ? handleChange(event, key)
                          : updatehandler(event, key)
                      }
                    />
                  </FormGroup>
                );
              });
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
