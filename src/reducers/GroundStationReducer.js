import { Map, fromJS, merge,isKeyed,List } from "immutable";
import {
  GROUNDSTATION_IS_ADD_DIALOG_OPEN,
  GROUNDSTATION_IS_VIEW_DIALOG_OPEN,
  GROUNDSTATION_ADD_STATION_LIST,
  GROUNDSTATION_UPDATE_STATION_LIST,
  GROUNDSTATION_UPDATE_STATION_ITEM,
  GROUNDSTATION_DELETE_STATION_LIST_ROW,
  GROUNDSTATION_CLEAR_STATION_LIST
} from "../actions/types";
import { getIn } from "immutable";

const initState = fromJS({
  isGroundstationAddFormOpen: false,
  isGroundstationViewFormOpen: false,
  GroundStationList: [{}],
});

export default (state = initState, action) => {
  switch (action.type) {
    case GROUNDSTATION_IS_ADD_DIALOG_OPEN:
      {
        
        return state.set("isGroundstationAddFormOpen", action.payload.isopen);
      }
      break;
    case GROUNDSTATION_IS_VIEW_DIALOG_OPEN:
      {
        
        return state.set("isGroundstationViewFormOpen", action.payload.isopen);
      }
      break;

    case GROUNDSTATION_ADD_STATION_LIST:
      {
        
        return state.set("GroundStationList", fromJS(action.payload.data));
      }
      break;

    case GROUNDSTATION_UPDATE_STATION_LIST:
      {
        
        const currentGroundList = state.get("GroundStationList");

        const index = currentGroundList.size;
        const newvalue = currentGroundList.toJS();

        // newvalue[index+1]={...action.payload.data};
        newvalue[index] = { ...action.payload.data };
        console.log(
          "GROUNDSTATION_ADD_STATION_LIST---------->",
          currentGroundList,
          index,
          newvalue
        );
        console.log(
          "GROUNDSTATION_ADD_STATION_LIST------444--->",
          currentGroundList.set(index, fromJS(action.payload.data))
        );
        return state.set("GroundStationList", fromJS(newvalue));
        // return
      }
      break;

    case GROUNDSTATION_UPDATE_STATION_ITEM:
      {
       
        const currentGroundList = state.get("GroundStationList");
      
        const newMap =currentGroundList.update(action.payload.key,value=>{

          
          return fromJS(action.payload.data);
        });
        

        return state.set("GroundStationList", newMap);


        

      }
      break;
      case GROUNDSTATION_DELETE_STATION_LIST_ROW:
        {
         
          const updatedGroundList = (state.get("GroundStationList")).delete(action.payload.key);
          

        return state.set("GroundStationList", updatedGroundList);
      }
      break;

    case GROUNDSTATION_CLEAR_STATION_LIST:
      {
        return state.set("GroundStationList", List());

      }
      break;



    default: {
      return state;
    }
  }
};
