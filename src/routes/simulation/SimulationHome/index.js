import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { withRouter } from 'react-router-dom';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar'
import {
    Card,
    CardContent,
    Grid
} from '@material-ui/core';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Table from 'mui-datatables';
import {
    fireEvent,
    setSimulationStatus,
    setProject,
    setCase,
    setParameters
} from 'Actions/Simulate';

import * as firebase from 'Firebase';
import SimulationService from 'Api/Simulate';
import IntlMessages from 'Util/IntlMessages';

import './index.scss';

import moment from 'moment';
import {get} from 'lodash';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const Home = ({
    fireEvent,
    setSimulationStatus,
    simulationStatus,
    caseName,
    setProject,
    setCase,
    setParameters,
    match,
    history,
    simenginestatus
}) => {

    const [storage, setStorage] = useState(null);
    const [topFive, setTopFive] = useState([]);
    const [actions, setActions] = useState([]);

    

    useEffect(() => {
        
        getStorage();
        getStatus();
        getLatestCases();
        getActions();
    }, []);

    async function getLatestCases() {
        await sleep(2000);
        const { uid } = firebase.auth.currentUser;
        const result = await SimulationService.fetchLatestProjects(uid/*'21c4c752bcb211e99cb52a2ae2dbcce4'*/);
        setTopFive(result.map(r => ({
            ...r,
            CreatedDate: moment(r.LastModifiedOn.seconds*1000).local().format('YYYY-MM-DD HH:mm:ss')

        })));


    }
    
    function onSelect(row) {
        
        const element = topFive.find(c => c.SimulationName == row[0] && c.ProjectName == row[1]);
    

        const { projectDoc, caseDoc } = element
        setProject({
            ...projectDoc
        });
        setCase({
            ...caseDoc
        });
        setParameters({
            ...caseDoc.parameters
        });
        history.push('/app/simulation/simulate');
    }

    async function getStorage() {
        await sleep(4000);
        fireEvent('storage', [result => {
            setStorage(parseInt(result) / Math.pow(10, 9));
        }]);
    }

    async function getStatus() {
        await sleep(4000);
        fireEvent('status_req', [result => {
            setSimulationStatus(result);
        }])
    }

    async function getActions() {
        await sleep(3000);
        
        const { uid } = firebase.auth.currentUser;
        let result = await SimulationService.fetchLatestActions(uid);

        
        setActions(result.map(r => ({
            ...r,
            CreatedDate:moment(result[0].CreatedDate).local().format('YYYY-MM-DD HH:mm:ss')

        })));
    }


    const usedSpace = storage;
    const remainingSpace = 15 - usedSpace;
    const options = {
        filter: false,
        search: false,
        print: false,
        download: false,
        viewColumns: false,
        selectableRows: 'none',
        pagination: false
    }
    
    const chartOptions = {
        datasets: [{
            data: [usedSpace, remainingSpace],
            backgroundColor: ['#8cf5f5', '#56a0ea']
        }],
        labels: [
            'Used',
            'Total'
        ],
    }

    const caseColumns = [
        {
            label: 'Case',
            name: 'SimulationName'
        },
        {
            label: 'Project',
            name: 'ProjectName'
        },
        {
            label: 'Last Activity',
            name: 'CreatedDate'
        }
    ]

    const actionColumns = [
        {
            label: 'Action',
            name: 'Type'
        },
        {
            label: 'Simulation',
            name: 'CaseName'
        },
        {
            label: 'Project',
            name: 'ProjectName'
        },
        {
            label: 'Timestamp',
            name: 'CreatedDate'
        }
    ]

    

    return (
        <React.Fragment>
            <PageTitleBar title='Simulation' match={match} enableBreadCrumb={true} />
        <div className="home">
            {/* <h1>Home</h1> */}
            <Grid container style={{
                flexGrow: 1,
                padding :10
             
                }}>
                <Grid item md={6}>
                    <Card className="card" style={{height:'100%'}}>
                        <CardContent>
                            <div className="row">
                                <strong>Space Used</strong>
                            </div>
                            <Pie
                                data={chartOptions}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={6}>
                    <Card className="card" style={{height:'100%',backgroundColor:'#ededed'}}>
                        <CardContent>
                            <div>
                                <strong>Running Simulation</strong>
                            </div>
                           
                            <Grid container className="row">
                                <Grid item md={2}>Status</Grid>
                                <Grid
                                    item
                                    md={10}
                                    classes={{
                                        root: classNames({
                                            'active': ['Running', 'Completed'].includes(simulationStatus),
                                            'error': simulationStatus === 'Error'
                                        })
                                    }}
                                >
                                {get(simenginestatus,['current_engine_states','status']) }
                                </Grid>
                            </Grid>

                            <Grid container className="row">
                                <Grid item md={2}>Name</Grid>
                                <Grid item md={10}>{get(simenginestatus,['current_engine_states','running_info','project_name']," ") }</Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Latest Simulation and Recent Activity Grid */}
            <Grid container style={{
                flexGrow: 1
            }}>

                <Grid item md={6}>
                <Card className="card" style={{height:'100%',backgroundColor:'#ededed'}}>
                    <CardContent> <h3>Latest Simulations</h3></CardContent>
                    <Table
                        data={topFive}
                        columns={caseColumns}
                        options={{
                            ...options,
                            onRowClick: onSelect.bind(this)
                        }}
                    />
                    </Card>
                </Grid>

                <Grid item md={6} >
                <Card className="card" style={{height:'100%',backgroundColor:'#ededed'}}>
                    <CardContent><h3>Recent Activity</h3></CardContent>
                    <Table                 
                        data={actions}
                        columns={actionColumns}
                        options={options}
                    />
                    </Card>
                </Grid>
            </Grid>
        </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    caseName: state.simulate.getIn(['status', 'caseName']),
    simulationStatus: state.simulate.getIn(['status', 'status']),
    simenginestatus:state.simengine
});

const mapDispatchToProps = {
    fireEvent,
    setSimulationStatus,
    setProject,
    setCase,
    setParameters
};

export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Home));