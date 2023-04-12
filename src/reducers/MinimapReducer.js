import { MINIMAP_INITIALZE_MODEL, MINIMAP_DELETE_NODE, MINIMAP_ADD_NODE, MINIMAP_UPDATE_NODE, MINIMAP_ZOOMIN, MINIMAP_ZOOMOUT, MINIMAP_SETOFFSET, MINIMAP_CANVAS_WIDTH_HEIGHT, MINIMAP_MARK_WIDTH, MINIMAP_MARK_LEFT, MINIMAP_EXTRA_RIGHT_WIDTH, MINIMAP_EXTRA_LEFT_WIDTH, MINIMAP_EXTRA_TOP_HEIGHT, MINIMAP_EXTRA_BOTTOM_HEIGHT, MINIMAP_MARK_HEIGHT, MINIMAP_IS_OPEN_TAB, MINIMAP_DRAG_START, MINIMAP_DRAG_END } from '../actions/types';
import produce from "immer";

/**
 * initial minimap settings
 * Minimap Component
 * Nirmalya Saha
 */
const INIT_STATE = {
	initializeModel: [],
  zoomLevels: 100,
	offSetX: 0,
	offSetY: 0,
	canvasHeight: 1,
	canvasWidth: 1,
	markWidth: 0,
	markLeft: 0,
	markHeight: 0,
	isOpenTab: true,
	isDraggingViewBox: false,
  extraWidthNegative: {
		id: "",
		pos: 0
	},
  extraWidthPositive: {
		id: "",
		pos: 0
	},
  extraHeightNegative: {
		id: "",
		pos: 0
	},
  extraHeightPositive: {
		id: "",
		pos: 0
	},
	// extraWidthNegative: 0,
  // extraWidthPositive: 0,
  // extraHeightNegative: 0,
  // extraHeightPositive: 0,
	loading: true
};

