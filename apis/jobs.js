import axios from "axios";

export function getJobValues() {
    return axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/seaJob/getValues`)
    .then((x)=>x.data)
}
export async function getJobById({id, type}) {
    if(id=="new"){
        return {status:"success", result:{}}
    } else {
        return await axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/seaJob/getSEJobById`,{
            headers: {"id":`${id}`, operation:`${type}`}
        })
        .then((x)=>x.data)
    }
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

export async function getChargeHeads ({id}) {
  let charges = [];
  await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_SE_HEADS_NEW,{
    headers:{"id": `${id}`}
  }).then((x)=>{
    if(x.data.status=="success"){
      charges = x.data.result;
    }
  });
  let tempChargeHeadsArray = await calculateChargeHeadsTotal([...charges], "full");    
  return {
    charges,
    ...tempChargeHeadsArray
  }
}