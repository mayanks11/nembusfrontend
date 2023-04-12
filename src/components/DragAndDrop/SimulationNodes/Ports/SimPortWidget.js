import * as React from 'react';
import { PortWidget } from '@projectstorm/react-diagrams-core';
import PortTextField from './PortTextField';
import Switch from './Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import './SimPortStyle.scss';
const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
	  backgroundColor: '#f5f5f9',
	  color: 'rgba(0, 0, 0, 0.87)',
	  maxWidth: 220,
	  fontSize: theme.typography.pxToRem(12),
	  border: '1px solid #dadde9',
	  placement:"left"
	},
  }))(Tooltip);

function renderPort({
    engine,
    port,
    roundedLeft,
    roundedRight,
    inactivePort = false,
}) {

	
	
	const { color: portBackgroundColor } = port.portType;
	const className = `${roundedLeft ? 'simPortLabel__port--left' : ''} \
		${roundedRight ? 'simPortLabel__port--right' : ''} simPortLabel__port`;
		
	if(!port.allowConnection) return <div className="simPortLabel__port" />;

	
	

	return(
	
		<PortWidget engine={engine} port={port}>
			<HtmlTooltip arrow 
        title={
          <React.Fragment>
            <Typography color="inherit">{port.parent.options.name}</Typography>
			<Typography color="inherit">{"Type:"}{port.portType.type}</Typography>
			{port.portType.type ==="matrix"? <Typography color="inherit">Size(Row X Col):{port.portType.size.row}X{port.portType.size.col}</Typography> :" " }
			
          </React.Fragment>
		}
		placement={port.direction==="in"?"left":"right"}
      >
			<div
				className={className}
				style={{ backgroundColor: portBackgroundColor }}
			/>
			</HtmlTooltip>
		</PortWidget>
	)
}

function renderElement(Element, port, isConnected) {
    return (
		<Element
			disabled={isConnected}
		    defaultValue={port.portType.value}
			onChange={(value) => port.portType.value = value}
			onFocus={() => port.parent.setLocked(true)}
			onBlur={() => port.parent.setLocked(false)}
		/>
	) 
}

function renderInputElement(port, isConnected) {
    return renderElement(PortTextField, port, isConnected);
}

function renderBoolenElement(port, isConnected) {
    return renderElement(Switch, port, isConnected);
}

function renderLabel({ isEditable, port, isConnected, isDisabled }) {
    let inputElement = null;
    
	if (isEditable && port.direction === 'in') {
		switch(port.portType.type) {
			case 'number':
                inputElement = renderInputElement(port, isConnected);
                break;
            case 'boolean':
                inputElement = renderBoolenElement(port, isConnected);
                break;
            default:
                inputElement = null;
		}
    }
    
	return(
		<div className="simPortLabel__label">
			{ inputElement }
			{ !isDisabled && port.options.label }
		</div>
	)
}

export function SimPortLabel({ port,
	engine,
	roundedLeft,
	roundedRight,
	inactivePort,
	disableLabel,
}) {

	inactivePort = false;
	
	const isConnected = !!Object.keys(port.links).length;

	const { isEditable } = true ;//port.portType;

	const portElem = renderPort({ engine, port, roundedLeft, roundedRight, inactivePort });


	const labelElem = renderLabel({ isEditable, port, isConnected, disableLabel:false });

	return (
		<div className="simPortLabel">
			{port.direction === 'in' ? portElem : labelElem}
			{port.direction === 'in' ? labelElem : portElem}
		</div>
	);
}
