import * as React from "react";
import { SimPortLabel } from "../Ports/SimPortWidget";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Build";
import Tooltip from "@material-ui/core/Tooltip";
import Simulationconfig from "./SimulationConfigDialog";

function renderPort(inActive, engine, port, isLeft = true) {
  return (
    <SimPortLabel
      roundedLeft={isLeft}
      roundedRight={!isLeft}
      inactivePort={inActive}
      disableLabel
      engine={engine}
      port={port}
    />
  );
}

export default function SimulationNodeHeader(props) {
  const {
    engine,
    triggerInputPort,
    triggerOutputPort,
    inActive,
    nodeName,
    nodealloptions,
    diagramEngine,
  } = props;

  const [nodeName_Val, setNodeName] = React.useState(nodeName);

  return (
    <div className="simulationNode__header">
      <div className="simulationNode__titleNode">
        {triggerInputPort ? (
          renderPort(inActive, engine, triggerInputPort, true)
        ) : (
          <div />
        )}
        <div className="simulationNode__titleNode__title"> {nodeName_Val} </div>
        {triggerOutputPort ? (
          renderPort(inActive, engine, triggerOutputPort, false)
        ) : (
          <div />
        )}
        <Simulationconfig
          inActive={inActive}
          engine={engine}
          nodealloptions={nodealloptions}
          diagramEngine={diagramEngine}
          setNodeName={setNodeName}
        />
      </div>
    </div>
  );
}