import React, { useEffect,useState } from "react";
import * as Cesium from 'cesium';
// import "react-reflex/styles.css";
import { connect } from "react-redux";
import { CesiumController } from "../../../../components/Visualization/Cesium/CesiumController";
import "../../../../components/Visualization/Cesium/bucketRaw.css";
import "./index.scss";
import "./css/main.css";
import "./style.css";
import NembusProjectAdapter from "../../../../adapterServices/NembusProjectAdapter";
import NembusProjectService from "../../../../api/NembusProject";
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import json from "./data.json";
console.log(json);
const dataCoverage = json.dataofcoverage;
const b1_arr =[];

const b2_arr =[];



for(let key in dataCoverage){
  if(key == "0"){
    continue;
  }
  dataCoverage[key].forEach(l => {
    if(l[0] === "PALAPA B1"){
      b1_arr.push(l);
      
    }else if(l[0] === "PALAPA B4"){
      b2_arr.push(l);
    }
  })
}
console.log("PALAPA B1",b1_arr);
console.log("PALAPA B4",b2_arr);


const CesiumThreeDimesionViz = ({

}) => {

  function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }

  const [windowSize, setWindowSize] = useState(getWindowSize());
  const[level0, setLevel0] = useState([]);
  const[level1, setLevel1] = useState([]);
  const[view, setView] = useState(null);
  const [tempView, setTempView] = useState(null);
  const[load, setLoad] = useState(false);
  const [finalLoad, setFinalLoad] = useState(false);
  const [country, setCountry] = useState();
  const [state, setState] = useState();
  let dataJson = {
    "type": "FeatureCollection",
    "name": "gadm41_IND_0",
    "crs": {
      "type": "name",
      "properties": {
          "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
      }
  },
  "features": []};
  let dataJson1 = {
    "type": "FeatureCollection",
    "name": "gadm41_IND_0",
    "crs": {
      "type": "name",
      "properties": {
          "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
      }
  },
  "features": []};
  const projectId = window.location.pathname.split('/')[3];
 
  const getInterestedLocationSnapshots = async () => {
    await NembusProjectService.getProjectInterestedLocationSnapshots(
      projectId,
      async (snapshot) => {
        const data = await NembusProjectAdapter.getGeoJsonCoordinatesInterestedLocationAdapter(projectId);
        setFinalLoad(true);
        setLoad(true);
        setLevel0(data.level0);
        setLevel1(data.level1);
        setLoad(false);
        snapshot.docChanges().forEach((change) => {
          // if(change.type === "added"){
          //   setId(change.doc.data().id);
          //   console.log("id",change.doc.data());
          // }
          if(change.type === "removed"){
            if(change.doc.data().level1_meta_data === null){
            console.log(change.doc.data());
            setCountry(change.doc.data().country);

          }else{
            setState(change.doc.data().level1_meta_data.name);
            setCountry(change.doc.data().country);
            console.log(change.doc.data().level1_meta_data);
  
          }
        }
        });
      }
    );
  }  
  
 

  useEffect(() => {
    const ces = new CesiumController();
    setView(ces);
    setTempView(ces);
     const getData = async () => {
       const data = await NembusProjectAdapter.getGeoJsonCoordinatesInterestedLocationAdapter(projectId);
       setFinalLoad(true);
       setLoad(true);
       setLevel1(data.level1);
       setLevel0(data.level0);
       setLoad(false);
     }
     getData();
     b2_arr.forEach(l => {
      const julian = l[5];
      var jd = parseFloat(julian) + 2400000.5;
      var mmillis = (jd - 2440587.5) * 86400000;
      var dateLocal = new Date(mmillis);
      // console.log(dateLocal);
     })

     const totalSeconds = 60 * 60 * 24;
     const timeStepInSeconds = 10;
     const start = Cesium.JulianDate.fromDate(new Date("Tue Jan 03 2023 00:00:00 GMT+0530 (India Standard Time"));
     const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
     ces.viewer.clock.startTime = start.clone();
     ces.viewer.clock.stopTime = stop.clone();
     ces.viewer.clock.currentTime = start.clone();
     ces.viewer.timeline.zoomTo(start, stop);
 
 
     const positionsOverTime = new Cesium.SampledPositionProperty();
     positionsOverTime.backwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
     positionsOverTime.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
     positionsOverTime.setInterpolationOptions({
       interpolationDegree: 5,
       interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
     });
     b2_arr.forEach(l => {
      const julian = l[5];
      var jd = parseFloat(julian) + 2400000.5;
      var mmillis = (jd - 2440587.5) * 86400000;
      var dateLocal = new Date(mmillis);
      const jl = Cesium.JulianDate.fromDate(dateLocal);
      const latlng = {lat: parseFloat(l[1]), lng: parseFloat(l[2]), height: parseFloat(l[4])};
      var positoin = Cesium.Cartesian3.fromDegrees(latlng.lng, latlng.lat, latlng.height);
      positionsOverTime.addSample(jl, positoin);
     })
     const redEllipse = ces.viewer.entities.add({
      position: positionsOverTime,
      name: "Red ellipse on surface",
      ellipse: {
        semiMinorAxis: 250000.0,
        semiMajorAxis: 400000.0,
        material: Cesium.Color.RED.withAlpha(0.5),
      },    
    });
  },[]);



  useEffect(() => {
    getInterestedLocationSnapshots();
    
  },[])



  
  
  useEffect(()=>{
    function lengthArr (list, list1){
      console.log(list.length);
      setTimeout(() => {
        list1.forEach(l => {
          const dt = l.data;
          const dtJson = JSON.parse(dt);
          dataJson1.features.push(dtJson);
        });
        const dt1 = list[0].data;
        const dtJson = JSON.parse(dt1);
        console.log(dtJson);
        dataJson.features.push(dtJson);
        const dt2 = list[1].data;
        const dtJson1 = JSON.parse(dt2);
        console.log(dtJson1);
        dataJson1.features.push(dtJson1);
        // list.forEach(l => {
        //   const dt = l.data;
        //   // console.log(dt);
        //   const dtJson = JSON.parse(dt);
        //   dataJson.features.push(dtJson);
        // });
        const promise1 = Cesium.GeoJsonDataSource.load(dataJson1);
        promise1.then(function(dataSource){
          view.viewer.dataSources.add(dataSource);
          const entities = dataSource.entities.values;
          const colorHash = {};
          for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            const name = entity.name;
            let r = Math.random();
            let g = Math.random();
            let b = Math.random();
            let color = new Cesium.Color(r, g, b, 1);
            entity.polygon.material = color;  
          }
        });

        const promise = Cesium.GeoJsonDataSource.load(dataJson);
        promise.then(function(dataSource){
          view.viewer.dataSources.add(dataSource);
          const entities = dataSource.entities.values;
          const colorHash = {};
          for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            const name = entity.name;
            let r = Math.random();
            let g = Math.random();
            let b = Math.random();
            let color = new Cesium.Color(r, g, b, 1);
            entity.polygon.material = color;   
          }
        });  
        

        
      }, 1000);
    }
    
    if(load === false && view !== null){
      
      lengthArr(level0, level1);
      setFinalLoad(false);
  
        
    
    }

  },[load]);
  useEffect(() => {
    if(view){
    view.viewer.dataSources._dataSources.forEach(data => {
      if(data.entities.values.length !== 0){
       data.entities.values.forEach(ent => {
        
        if(ent.properties.COUNTRY._value === country && !ent.properties.NAME_1){
          ent.show = false;
          console.log(ent.properties.COUNTRY._value);
          setCountry(null);
        }else{
        if(ent.properties.NAME_1){
          if(ent.properties.COUNTRY._value === country && state ===ent.properties.NAME_1._value){
            ent.show = false;
            console.log(ent.properties);
            setState(null);
            setCountry(null);
          }
        }
      }
      
        
        });
      }
    })
  }
  },[country, state])

  return (
    // <div style={{ height: windowSize.innerHeight*0.90}}>
    <div>
      {finalLoad && <RctSectionLoader />} 
      <div id="cesiumContainer" className="fullSize" style={{ marginTop: "48px"}}></div>
    </div>   
  );
};

const stateProp = (state) => ({

  });
  
  const dispatchProps = {

  };


export default connect(stateProp, dispatchProps)(CesiumThreeDimesionViz);
