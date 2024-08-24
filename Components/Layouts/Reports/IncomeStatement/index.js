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
import Cookies from "js-cookie";

const IncomeStatement = () => {

  const [records, setRecords] = useState([]);
  const [debitAccount, setDebitAccount] = useState("");
  const [company, setCompany] = useState(1);
  const [from, setFrom] = useState(moment("2023-07-01").format("YYYY-MM-DD"));
  const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
  const [currency, setCurrency] = useState("PKR");
  const [accountLevel, setAccountLevel] = useState("6");
  const [revenue, selectRevenue] = useState();
  const [expense, selectExpense] = useState();
  const [reportType, setReportType ] = useState("TC");

  let isRevenue = false;
  let isExpense = false;

  const dispatch = useDispatch()

  const stateValues = {
    from,
    to,
    company,
    debitAccount,
    accountLevel
  }

  const filterValues = useSelector(state => state.filterValues);
  const filters = filterValues.find(page => page.pageName === "accountActivity");
  const values = filters ? filters.values : null;

  const getAccounts = async () => {
    let temprecords = [];
    const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_PARENT_ACCOUNTS_ADVANCED, {
      headers: { companyid: company }
    }).then((x) => {
      temprecords = x.data.result.filter((x) => {
        if(x.AccountId == 2 || x.AccountId == 1){
          return x
        }
      })
    })
    setRecords(temprecords);
  }

  useEffect(() => { getAccounts(); }, [company]);

  useEffect(() => {
    if (filters) {
      setFrom(values.from);
      setTo(values.to);
      setCompany(values.company);
      setDebitAccount(values.debitAccount);
      setAccountLevel(values.accountLevel);
    }
  }, [filters, isRevenue, isExpense]);





  const handleRevenueChange = (e) => {
    // console.log(e)
    selectRevenue(e);
    isExpense = true;
    
  }
  const handleExpenseChange = (e) => {
    // console.log(e)
    selectExpense(e);
    isRevenue = true;
    
  }

  const handleSubmit = async () => {
    if(revenue != null){
      Router.push({ 
        pathname: `/reports/incomeStatement/report`, 
        query: { from: from, to: to, company: company, currency: currency, accountLevel:accountLevel, revenue:revenue} 
      });
      console.log(revenue)
      dispatch(incrementTab({
        "label": "Income Statement",
        "key": "5-12",
        "id": `?from=${from}&to=${to}&company=${company}&currency=${currency}&accountLevel=${accountLevel}&revenue=${revenue}`
      }))

    }else if(expense != null){
      Router.push({ 
        pathname: `/reports/incomeStatement/report`, 
        query: { from: from, to: to, company: company, currency: currency, accountLevel:accountLevel, expense:expense } 
      });
      console.log(expense)
      dispatch(incrementTab({
        "label": "Income Statement",
        "key": "5-12",
        "id": `?from=${from}&to=${to}&company=${company}&currency=${currency}&accountLevel=${accountLevel}&expense=${expense}`
      }))

    }else if(reportType != null){
      Router.push({ 
        pathname: `/reports/incomeStatement/report`, 
        query: { from: from, to: to, company: company, currency: currency, accountLevel:accountLevel, reportType:reportType  } 
      });
      dispatch(incrementTab({
        "label": "Income Statement",
        "key": "5-12",
        "id": `?from=${from}&to=${to}&company=${company}&currency=${currency}&accountLevel=${accountLevel}&reportType=${reportType}`
      }))

    }
    
    else{
      
      Router.push({ 
        pathname: `/reports/incomeStatement/report`, 
        query: { from: from, to: to, company: company, currency: currency, accountLevel:accountLevel } 
      });
      dispatch(incrementTab({
        "label": "Income Statement",
        "key": "5-12",
        "id": `?from=${from}&to=${to}&company=${company}&currency=${currency}&accountLevel=${accountLevel}`
      }))
    }
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
        <div>Revenue Parent</div>
        <Select disabled={isRevenue} name="selectRevenue" style={{ width: "100%" }} placeholder="Select Revenue" showSearch onChange={handleRevenueChange}>
          {records.map((x, index) => {
            if(x.AccountId == '2'){
              console.log(x)
              return <Select.OptGroup label={x.title}>
                {x.Child_Accounts.map((y, index) => {
                  return <Select.Option value={y.title}>{"("+y.code+")" + ' - ' +y.title}</Select.Option>
                })}
              </Select.OptGroup>
            }
            // return <Select.Option key={index} value={x.label}>{x.label}</Select.Option>
          })}
        </Select>
        <div>Expense Parent</div>
        <Select disabled={isExpense} name="selectExpense" style={{ width: "100%" }} placeholder="Select Expense" showSearch onChange={handleExpenseChange}>
        {records.map((x, index) => {
            if(x.AccountId == '1'){
              console.log(x)
              return <Select.OptGroup label={x.title}>
                {x.Child_Accounts.map((y, index) => {
                  return <Select.Option value={y.title}>{"("+y.code+")" + ' - ' +y.title}</Select.Option>
                })}
              </Select.OptGroup>
            }
            // return <Select.Option key={index} value={x.label}>{x.label}</Select.Option>
          })}
        </Select>
        </Col>
        <Col md={5} className="mb-3">
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
        <Col md={4}>
        <div>Account Level</div>
      <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Account Level"
          onChange={(e) => setAccountLevel(e)}
          options={[
            { value:'1', label:'1' },
            { value:'6', label:'6' },

                    
          ]}
          value={accountLevel}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          filterSort={(a, b) => (a?.label ?? '').toLowerCase().localeCompare((b?.label ?? '').toLowerCase())}
        />

        </Col>
           <Col md={4} style={{ border: '1px solid silver', marginLeft: 12, paddingRight: 40 }} className='py-1 mt-3'>
            Report Types 
            <Radio.Group 
            value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <Radio value={"TC"}>Two Column </Radio>
              <Radio value={"pnl"}>Profit & Loss Income Statement </Radio>
            </Radio.Group>
          </Col>
      </Row>
      <button className='btn-custom mt-3 px-3' onClick={handleSubmit}>
        Go
      </button>
    </div>
  )
}

export default React.memo(IncomeStatement)