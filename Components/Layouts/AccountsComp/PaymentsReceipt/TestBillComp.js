import { getNetInvoicesAmount } from '../../../../functions/amountCalculations';
import { recordsReducer, initialState, getAccounts, totalRecieveCalc, getInvoices } from './states';
import openNotification from '../../../Shared/Notification';
import { Empty, InputNumber, Checkbox, Radio } from 'antd';
import { Spinner, Table, Col, Row } from 'react-bootstrap';
import AgentTransactionInfo from './TestTranComp';
import React, { useEffect, useReducer, useState } from 'react';
import moment from "moment";
import Gl from './Gl';
import axios from 'axios';
import { CloseCircleOutlined } from '@ant-design/icons';

const AgentBillComp = ({selectedParty, partytype, payType, invoiceCurrency, companyId}) => {

    const [ state, dispatch ] = useReducer(recordsReducer, initialState);
    const set = (a, b) => dispatch({type:'set', var:a, pay:b});

    useEffect(() => {
        getInvoices(selectedParty?.id, dispatch, partytype, selectedParty, payType, companyId, invoiceCurrency); 
    }, [selectedParty, payType]);
    useEffect(() => { if(state.invoices.length>0){set('totalrecieving', totalRecieveCalc(state.invoices));} }, [state.invoices]);

    useEffect(() => {
        if(!state.autoOn){ calculateGainLoss(); }
    }, [state.invoices, state.manualExRate]);

    useEffect(() => {
        calculateTax();
    }, [state.totalrecieving, state.taxPerc, state.taxAmount, state.autoOn, state.exRate, state.manualExRate]);

    async function calculateTax(){
        let tempRate = state.autoOn? state.exRate:state.manualExRate
        if(state.isPerc){
            let tax = ((state.totalrecieving * tempRate)/100)*state.taxPerc;
            set('finalTax', tax);
        }else{
            set('finalTax', state.taxAmount);
        }
    }
    
    const calculateGainLoss = () => {
        let tempGainLoss = 0.00;
        let tempInvoiceLosses = [];
        state.invoices.forEach((x)=>{
            if(x.receiving && x.receiving!=0){
                tempGainLoss = tempGainLoss + parseFloat(state.manualExRate)*(x.receiving===null?0:parseFloat(x.receiving)) - parseFloat(x.ex_rate)*(x.receiving===null?0:parseFloat(x.receiving))
                let tempAmount = (parseFloat(state.manualExRate)*(x.receiving===null?0:parseFloat(x.receiving)) - parseFloat(x.ex_rate)*(x.receiving===null?0:parseFloat(x.receiving))).toFixed(2)
                tempInvoiceLosses.push({
                    InvoiceId:x.id,
                    gainLoss:payType=="Recievable"? parseFloat(tempAmount)*(-1):tempAmount, 
                })
            }
        });
        dispatch({type:'setAll', payload:{
            gainLossAmount:tempGainLoss.toFixed(2),
            invoiceLosses:tempInvoiceLosses
        }})
        //set('gainLossAmount', tempGainLoss.toFixed(2));
    }

    const resetAll = () => {
        let tempList = [...state.invoices];
        tempList = tempList.map(x=>({
            ...x,
            check:false,
            receiving:0.00,
        }));
        return tempList
    }

    const autoKnocking = async() => {
        let val = resetAll();
        if(state.auto=='0'||state.auto==null){
            openNotification('Alert', 'Please Enter A Number', 'orange');
        } else {
            let newExAmount = 0.00;
            let oldExAmount = 0.00;
            let tempAmount = parseFloat(state.auto).toFixed(2);
            let pendingFund = 0;
            val.forEach((x) => {
                pendingFund = parseFloat((parseFloat(x.inVbalance) - parseFloat(x.receiving==null?0:x.receiving)).toFixed(2));
                if(pendingFund >= tempAmount) {
                    x.receiving = (parseFloat(x.receiving) + parseFloat(tempAmount)).toFixed(2);
                    tempAmount = 0.00;
                } else if (tempAmount==0.00) {
                    null
                } else if (pendingFund < tempAmount){
                    x.receiving = pendingFund;
                    tempAmount = tempAmount - pendingFund;
                }
                pendingFund = 0.00;
            })

            val.forEach((x)=>{
                newExAmount = parseFloat(newExAmount) + (parseFloat(x.receiving)*parseFloat(state.exRate));
                oldExAmount = parseFloat(oldExAmount) + (parseFloat(x.receiving)*parseFloat(x.ex_rate));
            })
            dispatch({type:'setAll', payload:{
                gainLossAmount:(newExAmount-oldExAmount).toFixed(2),
                invoices:val,
                //taxAmount:0.0,
                //isPerc:false,
                //taxPerc:0.0
            }})
            // set('gainLossAmount', (newExAmount-oldExAmount).toFixed(2));
            // set('invoices', val);
        }
        calculateTax();
    }

    const submitPrices = async() => {
        let transTwo = [];
        let removing = 0;
        let tempInvoices = [...state.invoices];
        let invNarration = "";
        tempInvoices.forEach((x)=>{
            if(x.check){
                invNarration = invNarration + `Inv# ${x.invoice_No} for Job# ${x.jobId},`
            }
        });
        invNarration = invNarration + ` For ${selectedParty.name}`;
        //Create Account Transactions
        if((Object.keys(state.payAccountRecord).length!=0) && (state.totalrecieving!=0)){ // <- Checks if The Recieving Account is Selected
            if((Object.keys(state.taxAccountRecord).length!=0) && (state.finalTax!=0) && (state.finalTax!=null) && (state.totalrecieving!=0)){
                removing = state.finalTax;
                transTwo.push({
                    particular:state.taxAccountRecord,
                    tran:{
                        type:'debit',//state.taxAccountRecord.Parent_Account.Account[payType=="Recievable"?'inc':'dec'],
                        amount:state.finalTax,
                        defaultAmount:parseFloat(state.finalTax)/parseFloat(state.autoOn?state.exRate:state.manualExRate),//0
                        narration:`Tax Paid Against ${invNarration}`,
                        accountType:'Tax'
                    }
                })
            }
            if((Object.keys(state.bankChargesAccountRecord).length!=0) && (state.bankCharges!=0) && (state.bankCharges!=null) && (state.totalrecieving!=0)){
                removing = removing + state.bankCharges;
                transTwo.push({
                    particular:state.bankChargesAccountRecord,
                    tran:{
                        type:'debit',//state.bankChargesAccountRecord.Parent_Account.Account[payType=="Recievable"?'inc':'dec'],
                        amount:state.bankCharges,
                        defaultAmount:parseFloat(state.bankCharges)/parseFloat(state.autoOn?state.exRate:state.manualExRate),//0
                        narration:`Bank Charges Paid Against ${invNarration}`,
                        accountType:'BankCharges'
                    }
                })
            }
            if((Object.keys(state.gainLossAccountRecord).length!=0) && (state.gainLossAmount!=0) && (state.gainLossAmount!=null) && (state.totalrecieving!=0)){
            let gainAndLossAmount = state.gainLossAmount>0?parseFloat(state.gainLossAmount):(-1*parseFloat(state.gainLossAmount))
                transTwo.push({
                    particular:state.gainLossAccountRecord,
                    tran:{
                        type:parseFloat(state.gainLossAmount)>0? (payType!="Recievable"?'debit':'credit') : (payType!="Recievable"?'credit':'debit'),
                        amount:gainAndLossAmount,//state.gainLossAmount>0?parseFloat(state.gainLossAmount):(-1*parseFloat(state.gainLossAmount)),
                        defaultAmount:parseFloat(gainAndLossAmount)/parseFloat(state.autoOn?state.exRate:state.manualExRate), //- removing
                        narration:`${payType=="Payble"?"Paid":"Received"} Against ${invNarration}`,
                        accountType:'gainLoss'
                    }
                })
            }
            let partyAmount = state.totalrecieving * parseFloat(state.autoOn?state.exRate:state.manualExRate) - parseFloat(state.gainLossAmount)
            let payAmount = payType=="Recievable"? 
                (state.totalrecieving * parseFloat(state.autoOn?state.exRate:state.manualExRate)) - removing:
                (state.totalrecieving * parseFloat(state.autoOn?state.exRate:state.manualExRate)) + removing; 
            
            transTwo.push({
                particular:state.partyAccountRecord,
                tran:{
                    type:payType=="Recievable"?'credit':'debit',
                    amount:partyAmount, //state.totalrecieving * parseFloat(state.autoOn?state.exRate:state.manualExRate) - parseFloat(state.gainLossAmount),
                    defaultAmount:parseFloat(partyAmount)/parseFloat(state.autoOn?state.exRate:state.manualExRate), //- removing
                    narration:`${payType=="Payble"?"Paid":"Received"} Against ${invNarration}`,
                    accountType:'partyAccount'
                }
            })
            transTwo.push({
                particular:state.payAccountRecord,  
                tran:{ 
                    type:state.payAccountRecord.Parent_Account.Account[payType=="Recievable"?'inc':'dec'],// <-Checks the account type to make Debit or Credit
                    amount:payAmount,//payType=="Recievable"? 
                        //(state.totalrecieving * parseFloat(state.autoOn?state.exRate:state.manualExRate)) - removing:
                        //(state.totalrecieving * parseFloat(state.autoOn?state.exRate:state.manualExRate)) + removing,
                    defaultAmount:parseFloat(payAmount)/parseFloat(state.autoOn?state.exRate:state.manualExRate),//-removing
                    narration:`${payType=="Payble"?"Paid":"Received"} Against ${invNarration}`,
                    accountType:'payAccount'
                }
            })
        }
        dispatch({type:'setAll', payload:{
            removing:removing,
            transactionCreation:transTwo,
            glVisible:true
        }})
    }

  return (
    <>
    <Row>
        <Col md={7}>
            <AgentTransactionInfo state={state} dispatch={dispatch} payType={payType} invoiceCurrency={invoiceCurrency} />
        </Col>
        <Col md={5} className="">
            <div className="mb-2 pb-2 cur" style={{borderBottom:'1px solid silver'}} onClick={async()=>{
                    let tempReset = await resetAll();
                    dispatch({type:'setAll', payload:{
                        autoOn:!state.autoOn, invoices:tempReset,
                        exRate:'1', gainLossAmount:0.00, auto:'0'
                    }})
                }}>
                <span><Checkbox checked={state.autoOn} style={{position:'relative', bottom:1}} /></span>
                <span className='mx-2'>Auto Knock Off</span>
            </div>
            <Row>
                <Col md={5}>
                    <span className='grey-txt'>Amount</span>
                    <InputNumber 
                        size='small'
                        min="0" stringMode 
                        style={{width:'100%', paddingRight:10}} 
                        disabled={!state.autoOn} value={state.auto} 
                        onChange={(e)=>set('auto', e)} 
                    />
                </Col>
                <Col md={4}>
                    <span className='grey-txt'>Ex. Rate</span>
                    <InputNumber size='small'
                        min="0.00" stringMode 
                        style={{width:'100%', paddingRight:20}} 
                        disabled={!state.autoOn} value={state.exRate} 
                        onChange={(e)=>set('exRate', e)} 
                    />
                </Col>
                <Col md={3}>
                    <br/>
                    <button className={state.autoOn?'btn-custom':'btn-custom-disabled'}
                        style={{fontSize:10}}
                        disabled={!state.autoOn}
                        onClick={()=>autoKnocking()}
                    >Set</button>
                </Col>
                {!state.autoOn &&
                <Col md={12}>
                <div style={{maxWidth:100}}>
                <span className='grey-txt'>Ex. Rate</span>
                    <InputNumber size='small'
                        min="0.00" stringMode 
                        style={{width:'100%', paddingRight:20}} 
                        value={state.manualExRate} 
                        onChange={(e)=>set('manualExRate', e)} 
                    />
                </div>
                </Col>
                }
                <Col md={3} className="mt-3">
                    <div className='grey-txt fs-14'>Tax Amount</div>
                    <InputNumber size='small'  value={state.taxAmount} disabled={state.isPerc?true:false} onChange={(e)=>set('taxAmount',e)} min="0.0" />
                </Col>
                <Col md={1} className="mt-3">
                    <div className='grey-txt mb-1 fs-14'>%</div>
                    <Checkbox size='small'  checked={state.isPerc} onChange={()=>set('isPerc',!state.isPerc)} />
                </Col>
                <Col md={3} className="mt-3">
                    <div className='grey-txt fs-14'>Tax %</div>
                    <InputNumber size='small'  value={state.taxPerc} disabled={!state.isPerc?true:false} onChange={(e)=>set('taxPerc',e)} min="0.0" />
                </Col>
                <Col className="mt-3" md={5}>
                    <span className="grey-txt fs-14">Tax Account #</span>
                    <span style={{marginLeft:6, position:'relative', bottom:2}} className='close-btn'>
                        <CloseCircleOutlined onClick={()=>{
                            set('taxAccountRecord', {});
                        }} />
                    </span>
                    <div className="custom-select-input-small" 
                        onClick={async()=>{
                            dispatch({type:'setAll', payload:{
                                visible:true,
                                accountsLoader:true
                            }})
                            let resutlVal = await getAccounts('Adjust', companyId);
                            dispatch({type:'setAll', payload:{
                                variable:'taxAccountRecord',
                                accounts:resutlVal,
                                accountsLoader:false
                            }})
                            // set('variable', 'taxAccountRecord');
                            // set('visible', true);
                            // let resutlVal = await getAccounts('Adjust', companyId);
                            // set('accounts', resutlVal);
                        }}
                    >{
                        Object.keys(state.taxAccountRecord).length==0?
                        <span style={{color:'silver'}}>Select Account</span>:
                        <span style={{color:'black'}}>{state.taxAccountRecord.title}</span>
                    }
                    </div>
                </Col>
                <Col md={4} className="mt-3">
                    <div className='grey-txt fs-14'>
                        {state.gainLossAmount==0.00 && <br/>}
                        {(state.gainLossAmount>0 && payType!="Recievable") && <span style={{color:'red'}}><b>Loss</b></span>}
                        {(state.gainLossAmount>0 && payType=="Recievable") && <span style={{color:'green'}}><b>Gain</b></span>}
                        {(state.gainLossAmount<0 && payType!="Recievable") && <span style={{color:'green'}}><b>Gain</b></span>}
                        {(state.gainLossAmount<0 && payType=="Recievable") && <span style={{color:'red'}}><b>Loss</b></span>}
                    </div>
                    <div className="custom-select-input-small" >{Math.abs(state.gainLossAmount)}</div>
                </Col>
                <Col className="mt-3" md={8}>
                    <span className="grey-txt fs-14">Gain / Loss Account</span>
                    <span style={{marginLeft:7, position:'relative', bottom:2}} className='close-btn'>
                        <CloseCircleOutlined onClick={()=>{
                            set('gainLossAccountRecord', {});
                        }} />
                    </span>
                    <div className="custom-select-input-small"
                        onClick={async()=>{
                            // set('variable', 'gainLossAccountRecord');
                            // set('visible', true);
                            // let resutlVal = await getAccounts('Adjust', companyId);
                            // set('accounts', resutlVal);
                            dispatch({type:'setAll', payload:{
                                accountsLoader:true,
                                visible:true
                            }})
                            let resutlVal = await getAccounts('Adjust', companyId);
                            dispatch({type:'setAll', payload:{
                                variable:'gainLossAccountRecord',
                                accounts:resutlVal,
                                accountsLoader:false
                            }})

                        }}
                    >{
                        Object.keys(state.gainLossAccountRecord).length==0?
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
        {(state.oldrecords.length>0 && state.oldBills) && <>
        Old Bills
        <div style={{minHeight:100, border:"1px solid silver"}} className='my-2 px-2'>
        <div className='table-sm-1 mt-2' style={{maxHeight:300, overflowY:'auto'}}>
        <Table className='tableFixHead' bordered>
            <thead>
                <tr className='fs-12'>
                <th>Sr.</th>
                <th>Job #</th>
                <th>Inv/Bill #</th>
                <th>HBL</th>
                <th>MBL</th>
                <th>Currency</th>
                <th>Ex. Rate</th>
                <th>{payType=="Recievable"? 'Inv':'Bill'} Bal</th>
                <th>{payType=="Recievable"? 'Receiving Amount':'Paying Amount'}</th>
                <th>Balance</th>
                <th>Select</th>
                <th>Container</th>
                </tr>
            </thead>
            <tbody>
            {state.oldrecords.map((x, index) => {
            return (
            <tr key={index} className='f fs-12'>
                <td style={{width:30}}>{index + 1}</td>
                <td style={{width:100}}>{x.SE_Job.jobNo}</td>
                <td style={{width:100}}>{x.invoice_No}</td>
                <td>HBL</td>
                <td>MBL</td>
                <td style={{width:100}}>{x.currency}</td>
                <td style={{width:100}}>{x?.Charge_Heads[0]?.ex_rate}</td>
                <td>{x.total}</td>
                <td style={{padding:3, width:150}}><InputNumber style={{height:30, width:140}} disabled /></td>
                <td>0.00</td>
                <td style={{ width:50}} className='px-3 py-2'><input type='checkbox' disabled /></td>
                <td></td>
            </tr>
            )
            })}
            </tbody>
        </Table>
        </div>
        </div>
        </>
        }
        {state.invoices.length==0 && <Empty  />}
        {state.invoices.length>0 &&
        <div>
        <div style={{minHeight:300}}>
        <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
        <Table className='tableFixHead' bordered>
            <thead>
                <tr className='fs-12'>
                <th>Sr.</th>
                <th>Job #</th>
                <th>Inv/Bill #</th>
                <th>HBL</th>
                <th>MBL</th>
                <th>Currency</th>
                <th>Ex. Rate</th>
                <th>{payType=="Recievable"? 'Inv':'Bill'} Bal</th>
                <th>{payType=="Recievable"? 'Receiving Amount':'Paying Amount'}</th>
                <th>Balance</th>
                <th>Select</th>
                <th>Container</th>
                </tr>
            </thead>
            <tbody>
            {state.invoices.map((x, index) => {
            return (
            <tr key={index} className='f fs-12'>
                <td style={{width:30}}>{index + 1}</td>
                <td style={{width:100}}>{x.SE_Job.jobNo}</td>
                <td style={{width:100}}>{x.invoice_No}</td>
                <td>HBL</td>
                <td>MBL</td>
                <td style={{width:100}}>{x.currency}</td>
                <td style={{width:100}}>{x.ex_rate}</td>
                <td>{x.inVbalance}</td>
                <td style={{padding:3, width:150}}>
                    <InputNumber style={{height:30, width:140, fontSize:12}} value={x.receiving} min="0.00" max={`${x.remBalance}`} stringMode  disabled={state.autoOn}
                        onChange={(e)=>{
                            let tempState = [...state.invoices];
                            tempState[index].receiving = e;
                            set('invoices', tempState);
                        }}
                    />
                </td>
                <td>
                {(x.remBalance - x.receiving).toFixed(2)}
                </td>
                <td style={{ width:50}} className='px-3 py-2'>
                    <input type='checkbox' style={{cursor:'pointer'}} checked={x.check} disabled={state.autoOn}
                        onChange={()=>{
                            // let tempState = [...state.invoices];
                            // tempState[index].check = !tempState[index].check;
                            // tempState[index].receiving = tempState[index].check?x.inVbalance:0.00
                            // set('invoices', tempState);
                            let tempState = [...state.invoices];
                            tempState[index].check = !tempState[index].check;
                            payType=="Recievable"?(tempState[index].receiving = tempState[index].check?(x.inVbalance-x.recieved):0.00):(tempState[index].receiving = tempState[index].check?(x.inVbalance-x.paid):0.00)
                            console.log(tempState)
                            set('invoices', tempState);
                        }}
                    />
                </td>
                <td></td>
            </tr>
            )
            })}
            </tbody>
        </Table>
        </div>
        </div>
            <div className=''>
                Total {payType} Amount:{" "}
                <div style={{padding:3, border:'1px solid silver', minWidth:100, display:'inline-block', textAlign:'right'}}>
                    {state.totalrecieving.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}
                </div>
            </div>
            <div className='text-end'>
                <button onClick={submitPrices} className='btn-custom'>Make Transaction</button>
            </div>
        </div>
        }
    </>
    }
    {state.load && <div className='text-center' ><Spinner /></div>}
    {state.glVisible && 
        <Gl state={state} 
            dispatch={dispatch} 
            selectedParty={selectedParty} 
            partytype={partytype} 
            payType={payType} 
            companyId={companyId}
            invoiceCurrency={invoiceCurrency}
        />
    }
    </>
  )
}

export default React.memo(AgentBillComp)