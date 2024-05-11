import { getNetInvoicesAmount } from '/functions/amountCalculations';
import { getAccounts, totalRecieveCalc, getInvoices, getTotal } from './states';
import openNotification from '/Components/Shared/Notification';
import PrintTranInfo from './PrintTranInfo';
import { Empty, InputNumber, Checkbox } from 'antd';
import { Spinner, Table, Col, Row } from 'react-bootstrap';
import React, { useEffect } from 'react';
import PrintTopHeader from '/Components/Shared/PrintTopHeader';
import Gl from './Gl';

const PrintTransaction = ({companyId, state, dispatch}) => {

  const set = (a, b) => { dispatch({type:'set', var:a, pay:b}) }
  const commas = (a) =>  { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")};  
  
  useEffect(() => {
    getInvoices(state, companyId, dispatch);
  }, [state.selectedParty, state.payType]);  
  
  useEffect(() => { 
    if(state.invoices.length>0){
      set('totalrecieving', totalRecieveCalc(state.invoices));
      calculateTransactions();
    }
  }, [
    state.invoices,
    state.manualExRate,
    state.exRate,
    state.autoOn
  ]);  

  useEffect(() => {
    calculateTax();
  }, [
    state.totalrecieving, 
    state.taxPerc, 
    state.taxAmount, 
    state.autoOn, 
    state.exRate, 
    state.manualExRate
  ]);  

  async function calculateTax(){
    let tempRate = state.autoOn? state.exRate:state.manualExRate
    if(state.isPerc){
      let tax = ((state.totalrecieving * tempRate)/100)*state.taxPerc;
      set('finalTax', tax);
    } else {
      set('finalTax', state.taxAmount);
    }
  };

  const calculateTransactions = () => {
    let tempGainLoss = 0.00;
    let tempInvoiceLosses = [];
    let debitReceiving = 0.00
    let creditReceiving = 0.00
    state.invoices.forEach((x)=>{
      if(x.receiving && (x.receiving!=0|| state.edit)){
        let tempExAmount = parseFloat(state.manualExRate)*(x.receiving===null?0:parseFloat(x.receiving)) - parseFloat(x.ex_rate)*(x.receiving===null?0:parseFloat(x.receiving))
        // console.log(x.payType);
        if(x.payType=="Payble"){
          tempExAmount = -1*tempExAmount
        }
        tempGainLoss = tempGainLoss + tempExAmount
        // console.log(tempGainLoss);
        let tempAmount = (parseFloat(state.manualExRate)*(x.receiving===null?0:parseFloat(x.receiving)) - parseFloat(x.ex_rate)*(x.receiving===null?0:parseFloat(x.receiving))).toFixed(2)
        let invoieLossValue = {}
        // console.log(x.receiving)
        x.payType == 'Recievable'?
          debitReceiving = debitReceiving + parseFloat(x.receiving):
          creditReceiving = creditReceiving + parseFloat(x.receiving)
        invoieLossValue = {
          amount:x.receiving,
          InvoiceId:x.id,
          gainLoss: x.payType =="Recievable"?
            parseFloat(tempAmount)==0?
              0:parseFloat(tempAmount)*(-1)
            :
            tempAmount, 
        }
        if(x.Invoice_Transactions){
          invoieLossValue.id = x.Invoice_Transactions[0].id
        }
        tempInvoiceLosses.push(invoieLossValue)
      }
    });
    dispatch({type:'setAll', payload:{
      gainLossAmount:tempGainLoss.toFixed(2),
      invoiceLosses:tempInvoiceLosses,
      debitReceiving:debitReceiving,
      creditReceiving:creditReceiving,
    }})
  };

  const getContainers = (data) => {
    let result = "";
    data?.SE_Job?.Bl?.Container_Infos &&
    data?.SE_Job?.Bl?.Container_Infos.forEach((x)=>{
      result = result + x.no + ', '
    });
    return result||'none'
  };

  return (
  <>
  <div className='my-5'></div>
  <PrintTopHeader company={companyId} />
  <Row className=''>
    <Col md={12}><hr className='mb-0' /></Col>
    <Col md="auto" className='mt-3'>Party:</Col>
    <Col md={5} className='mt-3'style={{border:'1px solid silver'}}>
      <b>{state.selectedParty.name}</b>
    </Col>
    <Col md="auto" className='mt-3'>{"("}{state.partytype}{")"}</Col>
    <Col md={7} className='mt-2'>
      <PrintTranInfo state={state} />
    </Col>
    <Col md={5} className="mt-4">
      <div className="mb-2 pb-2 cur" style={{borderBottom:'1px solid silver'}}>
        <span><Checkbox checked={state.autoOn} style={{position:'relative', bottom:1}} /></span>
        <span className='mx-2'>Auto Knock</span>
      </div>
      <Row className='mt-2'>
        <Col md={5}>
          <span className='grey-txt'>Amount</span>
          <InputNumber 
            size='small'
            min="0" stringMode 
            style={{width:'100%', paddingRight:10}} 
            disabled={!state.autoOn} value={state.auto} 
          />
        </Col>
        <Col md={4}>
          <span className='grey-txt'>Ex. Rate</span>
          <InputNumber size='small'
            min="0.00" stringMode 
            style={{width:'100%', paddingRight:20}} 
            disabled={state.partytype!="agent"?true:!state.autoOn} value={state.exRate}
          />
        </Col>
        <Col md={3}>
        </Col>
        {!state.autoOn &&
        <Col md={12}>
          <div style={{maxWidth:100}}>
          <span className='grey-txt'>Ex. Rate</span>
            <InputNumber size='small'
              disabled={state.partytype!="agent"}
              min="0.00" stringMode 
              style={{width:'100%', paddingRight:20}} 
              value={state.partytype!="agent"?'1.00':state.manualExRate}
            />
          </div>
        </Col>
        }
        <Col md={4} className="mt-3">
          <div className='grey-txt fs-14'>
            Tax
          </div>
          <div className="custom-select-input-small" >{state.finalTax}</div>
        </Col>
        <Col className="mt-3" md={8}>
          <span className="grey-txt fs-14">Tax Account</span>
          <span style={{marginLeft:6, position:'relative', bottom:2}} className='close-btn'>

          </span>
          <div className="custom-select-input-small">{
            Object.keys(state.taxAccountRecord).length==0?
            <span style={{color:'silver'}}>Select Account</span>:
            <span style={{color:'black'}}>{state.taxAccountRecord.title}</span>
          }
          </div>
        </Col>
        <Col md={4} className="mt-3">
          <div className='grey-txt fs-14'>
            {state.gainLossAmount==0.00 && <br/>}
            {state.gainLossAmount>0 && <span style={{color:'green'}}><b>Gain</b></span>}
            {state.gainLossAmount<0 && <span style={{color:'red'}}><b>Loss</b></span>} 
          </div>
          <div className="custom-select-input-small" >{Math.abs(state.gainLossAmount)}</div>
          {/* <div className="custom-select-input-small" >{state.gainLossAmount}</div> */}
        </Col>
        <Col className="mt-3" md={8}>
          <span className="grey-txt fs-14">Gain / Loss Account</span>
          <div className="custom-select-input-small">
            {
              Object.keys(state?.gainLossAccountRecord).length==0?
              <span style={{color:'silver'}}>Select Account</span>:
              <span style={{color:'black'}}>{state.gainLossAccountRecord.title}</span>
            }
          </div>
        </Col>
      </Row>
    </Col>
  </Row>
  {!state.load && 
  <>  
    {state.invoices.length==0 && <Empty  />}
    {state.invoices.length>0 &&
    <>
      <div className='table-sm-1 mt-3'>
      <Table className='tableFixHead' bordered>
        <thead>
          <tr className='fs-10'>
          <th>Job #</th>
          <th>Inv/Bill #</th>
          <th>HBL</th>
          <th>MBL</th>
          <th>Curr</th>
          <th>Ex.</th>
          <th>Type</th>
          <th>Balance</th>
          <th>{'Amount'}</th>
          <th>Balance</th>
          <th>Container</th>
          </tr>
        </thead>
        <tbody>
          {state.invoices.map((x, index) => {
          return (
        <tr key={index} className={`f fs-10`}>
          <td className='px-0 py-1 text-center'><b>{x?.SE_Job?.jobNo}</b></td>
          <td className='px-0 py-1 text-center'>{x.invoice_No}</td>
          <td className='px-0 py-1 text-center'>{x?.SE_Job?.Bl?.hbl||'none'}</td>
          <td className='px-0 py-1 text-center'>{x?.SE_Job?.Bl?.mbl||'none'}</td>
          <td className='px-0 py-1 text-center'>{x.currency}</td>
          <td className='px-0 py-1 text-center'>{parseFloat(x.ex_rate).toFixed(2)}</td>
          <td className='px-0 py-1 text-center'><b>{x.payType=="Payble"?"CN":"DN"}</b></td>
          <td className='px-0 py-1 text-center'>{commas(x.inVbalance)}</td>
          <td className='px-0 py-1 text-center'>{commas(x.remBalance)}</td>
          <td className='px-0 py-1 text-center'>{commas(x.remBalance - x.receiving)} </td>
          <td className='px-0 py-1 text-center'>{getContainers(x)}</td>
        </tr>
          )})}
        </tbody>
      </Table>
      </div>
      <div style={{position:'relative', top:20}}>
        Total {state.debitReceiving > state.creditReceiving?"Receivable":"Payble"} Amount:{" "}
        <div style={{padding:3, border:'1px solid silver', minWidth:100, display:'inline-block', textAlign:'right'}}>
          {Math.abs(state.debitReceiving - state.creditReceiving).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}
        </div>
      </div>
    </>
    }
  </>
  }
  {state.load && <div className='text-center' ><Spinner /></div>}
  {state.glVisible && <Gl state={state} dispatch={dispatch} companyId={companyId} />}
  </>
  )
}

export default React.memo(PrintTransaction)