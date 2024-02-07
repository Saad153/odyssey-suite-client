import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CSVReader from 'react-csv-reader';
import moment from 'moment';
import { delay } from "/functions/delay"

const AgentInvoice = () => {

    // for receivable invoices only
    const [finalList, setFinalList] = useState([])
    const [failedList, setFailedList] = useState([])
    const [invoiceIndex, setInvoiceIndex] = useState(0)

    // for payble invoices only
    const [finalListPay, setFinalListPay] = useState([])
    const [failedListPay, setFailedListPay] = useState([])
    const [invoiceIndexPay, setInvoiceIndexPay] = useState(0)

  const parserOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
  }

  const handleOpeningInvoicesReceivable = async(data) => {
    let list = [];
    console.log(data)
    await data.forEach(async(x, i) => {
        let title = x.agent_name;
        if(x.local_amount!=null){

            let receivable = `${x.local_amount}`?.replaceAll(',', '');
            receivable = parseFloat(receivable[0]=="("?`-${receivable.slice(1, -1)}`:receivable);

            let received = `${x.rcvd___paid}`?.replaceAll(',', '');
            received = parseFloat(received[0]=="("?`-${received.slice(1, -1)}`:received);

            await list.push({
                party_Name:title, 
                currency:x.currency, 
                operation:x.operationcode,
                ex_rate:x.exchange_rate,
                type:"Agent Bill",
                payType:"Recievable",
                status:received>0?'3':'1',
                oldInvoiceNo:`${x.invoice_no}`,
                paid:0,
                roundOff:0,
                approved:1,
                total:receivable,
                createdAt:`${moment(x.invoice_date).format("YYYY-MM-DD")}`,
                receivable: receivable,
                received: received,//*x.exchange_rate,
                balance: (receivable) - received
            })
        }

    });
    console.log(list)
    let tempreceivable = 0;
    let tempreceived = 0;
    let tempbalance = 0;
    list.forEach((x)=>{
        tempreceivable = tempreceivable + x.receivable
        tempreceived = tempreceived + x.received
        tempbalance = tempbalance + x.balance
    })
    console.log("receivable", tempreceivable);
    console.log("received",tempreceived);
    console.log("balance",tempbalance);
  }
  const uploadRecivableInvoices = async() => {
    let finalInvoiceList = [];
    let failedList = [];
    let index = 0
    recivableInvoices.forEach(async(x, i)=>{
        await delay(3000)
        axios.post("http://localhost:8081/invoice/uploadbulkInvoicesTest",x)
        .then((y)=>{
            setInvoiceIndex(i)
            if(y.data.status=="success"){
                console.log(y.data.result)
                if(y.data.result){
                    finalInvoiceList.push(y.data.result)
                    setFinalList((z)=>[...z, {...x, party_Id:y.data.result}])
                }
            } else {
                failedList.push(x)
                setFailedList((z)=>[...z, x])
            }
        })
        
    })
  }

  const handleOpeningInvoicesPayble = async(data) => {
    let list = [];
    await data.forEach(async(x, i) => {
        let title = x.agent_name;
        if(x.local_amount!=null){

            let payble = `${x.local_amount}`?.replaceAll(',', '');
            payble = Math.abs(parseFloat(payble[0]=="("?`-${payble.slice(1, -1)}`:payble));

            let paid = `${x.rcvd___paid}`?.replaceAll(',', '');
            paid = Math.abs(parseFloat(paid[0]=="("?`-${paid.slice(1, -1)}`:paid));

            let invNo = `${x.invoice_no!=null?x.invoice_no:''}${x.inv_no!=null?x.inv_no:''}${x.bill_no!=null?x.bill_no:''}`;
            let newInvNo = "";
    
            if(invNo.indexOf("SNS")==0){
              newInvNo = invNo.slice(0, 4)+"O"+invNo.slice(4);
            } else if(invNo.indexOf("ACS")==0){
                newInvNo = invNo.slice(0, 4)+"O"+invNo.slice(4);
            } else {
                newInvNo = invNo;
            }
            console.log(newInvNo);

            await list.push({
                party_Name:title, 
                currency:x.currency, 
                operation:x.operationcode,
                ex_rate:x.exchange_rate,
                type:"Old Agent Invoice",
                payType:"Payble",
                status:paid>0?'3':'1',
                // oldInvoiceNo:`${x.invoice_no}`,
                invoice_No:newInvNo,
                received: 0,
                roundOff:0,
                approved:1,
                total:payble,
                createdAt:`${moment(x.invoice_date).format("YYYY-MM-DD")}`,
                paid:paid,
                payble: payble/x.exchange_rate,
                balance: (payble/x.exchange_rate) - paid
            })
        }

    });
    console.log(list)
    let tempreceivable = 0;
    let tempreceived = 0;
    let tempbalance = 0;
    list.forEach((x)=>{
        tempreceivable = tempreceivable + x.payble
        tempreceived = tempreceived + x.paid
        tempbalance = tempbalance + x.balance
    })
    console.log("payble", tempreceivable);
    console.log("paid",tempreceived);
    console.log("balance",tempbalance);
  }
  const uploadPaybleInvoices = async() => {
    let finalInvoiceList = [];
    let failedList = [];
    let index = 0;
    paybleList.forEach(async(x, i)=>{
        await delay(3000)
        axios.post("http://localhost:8081/invoice/uploadbulkInvoicesTest",x)
        .then((y)=>{
            setInvoiceIndexPay(i);
            if(y.data.status=="success"){
                console.log(y.data.result);
                if(y.data.result){
                    finalInvoiceList.push(y.data.result)
                    setFinalListPay((z)=>[...z, {...x, party_Id:y.data.result}])
                } else {
                    failedList.push(x)
                    setFailedListPay((z)=>[...z, x])
                }
            } else {
                failedList.push(x)
                setFailedListPay((z)=>[...z, x])
            }
        })
        
    })
  }

  useEffect(() => {
    if(invoiceIndex+1==recivableInvoices.length){
        console.log(finalList)
        console.log(failedList)
    }
  }, [finalList, failedList])

  useEffect(() => {
    if(invoiceIndexPay+1==paybleList.length){
        console.log(finalListPay)
        console.log(failedListPay)
    }
  }, [finalListPay, failedListPay])

  return (
  <>
  <h6>Agents</h6>
  <hr/>
    <div className='mt-4'><b>Make Receivable Opening Invoices</b></div>
    <CSVReader 
      cssClass="csv-reader-input" 
      onFileLoaded={handleOpeningInvoicesReceivable} 
      parserOptions={parserOptions} 
      disabled={false} 
      inputId="ObiWan" 
      inputName="ObiWan"
    />
    <button onClick={uploadRecivableInvoices} className='btn-custom mt-3'>Upload</button>
    <hr/>
    <div className='mt-4'><b>Make Payble Opening Invoices</b></div>
    <CSVReader 
      cssClass="csv-reader-input" 
      onFileLoaded={handleOpeningInvoicesPayble} 
      parserOptions={parserOptions} 
      disabled={false} 
      inputId="ObiWan" 
      inputName="ObiWan"
    />
    <button onClick={uploadPaybleInvoices} className='btn-custom mt-3'>Upload</button>
  </>
  )
}

export default AgentInvoice


let recivableInvoices = []

let paybleList = []