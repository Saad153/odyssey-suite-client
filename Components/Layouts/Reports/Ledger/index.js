import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from "react-bootstrap";
import moment from "moment";
import { Radio, Select } from "antd";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';
import { setFilterValues } from '../../../../redux/filters/filterSlice';

const Ledger = () => {

  const [from, setFrom] = useState(moment("2023-07-01").format("YYYY-MM-DD"));
  const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
  const [company, setCompany] = useState(1);
  const [account, setAccount] = useState("");
  const [currency, setCurrency] = useState("PKR");
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();

  const stateValues = {
    from: from,
    to: to,
    company: company,
    account: account,
    currency: currency,
  }

  const getAccounts = async () => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS, {
      headers: {
        companyid: company
      }
    }).then((x) => {
      let temprecords = [];
      x.data.result.map((x) => {
        return temprecords.push({ value: x.id, label: x.title, });
      });
      setRecords(temprecords);
    })
  };

  const filterValues = useSelector(state => state.filterValues);
  const filters = filterValues.find(page => page.pageName === "ledgerReport");
  const values = filters ? filters.values : null ;

  useEffect(() => { if (company != "") getAccounts(); }, [company]);
  useEffect(()=>{
    if(filters){
      setFrom(values.from),
      setTo(values.to),
      setCompany(values.company),
      setAccount(values.account),
      setCurrency(values.currency)
    }
  },[filters])

  return (
    <div className='base-page-layout'>
      <Row>
        <Col md={12}><h4 className="fw-7">Ledger</h4></Col>
        <Col md={12}><hr /></Col>
        <Col md={3} className="mt-3">
          <b>From</b>
          <Form.Control type={"date"} size="sm" value={from} onChange={(e) => setFrom(e.target.value)} />
        </Col>
        <Col md={3} className="mt-3">
          <b>To</b>
          <Form.Control type={"date"} size="sm" value={to} onChange={(e) => setTo(e.target.value)} />
        </Col>
        <Col md={6}></Col>
        <Col md={3} className="my-3">
          <b>Company</b>
          <Radio.Group className="mt-1" value={company} onChange={(e) => setCompany(e.target.value)}>
            <Radio value={1}>SEA NET SHIPPING & LOGISTICS</Radio>
            <Radio value={2}>CARGO LINKERS</Radio>
            <Radio value={3}>AIR CARGO SERVICES</Radio>
          </Radio.Group>
        </Col>
        <Col md={7}></Col>
        <Col md={9} className="my-3">
          <b>Currency</b><br />
          <Radio.Group className="mt-1" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <Radio value={"PKR"}>PKR</Radio>
            <Radio value={"USD"}>USD</Radio>
            <Radio value={"GBP"}>GBP</Radio>
            <Radio value={"CHF"}>CHF</Radio>
            <Radio value={"EUR"}>EUR</Radio>
          </Radio.Group>
        </Col>
        <Col md={6}>
          <b>Accounts</b>
          <Select showSearch style={{ width: "100%" }} placeholder="Select Account" onChange={(e) => setAccount(e)} options={records}
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
            filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
          />
        </Col>
        <Col md={12}>
          <button className='btn-custom mt-3' onClick={() => {
            dispatch(setFilterValues({ pageName: "ledgerReport", values: stateValues }));
            if (account != "" && account != null) {
              let name = records.filter((x) => x.value == account).map((x) => {
                {
                  return x.label
                }
              })
              Router.push({ pathname: `/reports/ledgerReport/${account}/`, query: { from: from, to: to, name: name[0], company: company, currency: currency } });
              dispatch(incrementTab({
                "label": "Ledger Report",
                "key": "5-7",
                "id": `${account}?from=${from}&to=${to}&name=${name[0]}&company=${company}&currency=${currency}`
              }))
            }
          }
          }> Go </button>
        </Col>
      </Row>
    </div>
  )
}

export default Ledger