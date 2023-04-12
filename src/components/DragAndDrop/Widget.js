import * as React from 'react';
import {PortWidget} from '@projectstorm/react-diagrams';
import {Card, CardContent, Typography} from '@material-ui/core';

/**
 * @author Dylan Vorster
 */
export default class Widget extends React.Component {
  constructor(props) {
    super(props);

    this._renderInPorts = this._renderInPorts.bind(this);
    this._renderOutPorts = this._renderOutPorts.bind(this);
  }

  _renderInPorts(port, i) {
    const {engine} = this.props;

    console.log("port----------->",port)
    console.log("_renderInPorts(port, i)",i)

    let myClasses = (port.options.maximumLinks ? "fw-port--limited " : "") + "fw-port fw-port--input";
    return (
      <PortWidget
        style={{
          top: 5 + (i * 30),
          left: -20,
          position: 'absolute',
          background: '#2C86B2',
          width: 20
        }}
        port={port}
        engine={engine}
        key={port.options.id}
        className={myClasses}>
        <Typography variant="caption" className="fw-port__label">{port.options.name}</Typography>
      </PortWidget>
    );
  }

  _renderOutPorts(port, i) {
    const {engine} = this.props;

    let myClasses = (port.options.maximumLinks ? "fw-port--limited " : "") + "fw-port fw-port--output";
    return (
      <PortWidget
        style={{
          top: 5 + (i * 30),
          right: -20,
          position: 'absolute',
          background: 'orange',
          width: 20
        }}
        port={port}
        engine={engine}
        key={port.options.id}
        className={myClasses}>
        <Typography variant="caption" className="fw-port__label">{port.options.name}</Typography>
      </PortWidget>
    );
  }

  render() {
    const {node} = this.props;
    console.log("node----------->",node)

    return (

      
      <Card className={'card' + (node.isSelected() ? ' is-active' : '')} style={{
        height: 'auto',
        overflow: 'visible'
      }}>
        <CardContent style={{padding: '15px 75px 20px'}}>
          <Typography gutterBottom variant="body2" component="p" align={'center'}>
            {node.options.name}
          </Typography>
          {node.options.extras && node.options.extras.blockType &&
            <Typography color="textSecondary" variant="caption" component="p" align={'center'}>
              {node.options.extras.blockType.type}<small>({node.options.extras.blockType.subtype})</small>
            </Typography>
          }
        </CardContent>
        {node.getInPorts().map(this._renderInPorts)}
        {node.getOutPorts().map(this._renderOutPorts)}
      </Card>
    );
  }
}
