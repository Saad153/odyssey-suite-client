import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import moment from "moment";
import axios from 'axios';
import openNotification from '../Shared/Notification';
import FullScreenLoader from './FullScreenLoader';
import InvoicePrint from './InvoicePrint';
import { Checkbox, Popover, Input, Radio, Select } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import CLPrint from './CLPrint';
import { useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';
const { TextArea } = Input;

const InvoiceCharges = ({data, companyId}) => {

  const commas = (a) => parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");

  let inputRef = useRef(null);
  const dispatchNew = useDispatch();

  const queryClient = useQueryClient();
  const [bank, setBank] = useState(1);
  const [invoiceData, setInvoiceData] = useState(false);
  const [records, setRecords] = useState([]);
  const [invoice, setInvoice] = useState({
    Charge_Heads:[],
    SE_Job:{
        Client:{},
        shipper:{},
        consignee:{},
        sales_representator:{},
        shipping_line:{},
        pol:'',
        pod:'',
        fd:'',
        SE_Equipments:[]
    },
    note:''
  });
  const [load, setLoad] = useState(false);
  const [ref, setRef] = useState(false);
  const [logo, setLogo] = useState(false);
  const [compLogo, setCompLogo] = useState("1");
  const [balance, setBalance] = useState(false);

  let bankDetails = {
    one:`
    Bank Name: Soneri Bank Ltd \n
    Bank Branch: Shahrah-e-Faisal Br 0031 Karachi \n
    A/c Title: AIR CARGO SERVICES \n
    A/c #: 20001766466 \n
    Swift Code: SONEPKKAKAR \n
    IBAN: PK02SONE0003120001766466`,
    two:`
    IBAN: PK91SONE0003120001534198 \n
    TITLE: SEA NET SHIPPING & LOGISTICS \n
    BANK: SONERI BANK LIMITED  \n
    A/c #: 20001534198 \n
    BRANCH: SHAHRAH-E-FAISAL BRANCH 0031, KARACHI \n
    SWIFT: SONEPKKAXXX`,
    three:`
    IBAN: PK08 BAHL 1054 0081 0028 1201 \n
    A/c #: 1054-0081-002182-01-5 \n
    TITLE: SEA NET SHIPPING & LOGISTICS \n
    BANK: BANK AL HABIB LIMITED \n
    BRANCH: TARIQ ROAD 1054, KARACHI \n
    SWIFT: BAHLPKKAXXX`,
    four:`
    IBAN: PK73 BAHL 1054 0081 0044 1101 \n
    A/c #: 1054-0081-004411-01-7 \n
    TITLE: AIR CARGO SERVICES \n    
    BANK: BANK AL HABIB LIMITED \n
    BRANCH: TARIQ ROAD 1054, KARACHI \n
    SWIFT: BAHLPKKAXXX`,
  };

  useEffect(()=>{
    if(Object.keys(data).length>0){
      setInvoice(data.resultOne);
      setRecords(data.resultOne?.Charge_Heads);
      setInvoiceData(!invoiceData)
    }
  }, [data])

  const calculateTotal = (data) => {
    let result = 0;
    data?.forEach((x)=>{
      result = result + parseFloat(x.local_amount)
    });
    return result.toFixed(2);
  };
  const getCurrencyInfoAdvanced = (id, heads) => {
    let tempHeads = heads.filter((x)=> x.InvoiceId==id)
    return tempHeads[0].ex_rate;
  };
  const roundOff = async() => {
    let tempInv = {...invoice};
    let before = parseFloat(calculateTotal(records));
    let after = parseFloat(parseInt(before));
    let remaining = before - after;
    if(remaining>0){
        if(invoice?.roundOff=="0"){
            if(remaining<=0.5 && remaining>0){
                tempInv.roundOff = `-${(remaining).toFixed(2)}`;
            }else{
                tempInv.roundOff = `+${(1-remaining).toFixed(2)}`;
            }
        }else{
            tempInv.roundOff = "0"
        }
        await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_ROUNDOFF_INVOICE, {
            id:tempInv.id,
            total:tempInv.total,
            roundOff:tempInv.roundOff,
            approved:tempInv.approved
        }).then((x)=>{
            if(x.data.status=="success"){
                openNotification("Success", "Invoice Successfully Rounded Off!", "green");
                setInvoice(tempInv);
            }else{
                openNotification("Ops", "An Error Occured!", "red");
            }
        })
    }
  };
  const approvingRoundOff = async(tempIvoice) => {
    let tempInv = {...tempIvoice};
    let before = parseFloat(calculateTotal(records));
    let after = parseFloat(parseInt(before));
    let remaining = before - after;
    if(remaining>0){
      if(tempIvoice?.roundOff=="0"){
        if(remaining<=0.5 && remaining>0){
          tempInv.roundOff = `-${(remaining).toFixed(2)}`;
        } else {
          tempInv.roundOff = `+${(1-remaining).toFixed(2)}`;
        }
      } else {
        tempInv.roundOff = "0"
      }
      axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_ROUNDOFF_INVOICE, {
        id:tempInv.id,
        total:tempInv.total,
        roundOff:tempInv.roundOff,
        approved:tempInv.approved
      })
    }
    return tempInv
  };
  const approve = async() => {
    let exp = {}, income = {}, party = {}; //exp is the Expense Account, income is Income Account, party is Party's account to create vouhcer with Ledger
    setLoad(true);
    let tempInv = {};
    if(invoice?.type!="Agent Invoice" && invoice?.type!="Agent Bill" && invoice?.approved!="1" && invoice?.roundOff=="0"){
      tempInv = await approvingRoundOff(invoice);
    } else {
      tempInv = {...invoice}
    }
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_SE_JOB_CHILDS,{
      headers:{ title:JSON.stringify(["FCL FREIGHT INCOME", "FCL FREIGHT EXPENSE"]), companyid:companyId }
    }).then((x)=>{
      if(x.data.status=="success"){
        x.data.result.forEach((y)=>{
          if(y.title.endsWith("INCOME")){ 
            income = y
          } else { 
            exp = y
          }
        })
      }
    });
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNTS_FOR_APPROVAL,{
      headers:{
        title:tempInv.payType=="Recievable"?"ACCOUNT RECEIVABLE":"ACCOUNT PAYABLE", 
        companyid:companyId,
        clientid:tempInv.party_Id,
        partytype:tempInv.partyType
      }
    }).then((x)=>{
      party = x.data.result
    });
    if(tempInv.approved=="0"){ tempInv.approved="1" } else { tempInv.approved="0" }
    let vouchers = {};
    let amount = calculateTotal(tempInv.Charge_Heads);
    tempInv.total = amount;
    vouchers = {
      type:tempInv.payType=="Recievable"?"Job Recievable":"Job Payble",
      vType:tempInv.payType=="Recievable"?"SI":"PI",
      CompanyId:companyId,
      amount:"",
      currency:tempInv.type=="Job Bill"?"PKR":tempInv.type=="Job Invoice"?"PKR":tempInv.currency,
      exRate:tempInv.type=="Job Bill"?"1":tempInv.type=="Job Invoice"?"1":getCurrencyInfoAdvanced(tempInv.id, tempInv.Charge_Heads),
      chequeNo:"",
      payTo:"",
      costCenter:"KHI",
      invoice_Voucher:"1",
      invoice_Id:tempInv.id,
      Voucher_Heads:[]
    }
    let tempRoundOff = parseFloat(tempInv.roundOff);
    let narration = `${tempInv.payType} Against Invoice ${invoice?.invoice_No} For Job# ${invoice?.SE_Job.jobNo} From ${invoice?.party_Name}`
    if(tempRoundOff==0){
      vouchers.Voucher_Heads.push({
        amount:parseFloat(amount),
        type:tempInv.payType=="Recievable"?"debit":"credit",
        narration:narration,
        VoucherId:null,
        ChildAccountId:party.id
      })
      vouchers.Voucher_Heads.push({
        amount:parseFloat(amount), //+ parseFloat(tempInv.roundOff),
        type:tempInv.payType=="Recievable"?"credit":"debit",
        narration:narration,
        VoucherId:null,
        ChildAccountId:tempInv.payType=="Recievable"?income.id:exp.id //income.id
      })
    } else if(tempRoundOff >0  && tempInv.payType=="Recievable"){
      vouchers.Voucher_Heads.push({
        amount:parseFloat(amount) + parseFloat(tempRoundOff),
        type:tempInv.payType=="Recievable"?"debit":"credit",
        narration:narration,
        VoucherId:null,
        ChildAccountId:party.id
      })
      vouchers.Voucher_Heads.push({
        amount:parseFloat(amount) + parseFloat(tempRoundOff),
        type:"credit",
        narration:narration,
        VoucherId:null,
        ChildAccountId:income.id
      })
    } else if(tempRoundOff <0  && tempInv.payType=="Recievable"){
      vouchers.Voucher_Heads.push({
        amount:parseFloat(amount) - parseFloat(tempRoundOff)*-1,
        type:tempInv.payType=="Recievable"?"debit":"credit",
        narration:narration,
        VoucherId:null,
        ChildAccountId:party.id
      })
      vouchers.Voucher_Heads.push({
        amount:parseFloat(amount),
        type:"credit",
        narration:narration,
        VoucherId:null,
        ChildAccountId:income.id
      })
      vouchers.Voucher_Heads.push({
        amount:parseFloat(tempRoundOff)*-1,
        type:tempInv.payType=="Recievable"?"debit":"credit",
        narration:narration,
        VoucherId:null,
        ChildAccountId:exp.id
      })
    } else if(tempRoundOff >0  && tempInv.payType!="Recievable"){
      vouchers.Voucher_Heads.push({
        amount:parseFloat(amount)+ parseFloat(tempRoundOff),
        type:"credit",
        narration:narration,
        VoucherId:null,
        ChildAccountId:party.id
      })
      vouchers.Voucher_Heads.push({
        amount:parseFloat(amount) + parseFloat(tempRoundOff),
        type:"debit",
        narration:narration,
        VoucherId:null,
        ChildAccountId:exp.id
      })
    } else if(tempRoundOff <0  && tempInv.payType!="Recievable"){
      vouchers.Voucher_Heads.push({
        amount:(parseFloat(amount) - parseFloat(tempRoundOff)*-1).toFixed(2),
        type:"credit",
        narration:narration,
        VoucherId:null,
        ChildAccountId:party.id
      })
      vouchers.Voucher_Heads.push({
        amount:(parseFloat(amount)).toFixed(2),
        type:"debit",
        narration:narration,
        VoucherId:null,
        ChildAccountId:exp.id
      })
      vouchers.Voucher_Heads.push({
        amount:(parseFloat(tempRoundOff)*-1).toFixed(2),
        type:"credit",
        narration:narration,
        VoucherId:null,
        ChildAccountId:income.id
      })
    }
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_INVOICE_APPROVE_DISAPPROVE,{
        id:tempInv.id,
        total:tempInv.total,
        roundOff:tempInv.roundOff,
        approved:tempInv.approved,
        exRate:vouchers.exRate
    }).then(async(x)=>{
        if(x.data.status=="success"){
            openNotification("Success", "Invoice Successfully Approved!", "green")
            if(tempInv.approved=="1"){
                await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER, vouchers);
            }else{
                //console.log("Here")
                await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_DELETE_VOUCHER, {id:tempInv.id})
                //.then((x)=>console.log(x.data))
            }
        }else{
            openNotification("Ops", "An Error Occured!", "red")
        }
    });
    await queryClient.removeQueries({ queryKey: ['charges'] })
    setInvoice(tempInv);
    setLoad(false);
  };
  const checkApprovability = (x) => {
    let result = false;
    if(x?.payType=="Recievable" && x?.recieved=="0"){
        result = false;
    }else if(x?.payType=="Recievable" && x?.recieved!="0"){
        result = true;
    }else if(x?.payType!="Recievable" && x?.paid=="0"){
        result = false;
    }else if(x?.payType!="Recievable" && x?.paid!="0"){
        result = true;
    }
    return result
  };
  const PrintOptions = (
    <div>
      <Checkbox onChange={()=>setRef(!ref)} checked={ref} className='mb-2'>Hide Ref & Sales Rep</Checkbox><br/>
      <Checkbox onChange={()=>setLogo(!logo)} checked={logo} className='mb-2'>Hide Logo</Checkbox><br/>
      <Checkbox onChange={()=>setBalance(!balance)} checked={balance} className='mb-2'>Hide Balance</Checkbox><br/>
      Logo: {" "}
      <Radio.Group optionType="button" buttonStyle="solid" value={compLogo}
        options={[{ label: 'SNS', value: '1' }, { label: 'ACS', value: '2' }]}
        onChange={(e)=>setCompLogo(e.target.value)}
      />
      <br/>
      <div className='mt-3'></div>
      <ReactToPrint content={()=>inputRef} trigger={()=><div className='div-btn-custom text-center p-2'>Go</div>} />
    </div>
  );
  const updateNote = async() => {
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_INVOICE_NOTE_UPDATE,{
      id:invoice.id, note:invoice.note, currency:invoice.currency
    }).then((x)=>{
      if(x.data.status=="success"){
        openNotification("Success", "Note Saved!", "green")
      }
    })
  };
  const routeToPayRec = () => {
    dispatchNew(incrementTab({
      "label": "Payment / Receipt",
      "key": "3-4",
      "id":`new?name=${data.resultOne.party_Name}&partyid=${data.resultOne.party_Id}&type=${data.resultOne.partyType}&paytype=${data.resultOne.payType}&currency=${data.resultOne.currency}`
    }))
    Router.push({
      pathname:"/accounts/paymentReceipt/new", 
      query:{
        name:data.resultOne.party_Name,
        partyid:data.resultOne.party_Id,
        type:data.resultOne.partyType,
        paytype:data.resultOne.payType,
        currency:data.resultOne.currency,
      }}, 
      undefined,
      {shallow:true}
    );
  };

