import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SecondaryLoader from '/Components/Shared/SecondaryLoader';
import { Table, Row, Col } from 'react-bootstrap';
import moment from "moment";
import { getNetInvoicesAmount } from '/functions/amountCalculations';

const Accounts = () => {

  useEffect(() => { getData(); }, [])

  const [records, setRecords] = useState([]);
  const [load, setLoad] = useState(true);
  const [seelctedRec, setSelectedRec] = useState({Invoices:[]});

  const getData = async() => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_HOME_ACCOUNTS)
    .then((x)=>{
      setRecords(x.data.result);
      setLoad(false);
    })
  }

  return (
    <div>
      {load?
        <div className='text-center'> <SecondaryLoader/> </div>
      :
      <>
      <Row>
      <Col>
          <h4 className='fw-7'>Pending Invoices/Bills</h4>
          <hr/>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
            <Table className='tableFixHead '>
            <thead>
              <tr style={{whiteSpace:"nowrap"}}>
                <th className='text-center'>#</th>
                <th className='text-center'>Job No.</th>
                <th className='text-center'>Sub Type</th>
                <th className='text-center'>Client</th>
                <th className='text-center'>Invoices</th>
                <th className='text-center'>Date</th>
              </tr>
            </thead>
            <tbody>
            {records.map((x, index) => {
              return (
              <tr key={index} className='f fs-12 tr-clickable'
                onClick={()=>{
                  setSelectedRec(x);
                }}
              >
                <td className='text-center fw-6'>{index+1}</td>
                <td className='text-center fw-7'>{x.jobNo}</td>
                <td className='text-center fw-7'>{x.subType}</td>
                <td className='text-center fw-5 grey-txt'>{x.Client.name}</td>
                <td className='text-center fw-5 grey-txt'>{x.Invoices.length}</td>
                <td className='text-center fw-5 grey-txt'>{moment(x.createdAt).format("DD-MM-YYYY")}</td>
              </tr>
              )
            })}
            </tbody>
            </Table>
          </div>
        </Col>
        <Col md={3}>
          <div className='selected-invoice mt-3'>
            <h6 className='wh-txt fw-6 fs-18 mb-4'>Summary</h6>
            {
              seelctedRec.Invoices.map((x, i)=>{
                return(
                  <div key={i} className='wh-txt'>
                    <div className='fs-14'>{x.invoice_No} 
                      <span style={{color:x.payType=="Recievable"?"#cde5ae":"#f8c1a3"}}
                        className="mx-3"
                      >
                        {"("}{x.payType}{")"}
                      </span>
                    </div>
                    <div className='fs-13 mt-2'>Party: {x.party_Name}</div>
                    <div className='fs-13'>Amount: {getNetInvoicesAmount(x.Charge_Heads)}</div>
                    <hr className='my-0 mb-3' />
                  </div>
                )
              })
            }
          </div>    
        </Col>
      </Row>
      </>
      }
    </div>
  )
}

export default Accounts