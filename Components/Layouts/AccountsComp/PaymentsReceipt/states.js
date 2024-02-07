import axios from "axios";
import moment from "moment";

function recordsReducer(state, action){
    switch (action.type) {
      case 'set': {
        return { ...state, [action.var]: action.pay } 
      }
      case 'setAll': {
        return {
            ...state, ...action.payload
        }
      }
      case 'on': {
        return {
            ...state,
            visible: true,
        }
      }
      case 'off': {
        let returnVal = {
          ...state, visible: false
        };
        return returnVal
      }
      default: return state 
    }
};

const initialState = {

  records: [],
  oldBills: false,
  oldrecords: [],
  load:false,
  visible:false,
  glVisible:false,

  invoices: [],
  load: false,
  autoOn:false,
  auto:'0',
  exRate:'1',
  manualExRate:'1',

  transaction :"Cash",
  subType:'Cheque',
  onAccount:'Client',
  variable:"",
  drawnAt:'',
  accounts:[
      {
        Parent_Account:{ CompanyId:1, title:'', Account:{}},
        title:''
      }
  ],
  checkNo:'',
  search:'',
  date:moment(),
  bankCharges:0.0,
  
  gainLoss :"Gain",
  gainLossAmount:0.0,
  taxAmount:0.0,
  isPerc:false,
  accountsLoader:false,
  taxPerc:0.0,
  finalTax:0.0,
  indexes:[],
  partyAccountRecord:{},
  payAccountRecord:{},
  taxAccountRecord:{},
  bankChargesAccountRecord:{},
  gainLossAccountRecord:{},

  totalrecieving:0.00,

  transactionCreation:[],
  activityCreation:[],
  transLoad:false,
  invoiceLosses:[],
};

const getCompanyName = (id) => {
    let result = "";
    result = id==1?'SNS':id==2?"CLS":"ACS"
   return result;
}

const getAccounts = async(trans, companyId) => {
    const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_FOR_TRANSACTION,{
        headers:{type:trans, companyid:companyId}
    }).then((x)=> x.data.result )
    return result;
}

const totalRecieveCalc = (vals) => {
    let total = 0.00;
    vals.forEach((x)=>{
      if(x.receiving>0){
        total = total+ parseFloat(x.receiving)
      }
    });
    return total;
}

const getInvoices = async(id, dispatch, partytype, selectedParty, payType, companyId, invoiceCurrency) => {
  dispatch({type:"setAll", 
    payload:{
      ...initialState,
      //invoices:[],
      load:true
    }
  });
  
  await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_PARTY_ID, 
    { headers:{id:id, pay:payType, party:partytype, companyId:companyId, invoiceCurrency:invoiceCurrency} }
  ).then(async(x)=> {
      let temp = x.data.result;
      let accountData = {};
      if(x.data.status=="success" && x.data.account!=null){
          x.data.account.forEach((z)=>{
            if(z.Child_Account!=null){
              accountData = z;
            }
          })
          temp = temp.map(y=>({
            ...y,
            check:false,
            jobId:y.SE_Job==null?'Old Job':y.SE_Job.jobNo,
            jobSubType:y.SE_Job==null?'Old':y.SE_Job.subType,
            ex_rate:y.Charge_Heads[0].ex_rate,
            receiving:0.00,
            //inVbalance:(parseFloat(y.total) + parseFloat(y.roundOff)).toFixed(2),
            inVbalance:partytype=="agent"?
              ((parseFloat(y.total) / parseFloat(y.Charge_Heads[0].ex_rate)) + parseFloat(y.roundOff)).toFixed(2):
              (parseFloat(y.total) + parseFloat(y.roundOff)).toFixed(2),
            remBalance:partytype=="agent"?
            (payType=="Recievable"?
              (parseFloat(y.total)/ parseFloat(y.Charge_Heads[0].ex_rate) - (parseFloat(y.recieved==null?0:y.recieved)/ parseFloat(y.Charge_Heads[0].ex_rate)) - parseFloat(y.receiving==null?0:y.receiving)).toFixed(2):
              (parseFloat(y.total)/ parseFloat(y.Charge_Heads[0].ex_rate) - (parseFloat(y.paid==null?0:y.paid)/ parseFloat(y.Charge_Heads[0].ex_rate)) - parseFloat(y.receiving==null?0:y.receiving))).toFixed(2):
            (payType=="Recievable"?
              (parseFloat(y.total) - parseFloat(y.recieved==null?0:y.recieved)-parseFloat(y.receiving==null?0:y.receiving)).toFixed(2):
              (parseFloat(y.total) - parseFloat(y.paid==null?0:y.paid) - parseFloat(y.receiving==null?0:y.receiving)).toFixed(2)),
            //inVbalance:(parseFloat(y.total) + parseFloat(y.roundOff)).toFixed(2)//getNetInvoicesAmount(y.Charge_Heads).localAmount
          }));
      }
      dispatch({
        type:"setAll", 
        payload:{
          invoices:temp,
          partyAccountRecord:accountData.Child_Account,
          load:false,
          glVisible:false,
          transLoad:false
      }})
  })
}

export { recordsReducer, initialState, getCompanyName, getAccounts, totalRecieveCalc, getInvoices };