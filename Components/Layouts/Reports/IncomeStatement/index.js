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
  const [accountLevel, setAccountLevel] = useState("6");
  const [revenue, selectRevenue] = useState();
  const [expense, selectExpense] = useState();
  const [reportType, setReportType ] = useState("");

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

  useEffect(() => { getAccounts(); }, [company]);

  useEffect(() => {
    if (filters) {
      setFrom(values.from);
      setTo(values.to);
      setCompany(values.company);
      setDebitAccount(values.debitAccount);
      setAccountLevel(values.accountLevel);
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

  let isRevenue = false;
  let isExpense = false;

  const handleRevenueChange = (e) => {
    selectRevenue(e);
    isExpense = true;
    
  }
  const handleExpenseChange = (e) => {
    selectExpense(e);
    isRevenue = true;
    
  }

  const handleSubmit = async () => {
    if(revenue != null){
      Router.push({ 
        pathname: `/reports/incomeStatement/report`, 
        query: { from: from, to: to, company: company, currency: currency, accountLevel:accountLevel, revenue:revenue} 
      });
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
          <Select.OptGroup label="Revenue">
            <Select.Option value='Income/Sales'>Revenue</Select.Option>
            <Select.Option value='INCOME FROM CLEARING'>Income From Clearing</Select.Option>
            <Select.Option value='INCOME FROM IMPORT'>Income From Import</Select.Option>
            <Select.Option value='EX-CHANGE RATE GAIN / LOSS'>Ex-Change Rate Gain/Loss</Select.Option>
            <Select.Option value='AIR IMPORT INCOME'>Air Import Income</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="FCL Selling Income">
            <Select.Option value='FCL FREIGHT INCOME'>FCL Freight Income</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="LCL Selling Income">
            <Select.Option value='LCL FREIGHT INCOME'>LCL Freight Income</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Open Top Selling Income">
            <Select.Option value='OPEN TOP FREIGHT INCOME'>Open Top Freight Income</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Income from Import">
            <Select.Option value='D/O INCOME'>D/O Income</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Import Selling Income">
            <Select.Option value='IMPORT FREIGHT INCOME'>Import Freight Income</Select.Option>
            <Select.Option value='IMPORT INSURANCE'>Import Insurance</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Air Selling Income">
            <Select.Option value='AIR FREIGHT INCOME'>Air Freight Income</Select.Option>
            <Select.Option value='AIR SALES DISCOUNT'>Air Sales Discount</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Other Revenue">
            <Select.Option value='MISC. INCOME'>Misc. Income</Select.Option>
            <Select.Option value='REBATE INCOME'>Rebate Income</Select.Option>
            <Select.Option value='CNTR HANDLING INCOME'>CNTR Handling Income</Select.Option>
            <Select.Option value='INTEREST INCOME'>Interest Income</Select.Option>
            <Select.Option value='KB INCOME'>K.B Income</Select.Option>
            <Select.Option value='INTEREST PAID'>Interest Paid</Select.Option>
            <Select.Option value='RENTAL INCOME'>Rental Income</Select.Option>
            <Select.Option value='SELLING REVENUE'>Selling Revenue</Select.Option>
            <Select.Option value='DETENTION INCOME'>Detention Income</Select.Option>
          </Select.OptGroup>
        </Select>
        <div>Expense Parent</div>
        <Select disabled={isExpense} name="selectExpense" style={{ width: "100%" }} placeholder="Select Expense" showSearch onChange={handleExpenseChange}>
        <Select.OptGroup label="Expenses">
          <Select.Option value='Expense'>Expenses</Select.Option>
          <Select.Option value='SCS COURIER EXP'>SCS COURIER EXP</Select.Option>
          <Select.Option value='SALES TAX EXP (SRB)'>SALES TAX EXP (SRB)</Select.Option>
          <Select.Option value='SOFTWARE & DEVELOPMENT EXPENSES'>SOFTWARE & DEVELOPMENT EXPENSES</Select.Option>
          <Select.Option value='COUNTERA ENTRY'>COUNTERA ENTRY</Select.Option>
          <Select.Option value='CONSTRUCTION A/ C'>CONSTRUCTION A/C</Select.Option>
          <Select.Option value='CIVIL AVIATION RENT'>CIVIL AVIATION RENT</Select.Option>
          <Select.Option value='COMMISSION EXPENSES'>COMMISSION EXPENSES</Select.Option>
          <Select.Option value='SALES TAX SNSL'>SALES TAX SNSL</Select.Option>
          <Select.Option value='REFUND EXPENSES (HAROON)'>REFUND EXPENSES (HAROON)</Select.Option>
          <Select.Option value='INTEREST EXPENSES'>INTEREST EXPENSES</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Selling Expenses">
          <Select.Option value='CLEARING EXPENSE'>CLEARING EXPENSE</Select.Option>
          <Select.Option value='BAD DEBTS'>BAD DEBTS</Select.Option>
          <Select.Option value='REFUND TO AIRLINE & SHIPPING LINE'>REFUND TO AIRLINE & SHIPPING LINE</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="FCL Selling Expenses">
          <Select.Option value='FCL FREIGHT EXPENSE'>FCL FREIGHT EXPENSE</Select.Option>
          <Select.Option value='FCL REBATE EXPENSE'>FCL REBATE EXPENSE</Select.Option>
          <Select.Option value='DOCS EXPENSES'>DOCS EXPENSES</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="LCL Selling Expenses">
          <Select.Option value='LCL FREIGHT EXP'>LCL FREIGHT EXP</Select.Option>
          <Select.Option value='LCL REBATE EXP.'>LCL REBATE EXP.</Select.Option>
          <Select.Option value='SHORT PAYMENT EXPESNES'>SHORT PAYMENT EXPESNES</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Open Top Expenses">
          <Select.Option value='OPEN TOP FREIGHT EXP'>OPEN TOP FREIGHT EXP</Select.Option>
          <Select.Option value='OPEN TOP REBATE EXP'>OPEN TOP REBATE EXP</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Import Selling Expenses">
          <Select.Option value='IMPORT EXPENSES'>IMPORT EXPENSES</Select.Option>
          <Select.Option value='D/ O CHARGES.'>D/O CHARGES.</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Air Selling Expenses">
          <Select.Option value='AIR FREIGHT EXPENSE'>AIR FREIGHT EXPENSE</Select.Option>
          <Select.Option value='AIR PORT EXPENSES'>AIR PORT EXPENSES</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Admin Expenses">
          <Select.Option value='ZAKAT EXP'>ZAKAT EXP</Select.Option>
          <Select.Option value='MOTOR VEHICLE TAX'>MOTOR VEHICLE TAX</Select.Option>
          <Select.Option value='AUDIT EXPENCE'>AUDIT EXPENCE</Select.Option>
          <Select.Option value='COURIER CHARGES'>COURIER CHARGES</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Operating Expenses">
          <Select.Option value='ADVERTISEMENT EXP.'>ADVERTISEMENT EXP.</Select.Option>
          <Select.Option value='B/ L ADHESIVE CHARGES'>B/L ADHESIVE CHARGES</Select.Option>
          <Select.Option value='BROKERAGE & COMMISSION'>BROKERAGE & COMMISSION</Select.Option>
          <Select.Option value='CHARITY & DONATION'>CHARITY & DONATION</Select.Option>
          <Select.Option value='COMPUTER EXPENSES'>COMPUTER EXPENSES</Select.Option>
          <Select.Option value='CONVEYANCE EXP.'>CONVEYANCE EXP.</Select.Option>
          <Select.Option value='DIRECTORS REMUNIRATION'>DIRECTORS REMUNIRATION</Select.Option>
          <Select.Option value='ELECTRICITY CHARGES'>ELECTRICITY CHARGES</Select.Option>
          <Select.Option value='ENTERTAINMENT EXP.'>ENTERTAINMENT EXP.</Select.Option>
          <Select.Option value='EQUIPMENT REPAIR'>EQUIPMENT REPAIR</Select.Option>
          <Select.Option value='FEES & TAXES'>FEES & TAXES</Select.Option>
          <Select.Option value='INTERNET/ EMAIL / FAXES'>INTERNET/ EMAIL / FAXES</Select.Option>
          <Select.Option value='LEGAL & PROFESSIONAL'>LEGAL & PROFESSIONAL</Select.Option>
          <Select.Option value='LICENCE FEE'>LICENCE FEE</Select.Option>
          <Select.Option value='MISC. EXPENSES'>MISC. EXPENSES</Select.Option>
          <Select.Option value='MOBILE EXP.'>MOBILE EXP.</Select.Option>
          <Select.Option value='NEWS PAPER & PERIODICAL'>NEWS PAPER & PERIODICAL</Select.Option>
          <Select.Option value='OFFICE REPAIR & MAINTENANCE'>OFFICE REPAIR & MAINTENANCE</Select.Option>
          <Select.Option value='PHOTO STAT'>PHOTO STAT</Select.Option>
          <Select.Option value='POSTAGE & TELEGRAME'>POSTAGE & TELEGRAME</Select.Option>
          <Select.Option value='PRINTING & STATIONERY'>PRINTING & STATIONERY</Select.Option>
          <Select.Option value='RENT EXPENSE'>RENT EXPENSE</Select.Option>
          <Select.Option value='SALARIES & ALLOWANCES'>SALARIES & ALLOWANCES</Select.Option>
          <Select.Option value='STAFF BONUS'>STAFF BONUS</Select.Option>
          <Select.Option value='TELEPHONE & FAX BILL EXPENSES'>TELEPHONE & FAX BILL EXPENSES</Select.Option>
          <Select.Option value='WAGES EXPENSES'>WAGES EXPENSES</Select.Option>
          <Select.Option value='STAFF WALFARE'>STAFF WALFARE</Select.Option>
          <Select.Option value='GENERATOR EXPENSE'>GENERATOR EXPENSE</Select.Option>
          <Select.Option value='SECURITY & SERVICES'>SECURITY & SERVICES</Select.Option>
          <Select.Option value='CLIMAX SOFTWARE EXP'>CLIMAX SOFTWARE EXP</Select.Option>
          <Select.Option value='INSURANCE EXP (TOYOTA)'>INSURANCE EXP (TOYOTA)</Select.Option>
          <Select.Option value='INSURANCE EXPENSES'>INSURANCE EXPENSES</Select.Option>
          <Select.Option value='EOBI EXPENSE'>EOBI EXPENSE</Select.Option>
          <Select.Option value='DONATION'>DONATION</Select.Option>
          <Select.Option value='INCOME TAX (SALARY)'>INCOME TAX (SALARY)</Select.Option>
          <Select.Option value='INCOM TAX ELECTRICITY'>INCOM TAX ELECTRICITY</Select.Option>
          <Select.Option value='GENERAL SALES TAX ELECTRICITY'>GENERAL SALES TAX ELECTRICITY</Select.Option>
          <Select.Option value='STATIONARY EXPENSE'>STATIONARY EXPENSE</Select.Option>
          <Select.Option value='CONVAYNCE EXPENSES'>CONVAYNCE EXPENSES</Select.Option>
          <Select.Option value='DISPATCH EXPESNES'>DISPATCH EXPESNES</Select.Option>
          <Select.Option value='FUEL & OIL EXPESNES'>FUEL & OIL EXPESNES</Select.Option>
          <Select.Option value='INTERNET & DSL EXPENSES'>INTERNET & DSL EXPENSES</Select.Option>
          <Select.Option value='WATER BILL EXPENSES'>WATER BILL EXPENSES</Select.Option>
          <Select.Option value='WATER BILL EXPESNES'>WATER BILL EXPESNES</Select.Option>
          <Select.Option value='UTILITIES EXPENSES'>UTILITIES EXPENSES</Select.Option>
          <Select.Option value='INCOM TAX'>INCOM TAX</Select.Option>
          <Select.Option value='GUEST HOUSE REPAIRING & MAINTENANCE'>GUEST HOUSE REPAIRING & MAINTENANCE</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Bank & Financial Charges">
          <Select.Option value='BANK CHARGES (SUNIL)'>BANK CHARGES (SUNIL)</Select.Option>
          <Select.Option value='UNITED INSURANCE CO'>UNITED INSURANCE CO</Select.Option>
          <Select.Option value='SALARIES & ALLOWANCES (ACS)'>SALARIES & ALLOWANCES (ACS)</Select.Option>
          <Select.Option value='OFFICE DESIGNING'>OFFICE DESIGNING</Select.Option>
          <Select.Option value='PORT EXPENSES'>PORT EXPENSES</Select.Option>
          <Select.Option value='BANK CHARGES'>BANK CHARGES</Select.Option>
          <Select.Option value='MARKUP CHARGES'>MARKUP CHARGES</Select.Option>
          <Select.Option value='COMMISSION ADV A/C'>COMMISSION ADV A/C</Select.Option>
          <Select.Option value='ENTER TRANSFER A/C'>ENTER TRANSFER A/C</Select.Option>
          <Select.Option value='S.E.S.S.I'>S.E.S.S.I</Select.Option>
          <Select.Option value='READY LOAN A/C'>READY LOAN A/C</Select.Option>
          <Select.Option value='OUT DOOR FUEL EXP'>OUT DOOR FUEL EXP</Select.Option>
          <Select.Option value='CUSTOM CLEARING CHARGES'>CUSTOM CLEARING CHARGES</Select.Option>
          <Select.Option value='PANALTY CHARGES'>PANALTY CHARGES</Select.Option>
          <Select.Option value='WATER & SAVERAGE BOARD BILL'>WATER & SAVERAGE BOARD BILL</Select.Option>
          <Select.Option value='LABOUR CHARGES'>LABOUR CHARGES</Select.Option>
          <Select.Option value='CAR INSTALMENT A/C'>CAR INSTALMENT A/C</Select.Option>
          <Select.Option value='SUI GAS BILL'>SUI GAS BILL</Select.Option>
          <Select.Option value='U.B.L BANK'>U.B.L BANK</Select.Option>
          <Select.Option value='PIA (BANK CHARGES)'>PIA (BANK CHARGES)</Select.Option>
          <Select.Option value='COMMISSION AGAINST BANK GUARANTEE'>COMMISSION AGAINST BANK GUARANTEE</Select.Option>
          <Select.Option value='CREDIT CARDS A/C'>CREDIT CARDS A/C</Select.Option>
          <Select.Option value='B/L STUMPPING'>B/L STUMPPING</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Marketing Expenses">
          <Select.Option value='VEHICLE & RUNNING EXP.'>VEHICLE & RUNNING EXP.</Select.Option>
          <Select.Option value='RECOVERY EXP.'>RECOVERY EXP.</Select.Option>
          <Select.Option value='TRAVELLING EXP.'>TRAVELLING EXP.</Select.Option>
          <Select.Option value='BAD DEBTS EXP'>BAD DEBTS EXP</Select.Option>
          <Select.Option value='COMMISSION A/C SEA SHIPMENTS'>COMMISSION A/C SEA SHIPMENTS</Select.Option>
          <Select.Option value='SALES PROMOTION EXP'>SALES PROMOTION EXP</Select.Option>
          <Select.Option value='SOFTWARE & DEVLOPMENT A/C'>SOFTWARE & DEVLOPMENT A/C</Select.Option>
          <Select.Option value='COMMISSION A/C AIR SHIPMENTS'>COMMISSION A/C AIR SHIPMENTS</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Vehicle Repair & Maintainance">
          <Select.Option value='VEHICLE REPAIR AND MAINTENANCE'>VEHICLE REPAIR AND MAINTENANCE</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="General">
          <Select.Option value='GENERAL'>GENERAL</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Commission A/C">
          <Select.Option value='COMMISSION A/C'>COMMISSION A/C</Select.Option>
        </Select.OptGroup>
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