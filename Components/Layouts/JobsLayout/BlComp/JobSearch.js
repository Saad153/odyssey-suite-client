import { CheckCircleOutlined } from "@ant-design/icons";
import { Row, Spinner, Table, Col } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Tag, Input } from 'antd';
import moment from "moment";
import { setJob } from "./states";

const JobSearch = ({state, useWatch, dispatch, control, reset}) => {
  const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b});
  const setAll = (obj) => dispatch({type:'set', payload:obj});
  const allValues = useWatch({control});
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div style={{minHeight:250}}>
      <Row>
        <Col md={3}>
          <h6><b>Search Job</b></h6>
          <Input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search Job" />
        </Col>
      </Row>
      {state.jobLoad && <div className='center' style={{paddingTop:'15%'}}><Spinner /></div>}
      {!state.jobLoad &&
        <div className='table-sm-1 mt-4' style={{maxHeight:300, overflowY:'auto'}}>
        <Table className='tableFixHead'>
          <thead>
          <tr>
            <th className='text-center'>#</th>
            <th className='text-center'>Job No.</th>
            <th className='text-center'>Date</th>
            <th className='text-center'>Client</th>
            <th className='text-center'>Sailing Date</th>
            <th className='text-center'>POL</th>
            <th className='text-center'>POD</th>
          </tr>
          </thead>
          <tbody>
          {state.jobsData.filter((x)=>{
        if(
          x.jobNo.toLowerCase().includes(searchTerm.toLowerCase())
        ){ return x }
        if(searchTerm==""){ return x }
      }).map((x, i)=> {
          return (
          <tr key={i} className={`${x.check?"table-select-list-selected":"table-select-list"}`}
            onClick={()=>setJob(set, x, state, reset, allValues, dispatch)}
          >
            <td className='text-center px-3'>
              {x.check?<CheckCircleOutlined style={{color:'green', position:'relative', bottom:2}} />:i+1 }
            </td>
            <td className='text-center' style={{whiteSpace:"nowrap"}}><strong>{x.jobNo}</strong></td>
            <td className='text-center' style={{fontSize:12}}>{moment(x.jobDate).format("DD-MM-YYYY")}</td>
            <td className='pt-1 text-center'>{x.Client.name}</td>
            <td className='pt-1 text-center' style={{fontSize:12}}>{moment(x.shipDate).format("DD-MM-YYYY")}</td>
            <td className='pt-1 text-center'><Tag color="cyan" className='mb-1'>{x.pol}</Tag></td>
            <td className='pt-1 text-center'><Tag color="cyan" className='mb-1'>{x.pod}</Tag></td>
          </tr>
          )})}
          </tbody>
        </Table>
        </div>
      }
    </div>
  )
}

export default JobSearch