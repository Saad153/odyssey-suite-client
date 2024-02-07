import React, { useEffect, useReducer } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';

function recordsReducer(state, action){
    switch (action.type) {
      case 'set': {
        return {
            ...state, ...action.payload
        }
      }
      default: return state 
    }
};

const initialState = {
  records: [{Employee:""}],
  load:false,
};

const OfficeVouchers = ({voucherList}) => {
    const [ state, dispatch ] = useReducer(recordsReducer, initialState);
    const dispatchNew = useDispatch();
    const set = (payload) => dispatch({type:"set", payload:payload});

  useEffect(() => {
    set({records:voucherList});
    //console.log( voucherList );
  }, [voucherList])
  
  return (
  <div className='base-page-layout'>
    <Row>
        <Col md={10}>
          <h5>Office Vouchers</h5>
        </Col>
        <Col md={2} style={{textAlign:'end'}}>
          <button className='btn-custom' onClick={()=>{
            dispatchNew(incrementTab({"label":"Office Voucher","key":"3-8","id":"new"}))
            Router.push(`/accounts/officeVouchers/new`)
          }}> Create </button>
        </Col>
    </Row>
    <Row>
    <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
      <Table className='tableFixHead'>
        <thead>
          <tr>
            <th>Sr.</th><th>Paid To</th><th>Requested By</th><th>Amount</th><th>Created By</th><th>Voucher No.</th><th>Status</th><th>Return Status</th>
          </tr>
        </thead>
        <tbody>
        {
        state.records.map((x, index) => {
        return (
        <tr key={index} className='f row-hov'
          onClick={() => {
            dispatchNew(incrementTab({
              "label": "Office Voucher",
              "key": "3-8",
              "id":x.id
            }))
            Router.push(`/accounts/officeVouchers/${x.id}`)
          }}
        >
          <td>{index + 1}</td>
          <td>
            <span className='blue-txt fw-7'>{x.Employee.name}</span>
          </td>
          <td>{x.requestedBy} </td>
          <td> PKR {x.amount} </td>
          <td>{x.preparedBy} </td>
          <td className='blue-txt fw-7'>{x.approved? x.Voucher?.voucher_Id:''} </td>
          <td className='fw-7'>{x.approved?
              <span style={{color:'green'}}>Approved</span>:
              <span style={{color:'silver'}}>Un-Approved</span>}
          </td>
          <td className='fw-7'>{
            x.paid=="0"?
              <span style={{color:'silver'}}>Not Paid</span>:
            x.paid=="1"?
              <span style={{color:'green'}}>Paid</span>:
              <span style={{color:'orange'}}>Not Fully Paid</span>
              }
          </td>
        </tr>
          )
        })}
        </tbody>
      </Table>
    </div>
    </Row>
  </div>
)}

export default OfficeVouchers