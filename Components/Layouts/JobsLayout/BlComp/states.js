import { delay } from "/functions/delay";
import moment from "moment";
import axios from "axios";

function recordsReducer(state, action){
    switch (action.type) {
      case 'toggle': {
        return { ...state, [action.fieldName]: action.payload } 
      }
      case 'set': {
        return { ...state, ...action.payload } 
      }
      case 'create': {
        return {
            ...state,
            edit: false,
            visible: true
        }
      }
      case 'history': {
        return {
            ...state,
            edit: false,
            viewHistory:true,
            visible: true,
        }
      }
      case 'edit': {
        return {
            ...state,
            selectedRecord:{},
            edit: true,
            visible: true,
            selectedRecord:action.payload
        }
      }
      case 'setContent': {
        return {
            ...state,
            shipperContent       :action.payload.shipperContent       ,
            consigneeContent     :action.payload.consigneeContent     ,
            notifyOneContent     :action.payload.notifyOneContent     ,
            notifyTwoContent     :action.payload.notifyTwoContent     ,
            deliveryContent      :action.payload.deliveryContent      ,
            marksContent         :action.payload.marksContent         ,
            marksContentTwo      :action.payload.marksContentTwo      ,
            noOfPckgs            :action.payload.noOfPckgs            ,
            descOfGoodsContent   :action.payload.descOfGoodsContent   ,
            descOfGoodsContentTwo:action.payload.descOfGoodsContentTwo,
            grossWeightContent   :action.payload.grossWeightContent   ,
            measurementContent   :action.payload.measurementContent
        }
      }
      case 'modalOff': {
        let returnVal = {
          ...state,
          visible: false,
          selectedRecord:state.edit?{}:state.selectedRecord,
          edit: false
        };
        return returnVal
      }
      default: return state 
    }
};

const baseValues = {

  //Basic Info
  id:'',
  operation:'',
  hbl:'',
  hblDate:'',
  hblIssue:'',
  mbl:'',
  mblDate:'',
  status:'',
  blReleaseStatus:'',
  blHandoverType:'',
  releaseInstruction:'',
  remarks:'',

  //sailingDate:'',
  onBoardDate:'',
  issuePlace:'',
  issueDate:'',
  formE:'',
  formEDate:'',
  SEJobId:'',
  noBls:'',
  notifyPartyOneId:null,
  notifyPartyTwoId:null,

  //Values Drawn From Job
  jobNo:'',
  shipper:'',
  consignee:'',
  overseas_agent:'',
  commodity:'',
  shipDate:'',
  vessel:'',
  pol:'',
  pofd:'',
  pot:'',
  fd:'',

  //Second Ports Option
  polTwo:'',
  podTwo:'',
  poDeliveryTwo:'',
  AgentStamp:'',
  freightType:"",
  unit:'',
  hs:'',
  agentM3:'',
  coloadM3:'',
  equip:[],
  gross:0,
  net:0,
  tare:0,  
  wtUnit:0,
  pkgs:0,  
  unit:0,  
  cbm:0,

  // For AWB
  date1:          '',
  date2:          '',
  declareCarriage:'',
  declareCustoms: '',
  insurance:      '',
  handlingInfo:   '',
  toOne:          '',
  toTwo:          '',
  toThree:        '',
  byOne:          '',
  byTwo:          '',
  byFirstCarrier: '',
  currency:       '',
  charges:        '',
  wtValPPC:       '',
  wtValCOLL:      '',
  othersPPC:      '',
  othersCOLL:     '',

  ppWeightCharges:        0,
  ccWeightCharges:        0,
  ppvaluationCharges:     0,
  ccvaluationCharges:     0,
  ppTax:                  0,
  ccTax:                  0,
  ppOtherDueChargeAgent:  0,
  ccOtherDueChargeAgent:  0,
  ppOtherDueChargeCarrier:0,
  ccOtherDueChargeCarrier:0,
  ppTotal:                0,
  ccTotal:                0,
  applyToCWT:           "0",
};

