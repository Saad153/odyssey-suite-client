import React, { useEffect, useReducer } from 'react';
import CreateOrEdit from './CreateOrEdit';
import { useSelector } from 'react-redux';
import axios from 'axios';

function recordsReducer(state, action){
  switch (action.type) {
    case 'set': { 
      return { ...state, ...action.payload } 
    }
    case 'toggle': { 
      return { ...state, [action.fieldName]: action.payload } 
    }
    case 'history': {
      return {
        ...state,
        edit: false,
        viewHistory:true,
        visible: true,
      }
    }
    default: return state 
  }
}

const baseValues = {
  //Basic Info
  id:'',
  name:"",
  registerDate:"",
  person1:"",
  mobile1:"",
  person2:"",
  mobile2:"",
  telephone1:"",
  telephone2:"",
  address1:"",
  address2:"",
  city:"",
  zip:"",
  ntn:"",
  strn:"",
  website:"",
  infoMail:"",
  accountsMail:"",
  operations:[],
  types: [],
  companies:[],
  //Bank Info
  bank:"",
  branchName:"",
  branchCode:"",
  accountNo:"",
  iban:"",
  swiftCode:"",
  routingNo:"",
  ifscCode:"",
  micrCode:"",
  bankAuthorizeDate:"",
  authorizedById : "",
  //Account Info
  accountRepresentatorId : "",
  salesRepresentatorId : "",
  docRepresentatorId : "",
  currency:"",
  code:"",

  parentAccount:'',
  childAccount:'',
}

const initialState = {
  load:false,
  values:baseValues,
  Representatives:[
    {name:'Accounts', records:[]},
    {name:'Sales', records:[]},
    {name:'Doc', records:[]}
  ],
  Operations:[
    { label: "Sea Import", value: "Sea Import" },
    { label: "Sea Export", value: "Sea Export" },
    { label: "Air Import", value: "Air Import" },
    { label: "Air Export", value: "Air Export" }
  ],
  Types:[
    { label: "Shipper", value: "Shipper" },
    { label: "Consignee", value: "Consignee" },
    { label: "Notify", value: "Notify" },
    { label: "Potential Customer", value: "Potential Customer" },
    { label: "Invoice Party", value: "Invoice Party" },
    { label: "Non operational Party", value: "Non operational Party" },
    { label: "Forwarder/Coloader", value: "Forwarder/Coloader" },
    { label: "Local Vendor", value: "Local Vendor" },
    { label: "Overseas Agent", value: "Overseas Agent" },
    { label: "Commission Agent", value: "Commission Agent" },
    { label: "Indentor", value: "Indentor" },
    { label: "Transporter", value: "Transporter" },
    { label: "CHA/CHB", value: "CHA/CHB" },
    { label: "Shipping Line", value: "Shipping Line" },
    { label: "Delivery Agent", value: "Delivery Agent" },
    { label: "Warehouse", value: "Warehouse" },
    { label: "Buying House", value: "Buying House" },
    { label: "Air Line", value: "Air Line" },
    { label: "Trucking", value: "Trucking" },
    { label: "Drayman", value: "Drayman" },
    { label: "Cartage", value: "Cartage" },
    { label: "Stevedore", value: "Stevedore" },
    { label: "Principal", value: "Principal" },
    { label: "Depot", value: "Depot" },
    { label: "Terminal", value: "Terminal" },
    { label: "Buyer", value: "Buyer" },
    { label: "Slot Operator", value: "Slot Operator" },
  ],
  accountList:[],
  companyList:[
    {id:1, name:''}
  ],
  editCompanyList:[
    {id:1, name:''}
  ],
  history:[],
  // Editing Records
  oldRecord:{},
};

const CreateOrEditComp = ({id, representativeData, clientData}) => {

  const companiesList = useSelector((state) => state.company.companies);
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);

  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNTS_FOR_PARTY_SETUP,{
      headers:{"id": `1`}
    }).then((x)=>{
      let tempParentAccount = ''
      x.data.result.forEach((x)=>{
        if(x.title=="ACCOUNT RECEIVABLE"){
          tempParentAccount = x.id
        }
      })
      dispatch({type:'set', payload:{
        parentAccount:id=="new"?tempParentAccount:clientData?.Client_Associations[0]?.Parent_Account?.id,
        accountList:x.data.result,
        companyList:createCompanyList(companiesList),
        editCompanyList:createCompanyList(companiesList)
      }});
    });
    setRecords();
  }, [])

  const createCompanyList = (list) => {
    let tempState = [];
    list.forEach((x, index)=>{
      tempState.push({value:x.id, label:x.title, disabled:false})
    })
    return tempState
  }

  const setRecords = () => {
    let tempState = [
      {name:'Accounts', records:[]},
      {name:'Sales', records:[]},
      {name:'Doc', records:[]}
    ];
    representativeData.result.Ar.forEach((x)=>{tempState[0].records.push(x)});
    representativeData.result.Dr.forEach((x)=>{tempState[1].records.push(x)});
    representativeData.result.Sr.forEach((x)=>{tempState[2].records.push(x)});
    dispatch({type:'toggle', fieldName:'Representatives', payload:tempState});
  }

  return (
  <div className='base-page-layout'>
    <CreateOrEdit state={state} dispatch={dispatch} baseValues={baseValues} clientData={clientData} id={id} />
  </div>
  )
}

export default React.memo(CreateOrEditComp)