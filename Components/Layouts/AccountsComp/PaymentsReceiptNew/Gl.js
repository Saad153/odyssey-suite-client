import { Row, Col, Table, Spinner } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { Modal } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { delay } from '../../../../functions/delay';
import { getNetInvoicesAmount } from '../../../../functions/amountCalculations';
import openNotification from '../../../Shared/Notification';
import { getInvoices } from './states';

const Gl = ({state, dispatch, companyId}) => {

  const { payType, invoiceCurrency } = state;
  const set = (a, b) => { dispatch({type:'set', var:a, pay:b}) }
  const commas = (a) => a==0?'0':parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")

  const getTotal = (type, list, curr) => {
    let result = 0.00;
    curr=="PKR"?
    list.forEach((x)=>{
      if(type==x.tran.type){
        result = result + parseFloat(x.tran.amount)
      }
    }):
    list.forEach((x)=>{
      if(type==x.tran.type){
        result = result + parseFloat(x.tran.defaultAmount)
      }
    });
    return result;
  }

  const handleSubmit = async () => {
    set("transLoad", true);
    let tempInvoices = [];
    let invoicesIds = [];
    state.invoices.forEach((x, i) => {
      // make receving & payin logic
      let tempReceiving = invoiceCurrency!="PKR"? 
        //parseFloat(x.recieved) - parseFloat(state.edit?x.Invoice_Transactions[0].amount:0) + (parseFloat(x.receiving)*parseFloat(x.ex_rate).toFixed(2)):
        parseFloat(x.recieved) - parseFloat(state.edit?x.Invoice_Transactions[0].amount*parseFloat(x.ex_rate).toFixed(2):0) + (parseFloat(x.receiving)*parseFloat(x.ex_rate).toFixed(2)):
        parseFloat(x.recieved) - parseFloat(state.edit?x.Invoice_Transactions[0].amount:0) + (parseFloat(x.receiving));
      let tempPaying = invoiceCurrency!="PKR"? 
        parseFloat(x.paid) - parseFloat(state.edit?x.Invoice_Transactions[0].amount*parseFloat(x.ex_rate).toFixed(2):0) + (parseFloat(x.receiving)*parseFloat(x.ex_rate).toFixed(2)):
        parseFloat(x.paid) - parseFloat(state.edit?x.Invoice_Transactions[0].amount:0) + (parseFloat(x.receiving))

      let tempRecStatus = invoiceCurrency!="PKR"?
        parseFloat(x.recieved) - parseFloat(state.edit?x.Invoice_Transactions[0].amount*parseFloat(x.ex_rate).toFixed(2):0) + (parseFloat(x.receiving)*parseFloat(x.ex_rate).toFixed(2))<(parseFloat(x.inVbalance)*parseFloat(x.ex_rate).toFixed(2))?"3":"2":
        parseFloat(x.recieved) - parseFloat(state.edit?x.Invoice_Transactions[0].amount:0) + (parseFloat(x.receiving))<(parseFloat(x.inVbalance))?"3":"2"
      let tempPayStatus = invoiceCurrency!="PKR"? 
        parseFloat(x.paid) - parseFloat(state.edit?x.Invoice_Transactions[0].amount*parseFloat(x.ex_rate).toFixed(2):0) + (parseFloat(x.receiving)*parseFloat(x.ex_rate).toFixed(2))<(parseFloat(x.inVbalance)*parseFloat(x.ex_rate).toFixed(2))?"3":"2":
        parseFloat(x.paid) - parseFloat(state.edit?x.Invoice_Transactions[0].amount:0) + (parseFloat(x.receiving))<(parseFloat(x.inVbalance))?"3":"2"

        if((x.receiving>0 || state.edit) && payType=="Recievable"){
        invoicesIds.push(x.id)
        tempInvoices.unshift({
          id:x.id,
          //recieved:parseFloat(x.total)+parseFloat(x.roundOff) == parseFloat(x.recieved)?x.recieved:tempReceiving, //this logic does not let over receive
          recieved:tempReceiving, //this logic does not let over receive
          status:tempRecStatus,
          //inVbalance:x.inVbalance
        })
      }else if((x.receiving>0 || state.edit) && payType!="Recievable"){
        invoicesIds.push(x.id)
        tempInvoices.unshift({
          id:x.id,
          //paid:parseFloat(x.total)+parseFloat(x.roundOff) == parseFloat(x.paid)?x.paid:tempPaying, //this logic does not let over pay
          paid:tempPaying, //this logic does not let over pay
          status:tempPayStatus,
          //inVbalance:x.inVbalance
        })
      }
    });
    let voucher = {
      type:payType=="Recievable"?"Job Reciept":"Job Payment",
      vType:state.transaction=="Bank"? 
        payType=="Recievable"?
          "BRV":"BPV":
        payType=="Recievable"?
          "CRV":"CPV",
      CompanyId:companyId,
      amount:"",
      currency:invoiceCurrency,
      exRate:state.autoOn?state.exRate:state.manualExRate,
      chequeNo:state.checkNo,
      drawnAt:state.drawnAt,
      onAccount:state.onAccount,
      costCenter:"KHI",
      Voucher_Heads:[],
      subType:state.subType
    }
    state.transactionCreation.forEach((x)=>{
      let tempVoucheObj = {
        defaultAmount:`${x.tran.defaultAmount==0?'':x.tran.defaultAmount}`,
        amount:`${x.tran.amount}`,
        type:x.tran.type,
        narration:x.tran.narration,
        VoucherId:null,
        ChildAccountId:x.particular.id,
        accountType:x.tran.accountType
      }
      let voucherHeadId = state.voucherHeads.find((y)=>y.accountType==x.tran.accountType)
      if(voucherHeadId){
        tempVoucheObj.id = voucherHeadId.id
      }
      voucher.Voucher_Heads.push(tempVoucheObj)
    })
    voucher.invoices = invoicesIds.join(", ");
    voucher.partyId = state.selectedParty.id;
    voucher.partyName = state.selectedParty.name;
    voucher.partyType = state.partytype;
    voucher.tranDate = moment(state.date).format("yyyy-MM-DD");
    state.edit?voucher.id = state.id : null;
    voucher.createdAt = state.createdAt;
    
    await axios.post(state.edit?process.env.NEXT_PUBLIC_CLIMAX_UPDATE_VOUCEHR:process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER, voucher)
    .then(async(x)=>{
      let newInvoices = state.invoiceLosses.map((y)=>{
        return {...y, VoucherId:state.edit?state.id:x.data.result.id}
      })
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_INVOICE_TRANSACTION,{
        invoices:tempInvoices,
        invoiceLosses:newInvoices,
      }).then(()=>{
        openNotification("Success", "Transaction Recorded!", "green")
      })
    })
    await delay(1000)
    await getInvoices(state, companyId, dispatch); 
  }

  return (
  <Modal title={`Transaction General Journal`} open={state.glVisible} onOk={()=>set('glVisible', false)} 
    onCancel={()=>set('glVisible', false)} footer={false} maskClosable={false} width={'80%'}
  >
  <div style={{minHeight:330, fontSize:12}}>
    <h4 className='grey-txt'>Proceed with following transaction?</h4>
    <div className='table-sm-1 mt-3' style={{maxHeight:330, overflowY:'auto'}}>
      <Table className='tableFixHead' bordered>
      <thead>
        <tr>
          <th className='' colSpan={6} style={{textAlign:'end', fontWeight:100}}>
            <span className='mx-2'>Ex. Rate:</span>{parseFloat(state.autoOn?state.exRate:state.manualExRate).toFixed(2)}
          </th>
        </tr>
        <tr>
          <th className='' style={{width:260}}>Particular</th>
          {state.invoiceCurrency!="PKR" &&<th className='text-center' style={{width:25}}>Debit</th>}
          {state.invoiceCurrency!="PKR" &&<th className='text-center' style={{width:25}}>Credit</th>}
          <th className='px-0' style={{width:"1px"}}></th>
          <th className='text-center' style={{width:25}}>Debit</th>
          <th className='text-center' style={{width:25}}>Credit</th>
        </tr>
      </thead>
      <tbody>
      {state.transactionCreation.map((x, index) => {
      return (
        <tr key={index}>
          <td>{x.particular?.title}</td>
          {state.invoiceCurrency!="PKR" &&<td className='text-end' style={{minWidth:90}}>{x.tran.type!="credit"?<><span className='gl-curr-rep'>{state.invoiceCurrency+". "}</span>{commas(x.tran.defaultAmount)}</>:''}</td>}
          {state.invoiceCurrency!="PKR" &&<td className='text-end' style={{minWidth:90}}>{x.tran.type=="credit"?<><span className='gl-curr-rep'>{state.invoiceCurrency+". "}</span>{commas(x.tran.defaultAmount)}</>:''}</td>}
          <td className='px-0' style={{width:"1px"}}></td>
          <td className='text-end' style={{minWidth:90}}>{x.tran.type!="credit"?<><span className='gl-curr-rep'>PKR.{" "}</span>{commas(x.tran.amount)}</>:''}</td>
          <td className='text-end' style={{minWidth:90}}>{x.tran.type=="credit"?<><span className='gl-curr-rep'>PKR.{" "}</span>{commas(x.tran.amount)}</>:''}</td>
        </tr>
        )})}
        <tr>
          <td style={{textAlign:'right'}}><>Balance:</></td>
          {state.invoiceCurrency!="PKR" &&<td className='text-end'><span className='gl-curr-rep'>{state.invoiceCurrency+". "}</span>{commas(getTotal('debit', state.transactionCreation,''))}</td>}
          {state.invoiceCurrency!="PKR" &&<td className='text-end'><span className='gl-curr-rep'>{state.invoiceCurrency+". "}</span>{commas(getTotal('debit', state.transactionCreation,''))}</td>}
          <td style={{width:"1px"}}></td>
          <td className='text-end'><span className='gl-curr-rep'>PKR.{" "}</span>{commas(getTotal('debit', state.transactionCreation,'PKR'))}</td>
          <td className='text-end'><span className='gl-curr-rep'>PKR.{" "}</span>{commas(getTotal('credit', state.transactionCreation,'PKR'))}</td>
        </tr>
      </tbody>
      </Table>
    </div>
  </div>
  {getTotal('debit', state.transactionCreation,'PKR') == getTotal('credit', state.transactionCreation,'PKR') &&
  <>
    {state.transactionCreation.length>0 && 
    <button className='btn-custom' disabled={state.transLoad?true:false} onClick={handleSubmit}>
      {state.transLoad? <Spinner size='sm' className='mx-5' />:"Approve & Save"}
    </button>
    }
  </>
  }
  </Modal>
  )
}

export default React.memo(Gl);