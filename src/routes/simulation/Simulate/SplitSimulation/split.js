import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Code, UnfoldMore } from '@material-ui/icons';
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import { connect } from "react-redux";
import "react-reflex/styles.css";
import "./style.css";
import { setMax, setMin, setLock, setExpand } from "../../../../actions/Split";
import EarthVisualization from "../earthvisualization";
import Parameters from "./Parameter";
import { Rnd } from "react-rnd";
import TimeLine from "../CesiumTimeline"

/**
 * Split Simulation
 * Nirmalya Saha
 */

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
  zIndex: "100"
};

class CollapsibleElementCls extends React.Component {
  constructor() {
    super();

    this.onLockSizeClicked = this.onLockSizeClicked.bind(this);

    this.onMinimizeClicked = this.onMinimizeClicked.bind(this);

    this.onMaximizeClicked = this.onMaximizeClicked.bind(this);

    this.state = {
      size: -1,
      lock: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.max !== this.props.max) {
      this.onMaximizeClicked();
    }
    if(prevProps.min !== this.props.min) {
      this.onMinimizeClicked()
    }
    if(prevProps.lock !== this.props.lock) {
      this.onLockSizeClicked();
    }
  }

  onLockSizeClicked() {
    this.props.onLockSize({
      locked: this.props.sizeLocked,
      paneId: this.props.id,
      size: this.getSize()
    });
    this.setState({ lock: !this.state.lock });
  }

  onMinimizeClicked() {
    if(this.state.lock){
      return;
    }
    const currentSize = this.getSize();

    const update = (size) => {
      return new Promise((resolve) => {
        this.setState(
          {
            size: size < 100 ? 100 : size
          },
          () => resolve()
        );
      });
    };

    const done = (from, to) => {
      return from < to;
    };

    this.animate(currentSize, 25, -8, done, update);
  }

  onMaximizeClicked() {
    if(this.state.lock){
      return;
    }
    const currentSize = this.getSize();

    const update = (size) => {
      return new Promise((resolve) => {
        this.setState(
          {
            size
          },
          () => resolve()
        );
      });
    };

    const done = (from, to) => {
      return from > to;
    };

    this.animate(currentSize, 1200, 8, done, update);
  }

  getSize() {
    const domElement = ReactDOM.findDOMNode(this);

    switch (this.props.orientation) {
      case "horizontal":
        return domElement.offsetHeight;

      case "vertical":
        return domElement.offsetWidth;

      default:
        return 0;
    }
  }

  animate(start, end, step, done, fn) {
    const stepFn = () => {
      if (!done(start, end)) {
        fn((start += step)).then(() => {
          window.requestAnimationFrame(stepFn);
        });
      }
    };

    stepFn();
  }

  render() {
    const lockStyle = this.props.sizeLocked ? { color: "#FF0000" } : {};

    return (
      <ReflexElement size={this.state.size} {...this.props}>
        <div className="pane-content" style={{height: "100%"}}>
          {
            this.props.id === "pane1" ? (
              <div className='element-pane' style={{height: "100%"}}> 
                  <EarthVisualization socket={this.props.socket} addCesiumcontroller={this.props.addCesiumcontroller} />
              </div>
            ) : this.props.id === "pane2" ? (
              <div className='element-pane' style={{height: "100%"}}> 
                  <h1>Split Panel 2</h1>
              </div>
            ) : (
              <div className='element-pane' style={{height: "100%"}}> 
                  <h1>Split Panel 3</h1>
              </div>
            )
          }
        </div>
      </ReflexElement>
    );
  }
}

const CollapsibleElement = React.forwardRef((props, ref) => {
  return (
    <CollapsibleElementCls innerRef={ref} {...props}/>
  )
})

