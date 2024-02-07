import React, { useEffect, useState } from 'react';
import { Col, Row, Table } from "react-bootstrap";
import Router from 'next/router';
import moment from 'moment';

const OpeningBalance = ({sessionData, openingBalancesList}) => {

  const [records, setRecords] = useState([]);

  useEffect(() => {
    setRecords(openingBalancesList.result)
  }, [])

  return (
  <div className='base-page-layout'>
    <Row>
      <Col md={10}>
        <h5>Opening Balance List</h5>
      </Col>
      <Col>
        <button className='btn-custom' style={{float:'right'}} onClick={()=>Router.push("/accounts/openingBalance/new")}
        >Create</button>
      </Col>
    </Row>
    <hr/>
    <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
    <Table className='tableFixHead' bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Voucher Id</th>
          <th>Cost Center</th>
          <th>Currency</th>
          <th>Ex. Rate</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
      {records?.map((x, index) => {
      return (
      <tr key={index} className='f table-row-center-singleLine row-hov'
        onClick={()=>Router.push(`/accounts/openingBalance/${x.id}`)}
      >
        <td>{x?.voucher_No}</td>
        <td>{x?.voucher_Id}</td>
        <td>{x?.costCenter}</td>
        <td>{x?.currency}</td>
        <td>{x.exRate}</td>
        <td>{moment(x?.createdAt).format("YYYY-MM-DD")}</td>
      </tr>
      )})}
      </tbody>
    </Table>
    </div>
  </div>
  )
}

export default OpeningBalance