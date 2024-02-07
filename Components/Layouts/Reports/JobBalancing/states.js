import moment from "moment";

function recordsReducer(state, action){
    switch (action.type) {
    case 'toggle': {
        return { ...state, [action.fieldName]: action.payload } 
    }
    case 'set': {
        return { ...state, ...action.payload }
    }
    default: return state 
    }
};

const initialState = {
  load:false,
  visible:false,
  to:moment().format("YYYY-MM-DD"),
  from:moment("2023-07-01").format("YYYY-MM-DD"),
  client:'',
  records:[],
  subType:'',
  selectedCompany:'1',
  operation:'',
  shipStatus:'',
  overseasagent:'',
  jobType:'Sea Export',
  salesrepresentative:'',
};

export { recordsReducer, initialState }