return (
  <>
    {load && <FullScreenLoader/>}
    <div className='invoice-styles '>
    {Object.keys(data).length>0 &&
    <div className='fs-12' 
        style={{maxHeight:660, overflowY:'auto', overflowX:'hidden'}}
    >
    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
      <Popover content={PrintOptions} placement="bottom" title="Printing Options">
        <div className='div-btn-custom text-center py-2 px-3'>
          <b>Print Invoice</b>
        </div>
      </Popover>
      <div className='div-btn-custom text-center py-2 px-3' onClick={routeToPayRec}> 
        <b>Go to Payment/Receipt</b>
      </div>
    </div>
    <Row className='py-3'>
      <Col md={3} className="mb-3">
        <div>
          <span className='inv-label'>Invoice No#:</span>
          <span className='inv-value'>{" "}{invoice?.invoice_No}</span>
        </div>
      </Col>
      <Col md={3} className="mb-3">
        <div>
          <span className='inv-label'>Party Name:</span>
          <span className='inv-value'>{" "}{invoice?.party_Name}</span>
        </div>
      </Col>
      <Col md={3} className="mb-3">
        <div>
          <span className='inv-label'>Pay Type:</span>
          <span className='inv-value'>{" "}{invoice?.payType}</span>
        </div>
      </Col>
      <Col md={3} className="mb-3">
        <span className='inv-label'>Currency:</span>
        {" "}
        {/* <span className='inv-value'>{" "}{invoice.currency}</span> */}
        <Select
          size='small'
            value={invoice?.currency} onChange={(e)=>setInvoice({...invoice, currency:e})}
            style={{ width: 80 }}
            options={[
              {value: 'PKR', label: 'PKR'},
              {value: 'USD', label: 'USD'},
              {value: 'EUR', label: 'EUR'},
              {value: 'CHF', label: 'CHF'},
              {value: 'GBP', label: 'GBP'},
              {value: 'OMR', label: 'OMR'},
              { value:"AED", label:"AED"},
              { value:"BDT", label:"BDT"},  

          ]}
        />
      </Col>
      <Col md={3} className="mb-3">
        <span className='inv-label'>Invoice/Bill:</span>
        <span className='inv-value'>{" "}{invoice?.type}</span>
      </Col>
      <Col md={3} className="mb-3">
        <span className='inv-label'>Created:</span>
        <span className='inv-value'>{" "}{ moment(invoice?.createdAt).format("DD / MMM / YY")}</span>
      </Col>
      <Col md={3} className="mb-3">
        <span className='inv-label'>Round Off:</span>
        <span className='inv-value mx-2'>
          <input className='cur' type={"checkbox"}
            disabled={invoice?.type=="Agent Invoice"?true:invoice?.type=="Agent Bill"?true:invoice?.approved=="1"?true:false} 
            checked={invoice?.roundOff!="0"} 
            onChange={roundOff} 
          />
        </span>
      </Col>
      <Col md={3} className="mb-3">
        <span className='inv-label'>Approved:</span>
        <span className='inv-value mx-2'>
          <input className='cur' type={"checkbox"} checked={invoice?.approved!="0"} 
            disabled={checkApprovability(invoice)}
            onChange={approve}
          />
        </span>
      </Col>
    </Row>
    <div style={{minHeight:250}}>
      <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto', fontSize:11}}>
      <Table className='tableFixHead' bordered>
        <thead>
          <tr className='table-heading-center'>
            <th></th>
            <th>Charge</th>
            <th>Particular</th>
            <th>Basis</th>
            <th>PP/CC</th>
            <th>Size</th>
            <th style={{minWidth:60}}>DG</th>
            <th>Qty</th>
            <th>Currency</th>
            <th>Amount</th>
            <th>Disc</th>
            <th>Tax</th>
            <th>Tax</th>
            <th>Net</th>
            <th>Ex.</th>
            <th>Total</th>  
          </tr>
        </thead>
        <tbody style={{fontSize:11}}>
          {records?.length>0 &&
          <>
            {records?.map((x, index) => {
            return (
            <tr key={index} className='f table-row-center-singleLine' style={{lineHeight:0.5}}>
              <td>{index + 1}</td>
              <td>{x.charge}</td>
              <td>{x.particular}</td>
              <td>{x.basis.slice(0, 8)}</td>
              <td>{x.pp_cc}</td>
              <td>{x.size_type}</td>
              <td>{x.dg_type}</td>
              <td>{x.qty}</td>
              <td>{x.currency}</td>
              <td>{x.amount}</td>
              <td>{x.discount}</td>
              <td>{x.tax_apply}</td>
              <td>{x.tax_amount}</td>
              <td>{x.net_amount}</td>
              <td>{x.currency=="PKR"?"1.00":x.ex_rate}</td>
              <td>{x.local_amount}</td>
            </tr>
            )})}
            </>
            }
            {invoice!=null && <>
              {invoice?.roundOff!="0" &&
              <tr style={{lineHeight:0.5}}>
                <td>{records.length+1}</td>
                <td>ROFC</td>
                <td>Round Off</td>
                <td> - </td>
                <td> - </td>
                <td> - </td>
                <td> - </td>
                <td>1</td>
                <td>PKR</td>
                <td>{invoice?.roundOff?.slice(1)}</td>
                <td> 0 </td>
                <td style={{textAlign:'center'}}>No</td>
                <td>0.00</td>
                <td>{invoice?.roundOff?.slice(1)}</td>
                <td>1.00</td>
                <td>{invoice?.roundOff}</td>
              </tr>
              }
            </>
            }
        </tbody>
      </Table>
      </div>
    </div>
    <Row>
      <Col className='mx-2 pt-3' md={4}>
          <h5>Note</h5>
          <div style={{border:"1px solid silver"}}>
            <TextArea rows={4} value={invoice?.note} onChange={(e)=>setInvoice({...invoice, note:e.target.value})} />
          </div>
          <button className='btn-custom mt-3' onClick={updateNote} type='button'>Save</button>
      </Col>
      <Col md={4} className='mt-4'>
          <b>Bank Details</b>
          <div style={{border:"1px solid silver"}}>
            <div style={{fontSize:12, lineHeight:0.8, whiteSpace:'pre-wrap', paddingBottom:10}}>
              {bank==1?bankDetails.one:bank==2?bankDetails.two:bank==3?bankDetails.three:bankDetails.four}
            </div>
          </div>
      </Col>
      <Col className='mt-5 p-0' md={2}>
          <Radio.Group onChange={(e)=>setBank(e.target.value)} value={bank}>
            <Radio value={1}>BANK-A {"(ACS)"}</Radio>
            <Radio value={4}>BANK-B {"(ACS)"}</Radio>
            <Radio value={2}>BANK-C {"(SNS)"}</Radio>
            <Radio value={3}>BANK-D {"(SNS)"}</Radio>
          </Radio.Group>
      </Col>
    </Row>
    <hr className='mb-1' />
    <div>
      <Row>
        <Col md={6}>
          {invoice?.currency!="PKR" && 
          <>
            <span className='inv-label mx-2'>Total Amount {`(${invoice?.currency})`}: </span>
            <span className='inv-value charges-box'> 
              {" "}
              {commas((parseFloat(invoice?.total)/parseFloat(invoice?.ex_rate)).toFixed(2))}
            </span>
            <span className='mx-4'></span>
          </>
          }
          <span className='inv-label mx-2'>Total Amount {"(Local)"}:</span>
          <span className='inv-value charges-box'> 
            {" "}
            {commas((parseFloat(invoice?.total) + parseFloat(invoice?.roundOff)).toFixed(2))}
          </span>
        </Col>
      </Row>
    </div>
    </div>
    }
    {/* Printing Component */}
    <div 
      style={{
        display:"none"
      }}
    >
      <div ref={(response)=>(inputRef=response)}>
        {invoice && companyId !== "2" ?
          <InvoicePrint 
            logo={logo} 
            compLogo={compLogo} 
            records={records} 
            bank={bank} 
            bankDetails={bankDetails} 
            invoice={invoice} 
            calculateTotal={calculateTotal} 
          /> 
        :
        <CLPrint records={records} invoice={invoice} />
        }
      </div>
    </div>
    </div>
  </>
)}

export default React.memo(InvoiceCharges)