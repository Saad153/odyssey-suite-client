import axios from 'axios';
import moment from "moment";
import { Select, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import { setFilterValues } from '/redux/filters/filterSlice';
import Router from 'next/router';

const TrialBalance = () => {

  const [records, setRecords] = useState([]);
  const [debitAccount, setDebitAccount] = useState("");
  const [company, setCompany] = useState(1);
  const [from, setFrom] = useState(moment("2023-07-01").format("YYYY-MM-DD"));
  const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
  const [currency, setCurrency] = useState("PKR");
  const [reportType, setReportType] = useState("6- Columns Simplified View");
  const [options, setOptions ] = useState("showall");

  const dispatch = useDispatch()

  const stateValues = {
    from,
    to,
    company,
    currency,
    debitAccount,
    reportType,
    options
  };

  const filterValues = useSelector(state => state.filterValues);
  const filters = filterValues.find(page => page.pageName === "trialBalance");
  const values = filters ? filters.values : null;

  useEffect(() => { getAccounts(); }, [company]);
  useEffect(() => {
    if (filters) {
      setFrom(values.from);
      setTo(values.to);
      setCompany(values.company);
      setCurrency(values.currency);
      setDebitAccount(values.debitAccount);
      setReportType(values.reportType);
      setOptions(values.options)

    }
    



  }, [filters]);

  const getAccounts = async () => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_PARENT_ACCOUNTS, {
      headers: { companyid: company }
    }).then((x) => {
      let temprecords = [];
      x.data.result.forEach((x) => {
        temprecords.push({ value: x.id, label: `(${x.code}) ${x.title}` });
      })
      setRecords(temprecords);
    })
  }

  const handleSubmit = () => {
    console.log("here")
    console.log(debitAccount)
    // Router.push("/reports/trialBalance/report")
    Router.push({ pathname: `/reports/trialBalance/report`, query: { from: from, to: to, company: company, reportType: reportType, currency: currency, accountid:debitAccount, options:options } });
    dispatch(incrementTab({
      "label": "Trial Balance Report",
      "key": "5-10",
      "id": `?from=${from}&to=${to}&company=${company}&reportType=${reportType}&currency=${currency}&accountid=${debitAccount}&options=${options}`
    }))

    dispatch(setFilterValues({
      pageName:"trialBalance",
      values:stateValues
    }))
  }

  const handleCompanyChange = (event) => {
        setCompany(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);

};



  return (
  <div className='base-page-layout'>
    <Row>
      <Col md={12} xs={12}>
        <h4 className='fw-7'>Trial Balance</h4>
      </Col>
      <Col md={12}><hr /></Col>
      <Col md={3} className="mt-3">
        <div>From</div>
        <Form.Control type={"date"} size="sm" value={from} onChange={(e) => setFrom(e.target.value)} />
      </Col>
      <Col md={3} className="mt-3">
        <div>To</div>
        <Form.Control type={"date"} size="sm" value={to} onChange={(e) => setTo(e.target.value)} />
      </Col>
      <Col md={6} className="py-5"></Col>
      <Col md={4} className="mb-3">
        <div>Company</div>
        <Radio.Group className='mt-1'
          value={company}
          onChange={handleCompanyChange}
        >
          <Radio value={1}>SEA NET SHIPPING & LOGISTICS</Radio>
          <Radio value={2}>AIR CARGO SERVICES</Radio>
        </Radio.Group>
      </Col>
      <Col md={9} className="mb-3">
        <b>Currency</b><br />
        <Radio.Group className="mt-1"
         value={currency}
         onChange={handleCurrencyChange}>
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
      <Col md={12}></Col>
      <Col md={4}>
        <div>Account</div>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Debit Account"
          onChange={(e) => setDebitAccount(e)}
          options={records}
          value={debitAccount}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          filterSort={(a, b) => (a?.label ?? '').toLowerCase().localeCompare((b?.label ?? '').toLowerCase())}
        />
      </Col>
      <Col md={4}>
      <div>Report</div>
      <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Report"
          onChange={(e) => setReportType(e)}
          options={[
            { value:'6- Columns Simplified View', label:'6- Columns Simplified View' },
            { value:'2- Columns Simplified View', label:'2- Columns Simplified View' },
            { value:'Debitors List', label:'Debitors List' },
            { value:'Creditors List', label:'Creditors List' },

           
          ]}
          value={reportType}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          filterSort={(a, b) => (a?.label ?? '').toLowerCase().localeCompare((b?.label ?? '').toLowerCase())}
        />
      </Col>

     
    </Row>
    <hr/>
    <Row>
    <Col md={4} style={{border:'1px solid silver', marginLeft:12}} className='py-1'>
            Options
            <br/>            <br/>

            <Radio.Group onChange={(e)=>setOptions(e.target.value)} value={options}>
                {/* <Radio value={"exclude"}>Exclude 0 </Radio> */}
                <Radio value={"excludeOpening"}>Exclude Opening</Radio>
                <Radio value={"showall"}>Show All</Radio>
            </Radio.Group>
          </Col>
          </Row>
    <button className='btn-custom mt-3 px-3' onClick={handleSubmit}>
      Go
    </button>
  </div>
  )
}

export default React.memo(TrialBalance)