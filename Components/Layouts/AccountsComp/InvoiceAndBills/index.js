import React, { useEffect, useState } from 'react';
import InvoiceCharges from '../../../Shared/InvoiceCharges';
import axios from "axios";
import { Row, Col, Spinner, Table } from 'react-bootstrap';
import { Input, Empty, Radio, Modal } from 'antd';
import openNotification from '../../../Shared/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from "next/router"

const InvoiceAndBills = ({invoiceData}) => {

  const companyId = useSelector((state) => state.company.value);
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [search, setSearch] = useState(null);
  const [visible, setVisible] = useState(false);
  const [invoice, setInvoice] = useState({});
  const [records, setRecords] = useState([]);
  const [type, setType] = useState("Job Invoice");
  const currentRecords = (search!='' && search!=null && search!=undefined)?records.filter((x)=>{
    return  x.invoice_No.toLowerCase().includes(search.toLowerCase()) ||
            x.SE_Job.jobNo.toLowerCase().includes(search.toLowerCase()) ||
            x.party_Name.toLowerCase().includes(search.toLowerCase()) ||
            x.total.toLowerCase().includes(search.toLowerCase())

       }):records;

  const onChange = async(e) => {
    setType(e.target.value);
    setLoad(true);
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_FILTERED_INVOICES,{
      headers:{ "type": `${e.target.value}` }
    }).then(async(x)=>{
      await setRecords(x.data.result);
      await setLoad(false);
    });
  };

  useEffect(() => {
    setRecords(invoiceData.result);
  }, [])

  const searchInvoice = async(data) => {
    setLoad(true);
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_NO, {
        headers:{"invoiceno": `${data}`}
    }).then((x)=>{
      console.log(x.data)
        if(x.data.result.resultOne!=null){
          setInvoice(x.data.result);
          setVisible(true)
        }else {
          setInvoice({});
          openNotification('Error', `Something Went Wrong!`, 'orange')
        }
    })
    setLoad(false);
  }
  
    return (
    <div className='base-page-layout fs-13'>
      <Row>
        <Col md={12} xs={12}>
            <h4 className='fw-7'>Invoices / Bills</h4>
        </Col>
        <Col md={3}>
            <Input onChange={(e)=>setSearch(e.target.value)} value={search} placeholder="Enter Bill / Invoice No." />
        </Col>
        <Col md={2}>
            <button className='btn-custom'>Search</button>
        </Col>
        <Col>
        <Radio.Group onChange={onChange} value={type}>
          <Radio value={"Job Invoice"}>Job Invoice</Radio>
          <Radio value={"Job Bill"}>Job Bill</Radio>
          <Radio value={"Agent Invoice"}>Agent Invoice</Radio>
          <Radio value={"Agent Bill"}>Agent Bill</Radio>
        </Radio.Group>
        </Col>
      </Row>
      <hr/>
      {!load &&
      <Row>
        {Object.keys(invoice).length>0 &&
          <Modal open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}
            width={"80%"}
            footer={false}
            centered={true}
            maskClosable={false}
          >
            <InvoiceCharges data={invoice} companyId={companyId} />
          </Modal>
        }
        {records.length==0 &&
          <div className='py-5'>
              <Empty />
          </div>
        }
        {records.length>0 &&
          <div className='' style={{maxHeight:500, overflowY:'auto'}}>
            <Table className='tableFixHead'>
            <thead>
              <tr>
                <th>Sr.</th>
                <th>No.</th>
                <th>Job No.</th>
                <th>Against</th>
                <th>Party</th>
                <th>Status</th>
                <th>Operation</th>
                <th>Currency</th>
                <th>Ex.Rate</th>
                <th>Amount</th>
                </tr>
              </thead>
            <tbody>
            {
            currentRecords.map((x, index) => {
            return (
              <tr key={index} className='f row-hov' onClick={async ()=>{
                // searchInvoice(x.invoice_No)
                await Router.push(`/reports/invoice/${x.id}`)
                dispatch(incrementTab({"label":"Invoice details", "key":"2-11", "id":`${x.id}`}))
              }}>
                <td>{index + 1}</td>
                <td><span className='blue-txt fw-7'>{x.invoice_No}</span></td>
                <td><span className='blue-txt fw-7'>{x.SE_Job?.jobNo}</span></td>
                <td style={{maxWidth:250}}><span className='blue-txt'>{x.partyType.toUpperCase()}  </span></td>
                <td><span className='blue-txt fw-7'>{x.party_Name}</span></td>
                <td><span className='grey-txt'>{x.approved==1?"Approved":"Un-Approved"}    </span></td>
                <td><span className='grey-txt'>{x.operation} </span></td>
                <td><span className='blue-txt'>{x.currency}  </span></td>
                <td><span className='blue-txt'>{x.ex_rate}  </span></td>
                <td><span className='blue-txt fw-7'>{x.total}  </span></td>
              </tr>
              )
            })}
            </tbody>
            </Table>
          </div>
        }
      </Row>
      }
      {load &&
        <div className='my-5 py-5 text-center'><Spinner size='lg' /></div>
      }
    </div>
  )
}

export default InvoiceAndBills