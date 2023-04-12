import React, { useState } from 'react';
import shortid from 'shortid';
import { SimPortLabel } from '../Ports/SimPortWidget';

function renderBezierCurve(node, options) {
  const { points, invertedCurve } = options.variables;
  const [ isCurveDecreasing, setCurveDecreasing ] = useState(invertedCurve);

  const handleSwitchChange = (value) => {
    options.variables.invertedCurve = value;
    setCurveDecreasing(value);
  }
  
	return (
		<div 
			onMouseDown={() => node.setLocked(true)}
			onMouseUp={() => node.setLocked(false)}
			onMouseLeave={() => node.setLocked(false)}
			className="simulationNode__body__visualisation"
		>
  
		</div>
	)
}

function renderVisualisation(node, options) {
	const visualisationType = options.visualisation;
	if (visualisationType === 'BezierCurve') {
		return renderBezierCurve(node, options);
  }
  
  return null;
}

function getPortsWithDirection(ports, direction = 'in') {
  const returnPorts = [];

  Object.values(ports).forEach((port) => {
    port.setMaximumLinks(1);
    if (port.direction === direction) {
      returnPorts.push(port);
    }
  });

  return returnPorts;
}

function renderPorts(ports, inActive, engine, isLeft = true) {

 
  return ports.map((inputPort) => (
    <SimPortLabel
      roundedLeft={isLeft}
      roundedRight={!isLeft}
      inactivePort={inActive}
      engine={engine}
      port={inputPort}
      key={shortid.generate()}
    />
  ))
}

export default function SimulationNodeBody(props) {
  const { node, inActive, engine } = props;
  
  const ports = node.getPorts();

 

  const inputPorts = getPortsWithDirection(ports, 'in');
  const outputPorts = getPortsWithDirection(ports, 'out');
  

  return (
    <div className="simulationNode__body">
      {
        node.options && node.options.options 
      }
      <div className="simulationNode__ports simulationNode__inputPorts">
        {
          renderPorts(inputPorts, false, engine, true)
        }
      </div>
      <div className="simulationNode__ports simulationNode__outputPorts">
        {
          renderPorts(outputPorts, inActive, engine, false)
        }
      </div>
    </div>
  );
}