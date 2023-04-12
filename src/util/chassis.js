const chassis = {
  "type": "Chassis",
  "subtype": "Satellite Body",
  "description": "This block gives you the Mass , Moment of intertal and CAD model of the satellite",
  "name": "Chassis of Satellite Body",
  "inputArray": [
    {
      "name": "Propogator Configuration",
      "isMultiplicity": false,
      "portType": {
        "type": "configuration",
        "color": "#FFFF00",
        "isEditable": false
      },
      "allowConnection": true,
      "alignment": "left"
    },
    {
      "name": "Actuators",
      "isMultiplicity": true,
      "portType": {
        "type": "matrix",
        "size": {
          "col": 1,
          "row": 3
        },
        "color": "#FF0000",
        "isEditable": false
      },
      "allowConnection": true,
      "alignment": "left"
    }
  ],
  "outputArray": [
    {
      "name": "Position",
      "isMultiplicity": false,
      "portType": {
        "type": "matrix",
        "size": {
          "col": 1,
          "row": 3
        },
        "color": "#FF0000",
        "isEditable": false
      },
      "allowConnection": true,
      "alignment": "right"
    },
    {
      "name": "Velocity",
      "isMultiplicity": false,
      "portType": {
        "type": "matrix",
        "size": {
          "col": 1,
          "row": 3
        },
        "color": "#FF0000",
        "isEditable": false
      },
      "allowConnection": true,
      "alignment": "right"
    },
    {
      "name": "Direaction Cosine Matrix",
      "isMultiplicity": true,
      "portType": {
        "type": "matrix",
        "size": {
          "col": 3,
          "row": 3
        },
        "color": "#FF0000",
        "isEditable": false

      },
      "allowConnection": true,
      "alignment": "right"
    }
  ],
  "plugin": {
    "type": "object",
    "properties": {
      "CADModel": {
        "type": "array",
        "items": [
          {
            "type": "fileuploader",
            "datapointer": "#/data/chasis_satellite/CAD_fileuploader",
            "rule": {

              "condition": {
                "scope": "#/data/chasis_satellite/isuploadown",
                "expectedValue": true
              }
            }
          },
          {
            "type": "select",
            "basepath": "/CAD",
            "datapointer": "#/data/chasis_satellite/cadfiles",
            "rule": {
              "effect": "USE",
              "condition": {
                "scope": "#/data/chasis_satellite/isuploadown",
                "expectedValue": false
              }
            }
          }
        ]
      },
      "codelist": {
        "type": "array",
        "entry": "main.cpp",
        "items": [
          "URLs/main.cpp",
          "URl/calculateContro.cpp"
        ]

      }
    }
  },
  "schema": {
    "type": "object",
    "properties": {
      "chasis_satellite": {
        "title": "Satellite body",
        "type": "object",
        "properties": {
          "satellite_name": {
            "type": "string",
            "isNotEmpty": true
          },
          "isuploadown": {
            "type": "boolean"
          },
          "cadfiles": {
            "type": "string",
            "label": "Satellite Chasis",
            "description": "Please Select the file",

            "enum": ["Cubesat 1U.glb", "Cubesat 2U.glb", "Cubesat 3U.glb", "Cubesat 6U.glb", "Cubesat 12U.glb"]
          },
          "CAD_fileuploader": {
            "type": "object",
            "description": "Please CAD file(.dae) ",
            "ismultiple": false,
            "accept": ".pdf"
          },
          "satellite_mass": {
            "type": "object",
            "properties": {
              "unit": {
                "type": "string",
                "description": "Select the Unit",
                "enum": ["Kilogram", "gram"]
              },
              "satellitemass_matrix": {
                "type": "object",
                "row": 1,
                "col": 1,
                "description": "Please Mass of Satellite"
              }
            }
          },
          "satellite_moi": {
            "type": "object",
            "properties": {
              "unit": {
                "type": "string",
                "description": "Select the Unit",
                "enum": ["Kilogram meter^2", "gram meter^2"]
              },
              "satellitemoi_matrix": {
                "type": "object",
                "row": 3,
                "col": 3,
                "description": "Please Enter MOI of satellite"
              }
            }
          }
        },
        "if": {
          "properties": { "isuploadown": { "const": true } }
        },
        "then": {
          "properties": { "CAD_fileuploader": { "minProperties": 1 } }
        },
        "else": { "required": ["cadfiles"] },
        "required": ["satellite_name"]
      }
    }
  },
  "uischema": {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "Group",
        "label": "Satellite body",
        "elements": [
          {
            "type": "VerticalLayout",
            "elements": [
              {
                "type": "Control",
                "label": "Satellite Name",
                "options": {
                  "trim": true,
                  "restrict": true
                },
                "scope": "#/properties/chasis_satellite/properties/satellite_name"
              },
              {
                "type": "Control",
                "label": "Do you want to upload your own CAD",
                "scope": "#/properties/chasis_satellite/properties/isuploadown"
              }
            ]
          },
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "label": "Select the Satellite Chasis CAD",
                "scope": "#/properties/chasis_satellite/properties/cadfiles",
                "rule": {
                  "effect": "DISABLE",
                  "condition": {
                    "scope": "#/properties/chasis_satellite/properties/isuploadown",
                    "schema": {
                      "const": true
                    }
                  }
                }
              },
              {
                "type": "Control",
                "label": "Upload file",
                "scope": "#/properties/chasis_satellite/properties/CAD_fileuploader",
                "rule": {
                  "effect": "DISABLE",
                  "condition": {
                    "scope": "#/properties/chasis_satellite/properties/isuploadown",
                    "schema": {
                      "const": false
                    }
                  }
                }
              }
            ]
          },
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "label": "Satellite Mass",
                "scope": "#/properties/chasis_satellite/properties/satellite_mass/properties/satellitemass_matrix"
              },
              {
                "type": "Control",
                "label": "Units",
                "scope": "#/properties/chasis_satellite/properties/satellite_mass/properties/unit"
              }
            ]
          },
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "label": "Satellite Moment of Inertia",
                "scope": "#/properties/chasis_satellite/properties/satellite_moi/properties/satellitemoi_matrix"
              },
              {
                "type": "Control",
                "label": "Units",
                "scope": "#/properties/chasis_satellite/properties/satellite_moi/properties/unit"
              }
            ]
          }
        ]
      }
    ]
  },
  "uischemaread": {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "Group",
        "label": "Satellite body",
        "elements": [
          {
            "type": "VerticalLayout",
            "elements": [
              {
                "type": "Control",
                "label": "Satellite Name",
                "options": {
                  "trim": true,
                  "restrict": true
                },
                "scope": "#/properties/chasis_satellite/properties/satellite_name",
                "rule": {
                  "effect": "DISABLE",
                  "condition": true
                }
              },
              {
                "type": "Control",
                "label": "Do you want to upload your own CAD",
                "scope": "#/properties/chasis_satellite/properties/isuploadown",
                "rule": {
                  "effect": "DISABLE",
                  "condition": true
                }
              }
            ]
          },
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "label": "Satellite Mass",
                "scope": "#/properties/chasis_satellite/properties/satellite_mass/properties/satellitemass_matrix",
                "rule": {
                  "effect": "DISABLE",
                  "condition": true
                }
              },
              {
                "type": "Control",
                "label": "Units",
                "scope": "#/properties/chasis_satellite/properties/satellite_mass/properties/unit",
                "rule": {
                  "effect": "DISABLE",
                  "condition": true
                }
              }
            ]
          },
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "label": "Satellite Moment of Inertia",
                "scope": "#/properties/chasis_satellite/properties/satellite_moi/properties/satellitemoi_matrix",
                "rule": {
                  "effect": "DISABLE",
                  "condition": true
                }
              },
              {
                "type": "Control",
                "label": "Units",
                "scope": "#/properties/chasis_satellite/properties/satellite_moi/properties/unit",
                "rule": {
                  "effect": "DISABLE",
                  "condition": true
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "simulationDetail": {
    "updatingFrequency": {
      "value": 1,
      "unit": "sec"
    }
  },
  "data": {
    "chasis_satellite": {
      "CAD_fileuploader": {},
      "isuploadown": false,
      "satellite_moi": {
        "satellitemoi_matrix": {
          "row1": [
            1,
            0,
            0
          ],
          "row2": [
            0,
            1,
            0
          ],
          "row3": [
            0,
            0,
            1
          ]
        },
        "unit": "Kilogram meter^2"
      },
      "satellite_mass": {
        "satellitemass_matrix": {
          "row1": [
            1
          ]
        },
        "unit": "Kilogram"
      },
      "satellite_name": "Satellite",
      "cadfiles": "Cubesat 1U.glb"
    }
  }
}
export default chassis