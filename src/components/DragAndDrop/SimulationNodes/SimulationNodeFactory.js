import * as React from 'react';
import { SimulationNodeModel } from './SimulationNodeModel';
import { SimulationNodeWidget } from './SimulationNodeWidget';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';

export class SimulationNodeFactory extends AbstractReactFactory {
	constructor(diagrams) {
		super('deltav');
		this.diagramsengine = diagrams

		console.log("engine diagrams diagrams",this)
	}

	generateModel(event) {

		return new SimulationNodeModel();
	}

	generateReactWidget(event) {

		
		return <SimulationNodeWidget
			engine={this.engine}
			diagramEngine={this.diagramsengine}
			node={event.model}
		/>;
	}
}