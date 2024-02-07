import Router from 'next/router';
import React from 'react';
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';

const List = () => {

  const dispatch = useDispatch();
  
  return (
    <div className='base-page-layout'>
      <Row>
        <Col md={10}></Col>
        <Col md={2} className='text-end'>
          <button className='btn-custom' onClick={()=>{
            dispatch(incrementTab({"label":"Opening Invoice","key":"3-12","id":"new"}))
            Router.push("/accounts/openingInvoices/new")
          }}
          >Create</button>
        </Col>
      </Row>
    </div>
  )
}

export default List