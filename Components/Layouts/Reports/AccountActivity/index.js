import axios from 'axios';
import moment from "moment";
import { Select, Radio, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Row, Col, Table, Spinner, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setFilterValues } from '../../../../redux/filters/filterSlice';

const AccountActivity = () => {

  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [records, setRecords] = useState([]);
  const [voucherRecords, setVoucherRecords] = useState([]);
  const [debitAccount, setDebitAccount] = useState("");
  const [creditAccount, setCreditAccount] = useState("");
  const [company, setCompany] = useState(1);
  const [from, setFrom] = useState(moment("2023-07-01").format("YYYY-MM-DD"));
  const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
  const dispatch = useDispatch()
  
  const commas = (a) => { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") }

  const stateValues = {
    from,
    to,
    company,
    debitAccount,
    creditAccount
  }

  const getTotal = (type, list) => {
    let result = 0.00;
    list.forEach((x) => {
      if (type == x.type) {
        result = result + parseFloat(x.amount)
      }
    })
    return result;
  }

  const filterValues = useSelector(state=>state.filterValues);
  const filters = filterValues.find(page=>page.pageName==="accountActivity");
  const values = filters ? filters.values : null ;

  useEffect(() => { getRecords(); }, [company])
  useEffect(()=>{
    if(filters){
      setFrom(values.from),
      setTo(values.to),
      setCompany(values.company),
      setDebitAccount(values.debitAccount),
      setCreditAccount(values.creditAccount)
    }
  },[filters]);

  const getRecords = async () => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS, {
      headers: { companyid: company }
    }).then((x) => {
      let temprecords = [];
      x.data.result.forEach((x) => {
        temprecords.push({ value: x.id, label: x.title });
      })
      setRecords(temprecords);
    })
  }

  const handleSubmit = async () => {
    setLoad(true);
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_ACTIVITY, {
      headers: {
        debitAccount,
        creditAccount,
        from,
        to
      }
    }).then((x) => {
      setVoucherRecords(x.data.result);
      setLoad(false);
      setVisible(true);
    })
    dispatch(setFilterValues({
      pageName:"accountActivity",
      values:stateValues
    }))
  }

  return (
    <div className='base-page-layout'>
      <Row>
        <Col md={12} xs={12}><h4 className='fw-7'>Account Activity
        </h4></Col>
        <Col md={12}><hr /></Col>
        <Col md={3} className="mt-3">
          <div>From</div>
          <Form.Control type={"date"} size="sm" value={from} onChange={(e) => setFrom(e.target.value)} />
        </Col>
        <Col md={3} className="mt-3">
          <div>To</div>
          <Form.Control type={"date"} size="sm" value={to} onChange={(e) => setTo(e.target.value)} />
        </Col>
        <Col md={6} className=""><div className='py-5'></div></Col>
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
        <Col md={8}></Col>
        <Col md={4}>
          <div>Debit Account</div>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Debit Account"
            onChange={(e) => setDebitAccount(e)}
            options={records}
            value={debitAccount}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Col>
        <Col md={1} className=""><br /> <CloseCircleOutlined className="cur" onClick={() => setDebitAccount("")} /></Col>
        <Col md={7}></Col>
        <Col md={4} className="my-3">
          <div>Credit Account</div>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Credit Account"
            onChange={(e) => setCreditAccount(e)}
            options={records}
            value={creditAccount}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Col>
        <Col md={1} className="my-3"><br /> <CloseCircleOutlined className="cur" onClick={() => setCreditAccount("")} /></Col>
      </Row>
      <button className='btn-custom' disabled={load ? true : false} onClick={handleSubmit}>
        {load ? <Spinner size='sm' className='mx-3' /> : "Search"}
      </button>
      <Modal open={visible} width={"80%"} onOk={() => setVisible(false)}
        onCancel={() => { setVisible(false); setVoucherRecords([]); }}
        footer={false} maskClosable={false}
        title={`Account Activity`}
      >
        {voucherRecords.length > 0 &&
          <div style={{ maxHeight: 660, overflowY: 'auto', overflowX: 'hidden' }}>
            {voucherRecords.map((z, i) => {
              return (
                <div className='table-sm-1' key={i}>
                  <Row style={{ fontSize: 15 }} className="mb-2">
                    <Col md={4}>
                      <span>Voucher No:</span> <span className='grey-txt'>{z.voucher_Id}</span>
                    </Col>
                    <Col md={2}>
                      <span>Currency:</span> <span className='grey-txt'>{z.currency}</span>
                    </Col>
                    <Col md={2} className="text-end">
                      <span>Ex Rate:</span> <span className='grey-txt'>{z.exRate}</span>
                    </Col>
                    <Col md={4} className="text-end px-4">
                      <span>Dated:</span> <span className='grey-txt'>{moment(z.createdAt).format("DD-MM-YYYY")}</span>
                    </Col>
                  </Row>
                  <Table className='tableFixHead' bordered style={{ fontSize: 14 }}>
                    <thead>
                      <tr>
                        <th className='' style={{ width: 220 }}>Particular</th>
                        <th className='text-center' style={{ width: 35 }}>Debit</th>
                        <th className='text-center' style={{ width: 35 }}>Credit</th>
                        <th className='text-center' style={{ width: 35 }}>Debit</th>
                        <th className='text-center' style={{ width: 35 }}>Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {z.Voucher_Heads.length > 0 && z.Voucher_Heads.map((x, index) => {
                        return (
                          <tr key={index}>
                            <td className='fs-13'>{x.Child_Account?.title}</td>
                            <td className='text-end fs-13'>{x.type != "credit" ? <><span className='gl-curr-rep'>{(x.defaultAmount && x.defaultAmount != 0 && z.currency != "PKR") ? `${z.currency}. ` : ''}</span>{(x.defaultAmount && x.defaultAmount != 0 && z.currency != "PKR") ? `${commas(x.defaultAmount)}` : ''}</> : ''}</td>
                            <td className='text-end fs-13'>{x.type == "credit" ? <><span className='gl-curr-rep'>{(x.defaultAmount && x.defaultAmount != 0 && z.currency != "PKR") ? `${z.currency}. ` : ''}</span>{(x.defaultAmount && x.defaultAmount != 0 && z.currency != "PKR") ? `${commas(x.defaultAmount)}` : ''}</> : ''}</td>
                            <td className='text-end fs-13'>{x.type != "credit" ? <><span className='gl-curr-rep'>Rs.{" "}</span>{commas(x.amount)}</> : ''}</td>
                            <td className='text-end fs-13'>{x.type == "credit" ? <><span className='gl-curr-rep'>Rs.{" "}</span>{commas(x.amount)}</> : ''}</td>
                          </tr>
                        )
                      })}
                      <tr>
                        <td>Balance</td>
                        <td></td>
                        <td></td>
                        <td className='text-end fs-13'><span className='gl-curr-rep'>Rs.{" "}</span>{commas(getTotal('debit', z.Voucher_Heads))}</td>
                        <td className='text-end fs-13'><span className='gl-curr-rep'>Rs.{" "}</span>{commas(getTotal('credit', z.Voucher_Heads))}</td>
                      </tr>
                    </tbody>
                  </Table>
                  {voucherRecords.length - 1 > i && <hr />}
                </div>
              )
            })}
          </div>
        }
      </Modal>
    </div>
  )
}

export default AccountActivity