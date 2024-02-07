import React, { useState } from "react";
import { Row, Col, Table, Form, Spinner } from "react-bootstrap";
import { incrementTab } from '/redux/tabs/tabSlice';
import { useDispatch } from 'react-redux';
import Router from 'next/router';
import { Modal, Input } from "antd";
import moment from "moment";
import axios from "axios";

const Index = ({manifest}) => {

  const [list, setList] = useState([]);
  const [load, setLoad] = useState(false);
  const [flight, setFlight] = useState("");
  const [pol, setPol] = useState("");
  const [pod, setPod] = useState("");
  const [visible, setVisible] = useState(false);
  const [from, setFrom] = useState(moment("2023-07-01").format("YYYY-MM-DD"));
  const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
  const dispatch = useDispatch();
  const comma=(a)=>a==0?'':parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,", ");

  const searchJob = async() => {
    setLoad(true);
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_SEARCH_MANIFEST,{
      headers:{ 
        'to':to,
        'from':from,
        'flight':flight
      }
    }).then((x)=>{
      setList(x.data.result)
      setLoad(false);
    })
  }

  return (
  <div className='base-page-layout'>
    <Row>
      <Col><h5>Manifest List</h5></Col>
      <Col md={2}>
        <button className="btn-custom right" onClick={()=>{setVisible(true);}}>Search</button>
      </Col>
      <Col md={1}>
        <button className='btn-custom right'
          onClick={()=>{
            dispatch(incrementTab({
              "label":"Manifest",
              "key":"7-8",
              "id":"new"
            }))
            Router.push(`/airJobs/manifest/new`);
          }}
        >Create
        </button>
      </Col>
    </Row>
    <hr className='my-2' />
    <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
    <Table className='tableFixHead' bordered>
      <thead>
        <tr>
          <th>S No</th>
          <th>Manifest No</th>
          <th>Owner And Operator</th>
          <th>Type Of Aircraft</th>
          <th>Point Of Loading</th>
          <th>Point Of Unloading</th>
          <th>Weight</th>
          <th>Pcs</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
      {manifest?.map((x, index) => {
      return (
        <tr key={index} className='f table-row-center-singleLine row-hov' 
          onClick={() => {
            dispatch(incrementTab({ "label":"Manifest", "key":"7-8", "id":x.id }));
            Router.push(`/airJobs/manifest/${x.id}`);
        }}>
          <td>{index + 1}</td>
          <td><b className="blue-txt">{x?.job_no}</b></td>
          <td>{x?.owner_and_operator}</td>
          <td>{x?.type_of_aircraft}  </td>
          <td>{x?.point_of_loading}  </td>
          <td>{x?.point_of_unloading}</td>
          <td>{comma(x?.totalWt)}    </td>
          <td>{comma(x?.totalPcs)}   </td>
          <td>{x?.date?.substr(0,10)}</td>
        </tr>)})}
      </tbody>
    </Table>
    </div>
    <Modal open={visible} width={"90%"} maskClosable={false} title={`Search Jobs`}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      footer={false}
    >
      <>
        <Row className="mt-0 pt-0">
          <Col md={3} className="">
            <div>From</div>
            <Form.Control type={"date"} size="sm" value={from} onChange={(e)=>setFrom(e.target.value)} />
          </Col>
          <Col md={3} className="">
            <div>To</div>
            <Form.Control type={"date"} size="sm" value={to} onChange={(e)=>setTo(e.target.value)} />
          </Col>
        </Row>
        <Row>
          <Col md={3} className="mt-2">
            Flight No.
            <Input value={flight} onChange={(e)=>setFlight(e.target.value)} />
          </Col>
        </Row>
        <Row>
          <Col md={2} className="mt-3">
            <button className="btn-custom"
              onClick={searchJob}
            >Go</button>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="mt-3">
          {(!load && list.length>0) &&
          <>
          <b> Total Weight: <span className="blue-txt">{comma(list?.reduce((x, c)=> Number(c.totalPcs) +x,0))}</span> </b><br/>
          <b> Total Pkgs:   <span className="blue-txt">{comma(list?.reduce((x, c)=> Number(c.totalWt) + x,0))}</span> </b>
          <hr/>
          <div className='mt-3' style={{maxHeight:500, overflowY:'auto', fontSize:12}}>
          <Table className='tableFixHead' bordered>
            <thead>
              <tr>
                <th>S No</th>
                <th>Manifest No</th>
                <th>Flight No</th>
                <th>Type Of Aircraft</th>
                <th>Point Of Loading</th>
                <th>Point Of Unloading</th>
                <th>Weight</th>
                <th>Pcs</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
            {list?.map((x, index) => {
            return (
              <tr key={index} className='f table-row-center-singleLine' 
                // onClick={() => {
                //   dispatch(incrementTab({ "label":"Manifest", "key":"7-8", "id":x.id }));
                //   Router.push(`/airJobs/manifest/${x.id}`);
                // }}
              >
                <td>{index + 1}</td>
                <td><b className="blue-txt">{x?.job_no}</b></td>
                <td>{x?.flight_no}</td>
                <td>{x?.type_of_aircraft}  </td>
                <td>{x?.point_of_loading}  </td>
                <td>{x?.point_of_unloading}</td>
                <td>{comma(x?.totalWt)}    </td>
                <td>{comma(x?.totalPcs)}   </td>
                <td>{x?.date?.substr(0,10)}</td>
              </tr>)})}
            </tbody>
          </Table>
          </div>
          </>
          }
          {(load) && <div className="text-center"><Spinner  /></div> }
          {(!load && list.length==0) && <div className="text-center">No Results</div> }
          </Col>
        </Row>
      </>
    </Modal>
  </div>
)};

export default Index;