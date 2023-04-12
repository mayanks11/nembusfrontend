/**
 * NEMBUS PROJECT
 * B2C
 * Nirmalya Saha
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Split from "./Analysis/split";
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import NembusProjectAdapter from "../../adapterServices/NembusProjectAdapter";

import {
  saveCzmlData,
   changeTab
 } from "../../actions/Simulate";

const ProjectHome = (props) => {
   const {
      socket,
      saveCzmlData
    } = props;
  const projectId = window.location.pathname.split('/')[3];
  const [load, setLoad] = useState(false);
  const [isProject, setIsProject] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoad(true);
      const data = await NembusProjectAdapter.checkCurrentUserProjectAdapter(projectId);
      setIsProject(data);
      setLoad(false);
    }
    getData();
  },[]);

  if(load) {
    return <RctSectionLoader />;
  } else if(load === false && isProject === false) {
      return <Redirect to={"/app/home"} />
  } else {
    return (
      <Split socket={socket} saveCzmlData={saveCzmlData}/>
    );
  }
};

const mapStateToProps = (state) => ({
   activeTab: state.simulate.get("activeTab"),
   isHeaderCollapsed: state.settings.isHeaderCollapsed,
   socket: state.simulate.get("socket")
});

const mapDispatchToProps = {
   changeTab,
   saveCzmlData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectHome);
