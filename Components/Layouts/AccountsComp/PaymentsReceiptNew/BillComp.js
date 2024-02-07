import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import openNotification from '../../../Shared/Notification';
import { Empty, InputNumber, Checkbox, Radio } from 'antd';
import { Spinner, Table, Col, Row } from 'react-bootstrap';
import { getNetInvoicesAmount } from '../../../../functions/amountCalculations';
import { recordsReducer, initialState, getAccounts, totalRecieveCalc, getInvoices } from './states';
import { useSelector } from 'react-redux';
import moment from "moment";
import { CloseCircleOutlined } from '@ant-design/icons';

import TransactionInfo from './TransactionInfo';
import Gl from './Gl';

const BillComp = ({partytype, selectedParty, payType, companyId, invoiceCurrency}) => {

    const [ state, dispatch ] = useReducer(recordsReducer, initialState);
    const set = (a, b) => dispatch({type:'set', var:a, pay:b});

    useEffect(() => { getInvoices(selectedParty.id, dispatch, partytype, selectedParty, payType, companyId); }, [selectedParty, payType]);
    useEffect(() => { if(state.invoices.length>0){set('totalrecieving', totalRecieveCalc(state.invoices))} }, [state.invoices]);
    useEffect(() => {
        if(state.isPerc){
            let tax = (state.totalrecieving/100)*state.taxPerc;
            set('finalTax', tax);
        }else{
            set('finalTax', state.taxAmount);
        }
    }, [state.totalrecieving, state.taxPerc, state.taxAmount]);

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
            console.log(state.auto)
            let tempAmount = (parseFloat(state.auto) * parseFloat(state.exRate)).toFixed(2);
            let pendingFund = 0;
            val.forEach((x) => {
                pendingFund = parseFloat((parseFloat(x.inVbalance) - parseFloat(x.receiving==null?0:x.receiving)).toFixed(2)) - parseFloat(x.recieved);

                if(pendingFund > tempAmount){
                    x.receiving = (parseFloat(x.receiving) + parseFloat(tempAmount)).toFixed(2);
                    tempAmount = 0.00;
                } else if (tempAmount==0.00){
                    null
                } else if (pendingFund < tempAmount){
                    x.receiving = pendingFund;
                    tempAmount = tempAmount - pendingFund
                }
                pendingFund = 0.00;
            })
            set('invoices', val);
        }
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
        // Create Account Transactions
        if((Object.keys(state.payAccountRecord).length!=0) && (state.totalrecieving!=0)){ // <- Checks if The Recieving Account is Selected
            if((Object.keys(state.taxAccountRecord).length!=0) && (state.finalTax!=0) && (state.finalTax!=null) && (state.totalrecieving!=0)){
                removing = state.finalTax;
                transTwo.push({
                    particular:state.taxAccountRecord,
                    tran:{
                        type:'debit', // state.taxAccountRecord.Parent_Account.Account[payType=="Recievable"?'inc':'dec'],
                        amount:state.finalTax,
                        defaultAmount:0,
                        narration:`Tax Paid Against ${invNarration}`
                    }
                })
            }
            if((Object.keys(state.bankChargesAccountRecord).length!=0) && (state.bankCharges!=0) && (state.bankCharges!=null) && (state.totalrecieving!=0)){
                removing = removing + state.bankCharges;
                transTwo.push({
                    particular:state.bankChargesAccountRecord,
                    tran:{
                        type:'debit', // state.bankChargesAccountRecord.Parent_Account.Account[payType=="Recievable"?'inc':'dec'],
                        amount:state.bankCharges,
                        defaultAmount:0,
                        narration:`Bank Charges Paid Against ${invNarration}`
                    }
                })
            }
            transTwo.push({
                particular:state.partyAccountRecord,
                tran:{
                    // type:state.partyAccountRecord.Parent_Account.Account[payType=="Recievable"?'dec':'inc'],
                    type:payType=="Recievable"?'credit':'debit',
                    amount:state.totalrecieving,
                    defaultAmount:0,
                    narration:`${payType=="Payble"?"Paid":"Received"} Against ${invNarration}`
                }
            })
            transTwo.push({
                particular:state.payAccountRecord,  
                tran:{ 
                    type:state.payAccountRecord.Parent_Account.Account[payType=="Recievable"?'inc':'dec'], // <-Checks the account type to make Debit or Credit
                    amount:payType=="Recievable"? state.totalrecieving-removing: state.totalrecieving+removing,
                    defaultAmount:0,
                    narration:`${payType=="Payble"?"Paid":"Received"} Against ${invNarration}`
                }
            })
        }
        dispatch({type:'setAll', payload:{
            glVisible:true,
            removing:removing,
            transactionCreation:transTwo
        }});
        // set('removing', removing);
        // set('transactionCreation', transTwo);
        // set('glVisible', true);
    }

  return (
    <>
    <div>
        <Row>
            <Col md={7}>
            <TransactionInfo state={state} dispatch={dispatch} payType={payType} companyId={companyId} />
            </Col>
            <Col md={5}>
            <div className="mb-2" style={{cursor:'pointer', borderBottom:'1px solid silver', paddingBottom:2}}
                onClick={async()=>{
                    let tempReset = await resetAll();
                    dispatch({type:'setAll', payload:{
                        autoOn:!state.autoOn,
                        invoices:tempReset,
                        exRate:'1',
                        auto:'0',
                    }})
                    // set('autoOn', !state.autoOn);
                    // set('invoices', resetAll());
                    // set('auto', '0');
                    // set('exRate', '1');
                }}
            >
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
                        min="1.00" stringMode 
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
                        onClick={autoKnocking}
                    >Set</button>
                </Col>
                <Col md={3} className="mt-3">
                    <div className='grey-txt fs-14'>Tax Amount</div>
                    <InputNumber size='small'  value={state.taxAmount} disabled={state.isPerc?true:false} onChange={(e)=>set('taxAmount',e)} min="0.0" max="100.00" />
                </Col>
                <Col md={1} className="mt-3">
                    <div className='grey-txt mb-1 fs-14'>%</div>
                    <Checkbox size='small'  checked={state.isPerc} 
                        onChange={()=>{
                            dispatch({type:'setAll', payload:{
                                taxAmount:0.0,
                                taxPerc:0.0,
                                isPerc:!state.isPerc
                            }})
                            // set('taxAmount',0.0);
                            // set('taxPerc',0.0);
                            // set('isPerc',!state.isPerc);
                        }} 
                    />
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
                                accountsLoader:true,
                                visible:true,
                            }})
                            let resutlVal = await getAccounts('Taxes', companyId);
                            dispatch({type:'setAll', payload:{
                                variable:'taxAccountRecord',
                                accounts:resutlVal,
                                accountsLoader:false
                            }})
                        }}
                    >{
                        Object.keys(state.taxAccountRecord).length==0?
                        <span style={{color:'silver'}}>Select Account</span>:
                        <span style={{color:'black'}}>{state.taxAccountRecord.title}</span>
                    }
                    </div>
                </Col>
            </Row>
            </Col>
        </Row>
    </div>
    {!state.load && 
    <>
        {state.invoices.length==0 && <Empty/>}
        {state.invoices.length>0 &&
        <div>
        <div style={{minHeight:250}}>
        <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
        <Table className='tableFixHead' bordered>
        <thead>
            <tr className='fs-12'>
            <th>Sr.</th>
            <th>Job #</th>
            <th>Inv/Bill #</th>
            <th>HBL</th>
            <th>MBL</th>
            <th>Type</th>
            <th>Currency</th>
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
            <td style={{width:100}} className="text-center">{x.jobId}</td>
            <td style={{width:100}}>{x.invoice_No}</td>
            <td>HBL</td>
            <td>MBL</td>
            <td style={{width:50}}>{x.jobSubType}</td>
            <td style={{width:100}}>PKR</td>
            <td>{x.inVbalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}</td>
            <td style={{padding:3, width:150}}>
                {/* receiving variable works for both paying and recieving amounts */}
                <InputNumber style={{height:30, width:140}} value={x.receiving} min="0" max={`${x.remBalance + parseFloat(x.roundOff)}`} stringMode disabled={state.autoOn}
                    onChange={(e)=>{
                        let tempState = [...state.invoices];
                        tempState[index].receiving = e;
                        set('invoices', tempState);
                    }
                }/>
            </td>
            <td>{(x.remBalance - x.receiving + parseFloat(x.roundOff)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,", ")}
            {/* {payType=="Recievable"?
            (parseFloat(x.inVbalance)-parseFloat(x.recieved==null?0:x.recieved)-parseFloat(x.receiving==null?0:x.receiving)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,", "):
            (parseFloat(x.inVbalance)-parseFloat(x.paid==null?0:x.paid)-parseFloat(x.receiving==null?0:x.receiving)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,", ")
            } */}
            </td>
            <td style={{ width:50}} className='px-3 py-2'>
                <input type='checkbox' style={{cursor:'pointer'}} checked={x.check} disabled={state.autoOn}
                    onChange={()=>{
                        let tempState = [...state.invoices];
                        tempState[index].check = !tempState[index].check;
                        payType=="Recievable"?(tempState[index].receiving = tempState[index].check?(x.inVbalance-x.recieved):0.00):(tempState[index].receiving = tempState[index].check?(x.inVbalance-x.paid):0.00)
                        set('invoices', tempState);
                    }}
                />
            </td>
            <td></td>
        </tr>
        )})}
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
        <Gl
            invoiceCurrency={invoiceCurrency}
            selectedParty={selectedParty}
            partytype={partytype}
            companyId={companyId}
            dispatch={dispatch}
            payType={payType}
            state={state}
        />
    }
    </>
  )
}

export default React.memo(BillComp)