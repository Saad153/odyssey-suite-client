import * as yup from "yup";
import axios from "axios";
import moment from "moment";

const SignupSchema = yup.object().shape({  });

function recordsReducer(state, action){
  switch (action.type) {
    case 'toggle': {
      return { ...state, [action.fieldName]: action.payload } 
    }
    case 'set': {
      return {
          ...state, ...action.payload
      }
    }
    case 'voyageSelection': {
      let temp = state.fields.vessel.filter((x)=> x.id == action.payload)[0].Voyages;
      let newTemp = [];
      temp.forEach((x)=> {
        newTemp.push({...x, check:false})
      });
      return {
        ...state,
        voyageVisible: true,
        voyageList:newTemp,
      }
    }
    default: return state 
  }
};

const baseValues = {
  //Basic Info
  id:'',
  customerRef:'',
  fileNo:'',
  jobNo:'',
  costCenter:'KHI',
  shipStatus:'Booked',
  jobDate:moment(),
  jobType:'QICT',
  jobKind:'Current',
  subType:'FCL',
  dg:'non-DG',
  pkgUnit:'',
  shipDate:moment(),
  freightType:'Prepaid',
  nomination:'Free Hand',
  incoTerms:'',
  ClientId:'',
  shipperId:'',
  consigneeId:'',
  commodityId:'',
  overseasAgentId:'',
  salesRepresentatorId:'',
  pol:'',
  pod:'',
  fd:'',
  customCheck:[],
  customAgentId:'',
  transportCheck:[],
  transporterId:'',
  forwarderId:'',
  localVendorId:'',
  localVendorId:'',
  airLineId:'',
  shippingLineId:'',
  vesselId:'',
  VoyageId:'',
  cutOffDate:'',
  cutOffTime:'',
  eta:'',
  etd:'',
  cbkg:'',

  aesDate:'',
  aesTime:'',
  siCutOffDate:'',
  siCutOffTime:'',
  eRcDate:'',
  eRcTime:'',
  eRlDate:'',
  eRlTime:'',
  doorMove:'',
  vgmCutOffDate:'',
  vgmCutOffTime:'',

  weight:'',
  weightUnit:'',
  bkg:'',
  container:'',
  shpVol:'',
  billVol:'',
  teu:'',
  pcs:'',
  vol:'',
  volWeight:'',

  cwtLine:'',
  cwtClient:'',

  delivery:'',
  terminal:'',
  freightPaybleAt:'',
  polDate:'',
  podDate:'',
  companyId:'',
  exRate:'1',
  approved:[],
  flightNo:'',
  arrivalDate:'',  
  arrivalTime:'',
  departureDate:'',
  departureTime:''
};

const initialState = {
  fetched: false,
  records: [],
  load:false,
  chargeLoad:false,
  visible:false,
  headVisible:false,
  voyageVisible:false,
  edit:false,
  popShow:false,
  viewHistory:false,
  invoiceData : [],
  InvoiceList : [],

  selection:{
    partyId:null,
    InvoiceId:null
  },

  paybleCharges:[],
  reciveableCharges:[],

  payble:{ pp:0.0, cc:0.0, total:0.0, tax:0.0 },
  reciveable:{ pp:0.0, cc:0.0, total:0.0, tax:0.0 },
  netAmount:0.0,

  vendorParties:[],
  clientParties:[],

  headIndex:"",

  values:baseValues,

  title:"",
  note:"",
  notes:[],
  deleteList:[],

  chargesTab:'1',
  selectedInvoice:'',
  loadingProgram:'',
  do:'',
  invoiceData:{},
  exRate:1.00,
  
  voyageList:[],
  consigneeList:[],
  shipperList:[],
  forwarderList:[],
  salesRepList:[],
  carrierList:[
    { id:'Emirates', name:'Emirates' },
    { id:'Elton', name:'Elton' },
  ],
  equipments:[
    {id:'', size:'', qty:'', dg:'', gross:'', teu:''}
  ],
  tabState:"1",
  vendorList:[],
  overseasAgentList:[],
  history:[],
  fields:{
    chargeList:[],
    party:{
      shipper:[],
      consignee:[],
      notify:[],
      client:[]
    },
    vendor:{
      transporter:[],
      forwarder:[],
      overseasAgent:[],
      chaChb:[],
      airLine:[],
      sLine:[],
      localVendor:[]
    },
    commodity:[],
    vessel:[],
    sr:[]
  },
  // Editing Records
  selectedRecord:{},
  oldRecord:{},
};

const memoize = (fn) => {
  let cache = {};
  return (...args) => {
    let n = args[0];
    if (n in cache) {
      //console.log('Fetching from cache', n);
      return cache[n];
    }
    else {
      //console.log('Calculating result', n);
      let result = fn(n);
      cache[n] = result;
      return result;
    }
  }
}

const getClients = memoize(async(id) => {
  const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_CLIENTS_FOR_CHARGES, {
    headers:{id:id}
  })
  .then((x)=>x.data.result);
  return result;
})

const getVendors = memoize(async(id) => {
  const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VENDORS_FOR_CHARGES, {
    headers:{id:id}
  })
  .then((x) => x.data.result)
  return result;
})

