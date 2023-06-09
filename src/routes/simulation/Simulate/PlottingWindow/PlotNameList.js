import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import TagFacesIcon from "@material-ui/icons/TagFaces";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
    minwidth:25,
    minheight:25
  },
  chip: {
    margin: theme.spacing(0.5)
  }
}));


//This will contain the Name of plot per papper 

export default function PlotNameArray({plotsPerChart}) {
  
  const classes = useStyles();
  // const [chipData, setChipData] = React.useState([
  //   { key: 0, label: "Angular" },
  //   { key: 1, label: "jQuery" },
  //   { key: 2, label: "Polymer" },
  //   { key: 3, label: "React" },
  //   { key: 4, label: "Vue.js" }
  // ]);

  const handleDelete = (chipToDelete) => () => {

    // setChipData((chips) =>
    //   chips.filter((chip) => chip.key !== chipToDelete.key)
    // );

    console.log(chipToDelete)
  };

  

  return (

    <Paper component="ul" className={classes.root}>
    {plotsPerChart.series.map((label,index) => {
      let icon;
      return (
        <li key={label.name}>
          <Chip
            icon={icon}
            label={label.name}
            onDelete={handleDelete(label.name)}
            className={classes.chip}
          />
        </li>
      );
    })}
  </Paper>
 
  );
}
