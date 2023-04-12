import Widget from './Widget';
import Model from './Model';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';

export default class Factory extends AbstractReactFactory {
	constructor() {
		super('deltav');
	}

	generateReactWidget(event){
		return <Widget engine={this.engine} size={120} node={event.model} />;
	}

	generateModel(event) {
		const model  = new Model();
	
		return model;
	}
}
