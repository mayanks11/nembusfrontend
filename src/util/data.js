
const modelTypes = [
    "Chassis",
    "Sensor",
    "Control Algorithms",
    "Estimator Algorithms",
    "Actuator",
  ];
  
  const tableData = [1, 2, 3];
  
  
  let configOptions = ["string", "select", "multiselect", "checkbox", "matrix"];
  let matrixDefaultUnits = [
    {
      name: "length",
      defaultUnits: ["km", "meter"],
    },
    {
      name: "velocity",
      defaultUnits: ["km/sec", "meter/sec"],
    },
    {
      name: "acceleration",
      defaultUnits: ["km/sec^2", "meter/sec^2"],
    },
    {
      name: "angle",
      defaultUnits: ["radian", "degree"],
    },
    {
      name: "angular velocity",
      defaultUnits: ["radian/sec", "degree/sec"],
    },
    {
      name: "angular acceleration",
      defaultUnits: ["radian/sec^2", "degree/sec^2"],
    },
    {
      name: "unit less",
      defaultUnits: [],
    },
  ];
  export {modelTypes,tableData,configOptions,matrixDefaultUnits}