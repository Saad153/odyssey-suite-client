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

const IncomeStatement = () => {

  const [records, setRecords] = useState([]);
  const [debitAccount, setDebitAccount] = useState("");
  const [company, setCompany] = useState(1);
  const [from, setFrom] = useState(moment("2023-07-01").format("YYYY-MM-DD"));
  const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
  const [currency, setCurrency] = useState("PKR");

  const dispatch = useDispatch()

  const stateValues = {
    from,
    to,
    company,
    debitAccount,
  }

  const filterValues = useSelector(state => state.filterValues);
  const filters = filterValues.find(page => page.pageName === "accountActivity");
  const values = filters ? filters.values : null;

  useEffect(() => { getAccounts(); }, [company]);

  useEffect(() => {
    if (filters) {
      setFrom(values.from);
      setTo(values.to);
      setCompany(values.company);
      setDebitAccount(values.debitAccount);
    }
  }, [filters]);

  const getAccounts = async () => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS, {
      headers: { companyid: company }
    }).then((x) => {
      // console.log(x.data)
      let temprecords = [];
      x.data.result.forEach((x) => {
        temprecords.push({ value: x.id, label: x.title });
      })
      setRecords(temprecords);
    })
  }

  const handleSubmit = async () => {
    Router.push({ 
      pathname: `/reports/incomeStatement/report`, 
      query: { from: from, to: to, company: company, currency: currency } 
    });
    dispatch(incrementTab({
      "label": "Income Statement",
      "key": "5-12",
      "id": `?from=${from}&to=${to}&company=${company}&currency=${currency}`
    }))
  }

  return (
    <div className='base-page-layout'>
      <Row>
        <Col md={12} xs={12}>
          <h4 className='fw-7'>Income Statement</h4>
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
            onChange={(e) => {
              setCompany(e.target.value);
            }}
          >
            <Radio value={1}>SEA NET SHIPPING & LOGISTICS</Radio>
            <Radio value={2}>CARGO LINKERS</Radio>
            <Radio value={3}>AIR CARGO SERVICES</Radio>
          </Radio.Group>
        </Col>
        <Col md={9} className="mb-3">
          <b>Currency</b><br />
          <Radio.Group className="mt-1" value={currency} onChange={(e) => setCurrency(e.target.value)}>
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
        {/* <Col md={4}>
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
        </Col> */}
      </Row>
      <button className='btn-custom mt-3 px-3' onClick={handleSubmit}>
        Go
      </button>
    </div>
  )
}

export default React.memo(IncomeStatement)