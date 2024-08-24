import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from "react-bootstrap";
import moment from "moment";
import { Radio, Select } from "antd";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';
import { setFilterValues } from '../../../../redux/filters/filterSlice';
import { setFrom, setTo, setCompany, setCurrency, setRecords, setAccount, setName } from '../../../../redux/ledger/ledgerSlice';

const Ledger = () => {

  const dispatch = useDispatch();

  const filterValues = useSelector(state => state.filterValues);
  const { from, to, company, currency, records,account, name } = useSelector((state) => state.ledger);

  const filters = filterValues.find(page => page.pageName === "ledgerReport");
  const values = filters ? filters.values : null;


  const getAccounts = async () => {
   
    try{  
      const gotAccounts = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS, {
      headers: {
        companyid: company
      } });

        const {data}= gotAccounts;
        const {result} = data
        let temprecords=[];
        result?.map((x) => {
              return temprecords.push({ value: x.id, label: x.title, });
            });
            dispatch(setRecords(temprecords));
            getAccountName(temprecords);
  
     
    }catch(e){
      console.log("e",e)

    }
  



  };

  const getAccountName = (temprecords) =>{

    const data = temprecords || records
    const foundAccount = data?.find(x => x.value == account);
    console.log("found", foundAccount)
    if (foundAccount) {
      let acName = foundAccount?.label;
      dispatch(setName(acName))
          }else{
      dispatch(setName(""))
    }
  }

  async function getLedger(){

    try{
      const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VOUCEHR_LEDGER, {
        headers: {
          id: account,
          currency: currency,
          from: from,
          to: to,
        }
      });
      console.log(result.data)
      return result.data
    }catch(e){
      console.error(e)
    }
  }

  useEffect(() => { if (company != "") 
    getAccounts();
 

   }, [company,account]);


  // useEffect(()=>{
  //   if(filters){
  //     setFrom(values.from),
  //     setTo(values.to),
  //     setCompany(values.company),
  //     setAccount(values.account),
  //     setCurrency(values.currency)

  //   }
  // },[filters])

  const handleAccountChange = (value) => {
    dispatch(setAccount(value));
  };

  return (
  <div className='base-page-layout'>
    <Row>
      <Col md={12}><h4 className="fw-7">Ledger</h4></Col>
      <Col md={12}><hr /></Col>
      <Col md={3} className="mt-3">
        <b>From</b>
        <Form.Control type={"date"} size="sm" value={from} onChange={(e) => dispatch(setFrom(e.target.value))} />
      </Col>
      <Col md={3} className="mt-3">
        <b>To</b>
        <Form.Control type={"date"} size="sm" value={to} onChange={(e) => dispatch(setTo(e.target.value))} />
      </Col>
      <Col md={6}></Col>
      <Col md={3} className="my-3">
        <b>Company</b>
        <Radio.Group className="mt-1" 
        value={company} 
        onChange={(e) => dispatch(setCompany(e.target.value))}>
          <Radio value={1}>SEA NET SHIPPING & LOGISTICS</Radio>
          <Radio value={2}>CARGO LINKERS</Radio>
          <Radio value={3}>AIR CARGO SERVICES</Radio>
        </Radio.Group>
      </Col>
      <Col md={7}></Col>
      <Col md={9} className="my-3">
        <b>Currency</b><br />
        <Radio.Group className="mt-1" 
        value={currency} onChange={(e) => dispatch(setCurrency(e.target.value))}>
        <Radio value={"PKR"}>PKR</Radio>
            <Radio value={"USD"}>USD</Radio>
            <Radio value={"GBP"}>GBP</Radio>
            <Radio value={"CHF"}>CHF</Radio>
            <Radio value={"EUR"}>EUR</Radio>
            <Radio value={"AED"}>AED</Radio>
            <Radio value={"OMR"}>OMR</Radio>
            <Radio value={"BDT"}>BDT</Radio>
        </Radio.Group>
      </Col>
      <Col md={6}>
        <b>Accounts</b>
        <Select showSearch 
        allowClear
        style={{ width: "100%" }} 
        placeholder="Select Account" 
        value={account}
        onChange={handleAccountChange} 
        options={records}
          filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
        />
      </Col>
      <Col md={12}>
        <button className='btn-custom mt-3' onClick={async () => {
          if (account != "" && account != null) {
            await getLedger();
            Router.push({ pathname: `/reports/ledgerReport/${account}/`, query: { from: from, to: to, name: name, company: company, currency: currency } });
            dispatch(incrementTab({
              "label": "Ledger Report",
              "key": "5-7",
              "id": `${account}?from=${from}&to=${to}&name=${name}&company=${company}&currency=${currency}`,
              'data': getLedger()
            }))
          }else{
            Router.push({
              pathname: `/reports/ledgerReport/`,  
              query: { from: from, to: to, name: name, company: company, currency: currency }
            });
            
            dispatch(incrementTab({
              "label": "Ledger Report",
              "key": "5-7",
              "id": `from=${from}&to=${to}&name=${name}&company=${company}&currency=${currency}`  // Removed ${account} from id
            }));
            
          }
        }
        }> Go </button>
      </Col>
    </Row>
  </div>
  )
}

export default  React.memo(Ledger)