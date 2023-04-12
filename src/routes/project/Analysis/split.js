/**
 * Split Nembus Project Details
 * B2C
 * Nirmalya Saha
 */

import React, { useState, useEffect, useRef } from "react";
import { Code } from '@material-ui/icons';
import { ReflexContainer, ReflexElement, ReflexSplitter, ReflexHandle } from "react-reflex";
import { setNembusProjectWidthChanged } from "../../../actions/Split";
import { connect } from "react-redux";
import "react-reflex/styles.css";
import "./style.css";
import DrawerPanel from "./Drawer";
import Main from "./Visualization/Main";
import Analysis from "./Analysis"

class CollapsibleElementCls extends React.Component {
  constructor() {
    super();

    this.state = {
      size: -1,
      lock: false,
    };
  }

  render() {
    return (
      <ReflexElement size={this.state.size} {...this.props}>
        <div className="pane-content" style={{height: "100%"}}>
          {
            this.props.id === "pane2" ? (
              <div style={{height: "100%"}}> 
                 <Main />
              </div>
            ) : this.props.id === "pane1" ? (
              <div style={{height: "100%"}}> 
                  <DrawerPanel socket={this.props.socket} saveCzmlData={this.props.saveCzmlData} navIcon={this.props.navIcon}/>
              </div>
            ) : (
              <div style={{height: "100%"}}> 
                <Analysis />
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

  const ref = useRef();
  const ref2 = useRef();

  const [stateData, setStateData] = useState({
    pane1: {
      sizeLocked: false,
      name: "Pane 1",
      direction: 1,
      id: "pane1",
      minSize: 150,
      maxSize: 250,
      socket: props.socket,
      saveCzmlData: props.saveCzmlData,
    },
    pane2: {
      sizeLocked: false,
      name: "Pane 2",
      direction: -1,
      id: "pane2",
      minSize: 250,
      socket: props.socket,
      saveCzmlData: props.saveCzmlData,
    },
    pane3: {
      sizeLocked: false,
      name: "Pane 3",
      direction: -2,
      id: "pane3",
      minSize: 250,
      socket: props.socket,
      saveCzmlData: props.saveCzmlData,
      widthChanged: 0
    }
  });

  const [navIcon, setNavIcon] = useState(false);

  const onResize = (e) => {
    if (e.domElement && ref && ref.current) {
      if(ref.current.offsetWidth <= 190) {
        setNavIcon(true);
      } else {
        setNavIcon(false);
      }
    }
  }

  const onResize2 = (e) => {
    if (e.domElement && ref2 && ref2.current) {
      props.setNembusProjectWidthChanged(ref2.current.offsetWidth);
    }
  }

  return(
    <div style={{height: "100%"}}>
        <ReflexContainer orientation='vertical' style={{height: "100vh"}}>
              <ReflexElement onResize={onResize} minSize={140} maxSize={310}>
                <div ref={ref} className='pane-content' style={{height: "100vh"}}>
                    <CollapsibleElement {...stateData.pane1} navIcon={navIcon}/> 
                </div>
              </ReflexElement>

              <ReflexSplitter style={{ zIndex: "1", height: "99vh" }} className="hoverEffect">
                <div className='splitter'>
                  <Code />
                </div>
              </ReflexSplitter>

              <ReflexElement minSize={400}>
                <div className='pane-content' style={{height: "100vh"}} >
                    <CollapsibleElement {...stateData.pane2}/>
                </div>
              </ReflexElement>

              <ReflexSplitter style={{ zIndex: "1", height: "99vh" }} className="hoverEffect">
                <div className='splitter'>
                  <Code />
                </div>
              </ReflexSplitter>

              <ReflexElement onResize={onResize2} minSize={150}>
                <div ref={ref2} className='pane-content' style={{height: "100vh"}} >
                    <CollapsibleElement {...stateData.pane3}/>
                </div>
              </ReflexElement>
        </ReflexContainer>
    </div>
  )
}

const stateProp = (state) => ({

});

const dispatchProps = {
  setNembusProjectWidthChanged
};

export default connect(stateProp, dispatchProps)(Split);