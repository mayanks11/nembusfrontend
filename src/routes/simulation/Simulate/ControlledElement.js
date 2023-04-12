import React, { useEffect, useState, Fragment, useRef } from "react";
import ReactDOM from 'react-dom'
import 'react-reflex/styles.css';
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex"; 

class ControlledElementCls
  extends React.Component {

  constructor () {

    super()

    this.onLockSizeClicked =
      this.onLockSizeClicked.bind(this)

    this.onMinimizeClicked =
      this.onMinimizeClicked.bind(this)

    this.onMaximizeClicked =
      this.onMaximizeClicked.bind(this)

    this.state = {
      size: -1
    }
  }

  onLockSizeClicked () {

    this.props.onLockSize({
      locked: this.props.sizeLocked,
      paneId: this.props.id,
      size: this.getSize()
    })
  }

  onMinimizeClicked () {

    const currentSize = this.getSize()
    console.log("currrent size minimum",currentSize)
    const update = (size) => {

      return new Promise((resolve) => {

        this.setState({
          size: size < 25 ? 25 : size
        }, () => resolve())
      })
    }

    const done = (from, to) => {

      return from < to
    }

    this.animate (
      currentSize, 25, -8,
      done, update)
  }

  onMaximizeClicked () {

    const currentSize = this.getSize()
    
    console.log("currrent size",currentSize)

    const update = (size) => {

      return new Promise((resolve) => {

        this.setState({
          size
        }, () => resolve())
      })
    }

    const done = (from, to) => {

      return from > to
    }

    this.animate (
      currentSize, 400, 8,
      done, update)
  }

  getSize () {

    const domElement = ReactDOM.findDOMNode(this)

    switch (this.props.orientation) {

      case 'horizontal':
        return domElement.offsetHeight

      case 'vertical':
        return domElement.offsetWidth

      default:
        return 0
    }
  }

  animate (start, end, step, done, fn) {

    const stepFn = () => {

      if (!done(start, end)) {

        fn(start += step).then(() => {

          window.requestAnimationFrame(stepFn)
        })
      }
    }

    stepFn ()
  }

  render () {

    const lockStyle = this.props.sizeLocked ?
      { color: '#FF0000' } : {}

    return (
      <ReflexElement size={this.state.size} {...this.props}>
        <div className="pane-content">
          <div className="pane-control">
            <label>
              {this.props.name}  Controls
            </label>
            <button onClick={this.onMaximizeClicked}>
              <label> + </label>
            </button>
            <button onClick={this.onMinimizeClicked}>
              <label> - </label>
            </button>
            <button onClick={this.onLockSizeClicked}>
              <label style={lockStyle} > = </label>
            </button>
          </div>
          <div className="ctrl-pane-content">
            <label>
              {this.props.name}
            </label>
          </div>
        </div>
      </ReflexElement>
    )
  }
}

const ControlledElement = React.forwardRef((props, ref) => {
  return (
    <ControlledElementCls innerRef={ref} {...props}/>
  )
})

export default class ReflexControlsDemo
  extends React.Component {

  constructor () {

    super()

    this.onLockSize =
      this.onLockSize.bind(this)

    this.state = {
      pane1: {
        onLockSize: this.onLockSize,
        sizeLocked: false,
        name: 'Pane 1',
        direction: 1,
        id: 'pane1',
        minSize: 25
      },
      pane2: {
        onLockSize: this.onLockSize,
        sizeLocked: false,
        name: 'Pane 2',
        direction: [1, -1],
        id: 'pane2',
        minSize: 25
      },
      pane3: {
        onLockSize: this.onLockSize,
        sizeLocked: false,
        name: 'Pane 3',
        direction:-1,
        id: 'pane3',
        minSize: 25
      }
    }
  }

  onLockSize (data) {

    const locked = !this.state[data.paneId].sizeLocked

    this.state[data.paneId].sizeLocked = locked

    if (locked) {

      this.state[data.paneId].minSize = data.size
      this.state[data.paneId].maxSize = data.size

    } else {

      this.state[data.paneId].minSize = 25
      this.state[data.paneId].maxSize = Number.MAX_VALUE
    }

    this.setState(this.state)
  }

  render () {

    return (
      <ReflexContainer orientation="vertical">

        <ReflexElement flex={0.4}>
          <div className="pane-content">
            <ReflexContainer orientation="horizontal">

              <ControlledElement {...this.state.pane1}/>

              <ReflexSplitter propagate={true}/>

              <ControlledElement {...this.state.pane2}/>

              <ReflexSplitter propagate={true}/>

              <ControlledElement {...this.state.pane3}/>

            </ReflexContainer>
          </div>
        </ReflexElement>

        <ReflexSplitter/>

        <ReflexElement>
          <div className="pane-content">
            <label>
            App Pane
            </label>
          </div>
        </ReflexElement>

      </ReflexContainer>
    )
  }
}