const initialState = {
  records: [{
    SE_Job:{jobNo:""}
  }],
  load:false,
  visible:false,
  partyVisible:false,
  jobsData:[],
  partiesData:[],
  Container_Infos:[],
  Item_Details:[],
  Dimensions:[{length:'0', width:'0', height:'0', qty:'0', vol:'0', weight:'0'}],
  Stamps_Info:[],
  deletingContinersList:[],
  deletingItemList:[],
  deletingDimensionsList:[],

  //setNotifyParties:false,
  updateContent:false,
  shipperContent:       "",
  consigneeContent:     "",
  notifyOneContent:     "",
  notifyTwoContent:     "",
  deliveryContent:      "",
  marksContent:         "",
  marksContentTwo:      "",
  noOfPckgs:            "",
  descOfGoodsContent:   "",
  descOfGoodsContentTwo:"",
  grossWeightContent:   "",
  measurementContent:   "",
  saveContainers:false,
  jobLoad:false,
  edit:false,
  values:baseValues,
  jobId:'',
  selectedRecord:{}
};

const fetchJobsData = async(set, dispatch, id) => {
  const jobsData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_SEA_JOBS_WITHOUT_BL,{
    headers:{id:id}
  })
  .then((x)=>{
    //console.log(x.data)
    let data = [];
    if(x.data.status=="success"){
      x.data.result.forEach(x => {
        data.push({...x, check:false})
      });
    }
    return data
  });
  return jobsData
}

const convetAsHtml = (values) => {
  const getVar = (val) => {
    let result = ""
    if(val=="telephone1"){ result='TEL'; }
    else if(val=="telephone1"){ result='TEL'; }
    else if(val=="telephone2"){ result='TEL'; }
    return result;
  }
  let result = "";
  let gottenValues = {...values};
  delete gottenValues.id;
  Object.keys(gottenValues).forEach((x)=>{
    result = result + `<p>${getVar(x)} ${gottenValues[x]}</P>`;
  })
  return result
}

const setJob = (set, x, state, reset, allValues, dispatch, id) => {
    allValues.SEJobId =      x.id;                 
    allValues.jobNo =        x.jobNo;                        
    allValues.consignee =    x.consignee?.name;     
    allValues.shipper =      x.shipper?.name;            
    allValues.overseas_agent=x.overseas_agent?.name;
    allValues.air_line      =x.air_line?.name;
    allValues.pol =          x.pol;           
    allValues.polTwo =       x.pol;         
    allValues.pofd =         x.pod;                
    allValues.podTwo =       x.pod;                
    allValues.fd =           x.fd;                 
    allValues.poDeliveryTwo =x.fd;                
    allValues.vessel =       x.vessel?.name;             
    allValues.shipDate =     x.shipDate;
    allValues.commodity =    x.commodity?.name; 
    allValues.equip =        x.SE_Equipments;      
    allValues.freightType =  x.freightType;      
    allValues.delivery   =   x.delivery;      
    allValues.operation =    x.operation;      
    allValues.flightNo =     x.flightNo;      
    allValues.shipping_line= x.shipping_line?.name;
    allValues.voyage =       x.Voyage?.voyage;
    dispatch({type:"set", payload:{
      deliveryContent:convetAsHtml(x.overseas_agent),
      consigneeContent:convetAsHtml(x.consignee),
      shipperContent:convetAsHtml(x.shipper),
      partyVisible:false,
      updateContent:!state.updateContent,
      Item_Details:id=="new"?[{
        id:null, noOfPcs:x.pcs, unit:'',grossWt:x.weight, kh_lb:'', r_class:'', itemNo:'',
        chargableWt:x.cwtClient, rate_charge:'0', total:'0', lineWeight: x.cwtLine
    }]:[]
    }})
    reset(allValues)
}

const calculateContainerInfos=(state, set, reset, allValues)=>{
  let tempContainers = state.Container_Infos, cbm = 0.0, tare = 0.0, net = 0.0, gross = 0.0, pkgs = 0, unit = "", wtUnit = "";
  tempContainers.forEach((x,i)=>{
    if(i==0){
      unit= x.unit; wtUnit= x.wtUnit;
    }
    cbm = cbm + parseFloat(x.cbm||0); tare = tare + parseFloat(x.tare||0); net = net + parseFloat(x.net||0); gross = gross + parseFloat(x.gross||0); pkgs = pkgs + parseInt(x.pkgs||0);
  })
  set('saveContainers',false);
  allValues = {...allValues, gross:""+gross, net:""+net, tare:""+tare, wtUnit, pkgs:""+pkgs, unit, cbm:""+cbm}
  reset(allValues);
}

