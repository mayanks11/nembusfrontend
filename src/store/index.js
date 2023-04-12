import { createStore, applyMiddleware, compose } from "redux";
import Thunk from "redux-thunk";
import reducers from "../reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import { Actions, jsonformsReducer, createAjv } from "@jsonforms/core";

import matrixControlTester from "../components/CustomJsonRenderer/Matrix/MatrixControlTester";
import MatrixControl from "../components/CustomJsonRenderer/Matrix/MatrixControl";
import fileUploadControlTester from "../components/CustomJsonRenderer/Fileuploader/FileUploadTester";
import FileUploadControl from "../components/CustomJsonRenderer/Fileuploader/FileUploadControl";
import multiselectTester from "../components/CustomJsonRenderer/Multiselect/MultiselectTester";
import MultiselectControl from "../components/CustomJsonRenderer/Multiselect/MultiselectControl";
import TLESelectTester from "../components/CustomJsonRenderer/TLEDatatable/DatatableTester";
import TLESelectControl from "../components/CustomJsonRenderer/TLEDatatable/DatatableControl";
import SolarPanelTester from "../components/CustomJsonRenderer/SolarPanelNormal/SolarPanelTester";
import SolarPanelControl from "../components/CustomJsonRenderer/SolarPanelNormal/SolarPanelControl";

import VisibilityReportTester from "../components/CustomJsonRenderer/VisibilityReport/VisibilityReportTester";
import VisibilityReportControl from "../components/CustomJsonRenderer/VisibilityReport/VisibilityReportControl";

import matrixDisableControlTester from "../components/CustomJsonRenderer//MatrixDisable/MatrixDisableControlTester";
import MatrixDisableControl from "../components/CustomJsonRenderer/MatrixDisable/MatrixDisableControl";

import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";

import { getFirebase } from "react-redux-firebase";

export function configureStore(initialState) {
  const store = createStore(
    reducers,
    {
      jsonforms: {
        cells: materialCells,
        renderers: materialRenderers,
      },
    },
    compose(composeWithDevTools(applyMiddleware(Thunk.withExtraArgument({ getFirebase }))))
  );
  store.dispatch(Actions.registerRenderer(matrixControlTester, MatrixControl));
  store.dispatch(Actions.registerRenderer(TLESelectTester, TLESelectControl));
  store.dispatch(Actions.registerRenderer(SolarPanelTester, SolarPanelControl));
  store.dispatch(Actions.registerRenderer(VisibilityReportTester, VisibilityReportControl));
  store.dispatch(
    Actions.registerRenderer(fileUploadControlTester, FileUploadControl)
  );
  store.dispatch(
    Actions.registerRenderer(multiselectTester, MultiselectControl)
  );
  store.dispatch(Actions.registerRenderer(matrixDisableControlTester, MatrixDisableControl));

  //Custom Validator for JSON form
  const ajv = createAjv();

  ajv.addKeyword("isNotEmpty", {
    type: "string",
    validate: function validate(schema, data) {
      if (typeof data === "string" && data.trim() !== "") {
        return true;
      }
      validate.errors = [
        {
          keyword: "isNotEmpty",
          message: "Cannot be empty",
          params: { keyword: "isNotEmpty" },
        },
      ];
      return false;
    },
    errors: true,
  });
  const data = {};
  const schema = {};
  const uischema = {};

  store.dispatch(Actions.init(data, schema, uischema, ajv));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("../reducers/index", () => {
      const nextRootReducer = require("../reducers/index");
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