const saveHeads = async(charges, state, dispatch, reset) => {
  await axios.post(process.env.NEXT_PUBLIC_CLIMAX_SAVE_SE_HEADS_NEW, 
    { charges, deleteList:state.deleteList, id:state.selectedRecord.id, exRate:state.exRate }
  ).then((x)=>{
    reset({chargeList:[]})
  })
}

const getHeadsNew = async(id, dispatch) => {
  //dispatch({type:'toggle', fieldName:'chargeLoad', payload:true})
  let paybleCharges = [];
  let reciveableCharges = [];
  await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_SE_HEADS_NEW,{
      headers:{"id": `${id}`}
  }).then((x)=>{
      if(x.data.status=="success"){
        let tempCharge = [];
        x.data.result.forEach((x)=>{
            if(x.type!='Payble'){
              tempCharge.push({...x, sep:false});
            }
        });
        reciveableCharges = tempCharge;
        tempCharge = [];
        x.data.result.forEach((x)=>{
            if(x.type=='Payble'){
              tempCharge.push({...x, sep:false});
            }
        })
        paybleCharges = tempCharge;
      }
  });
  let tempChargeHeadsArray = calculateChargeHeadsTotal([...reciveableCharges, ...paybleCharges], "full");    
  console.log(tempChargeHeadsArray)
  dispatch({type:'set', 
  payload:{
    reciveableCharges,
    paybleCharges,
    chargeLoad:false,
    ...tempChargeHeadsArray
  }})
}

const calculateChargeHeadsTotal = (chageHeads, type) => {
  let rec_ccCharges = 0, pay_ccCharges = 0;
  let rec_ppCharges = 0, pay_ppCharges = 0;
  let rec_tax = 0      , pay_tax = 0;      
  if(chageHeads.length!=0){
    type!="Payble"?chageHeads.forEach((x)=>{
      if(x.pp_cc=="CC"){
        x.type=="Recievable"?rec_ccCharges = rec_ccCharges + parseFloat(x.local_amount):null;
      }else if(x.pp_cc=="PP"){
        x.type=="Recievable"?rec_ppCharges = rec_ppCharges + parseFloat(x.local_amount):null;
      }
      if(x.tax_apply){
        x.type=="Recievable"?rec_tax = rec_tax + parseFloat(x.tax_amount*x.ex_rate):null;
      }
    }):null
    type!="Recievable"?chageHeads.forEach((x)=>{
      if(x.pp_cc=="CC"){
        x.type!="Recievable"?pay_ccCharges = pay_ccCharges + parseFloat(x.local_amount):null;
      }else if(x.pp_cc=="PP"){
        x.type!="Recievable"?pay_ppCharges = pay_ppCharges + parseFloat(x.local_amount):null;
      }
      if(x.tax_apply){
        x.type!="Recievable"?pay_tax = pay_tax + parseFloat(x.tax_amount*x.ex_rate):null;
      }
    }):null
  }
  let obj = {
    payble:{
      pp:pay_ppCharges.toFixed(2) - (pay_tax).toFixed(2),
      cc:pay_ccCharges.toFixed(2),
      total:(pay_ppCharges+pay_ccCharges).toFixed(2),
      tax:(pay_tax).toFixed(2)
    },
    reciveable:{
      pp:rec_ppCharges.toFixed(2) - (rec_tax).toFixed(2),
      cc:rec_ccCharges.toFixed(2),
      total:(rec_ppCharges+rec_ccCharges).toFixed(2),
      tax:(rec_tax).toFixed(2)
    },
  }
  type=="Recievable"?delete obj.payble:null
  type=="Payble"?delete obj.reciveable:null
  return obj
}

const makeInvoice = async(list, companyId, reset, type) => {
  let status = "";
  let tempList = list.filter((x)=>x.check);
  if(tempList.length>0){
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_INVOICE_NEW,{
      chargeList:tempList, companyId, type:type
    }).then((x)=>{
      reset({chargeList:[]})
      status = x.data.status
    })
  }
  return status
}

const getInvoices = async(id, dispatch) => {
  let result = [];
  await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_IVOICES_TYPES, 
    {headers:{id:id}
  }).then((x)=>{
    result = x.data.status=="success"? x.data.result : [];
    dispatch({type:'set', payload:{"InvoiceList":result}})
  })
  //return result;
} 

const getStatus = (val) => {
  return val[0]=="1"?true:false
};

const setHeadsCache = (chargesData, dispatch, reset) => {
  chargesData.status=="success"?
  dispatch({type:'set', 
  payload:{
    reciveableCharges:chargesData.data.reciveableCharges,
    paybleCharges:chargesData.data.paybleCharges,
    ...chargesData.data
    //...tempChargeHeadsArray
  }}):null;
  chargesData.status=="success"?
  reset({chargeList:[ ...chargesData.data.charges ]}):
  null;
}

export {
  recordsReducer, initialState, baseValues,
  SignupSchema, getClients, getVendors,
  saveHeads, getHeadsNew, getStatus,
  calculateChargeHeadsTotal,
  makeInvoice, getInvoices,
  setHeadsCache
};