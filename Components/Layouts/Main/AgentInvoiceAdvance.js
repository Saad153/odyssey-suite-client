import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CSVReader from 'react-csv-reader';
import moment from 'moment';
import { delay } from "/functions/delay"

const AgentInvoiceAdv = () => {

    // For receivable invoices only
    const [finalList, setFinalList] = useState([])
    const [failedList, setFailedList] = useState([])
    const [invoiceIndex, setInvoiceIndex] = useState(0)

    // For payble invoices only
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
          currency:x.currency, 
          operation:x.operationcode,
          ex_rate:x.exchange_rate,
          type:"Old Agent Bill",
          payType:"Recievable",
          status:received>0?'3':'1',
          //oldInvoiceNo:`${x.invoice_no}`,
          invoice_No:newInvNo,
          paid:0,
          roundOff:0,
          approved:1,
          total:receivable,
          createdAt:`${moment(x.invoice_date).format("YYYY-MM-DD")}`,
          receivable: receivable/x.exchange_rate,
          received: received,
          balance: (receivable/x.exchange_rate) - received
        })
      }
    });

    console.log(list)
    let tempreceivable = 0;
    let tempreceived = 0;
    let tempbalance = 0;
    list.forEach((x) => {
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
    console.log(recivableInvoices.length)
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
        payble = parseFloat(payble[0]=="("?`-${payble.slice(1, -1)}`:payble);

        let paid = `${x.rcvd___paid}`?.replaceAll(',', '');
        paid = parseFloat(paid[0]=="("?`-${paid.slice(1, -1)}`:paid);

        let invNo = `${x.invoice_no!=null?x.invoice_no:''}${x.inv_no!=null?x.inv_no:''}${x.bill_no!=null?x.bill_no:''}`;
        let newInvNo = "";

        if(invNo.indexOf("SNS")==0){
            newInvNo = invNo.slice(0, 4)+"O"+invNo.slice(4);
        } else if(invNo.indexOf("ACS")==0){
            newInvNo = invNo.slice(0, 4)+"O"+invNo.slice(4);
        } else {
            newInvNo = invNo;
        }
        //  console.log(newInvNo);
        await list.push({
          companyId:3,
          party_Name:title, 
          currency:x.currency, 
          operation:x.operationcode,
          ex_rate:x.exchange_rate,
          type:"Old Agent Invoice",
          payType:"Payble",
          status:paid>0?'3':'1',
          //oldInvoiceNo:`${x.invoice_no}`,
          invoice_No:newInvNo,
          received:0,
          roundOff:0,
          approved:1,
          total:payble*-1,
          createdAt:`${moment(x.invoice_date).format("YYYY-MM-DD")}`,
          payble: payble*-1/x.exchange_rate,
          paid:paid*-1,
          balance: (payble*-1/x.exchange_rate) - paid*-1
        })
      }
    });
    console.log(list)
    let tempreceivable = 0;
    let tempreceived = 0;
    let tempbalance = 0;
    list.forEach((x) => {
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
    PaybleList.forEach(async(x, i)=>{
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

  useEffect(() => {
    console.log(finalList)
  }, [finalList])

  useEffect(() => {
    console.log("Error Here", failedList)
  }, [failedList])

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

export default AgentInvoiceAdv;

let recivableInvoices = []

let PaybleList = [
    {
        "companyId": 3,
        "party_Name": "SEA NET TRADING",
        "currency": "USD",
        "ex_rate": 100,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-39/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 1581,
        "createdAt": "2014-06-10",
        "payble": 15.81,
        "paid": 0,
        "balance": 15.81
    },
    {
        "companyId": 3,
        "party_Name": "SHANGHAI SUNBOOM INT'L TRANSPORTATION",
        "currency": "USD",
        "ex_rate": 104,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-63/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 5044,
        "createdAt": "2015-06-25",
        "payble": 48.5,
        "paid": 0,
        "balance": 48.5
    },
    {
        "companyId": 3,
        "party_Name": "COMATRAM SFAX",
        "currency": "USD",
        "ex_rate": 105,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-116/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 19425,
        "createdAt": "2016-06-14",
        "payble": 185,
        "paid": 0,
        "balance": 185
    },
    {
        "companyId": 3,
        "party_Name": "METROTEX IND",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-117/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 6500,
        "createdAt": "2016-08-01",
        "payble": 6500,
        "paid": 0,
        "balance": 6500
    },
    {
        "companyId": 3,
        "party_Name": "METROTEX IND",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-118/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.02,
        "createdAt": "2016-09-11",
        "payble": 0.02,
        "paid": 0,
        "balance": 0.02
    },
    {
        "companyId": 3,
        "party_Name": "SEA NET TRADING",
        "currency": "USD",
        "ex_rate": 106,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-40/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 79503.18,
        "createdAt": "2016-10-29",
        "payble": 750.03,
        "paid": 0,
        "balance": 750.03
    },
    {
        "companyId": 3,
        "party_Name": "SERVOTECH SHIPPING (PVT) LTD",
        "currency": "USD",
        "ex_rate": 106,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-14/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 1590,
        "createdAt": "2017-02-07",
        "payble": 15,
        "paid": 0,
        "balance": 15
    },
    {
        "companyId": 3,
        "party_Name": "SEKO LOGISTICS - MIAMI",
        "currency": "USD",
        "ex_rate": 106,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-130/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 86025.36,
        "createdAt": "2017-04-22",
        "payble": 811.5600000000001,
        "paid": 0,
        "balance": 811.5600000000001
    },
    {
        "companyId": 3,
        "party_Name": "SEKO LOGISTICS - MIAMI",
        "currency": "USD",
        "ex_rate": 106.35,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-131/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 74838.5,
        "createdAt": "2017-05-17",
        "payble": 703.7000470145746,
        "paid": 0,
        "balance": 703.7000470145746
    },
    {
        "companyId": 3,
        "party_Name": "KERRY LOGISTICS (UK) LTD",
        "currency": "USD",
        "ex_rate": 106,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-142/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 24807.18,
        "createdAt": "2017-05-23",
        "payble": 234.03,
        "paid": 0,
        "balance": 234.03
    },
    {
        "companyId": 3,
        "party_Name": "SERVOTECH SHIPPING (PVT) LTD",
        "currency": "USD",
        "ex_rate": 106,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-15/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 2120,
        "createdAt": "2017-05-27",
        "payble": 20,
        "paid": 0,
        "balance": 20
    },
    {
        "companyId": 3,
        "party_Name": "SEA TRADE SERVICES (PVT) LTD.",
        "currency": "USD",
        "ex_rate": 106,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-77/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 3710,
        "createdAt": "2017-06-20",
        "payble": 35,
        "paid": 0,
        "balance": 35
    },
    {
        "companyId": 3,
        "party_Name": "AF EXPORTS",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-367/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.75,
        "createdAt": "2017-12-21",
        "payble": 0.75,
        "paid": 0,
        "balance": 0.75
    },
    {
        "companyId": 3,
        "party_Name": "SEKO WORLDWIDE LLC - ORLANDO",
        "currency": "USD",
        "ex_rate": 110.3,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-242/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 9335.79,
        "createdAt": "2018-02-05",
        "payble": 84.63998186763374,
        "paid": 0,
        "balance": 84.63998186763374
    },
    {
        "companyId": 3,
        "party_Name": "KERRY LOGISTICS (GERMANY) GMBH",
        "currency": "USD",
        "ex_rate": 110.5,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-132/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 6010.1,
        "createdAt": "2018-02-24",
        "payble": 54.39004524886878,
        "paid": 0,
        "balance": 54.39004524886878
    },
    {
        "companyId": 3,
        "party_Name": "SEKO LOGISTICS (NY)",
        "currency": "USD",
        "ex_rate": 126,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-220/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 544526.64,
        "createdAt": "2018-05-31",
        "payble": 4321.64,
        "paid": 0,
        "balance": 4321.64
    },
    {
        "companyId": 3,
        "party_Name": "SEKO LOGISTICS (NY)",
        "currency": "USD",
        "ex_rate": 126,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-221/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 213146.64,
        "createdAt": "2018-07-13",
        "payble": 1691.64,
        "paid": 0,
        "balance": 1691.64
    },
    {
        "companyId": 3,
        "party_Name": "SEKO WORLDWIDE LLC - BALTIMORE",
        "currency": "USD",
        "ex_rate": 125,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-325/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 65000,
        "createdAt": "2018-09-01",
        "payble": 520,
        "paid": 0,
        "balance": 520
    },
    {
        "companyId": 3,
        "party_Name": "SEA TRADE SERVICES (PVT) LTD.",
        "currency": "USD",
        "ex_rate": 140,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-87/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 280,
        "createdAt": "2019-01-22",
        "payble": 2,
        "paid": 0,
        "balance": 2
    },
    {
        "companyId": 3,
        "party_Name": "SEA NET TRADING",
        "currency": "USD",
        "ex_rate": 140,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-41/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 31690.4,
        "createdAt": "2019-03-08",
        "payble": 226.36,
        "paid": 0,
        "balance": 226.36
    },
    {
        "companyId": 3,
        "party_Name": "SEA TRADE SERVICES (PVT) LTD.",
        "currency": "USD",
        "ex_rate": 141.5187,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-90/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 47408.76,
        "createdAt": "2019-05-05",
        "payble": 334.99996820208213,
        "paid": 0,
        "balance": 334.99996820208213
    },
    {
        "companyId": 3,
        "party_Name": "NAZ TEXTILE PVT LTD",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-520/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.52,
        "createdAt": "2019-05-18",
        "payble": 0.52,
        "paid": 0,
        "balance": 0.52
    },
    {
        "companyId": 3,
        "party_Name": "KERRY LOGISTICS (POLAND) SP Z.O.O,",
        "currency": "USD",
        "ex_rate": 164,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-513/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 82426.4,
        "createdAt": "2019-06-27",
        "payble": 502.59999999999997,
        "paid": 0,
        "balance": 502.59999999999997
    },
    {
        "companyId": 3,
        "party_Name": "KERRY LOGISTICS (POLAND) SP Z.O.O,",
        "currency": "USD",
        "ex_rate": 161,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-514/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 24955,
        "createdAt": "2019-08-11",
        "payble": 155,
        "paid": 0,
        "balance": 155
    },
    {
        "companyId": 3,
        "party_Name": "NAZ TEXTILE PVT LTD",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-521/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.5,
        "createdAt": "2019-09-12",
        "payble": 0.5,
        "paid": 0,
        "balance": 0.5
    },
    {
        "companyId": 3,
        "party_Name": "NAZ TEXTILE PVT LTD",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-522/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 1,
        "createdAt": "2019-09-21",
        "payble": 1,
        "paid": 0,
        "balance": 1
    },
    {
        "companyId": 3,
        "party_Name": "CONTROLO CARGO SERVICES",
        "currency": "USD",
        "ex_rate": 197,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-543/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 27580,
        "createdAt": "2019-09-28",
        "payble": 140,
        "paid": 0,
        "balance": 140
    },
    {
        "companyId": 3,
        "party_Name": "NAZ TEXTILE PVT LTD",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-523/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.2,
        "createdAt": "2019-10-11",
        "payble": 0.2,
        "paid": 0,
        "balance": 0.2
    },
    {
        "companyId": 3,
        "party_Name": "NAZ TEXTILE PVT LTD",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-524/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 1302.05,
        "createdAt": "2019-10-25",
        "payble": 1302.05,
        "paid": 0,
        "balance": 1302.05
    },
    {
        "companyId": 3,
        "party_Name": "METROTEX IND",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-123/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 5513,
        "createdAt": "2019-10-31",
        "payble": 5513,
        "paid": 0,
        "balance": 5513
    },
    {
        "companyId": 3,
        "party_Name": "NAZ TEXTILE PVT LTD",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-526/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 554.55,
        "createdAt": "2019-11-22",
        "payble": 554.55,
        "paid": 0,
        "balance": 554.55
    },
    {
        "companyId": 3,
        "party_Name": "POPULAR FABRICS LTD",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-562/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.07,
        "createdAt": "2019-11-22",
        "payble": 0.07,
        "paid": 0,
        "balance": 0.07
    },
    {
        "companyId": 3,
        "party_Name": "NAZ TEXTILE PVT LTD",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-527/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.15,
        "createdAt": "2019-12-06",
        "payble": 0.15,
        "paid": 0,
        "balance": 0.15
    },
    {
        "companyId": 3,
        "party_Name": "DENIM CRAFTS",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-531/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.02,
        "createdAt": "2019-12-06",
        "payble": 0.02,
        "paid": 0,
        "balance": 0.02
    },
    {
        "companyId": 3,
        "party_Name": "SES INDUSTRIES",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-577/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.4,
        "createdAt": "2019-12-13",
        "payble": 0.4,
        "paid": 0,
        "balance": 0.4
    },
    {
        "companyId": 3,
        "party_Name": "SES INDUSTRIES",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-578/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.03,
        "createdAt": "2019-12-20",
        "payble": 0.03,
        "paid": 0,
        "balance": 0.03
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK TRANSPORTATION, INC / ATL",
        "currency": "USD",
        "ex_rate": 154.935,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-579/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 42917,
        "createdAt": "2020-01-11",
        "payble": 277.0000322715978,
        "paid": 0,
        "balance": 277.0000322715978
    },
    {
        "companyId": 3,
        "party_Name": "CHINA GLOBAL LINES LIMITED",
        "currency": "USD",
        "ex_rate": 154.9,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-546/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 30.98,
        "createdAt": "2020-01-20",
        "payble": 0.19999999999999998,
        "paid": 0,
        "balance": 0.19999999999999998
    },
    {
        "companyId": 3,
        "party_Name": "POPULAR FABRICS LTD",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-565/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.07,
        "createdAt": "2020-01-20",
        "payble": 0.07,
        "paid": 0,
        "balance": 0.07
    },
    {
        "companyId": 3,
        "party_Name": "TEU S.A SHIPPING & FORWARDING .CO",
        "currency": "USD",
        "ex_rate": 155,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-160/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 41540,
        "createdAt": "2020-01-22",
        "payble": 268,
        "paid": 0,
        "balance": 268
    },
    {
        "companyId": 3,
        "party_Name": "POPULAR FABRICS LTD",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-566/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.1,
        "createdAt": "2020-01-24",
        "payble": 0.1,
        "paid": 0,
        "balance": 0.1
    },
    {
        "companyId": 3,
        "party_Name": "SPEDYCARGO SA",
        "currency": "USD",
        "ex_rate": 157.7325,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-561/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 38959.93,
        "createdAt": "2020-01-30",
        "payble": 247.00001584961885,
        "paid": 0,
        "balance": 247.00001584961885
    },
    {
        "companyId": 3,
        "party_Name": "PT. TIGA  BINTANG  JAYA",
        "currency": "USD",
        "ex_rate": 156.45,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-129/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 152069.4,
        "createdAt": "2020-02-04",
        "payble": 972,
        "paid": 0,
        "balance": 972
    },
    {
        "companyId": 3,
        "party_Name": "GARATEX",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-575/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 0.32,
        "createdAt": "2020-02-14",
        "payble": 0.32,
        "paid": 0,
        "balance": 0.32
    },
    {
        "companyId": 3,
        "party_Name": "GARATEX",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-576/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 192517.15,
        "createdAt": "2020-02-21",
        "payble": 192517.15,
        "paid": 0,
        "balance": 192517.15
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK TRANSPORTATION, INC / ATL",
        "currency": "USD",
        "ex_rate": 154.3999,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-580/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 9263.99,
        "createdAt": "2020-02-21",
        "payble": 59.99997409324747,
        "paid": 0,
        "balance": 59.99997409324747
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK TRANSPORTATION, INC / ATL",
        "currency": "USD",
        "ex_rate": 155.9,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-581/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 9354,
        "createdAt": "2020-02-21",
        "payble": 60,
        "paid": 0,
        "balance": 60
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK TRANSPORTATION, INC / ATL",
        "currency": "USD",
        "ex_rate": 154.8,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-582/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 9288,
        "createdAt": "2020-02-24",
        "payble": 59.99999999999999,
        "paid": 0,
        "balance": 59.99999999999999
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK TRANSPORTATION, INC / ATL",
        "currency": "USD",
        "ex_rate": 154.8,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-583/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 9288,
        "createdAt": "2020-02-24",
        "payble": 59.99999999999999,
        "paid": 0,
        "balance": 59.99999999999999
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK TRANSPORTATION, INC / ATL",
        "currency": "USD",
        "ex_rate": 154.8,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-584/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 9288,
        "createdAt": "2020-02-24",
        "payble": 59.99999999999999,
        "paid": 0,
        "balance": 59.99999999999999
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK TRANSPORTATION, INC / ATL",
        "currency": "USD",
        "ex_rate": 154.8,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-585/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 9288,
        "createdAt": "2020-02-24",
        "payble": 59.99999999999999,
        "paid": 0,
        "balance": 59.99999999999999
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK TRANSPORTATION, INC / ATL",
        "currency": "USD",
        "ex_rate": 154.8,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-586/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 9288,
        "createdAt": "2020-02-24",
        "payble": 59.99999999999999,
        "paid": 0,
        "balance": 59.99999999999999
    },
    {
        "companyId": 3,
        "party_Name": "SEA NET TRADING",
        "currency": "USD",
        "ex_rate": 120.45,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-42/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 249090.6,
        "createdAt": "2020-07-02",
        "payble": 2068,
        "paid": 0,
        "balance": 2068
    },
    {
        "companyId": 3,
        "party_Name": "HERMES INTERNATIONAL",
        "currency": "USD",
        "ex_rate": 189,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-594/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 48705.3,
        "createdAt": "2020-07-10",
        "payble": 257.7,
        "paid": 0,
        "balance": 257.7
    },
    {
        "companyId": 3,
        "party_Name": "SALOTA INTERNATIONAL (PVT) LTD",
        "currency": "USD",
        "ex_rate": 164,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-223/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 7872,
        "createdAt": "2020-10-24",
        "payble": 48,
        "paid": 0,
        "balance": 48
    },
    {
        "companyId": 3,
        "party_Name": "SALOTA INTERNATIONAL (PVT) LTD",
        "currency": "USD",
        "ex_rate": 161,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-224/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 11592,
        "createdAt": "2020-11-23",
        "payble": 72,
        "paid": 0,
        "balance": 72
    },
    {
        "companyId": 3,
        "party_Name": "SALOTA INTERNATIONAL (PVT) LTD",
        "currency": "USD",
        "ex_rate": 161,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-225/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 11592,
        "createdAt": "2020-11-23",
        "payble": 72,
        "paid": 0,
        "balance": 72
    },
    {
        "companyId": 3,
        "party_Name": "LOGISTICS PLUS",
        "currency": "USD",
        "ex_rate": 161,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-600/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 123165,
        "createdAt": "2020-11-27",
        "payble": 765,
        "paid": 0,
        "balance": 765
    },
    {
        "companyId": 3,
        "party_Name": "SALOTA INTERNATIONAL (PVT) LTD",
        "currency": "USD",
        "ex_rate": 161,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-228/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 10304,
        "createdAt": "2020-12-23",
        "payble": 64,
        "paid": 0,
        "balance": 64
    },
    {
        "companyId": 3,
        "party_Name": "SALOTA INTERNATIONAL (PVT) LTD",
        "currency": "USD",
        "ex_rate": 161,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-229/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 21896,
        "createdAt": "2021-01-11",
        "payble": 136,
        "paid": 0,
        "balance": 136
    },
    {
        "companyId": 3,
        "party_Name": "ORIONCO SHIPPING B.V.",
        "currency": "USD",
        "ex_rate": 159.5,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-625/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 79.75,
        "createdAt": "2021-03-11",
        "payble": 0.5,
        "paid": 0,
        "balance": 0.5
    },
    {
        "companyId": 3,
        "party_Name": "SHIP-LOG A/S",
        "currency": "USD",
        "ex_rate": 156.9973,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-694/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 46942.19,
        "createdAt": "2021-03-31",
        "payble": 298.999982802252,
        "paid": 0,
        "balance": 298.999982802252
    },
    {
        "companyId": 3,
        "party_Name": "SCAN GLOBAL LOGISTICS",
        "currency": "USD",
        "ex_rate": 182.29,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-627/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 42473.57,
        "createdAt": "2021-04-11",
        "payble": 233,
        "paid": 0,
        "balance": 233
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK TRANSPORTATION, INC / ATL",
        "currency": "USD",
        "ex_rate": 154.2,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-588/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 328291.8,
        "createdAt": "2021-04-13",
        "payble": 2129,
        "paid": 0,
        "balance": 2129
    },
    {
        "companyId": 3,
        "party_Name": "TRANSMODAL LOGISTICS INT'L (USA)",
        "currency": "USD",
        "ex_rate": 156,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-48/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 70200,
        "createdAt": "2021-05-22",
        "payble": 450,
        "paid": 0,
        "balance": 450
    },
    {
        "companyId": 3,
        "party_Name": "CMA CS REFUND",
        "currency": "USD",
        "ex_rate": 169.3,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-647/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 169977.2,
        "createdAt": "2021-09-14",
        "payble": 1004,
        "paid": 0,
        "balance": 1004
    },
    {
        "companyId": 3,
        "party_Name": "TRANSMODAL LOGISTICS INT'L (USA)",
        "currency": "USD",
        "ex_rate": 174.2,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-52/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 2146387.88,
        "createdAt": "2021-10-27",
        "payble": 12321.4,
        "paid": 0,
        "balance": 12321.4
    },
    {
        "companyId": 3,
        "party_Name": "TRANSMODAL LOGISTICS INT'L (USA)",
        "currency": "USD",
        "ex_rate": 174.2,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-53/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 1989407.55,
        "createdAt": "2021-10-27",
        "payble": 11420.250000000002,
        "paid": 0,
        "balance": 11420.250000000002
    },
    {
        "companyId": 3,
        "party_Name": "CMA CS REFUND",
        "currency": "USD",
        "ex_rate": 174.2,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-648/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 658824.4,
        "createdAt": "2021-10-27",
        "payble": 3782.0000000000005,
        "paid": 0,
        "balance": 3782.0000000000005
    },
    {
        "companyId": 3,
        "party_Name": "CMA CS REFUND",
        "currency": "USD",
        "ex_rate": 174.2,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-649/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 482359.8,
        "createdAt": "2021-10-27",
        "payble": 2769,
        "paid": 0,
        "balance": 2769
    },
    {
        "companyId": 3,
        "party_Name": "CMA CS REFUND",
        "currency": "USD",
        "ex_rate": 174.2,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-650/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 900091.4,
        "createdAt": "2021-10-27",
        "payble": 5167.000000000001,
        "paid": 0,
        "balance": 5167.000000000001
    },
    {
        "companyId": 3,
        "party_Name": "TRANSMODAL LOGISTICS INT'L (USA)",
        "currency": "USD",
        "ex_rate": 172.15,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-54/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 2489182.27,
        "createdAt": "2021-11-05",
        "payble": 14459.380017426662,
        "paid": 0,
        "balance": 14459.380017426662
    },
    {
        "companyId": 3,
        "party_Name": "TRANSMODAL LOGISTICS INT'L (USA)",
        "currency": "USD",
        "ex_rate": 178.6,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-56/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 2052024.7,
        "createdAt": "2021-11-14",
        "payble": 11489.5,
        "paid": 0,
        "balance": 11489.5
    },
    {
        "companyId": 3,
        "party_Name": "TRANSMODAL LOGISTICS INT'L (USA)",
        "currency": "USD",
        "ex_rate": 179.15,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-58/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 1553520.72,
        "createdAt": "2021-12-15",
        "payble": 8671.619983254255,
        "paid": 0,
        "balance": 8671.619983254255
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK TRANSPORTATION, INC / ATL",
        "currency": "USD",
        "ex_rate": 179,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-589/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 52760.25,
        "createdAt": "2022-02-27",
        "payble": 294.75,
        "paid": 0,
        "balance": 294.75
    },
    {
        "companyId": 3,
        "party_Name": "GARATEX",
        "currency": "PKR",
        "ex_rate": 1,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OOA-692/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 1.46,
        "createdAt": "2022-06-30",
        "payble": 1.46,
        "paid": 0,
        "balance": 1.46
    },
    {
        "companyId": 3,
        "party_Name": "MAURICE WARD NETWORKS UK LTD",
        "currency": "EUR",
        "ex_rate": 232.39,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OAI-83/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 63326.28,
        "createdAt": "2022-07-06",
        "payble": 272.5000215155558,
        "paid": 0,
        "balance": 272.5000215155558
    },
    {
        "companyId": 3,
        "party_Name": "TRANSMODAL LOGISTICS INT'L (USA)",
        "currency": "USD",
        "ex_rate": 228.452,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OAI-48/23",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 173623.52,
        "createdAt": "2022-10-05",
        "payble": 760,
        "paid": 0,
        "balance": 760
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK Transportation (BD) Ltd",
        "currency": "USD",
        "ex_rate": 291.507,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OAI-61/24",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 370213.89,
        "createdAt": "2023-08-28",
        "payble": 1270,
        "paid": 0,
        "balance": 1270
    },
    {
        "companyId": 3,
        "party_Name": "EASTWAY GLOBAL FORWARDING LTD.",
        "currency": "EUR",
        "ex_rate": 301.03,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OAI-57/24",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 427914.15,
        "createdAt": "2024-02-08",
        "payble": 1421.5000166096404,
        "paid": 0,
        "balance": 1421.5000166096404
    },
    {
        "companyId": 3,
        "party_Name": "CENTRAL GLOBAL CARGO GMBH",
        "currency": "EUR",
        "ex_rate": 296.31,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OAI-71/24",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 1611422.67,
        "createdAt": "2024-03-23",
        "payble": 5438.299989875468,
        "paid": 0,
        "balance": 5438.299989875468
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK Transportation (BD) Ltd",
        "currency": "USD",
        "ex_rate": 278.7428,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OAI-63/24",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 2853225.24,
        "createdAt": "2024-03-26",
        "payble": 10236.050007390326,
        "paid": 0,
        "balance": 10236.050007390326
    },
    {
        "companyId": 3,
        "party_Name": "SPEEDMARK Transportation (BD) Ltd",
        "currency": "USD",
        "ex_rate": 278.1226,
        "type": "Old Agent Invoice",
        "payType": "Payble",
        "status": "1",
        "invoice_No": "ACS-OAI-76/24",
        "received": 0,
        "roundOff": 0,
        "approved": 1,
        "total": 2598276.95,
        "createdAt": "2024-04-20",
        "payble": 9342.199986624606,
        "paid": 0,
        "balance": 9342.199986624606
    }
]