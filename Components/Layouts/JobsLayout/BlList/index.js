import React, { useEffect, useReducer } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { recordsReducer, initialState } from './states';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import moment from 'moment';
import Router from 'next/router';

const SeJob = ({partiesData, BlsData, type}) => {

  const dispatchNew = useDispatch();
  const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b});
  const companyId = useSelector((state) => state.company.value);
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);

  useEffect(() => {
    set('partiesData', partiesData)
    set('records', BlsData)
  }, [])

  return (
  <>
    {companyId!='' &&
    <div className='base-page-layout'>
      <Row>
        <Col><h5>Sea Job BL List</h5></Col>
        <Col>
          {/* <button className='btn-custom right'
            onClick={()=>{
              // dispatchNew(incrementTab({"label":"SE BL","key":"4-4","id":"new"}))
              // Router.push(`/seJob/bl/new`)
            }}
          >
            Create
          </button> */}
        </Col>
      </Row>
      <hr className='my-2' />
      <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead'>
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Job #</th>
            <th>MBL #</th>
            <th>HBL #</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
        {state.records.map((x, i)=>{
        return(
        <tr key={i} className='f row-hov' 
          //onClick={()=>dispatch({type:'edit', payload:x})}
          onClick={()=>{
            dispatchNew(incrementTab({"label":`${type} BL`,"key":"4-4","id":x.id}))
            Router.push(`/seaJobs/export/bl/${x.id}`)
          }}
        >
          <td>{i+1}</td>
          <td>{x.SE_Job.jobNo}</td>
          <td>{x.mbl}</td>
          <td>{x.hbl}</td>
          <td>{x.status}</td>
          <td>{moment(x.createdAt).format("DD-MM-YYYY")}</td>
        </tr>
        )})}
        </tbody>
        </Table>
      </div>
    </div>
    }
  </>
  )
}

export default SeJob;