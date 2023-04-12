import * as React from 'react';
import ReactDOM from "react-dom";
import {Lock, LockOpen, Add, Remove} from '@material-ui/icons';
import { FormControl, MenuItem, InputLabel, Select } from "@material-ui/core";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import "react-reflex/styles.css";
import "./style.css";
import GitGraph from "./index";
import Parameters from "./Parameters";
import SimulateService from "../../../../api/Simulate";

/**
 * Custom GitGraph Compoennt For User History
 * By Nirmalya Saha
 */

class ControlledElementCls extends React.Component {
    constructor() {
      super();
  
      this.onLockSizeClicked = this.onLockSizeClicked.bind(this);
  
      this.onMinimizeClicked = this.onMinimizeClicked.bind(this);
  
      this.onMaximizeClicked = this.onMaximizeClicked.bind(this);
  
      this.state = {
        size: -1,
        lock: false,
        age: 'Authors',
        authors: [],
        load: false
      };
  
      this.array = [];
      this.front = 0;
      this.rear = 0;
      this.run_tag = 0.0;
      this.currentid = "1d1888di";
    }

    async componentDidMount() {
      this.setState({ load: true })
      if(this.props.id === "pane1") {
        const gitGraph = await SimulateService.getGitGraph(this.props.projectId,this.props.caseId,this.props.email);
        var array = gitGraph.gitGraph;
        var authors = [...this.state.authors];
        array.forEach(function(element){
          if(authors.indexOf(element.createdBy)===-1){
            authors.push(element.createdBy);
          }
        });
        this.setState({ authors: authors });
        console.log("N...", array, authors, this.state.authors);
      }
      this.setState({ load: false });
    }
  
    onLockSizeClicked() {
      this.props.onLockSize({
        locked: this.props.sizeLocked,
        paneId: this.props.id,
        size: this.getSize()
      });
      this.setState({ lock: !this.state.lock });
    }

    handleChanges = (e) => {
      this.setState({ age: e.target.value });
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
              size: size < 250 ? 250 : size
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
          <div className="pane-content">
            <div className="pane-control">
              <Add className='button' onClick={this.onMaximizeClicked}/>
              <Remove className='button' onClick={this.onMinimizeClicked}/>
              
              {
                this.state.lock ? (
                  <Lock className='button' onClick={this.onLockSizeClicked}/>
                ) : (
                  <LockOpen className='button' onClick={this.onLockSizeClicked}/>
                )
              }

              {
                this.props.id === "pane1" &&
                  <div style={{ position: 'relative', float: 'right' }}>
                    <FormControl size="small" style={{ color: 'white' }}>
                      {/* <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel> */}
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={this.state.age}
                        onChange={this.handleChanges}
                        autoWidth
                        label="Age"
                        style={{ color: 'white' }}
                      >
                        <MenuItem value="Authors">
                          <em>Authors</em>
                        </MenuItem>
                        {
                          this.state.authors.map((element) => {
                            return <MenuItem value={element}>{element}</MenuItem>
                          })
                        }          
                      </Select>
                    </FormControl>
                  </div>
                
              }
            </div>
            {
              this.props.id === "pane1" ? (
                <div className='element-pane' > 
                  <GitGraph commit={this.props.commit} author={this.state.age} />
                </div>
              ) : (
                <div className='element-pane' > 
                  <Parameters socket={this.props.socket} saveCzmlData={this.props.saveCzmlData} commit={this.props.commit} commitLoading={this.props.isLoading} />
                </div>
              )
            }
          </div>
        </ReflexElement>
      );
    }
  }
  
  const ControlledElement = React.forwardRef((props, ref) => {
    return <ControlledElementCls innerRef={ref} {...props} />;
  });
  
  class Split extends React.Component {
    constructor(props) {
      super();
  
      this.onLockSize = this.onLockSize.bind(this);
      this.commit = this.commit.bind(this);
  
      this.state = {
        pane1: {
          onLockSize: this.onLockSize,
          commit: this.commit,
          sizeLocked: false,
          name: "Pane 1",
          direction: 1,
          id: "pane1",
          minSize: 250,
          projectId: props.projectId,
          caseId: props.caseId,
          email: props.email
        },
        pane3: {
          onLockSize: this.onLockSize,
          sizeLocked: false,
          name: "Pane 3",
          direction: -1,
          id: "pane3",
          minSize: 250,
          socket: props.socket,
          saveCzmlData: props.saveCzmlData,
          commit: null,
          isLoading: false
        },
        commit: null
      };
    }
  
    onLockSize(data) {
      const locked = !this.state[data.paneId].sizeLocked;
  
      this.state[data.paneId].sizeLocked = locked;
  
      if (locked) {
        this.state[data.paneId].minSize = data.size;
        this.state[data.paneId].maxSize = data.size;
      } else {
        this.state[data.paneId].minSize = 250;
        this.state[data.paneId].maxSize = Number.MAX_VALUE;
      }
  
      this.setState(this.state);
    }

    commit(data){
      this.setState({
        ...this.state,
        pane3: {
          ...this.state.pane3,
          commit: data,
          isLoading: !this.state.pane3.isLoading
        }
      });
      this.setState({commit: data});
      console.log("Nirmalya Commit", this.state.commit, this.state.pane3.commit, data, this.state.pane3.isLoading);
    }
  
    render() {
      return (
        <div >
        <ReflexContainer orientation="vertical" style={{height: "100%"}}>
          <ControlledElement {...this.state.pane1} />
          <ReflexSplitter />
          <ControlledElement {...this.state.pane3} />
        </ReflexContainer>
        </div>
      );
    }
  }

  export default Split;