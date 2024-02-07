import moment from "moment";
import { delay } from "/functions/delay";
import axios from "axios";

function recordsReducer(state, action){
    switch (action.type) {
      case 'toggle': {
        return { ...state, [action.fieldName]: action.payload } 
      }

      default: return state 
    }
};

const initialState = {
  records: [{
    SE_Job:{jobNo:""}
  }],
  load:false,
  visible:false
};

export { 
  initialState,
  recordsReducer
};