import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CSVReader from 'react-csv-reader';
import moment from 'moment';
import { delay } from "/functions/delay"

const Uploader = () => {

    // for receivable invoices only
    const [finalList, setFinalList] = useState([]);
    const [failedList, setFailedList] = useState([]);
    const [invoiceIndex, setInvoiceIndex] = useState(0);

    // for payble invoices only
    const [finalListPay, setFinalListPay] = useState([]);
    const [failedListPay, setFailedListPay] = useState([]);
    const [invoiceIndexPay, setInvoiceIndexPay] = useState(0);

    const parserOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
    }

    const handleOpeningInvoicesReceivable = async(data) => {
        let list = [];
        await data.forEach(async(x, i) => {
            let title = x.client? x.client.slice(0, x.client.lastIndexOf("(")-1):'';
            if(x.receivable!=null){

                let receivable = `${x.receivable}`?.replaceAll(',', '');
                receivable = parseFloat(receivable[0]=="("?`-${receivable.slice(1, -1)}`:receivable);

                let received = `${x.received}`?.replaceAll(',', '');
                received = parseFloat(received[0]=="("?`-${received.slice(1, -1)}`:received);

                let adjust = `${x.adjust}`?.replaceAll(',', '');
                adjust = parseFloat(adjust[0]=="("?`-${adjust.slice(1, -1)}`:adjust);

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
                    companyId:3,
                    party_Name:title, 
                    jobNo:`${x.jobnumber}`.trim(), 
                    currency:x.curr, 
                    operation:x.operationcode==null?"SE":x.operationcode,
                    ex_rate:1,
                    type:"Old Job Invoice",
                    payType:"Recievable",
                    status:(received + adjust)>0?'3':'1',
                    invoice_No:newInvNo,
                    paid:0,
                    roundOff:0,
                    approved:1,
                    total:receivable,
                    createdAt:`${moment(x.invoicedate_f).format("YYYY-MM-DD")}`,
                    receivable: receivable,
                    received: received + adjust,
                    balance: receivable - (received + adjust)
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
        let index = 0;
        console.log(recTwo.length)
        recTwo.forEach(async(x, i)=>{
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
            let title = x.vendor? x.vendor.slice(0, x.vendor.lastIndexOf("(")-1):'';
            if(x.payable!=null){

                let payable = `${x.payable}`?.replaceAll(',', '');
                payable = parseFloat(payable[0]=="("?`-${payable.slice(1, -1)}`:payable);

                let paid = `${x.paid}`?.replaceAll(',', '');
                paid = parseFloat(paid[0]=="("?`-${paid.slice(1, -1)}`:paid);

                let adjust = `${x.adjust}`?.replaceAll(',', '');
                adjust = parseFloat(adjust[0]=="("?`-${adjust.slice(1, -1)}`:adjust);

                let invNo = `${x.invoice_no!=null?x.invoice_no:''}${x.inv_no!=null?x.inv_no:''}${x.bill_no!=null?x.bill_no:''}`;
                let newInvNo = "";

                // if(invNo.indexOf("SNS")==0){
                //     newInvNo = invNo.slice(0, 4)+"O"+invNo.slice(4);
                // } else if(invNo.indexOf("ACS")==0){
                //     newInvNo = invNo.slice(0, 4)+"O"+invNo.slice(4);
                // } else {
                //     newInvNo = invNo;
                // }
                // await list.push({
                //     companyId:1,
                //     party_Name:title, 
                //     jobNo:`${x.jobnumber}`.trim(), 
                //     currency:x.curr, 
                //     operation:x.operationcode,
                //     ex_rate:1,
                //     type:"Old Job Bill",
                //     payType:"Payble",
                //     status:(paid + adjust)>0?'3':'1',
                //     oldInvoiceNo:`${x.invoice_no!=null?x.invoice_no:''}${x.inv_no!=null?x.inv_no:''}${x.bill_no!=null?x.bill_no:''}`,
                //     received:0,
                //     roundOff:0,
                //     approved:1,
                //     total:payable,
                //     createdAt:`${moment(x.invoicedate_f).format("YYYY-MM-DD")}`,
                //     payable: payable,
                //     paid: paid + adjust,
                //     balance: payable - (paid + adjust)
                // })

                if(invNo.indexOf("SNS")==0){
                    newInvNo = invNo.slice(0, 4)+"O"+invNo.slice(4);
                } else if(invNo.indexOf("ACS")==0){
                    newInvNo = invNo.slice(0, 4)+"O"+invNo.slice(4);
                } else {
                    newInvNo = invNo;
                }
                console.log(newInvNo);
                await list.push({
                    companyId:3,
                    party_Name:title, 
                    jobNo:`${x.jobnumber}`.trim(), 
                    currency:x.curr, 
                    operation:x.operationcode==null?"SE":x.operationcode,
                    ex_rate:1,
                    type:"Old Job Bill",
                    payType:"Payble",
                    status:(paid + adjust)>0?'3':'1',
                    invoice_No:newInvNo,
                    paid:0,
                    roundOff:0,
                    approved:1,
                    total:payable,
                    createdAt:`${moment(x.billdate_f).format("YYYY-MM-DD")}`,
                    payable: payable,
                    paid: paid + adjust,
                    balance: payable - (paid + adjust)
                })
            }

        });
        console.log(list)
        let tempreceivable = 0;
        let tempreceived = 0;
        let tempbalance = 0;
        list.forEach((x)=>{
            tempreceivable = tempreceivable + x.payable
            tempreceived = tempreceived + x.paid
            tempbalance = tempbalance + x.balance
        })
        console.log("payble", tempreceivable, "paid",tempreceived, "balance",tempbalance);
    }

    const uploadPaybleInvoices = async() => {
        let finalInvoiceList = [];
        let failedList = [];
        let index = 0;
        console.log(paybleFour.length);
        paybleFour.forEach(async(x, i)=>{
            axios.post("http://localhost:8081/invoice/uploadbulkInvoicesTest",x)
            .then((y)=>{
                setInvoiceIndexPay(i);
                if(y.data.status=="success"){
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

    // useEffect(() => {
    //   console.log(finalList)
    // }, [finalList])

    // useEffect(() => {
    //   console.log(failedList)
    // }, [failedList])

    // useEffect(() => {
    //     console.log(finalListPay)
    // }, [finalListPay])

    // useEffect(() => {
    // console.log("Error Here",failedListPay)
    // }, [failedListPay])


    // useEffect(()=> {
    //     const midIndex = Math.floor(paybleList.length / 4);
    //     const partOne = paybleList.slice(0, midIndex);
    //     const partTwo = paybleList.slice(midIndex, midIndex*2);
    //     const partThree = paybleList.slice(midIndex*2, midIndex*3);
    //     const partFour = paybleList.slice(midIndex*3);

    //     console.log({
    //         partOne,
    //         partTwo,
    //         partThree,
    //         partFour
    //     });
    // }, [])

    useEffect(()=> {
        const midIndex = Math.floor(recivableInvoices.length / 2);
        const partOne = recivableInvoices.slice(0, midIndex);
        const partTwo = recivableInvoices.slice(midIndex);

        console.log({
            partOne,
            partTwo
        });
    }, [])

    
    // useEffect(() => {
    //     let one = [];
    //     let two = [];
    //     paybleList.forEach((x, i)=>{
    //         i%2==0?one.push(x):two.push(x)
    //     })
    //     console.log(one)
    //     console.log(two)
    // }, [paybleList])
    
    // useEffect(() => {
    //     if(invoiceIndex+1==recivableInvoices.length){
    //         console.log(finalList)
    //         console.log(failedList)
    //     }
    // }, [finalList, failedList])

    // useEffect(() => {
    //     if(invoiceIndexPay+1==paybleTwo.length){
    //         console.log(finalListPay)
    //         console.log(failedListPay)
    //     }
    // }, [finalListPay, failedListPay])

  return (
  <>
    <h6>Clients / Vendors</h6>
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

export default Uploader

let recivableInvoices = []

let paybleList = []

let paybleOne = []

let paybleTwo = []

let paybleThree = []

let paybleFour = []