function Split(props){
  const refContainer = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (refContainer.current) {
      setDimensions({
        width: refContainer.current.offsetWidth,
        height: refContainer.current.offsetHeight,
      });
    }
  }, []);

  const onLockSize = (data) => {
    const locked = !stateData[data.paneId].sizeLocked;

    var update = stateData;
    update[data.paneId].sizeLocked = locked;

    if (locked) {
      update[data.paneId].minSize = data.size;
      update[data.paneId].maxSize = data.size;

    } else {
      update[data.paneId].minSize = 100;
      update[data.paneId].maxSize = Number.MAX_VALUE;
    }
    setStateData(update);
  }

  const [stateData, setStateData] = useState({
    pane1: {
      onLockSize: onLockSize,
      sizeLocked: false,
      name: "Pane 1",
      direction: 1,
      id: "pane1",
      minSize: 100,
      socket: props.socket,
      addCesiumcontroller: props.addCesiumcontroller,
      max: props.SplitReducer.pane1.max,
      min: props.SplitReducer.pane1.min,
      lock: props.SplitReducer.pane1.lock,
      collapse: props.SplitReducer.pane1.collapse
    },
    pane2: {
      onLockSize: onLockSize,
      sizeLocked: false,
      name: "Pane 2",
      direction: 1,
      id: "pane2",
      minSize: 100,
      socket: props.socket,
      addCesiumcontroller: props.addCesiumcontroller,
      max: props.SplitReducer.pane2.max,
      min: props.SplitReducer.pane2.min,
      lock: props.SplitReducer.pane2.lock,
      collapse: props.SplitReducer.pane2.collapse
    },
    pane3: {
      onLockSize: onLockSize,
      sizeLocked: false,
      name: "Pane 3",
      direction: -1,
      id: "pane3",
      minSize: 100,
      socket: props.socket,
      addCesiumcontroller: props.addCesiumcontroller,
      max: props.SplitReducer.pane3.max,
      min: props.SplitReducer.pane3.min,
      lock: props.SplitReducer.pane3.lock,
      collapse: props.SplitReducer.pane3.collapse
    },
    pane4: {
      windowCollapse: props.SplitReducer.pane4.windowCollapse
    }
  });

  const handleLock = (value) => {
    var update = stateData;
    update[value].lock = !stateData[value].lock;
    setStateData(update);
  }

  const handleMax = (value) => {
    var update = stateData;
    update[value].max = !stateData[value].max;
    setStateData(update);
  }

  const handleMin = (value) => {
    var update = stateData;
    update[value].min = !stateData[value].min;
    setStateData(update);
  }

  const handleCollapse = (value) => {
    var update = stateData;
    update[value].collapse = !stateData[value].collapse;
    setStateData(update);
  }

  const handleWindowSplit = (value) => {
    var update = stateData;
    update[value].windowCollapse = !stateData[value].windowCollapse;
    setStateData(update);
  }

  return(
    <div ref={refContainer} style={{height: "100%"}}>
      <ReflexContainer orientation="horizontal" style={{height: "100%"}}>
        <ReflexElement minSize={48} maxSize={48}>
            <Parameters socket={props.socket} saveCzmlData={props.saveCzmlData} handleMax={handleMax} 
            handleMin={handleMin} handleLock={handleLock} handleCollapse={handleCollapse} handleWindowSplit={handleWindowSplit} />
        </ReflexElement>
        <ReflexElement>
        <ReflexContainer orientation='vertical' style={{height: "100%"}}>
          {
            stateData["pane1"].collapse ? (
              <ReflexElement>
                <div className='pane-content' style={{height: "100%"}}>
                  <ReflexContainer orientation='horizontal' style={{height: "calc(100vh - 140px)"}}>
                    {stateData["pane1"].collapse && <CollapsibleElement {...stateData.pane1}/> }
                  </ReflexContainer>
                </div>
              </ReflexElement>
            ) : null
          }

          {
            stateData["pane1"].collapse || stateData["pane2"].collapse || 
            stateData["pane3"].collapse ? (
              <ReflexSplitter>
                <div className='splitter'>
                  <Code />
                </div>
              </ReflexSplitter>
            ) : null
          }
 
          {
            stateData["pane3"].collapse || stateData["pane2"].collapse ? (
              <ReflexElement>
                <div className='pane-content' style={{height: "100%"}} >
                  <ReflexContainer orientation='horizontal' style={{height: "calc(100vh - 140px)"}}>
                    {stateData["pane2"].collapse && <CollapsibleElement {...stateData.pane2}/>}
                    <ReflexSplitter propagate={true} />
                    {stateData["pane3"].collapse && <CollapsibleElement {...stateData.pane3}/>}
                  </ReflexContainer>
                </div>
              </ReflexElement>
            ) : null
          }
        </ReflexContainer>
        </ReflexElement>
        <ReflexSplitter propagate={true}>
          <div className='splitter' style={{top: "-10px"}}>
            <UnfoldMore />
          </div>
        </ReflexSplitter>
        <ReflexElement minSize={55} maxSize={65}>
          <div style={{backgroundColor: "grey", height: "100%", width: "100%"}}>
            <TimeLine />
          </div>
        </ReflexElement>
      </ReflexContainer>
      { 
        stateData["pane4"].windowCollapse && dimensions.width > 0 ? (
        <Rnd
            style={style}
            className="extra-window"
            default={{
              x: dimensions.width/2,
              y: 50,
              width: "50%",
              height: ((dimensions.height) - 120)
            }}
            minWidth='200'
            minHeight={200}
            bounds="parent"
          >
            <div className="extra-window" style={{backgroundColor: "grey", height: "100%", width: "100%"}}>
              Extra Utility Window
            </div>
          </Rnd>
        ) : null 
       }
    </div>
  )
}

const stateProp = (state) => ({
  SplitReducer: state.SplitReducer
});

const dispatchProps = {
  setMax, 
  setMin, 
  setLock, 
  setExpand
};

export default connect(stateProp, dispatchProps)(Split);