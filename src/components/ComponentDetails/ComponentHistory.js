import React , { Component } from 'react';
import IntlMessages from "Util/IntlMessages";
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import { RctCard } from 'Components/RctCard';
import ComponentApi from 'Api/Component'
import {
    Tooltip,
    List,
    ListItem,
    CircularProgress,
    AccordionDetails,
  } from '@material-ui/core';
import ModelInformationTabs from 'Components/ComponentDetails/ModelInformationTabs';
const styles = {
    mr10: {
       marginRight: 25
    },
    mt10: {
       marginTop: 10
    },
    bold: {
      fontWeight: 'bold'
    },
    leftBorder: {
      paddingLeft: 10,
      marginRight: 10,
      borderLeft: '1px solid black'
    },
    rightBorder: {
      marginLeft: 10,
      paddingRight: 10,
      borderRight: '1px solid black'
    },
    center: {
      marginLeft: 10,
      marginRight: 10
    },
    primaryColor:{
      color:'#2196f3'
    },
    maxWidth: {
       maxWidth:'100%'
    },
    pullLeft: {
       float: 'left'
    },
    alignCenter: {
       textAlign: 'center'
    },
    textArea: {
       width: '100%',
       marginTop: 20,
       marginBottom: 10,
       borderRadius: 5,
       border: '1px solid rgb(221,221,221)'
     }
  };
class ComponentHistory extends Component {

    state = {
       name:'',
       ModelLoading: true,
       type: '',
       subtype: '',
       supplier: '',
       satelliteName: '',
       updatingFrequency: {},
       version: '',
       description: '',
       outputArray: [],
       inputArray: [],
       cadFile: {}
    }

    componentDidMount = async() => {
        const {componentId, versionId, cadFile} = this.props;
        const details = await ComponentApi.getComponentVersionDetails(componentId, versionId);
        this.setState({
            satelliteName: details.SatelliteName,
            version: details.version.major+'.'+
            details.version.minor+'.'+details.version.patch,
            type: details.ModelDetail.type,
            subtype: details.ModelDetail.subtype,
            description: details.description,
            supplier: details.Supplier,
            outputArray: details.outputArray,
            inputArray: details.inputArray,
            updatingFrequency: details.datas.simulationDetail.updatingFrequency,
            cadFile:cadFile
        });
    }

    modelLoaded = () => {
        this.setState({
            ModelLoading: false
        })
    }

    render() {
        const {
            name,
            ModelLoading,
            type,
            subtype,
            supplier,
            satelliteName,
            updatingFrequency,
            version,
            description,
            outputArray,
            inputArray,
            cadFile
        } = this.state;
        return (
            <AccordionDetails style={{flexDirection: 'column'}}>
                <div className="list-wrapper">
                <h3 style={styles.bold}>
                    {name}
                </h3>
                </div>
                <div className="row m-0">
                <div className="col-sm-12 col-md-12 col-xl-8 d-sm-half-block rct-block">
                    <span style={{paddingTop:'10px', paddingLeft:'10px'}}><strong>3D Model</strong></span>
                    <div style={{ margin: '0px auto' }}>
                        <React.Fragment>
                            <div style={{display: ModelLoading ? "block" : "none", textAlign:'center'}}>
                            <CircularProgress color='inherit' size={30} />
                            </div>
                            <GLTFModel 
                            style={{display: ModelLoading ? "block" : "none"}}
                            onLoad={this.modelLoaded}
                            loader="gltf" width="800"
                            scale={{x:.6, y:.6, z:.6}}
                            src="https://kafka2websocket.appspot.com/getModel/cubesat.gltf"
                            >
                            </GLTFModel>
                        </React.Fragment>
                    </div>
                </div>
                <div className="col-sm-12 col-md-12 col-xl-4 d-sm-half-block">
                    <RctCard>
                        <RctCollapsibleCard>
                            <List>
                            {type !== '' &&
                                <ListItem className="d-flex align-items-center border-bottom py-15 componenet-types">
                                    <span className="w-25">Type</span>
                                    <p className="w-75 mb-0 text-right">{type}</p>
                                </ListItem>
                            }
                            {subtype !== '' && 
                                <ListItem className="d-flex align-items-center border-bottom py-15 componenet-types">
                                    <span className="w-25">Sub Type</span>
                                    {subtype.length > 18 ? (
                                    <Tooltip title={subtype} placement='top'>
                                        <div>{`${subtype.slice(0, 17)}...`}</div>
                                    </Tooltip>
                                    ) : (
                                        <p className="w-75 mb-0 text-right">{subtype}</p>
                                    )}
                                </ListItem>
                            }
                            {supplier !== '' &&
                                <ListItem className="d-flex align-items-center border-bottom py-15 componenet-types">
                                    <span className="w-25">Project</span>
                                    <p className="w-75 mb-0 text-right">{supplier}</p>
                                </ListItem>
                            }
                            {satelliteName !== '' &&
                                <ListItem className="d-flex align-items-center border-bottom py-15 componenet-types">
                                    <span className="w-75">Satellite</span>
                                    <p className="w-100 mb-0 text-right">{satelliteName}</p>
                                </ListItem>
                            }
                            {updatingFrequency &&
                                Object.keys(updatingFrequency).length > 0 && (
                                    <ListItem className="d-flex align-items-center border-bottom py-15 componenet-types">
                                        <span className="w-75">Updating Frequency</span>
                                        <p className="w-75 mb-0 text-right">{`${updatingFrequency.value} ${updatingFrequency.unit}`}</p>
                                    </ListItem>
                                )
                            }
                            {version !== '' &&
                                <ListItem className="d-flex align-items-center border-bottom py-15 componenet-types">
                                    <span className="w-75">Version</span>
                                    <p className="w-100 mb-0 text-right">{version}</p>
                                </ListItem>
                            }
                            </List>
                        </RctCollapsibleCard>
                    </RctCard>
                    <RctCard>
                        <div style={{height: '300px'}}>
                            <RctCollapsibleCard>
                            <div style={styles.bold}>Snippet</div>
                            </RctCollapsibleCard>
                        </div>
                    </RctCard>
                </div>
                </div>
                <ModelInformationTabs 
                description={description} 
                outputArray={outputArray}
                inputArray={inputArray}
                cadFile={cadFile}/>
                </AccordionDetails>
        );
    }
}

export default ComponentHistory;