const calculateItemInfos=(state, set, reset, allValues)=>{
  let gross = 0.0, pkgs = 0, wtUnit = 0, chargableWt=0;
  state.Item_Details.forEach((x,i)=>{
    if(i==0){
      wtUnit= x.kh_lb;
    }
    gross = gross + parseFloat(x.grossWt||0); 
    pkgs = pkgs + parseInt(x.noOfPcs||0);
    chargableWt = chargableWt + parseInt(x.chargableWt||0);
  })
  allValues = {...allValues, gross:""+gross, wtUnit, pkgs:""+pkgs, chargableWt }
  reset(allValues);
}

const setAndFetchBlData = async(reset, state, allValues, set, dispatch, blData) => {
  let result = {...blData};
  set("load", true);
  result.equip = [{}];
  const fetchedResult = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_FIND_JOB_BY_NO,{ no:result.SE_Job.jobNo }).then((x)=>x.data.result)
  allValues.SEJobId =         fetchedResult[0].id;
  allValues.jobNo =           fetchedResult[0].jobNo;
  allValues.consignee =       fetchedResult[0].consignee?.name;
  allValues.shipper =         fetchedResult[0].shipper?.name;
  allValues.overseas_agent =  fetchedResult[0].overseas_agent?.name;
  allValues.pol =             fetchedResult[0].pol;
  allValues.pofd =            fetchedResult[0].pod;
  allValues.fd =              fetchedResult[0].fd;
  allValues.vessel =          fetchedResult[0].vessel?.name;
  allValues.voyage =          fetchedResult[0].Voyage?.voyage;
  allValues.shipDate =        fetchedResult[0].shipDate;
  allValues.commodity =       fetchedResult[0].commodity?.name;
  allValues.equip =           fetchedResult[0].SE_Equipments;
  allValues.freightType =     fetchedResult[0].freightType;
  allValues.freightPaybleAt = fetchedResult[0].freightPaybleAt;
  allValues.delivery =        fetchedResult[0].delivery;
  allValues.operation =       fetchedResult[0].operation;      
  allValues.flightNo =        fetchedResult[0].flightNo; 
  allValues.shipping_line =   fetchedResult[0].shipping_line?.name;
  allValues.air_line      =   fetchedResult[0].air_line?.name;

  let cbm = 0.0, tare = 0.0, net = 0.0, gross = 0.0, pkgs = 0, unit = "", wtUnit = "";

  result.Container_Infos.forEach((x,i) => {
    if(i==0){ 
      unit= x.unit; wtUnit= x.wtUnit; 
    }
    cbm = cbm + parseFloat(x.cbm||0); tare = tare + parseFloat(x.tare||0); net = net + parseFloat(x.net||0); gross = gross + parseFloat(x.gross||0); pkgs = pkgs + parseInt(x.pkgs||0);
  })

  allValues = { ...allValues, gross:"" + gross, net:"" + net, tare:"" + tare, wtUnit, pkgs:"" + pkgs, unit, cbm:"" + cbm }
  let contInfos = result.Container_Infos;
  result = {
    ...allValues,
    ...result
  }
  result.mblDate = result.mblDate?moment(result.mblDate):"";
  result.hblDate = result.hblDate?moment(result.hblDate):"";
  result.onBoardDate = result.onBoardDate?moment(result.onBoardDate):"";
  result.issueDate = result.issueDate?moment(result.issueDate):"";
  result.shipDate = result.shipDate?moment(result.shipDate):"";
  result.formEDate = result.formEDate?moment(result.formEDate):"";

  result.date1 = result.date1?moment(result.date1):"";
  result.date2 = result.date2?moment(result.date2):"";
  dispatch({type:"set",payload:{
    Container_Infos:contInfos,
    Item_Details:result.Item_Details,
    Dimensions:result.Dimensions,
    load:false,
    updateContent:true,
    shipperContent       :result.shipperContent       ,
    consigneeContent     :result.consigneeContent     ,
    notifyOneContent     :result.notifyOneContent     ,
    notifyTwoContent     :result.notifyTwoContent     ,
    deliveryContent      :result.deliveryContent      ,
    marksContent         :result.marksContent         ,
    marksContentTwo      :result.marksContentTwo      ,
    noOfPckgs            :result.noOfPckgs            ,
    descOfGoodsContent   :result.descOfGoodsContent   ,
    descOfGoodsContentTwo:result.descOfGoodsContentTwo,
    grossWeightContent   :result.grossWeightContent   ,
    measurementContent   :result.measurementContent
  }})
  reset(result);
} 

export {
  calculateContainerInfos,
  calculateItemInfos,
  setAndFetchBlData,
  recordsReducer,
  fetchJobsData,
  convetAsHtml,
  initialState,
  baseValues,
  setJob,
}