export default (state = INIT_STATE, action) => {
	return produce(state, (draft) => {
	  switch (action.type) {

		// initializeModel
		case MINIMAP_INITIALZE_MODEL:
			console.log("Nirmalya Init", action.payload);
			var checkSave = false;
			action.payload.forEach((ele)=>{
				if(ele.width > 0){
					checkSave = true;
					console.log("NNNK", checkSave, ele.width, ele.height, ele)
				}
			})
			if(checkSave || (action.payload.length == 0)){
				draft.initializeModel = [];
				draft.extraWidthNegative = {
					id: "",
					pos: 0
				};
				draft.extraWidthPositive = {
					id: "",
					pos: 0
				};
				draft.extraHeightNegative = {
					id: "",
					pos: 0
				};
				draft.extraHeightPositive = {
					id: "",
					pos: 0
				};
				action.payload.forEach((ele)=>{
					// const model_info = {
					// 	'position':ele.position,
					// 	'height' : ele.height,
					// 	'width':ele.width,
					// 	'id': ele.options.id
					// }
					// draft.initializeModel.push(model_info);
					// ele.width = ele.width === 0 ? 100 : ele.width;
					// ele.height = ele.height === 0 ? 100 : ele.height;
					ele['id'] = ele.options.id;
					draft.initializeModel.push(ele);
				})
			}

		  break;
			case MINIMAP_DELETE_NODE:
			const index = draft.initializeModel.findIndex(todo => todo.id === action.payload.options.id)
			if (index !== -1) draft.initializeModel.splice(index, 1)
			break;
			case MINIMAP_ADD_NODE:
				const newNode = action.payload;
				newNode['id'] = newNode.options.id
				draft.initializeModel.push(newNode)
				break;
			case MINIMAP_UPDATE_NODE:
				// const idx = draft.initializeModel.findIndex(todo=> todo.id === action.payload.id);
				// if(index !== -1){
				// 	draft.initializeModel[idx].position.x = action.payload.x;
				// 	draft.initializeModel[idx].position.y = action.payload.y;
				// }
				draft.initializeModel[
					draft.initializeModel.findIndex(i => i.id === action.payload.id)
				].position.x = action.payload.x;
				draft.initializeModel[
					draft.initializeModel.findIndex(i => i.id === action.payload.id)
				].position.y = action.payload.y;
				draft.loading = !draft.loading;
				


				if(action.payload.id === draft.extraWidthNegative.id){
					var value1 = action.payload.x + draft.offSetX;
					if(value1 < 0){
						value1 = value1 * -1;
						if(value1 < draft.extraWidthNegative.pos){
							draft.extraWidthNegative.pos = value1;
						}
					}
				}
				else if(action.payload.id === draft.extraWidthPositive.id){
					var value2 = action.payload.x + draft.offSetX;
					if(value2 > draft.canvasWidth){
						value2 = value2 - draft.canvasWidth;
						if(value2 < draft.extraWidthPositive.pos){
							draft.extraWidthPositive.pos = value2;
						}
					}
				}
				else if(action.payload.id === draft.extraHeightPositive.id){
					var value3 = action.payload.y + draft.offSetY;
					if(value3 > draft.canvasHeight){
						value3 = value3 - draft.canvasHeight;
						if(value3 < draft.extraHeightPositive.pos){
							draft.extraHeightPositive.pos = value3;
						}
					}
				}
				else if(action.payload.id === draft.extraHeightNegative.id){
					var value4 = action.payload.y + draft.offSetY;
					if(value4 < 0){
						value4 = value4 * -1;
						if(value4 < draft.extraHeightNegative.pos){
							draft.extraHeightNegative.pos = value4;
						}
					}
				}



				break;
      case MINIMAP_ZOOMIN:
        draft.zoomLevels = action.payload;
        break;
      case MINIMAP_ZOOMOUT:
        draft.zoomLevels = action.payload;
        break;
	  case MINIMAP_SETOFFSET:
		// if(!draft.isDraggingViewBox){
			draft.offSetX = action.payload.x;
			draft.offSetY = action.payload.y;
		// }
		break;
	  case MINIMAP_CANVAS_WIDTH_HEIGHT:
		draft.canvasWidth = action.payload.width;
		draft.canvasHeight = action.payload.height;
		break;
		case MINIMAP_MARK_WIDTH:
		draft.markWidth = action.payload;
		break;
		case MINIMAP_MARK_LEFT:
		draft.markLeft = action.payload;
		break;
		case MINIMAP_MARK_HEIGHT:
			draft.markHeight = action.payload;
			break;
		case MINIMAP_IS_OPEN_TAB: 
			draft.isOpenTab = action.payload;
			break;
		
		case MINIMAP_EXTRA_LEFT_WIDTH:
			draft.extraWidthNegative.id = action.payload.id;
			draft.extraWidthNegative.pos = action.payload.pos;
			
		break;
		case MINIMAP_EXTRA_RIGHT_WIDTH:
			draft.extraWidthPositive.id = action.payload.id;
			draft.extraWidthPositive.pos = action.payload.pos;
			// if(action.payload.check === 1 && action.payload.pos < draft.extraWidthPositive.pos){
			// 	draft.extraWidthPositive.pos = action.payload.pos;
			// }
			// else if(action.payload.pos > draft.extraWidthPositive.pos){
			// draft.extraWidthPositive.id = action.payload.id;
			// draft.extraWidthPositive.pos = action.payload.pos;
			// }
		break;
		case MINIMAP_EXTRA_TOP_HEIGHT:
			draft.extraHeightPositive.id = action.payload.id;
			draft.extraHeightPositive.pos = action.payload.pos;
			// if(action.payload.check === 1 && action.payload.pos < draft.extraHeightPositive.pos){
			// 	draft.extraHeightPositive.pos = action.payload.pos;
			// }
			// else if(action.payload.pos > draft.extraHeightPositive.pos){
			// draft.extraHeightPositive.id = action.payload.id;
			// draft.extraHeightPositive.pos = action.payload.pos;
			// }
		break;
		case MINIMAP_EXTRA_BOTTOM_HEIGHT:

			draft.extraHeightNegative.id = action.payload.id;
			draft.extraHeightNegative.pos = action.payload.pos;

			
		break;
		case MINIMAP_DRAG_START:
			draft.isDraggingViewBox = action.payload;
			break;
		case MINIMAP_DRAG_END:
			draft.isDraggingViewBox = action.payload;
			break;
	  }
	});
};
