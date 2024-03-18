import axios from "axios";
import Cookies from "js-cookie";

function recordsReducer(state, action){
  switch (action.type) {
    case 'set': {
      return {
        ...state, ...action.payload
      }
    }
    default: return state 
  }
};

const initialState = {
  isOpen:false,
  load:false,
  taskList:[],
  employeeList:[],
  deleteList:[],
  edit:false,
  task:{
    title:'',
    category:'Internal',
    status:'Backlog',
    priority:'Medium',
    requestedBy:'',
    EmployeeId:'',
    due:null,
    subTasks:[]
  }
};

const proiroties = [
  { value: 'None', label: 'None' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Highest', label: 'Highest' },
];

const categories = [
  { value: 'Sea', label: 'Sea' },
  { value: 'Air', label: 'Air' },
  { value: 'Internal', label: 'Internal' },
  { value: 'Accounts', label: 'Accounts' },
];

const statuses = [
  { value: 'Backlog', label: 'Backlog' },
  { value: 'In-progress', label: 'In-progress' },
  { value: 'In-Review', label: 'In-Review' },
  { value: 'Done', label: 'Done' },
];

const fetchEmployees = async() => {
  let data = [];
  await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_EMPLOYEES).then((x)=>{
    if(x.data.status=='success'){
      data = x.data.result;
    }
  })
  return data
};

const fetchTasks = async() => {
  let data = [];
  await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_TASKS).then((x)=>{
    if(x.data.status=='success'){
      data = x.data.result;
    }
  })
  return data
}

const createTask = async(data) => {
  let user = await Cookies.get('username');
  data = {...data, requestedBy:user}
  await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_TASK, data)
}

const updateTask = async(state) => {
  await axios.post(process.env.NEXT_PUBLIC_CLIMAX_EDIT_TASK, {
    task:state.task,
    deleteList:state.deleteList
  })
  .then((x)=>{
    // console.log(x.data)
  })
}

export {
  recordsReducer, initialState, proiroties,
  categories, fetchEmployees, statuses,
  createTask, fetchTasks, updateTask
};