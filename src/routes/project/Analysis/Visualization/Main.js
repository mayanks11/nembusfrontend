/**
 * Cesium Component
 * Nirmalya Saha
 */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
    AppBar
} from "@material-ui/core";
import EarthVisualization from "./EarthVisualization";
import NembusProjectAdapter from "../../../../adapterServices/NembusProjectAdapter";
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

const Main = ({}) => {  
    const projectId = window.location.pathname.split('/')[3];
    
    const [data, setData] = useState(null);
    const [load, setLoad] = useState(false);

    useEffect(()=> {
        const getData = async () => {
            setLoad(true);
            const data = await NembusProjectAdapter.getProjectDataAdapter(projectId);
            setData(data);
            setLoad(false);
        }
        getData();
    },[])

    return (
        <div>
            {load && <RctSectionLoader />}
            <div>
                <AppBar style={{ backgroundColor: "white", height: "47px" }} position="static" color="transparent">
                    <div>
                        <h3 style={{ margin: "7px", padding: "7px" }}>{data && data.title} / Find Satellite / Report Name</h3>
                    </div>
                </AppBar>
            </div>
            <div>
                <EarthVisualization />
            </div>
        </div>
    )
}

const mapState = (state) => ({
});

const mapDispatchToProps = (dispatch) =>{    
}

export default connect(mapState, mapDispatchToProps)(Main);