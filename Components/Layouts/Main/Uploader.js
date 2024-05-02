import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CSVReader from 'react-csv-reader';
import moment from 'moment';
import { delay } from "/functions/delay"
import InvoicedUploader from "./InvoicedUploader";
import AgentInvoice from "./AgentInvoice";
import PartiesUploader from "./PartiesUploader";
import invoices from "../../../jsonData/invoices.json"
import AgentInvoiceAdv from './AgentInvoiceAdvance';

const Uploader = () => {

  const commas = (a) => a==0?'0':parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");

  const parserOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
  }

  const handleCA = async(data) => {
    let Assets = [];
    let Liability = [];
    let Expense = [];
    let Capital = [];
    let income = [];

    await data.forEach(async(x, i) => {
      if(i<data.length-1 && x.account_no!="Account No" && x.account_no!=null){
        let record  = {
          ...x, 
          account_title:x.account_title.trimStart(), 
          account_no:`${x.account_no}`.trimStart(),
          title:x.account_title.trimStart(),
          editable:'0',
          subCategory:x.sub_category
        }
        if(record.catogary=="Asset"){
          if(record.type=="Group" ){
            Assets.push({...record, AccountId:3,childAccounts:[]})
          } else if(record.type!="Group"){
            Assets[Assets.length-1].childAccounts.push(record)
          }
        }
        if(record.catogary=="Liability"){
          if(record.type=="Group" ){
            Liability.push({...record, AccountId:4, childAccounts:[]})
          } else if(record.type!="Group"){
            Liability[Liability.length-1]?
              Liability[Liability.length-1].childAccounts.push(record):
              Liability.push({title:'OTHER LIABILITY ACCOUNTS', account_no:'ACC-3', AccountId:4, type:'Group', childAccounts:[{...record}]})
          }
        }
        if(record.catogary=="Expense"){
          if(record.type=="Group" ){
            Expense.push({...record, AccountId:1, childAccounts:[]})
          } else if(record.type!="Group"){
            Expense[Expense.length-1]?
              Expense[Expense.length-1].childAccounts.push(record):
              Expense.push({title:'OTHER EXPENSE ACCOUNTS', account_no:'ACC-3', type:'Group', AccountId:1, childAccounts:[{...record}]})
          }
        }
        if(record.catogary=="Income"){
          if(record.type=="Group" ){
            income.push({...record, AccountId:2, childAccounts:[]})
          } else if(record.type!="Group"){
            income[income.length-1]?
              income[income.length-1].childAccounts.push(record):
              income.push({title:'OTHER INCOME ACCOUNTS', account_no:'ACC-2', type:'Group', AccountId:2, childAccounts:[{...record}]})
          }
        }
        if(record.catogary=="Capital"){
          if(record.type=="Group" ){
            Capital.push({...record, AccountId:5, childAccounts:[]});
          } else if(record.type!="Group"){
            Capital[Capital.length-1]?
            Capital[Capital.length-1].childAccounts.push(record):
            Capital.push({title:'OTHER CAPITAL ACCOUNTS', account_no:'ACC-1', type:'Group', AccountId:5, childAccounts:[{...record}]})
          }
        }
      }
    });

    console.log({
        Assets,
        Liability,
        Expense,
        income,
        Capital
    })

    axios.post('http://localhost:8081/accounts/accountCreate',[
      ...Assets,
      ...Liability,
      ...Expense,
      ...income,
      ...Capital
    ]).then((x)=>{
      console.log(x.data)
    })
  }

  const handleOpeningBalances = (data) => {
    console.log(data)
    let list = [];
    data.forEach(async(x, i) => {
      if(i<data.length && x.particular!=null) {
        let title = x.particular.slice(x.particular.indexOf("(")).slice(1).slice(0, -1)
        await list.push({title:title, amount:x.balance, type:x.type=="Dr"?"credit":'debit'})
      }
    });
    let newItem = [...list];
    // Company Id Must to be set in backend API also !!!
    // PKR USD EUR GBP AED BDT OMR CHF
    axios.post("http://localhost:8081/voucher/getChildAccountIds", {
        list:newItem, company:3, currency:"EUR"
    }).then((x)=>{
        console.log(x.data.result.newList);
        let total = 0
        x.data.result.newList.forEach((x)=>{
            total = total + x.Voucher_Heads[0].amount;
        })
        console.log(total)
    })
  }

  const uploadVouchers = async() => {
    await vouchersList.forEach(async(x, i)=>{
        await axios.post("http://localhost:8081/voucher/voucherCreation",x)
        .then((y)=>{
            console.log(y.data)
            console.log(i)
        })
    })
  }

  const uploadInvoices = async() => {
    let values = [];
    await invoices.forEach((x)=>{
        values.push({
            ...x,
            total:`${x.total}`,
            recieved:`${x.received}`,
            paid:`${x.paid}`,
            roundOff:`${x.roundOff}`,
            approved:`${x.approved}`,
            ex_rate:`${x.ex_rate}`,
            companyId:`${x.companyId}`,
        })
    })
    console.log(values)
    axios.post("http://localhost:8081/invoice/createBulkInvoices", values)
    .then((x)=>{
        console.log(x.data)
    })
  }

  return (
  <>
    {false!=true && <>
    {/* <div className='mt-4'>
      <b>Chart Of Account Loader</b>
    </div>
    <CSVReader 
      cssClass="csv-reader-input" 
      onFileLoaded={handleCA} 
      parserOptions={parserOptions} 
      inputId="ObiWan" 
      inputName="ObiWan"
    /> */}

    {/* <div className='mt-4'>
      <b>Opening Balances Upload</b>
    </div>
    <CSVReader cssClass="csv-reader-input" 
      onFileLoaded={handleOpeningBalances} 
      parserOptions={parserOptions} 
      inputId="ObiWan" 
      inputName="ObiWan"
    />
    <button onClick={uploadVouchers} className='btn-custom mt-5'>Upload Opening Balances</button> */}

    <button onClick={uploadInvoices} className='btn-custom mt-5'>Upload Invoices</button>

    </>
    }

    {/* <PartiesUploader/> */}
    {/* <InvoicedUploader /> */}
    {/* <AgentInvoice /> */}
    {/* <AgentInvoiceAdv/> */}
  </>
  )
}

export default Uploader

let accountsList = {
    "Assets": [],
    "Liability": [],
    "Expense": [],
    "income": [],
    "Capital": []
}

let vouchersList = []