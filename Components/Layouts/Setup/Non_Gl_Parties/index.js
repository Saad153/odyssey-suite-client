import { Row, Col, Table } from 'react-bootstrap';
import React, { useEffect, useReducer, useState } from 'react';
import Router from 'next/router';
import { useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import axios from 'axios';
import {Input, Select} from 'antd'

function recordsReducer(state, action){
  switch (action.type) {
    case 'set': { 
      return { ...state, ...action.payload } 
    }
    case 'toggle': { 
      return { ...state, [action.fieldName]: action.payload } 
    }
    case 'create': {
      return {
        ...state,
        edit: false,
        visible: true
      }
    }
    case 'history': {
      return {
        ...state,
        edit: false,
        viewHistory:true,
        visible: true,
      }
    }
    case 'edit': {
      return {
        ...state,
        selectedRecord:{},
        edit: true,
        visible: true,
        selectedRecord:action.payload
      }
    }
    case 'modalOff': {
      let returnVal = { ...state, visible: false, edit: false, viewHistory:false };
      state.edit?returnVal.selectedRecord={}:null
      return returnVal
    }
    default: return state
  }
}

const initialState = {
  records: [],
  searchClient : '',
  allClients : []
};

const Index = ({ clientData, sessionData}) => {

  const dispatchNew = useDispatch();
  
  useEffect(()=>{
    if(sessionData.isLoggedIn==false){
      Router.push('/login');
    } 
    setRecords(); 
  }, [sessionData]);

  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const { records, allClients } = state;
  const [ searchBy , setSearchBy ] = useState("name")

  const setRecords = () => {
    dispatch({type:'set', payload:{
      records:clientData.result,
      allClients:clientData.result
    }});
  }


const onSearch = (event) => {
  const data = searchBy == 'name' ? allClients.filter((x) => x.name.toLowerCase().includes(event.target.value.toLowerCase())) : allClients.filter((x) => x.code.includes(event.target.value))
  dispatch({type:'toggle', fieldName:'records', payload:data});
}

  return (
    <div className='base-page-layout'>
    <Row>
    <Col md={3}><h5>Non Gl Parties</h5></Col>
      <Col md={7} style={{display:"inline-block"}}><span>Search By :</span>
        <Select placeholder="Search" onChange={(e) => setSearchBy(e)} style={{width:"150px", marginLeft:"5px",borderRadius:"10px"}}
          options={[{value : "code", label:"Code"}, {value : "name", label:"Name"}]} defaultValue={"name"}
        />
        <Input style={{width:"290px", marginLeft:"5px",borderRadius:"10px"}} placeholder={searchBy == 'name' ? "Type Name" : "Type Code"}
          onChange={(e) => onSearch(e)}
        />
      </Col>

      <Col md={2}>
        <button className='btn-custom right' 
          onClick={()=>{
            // dispatchNew(incrementTab({"label":"Client","key":"2-7","id":"new"}));
            Router.push(`/setup/nonGlParties/new`);
        }}>Create</button>
      </Col>
    </Row>
    <hr className='my-2' />
    <Row style={{maxHeight:'69vh',overflowY:'auto', overflowX:'hidden'}}>
    <Col md={12}>
      <div className='table-sm-1 mt-3' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead'>
        <thead>
          <tr>
          <th>Code</th>
            <th>Name</th>
            <th>Contact Persons</th>
            <th>Telephones</th>
            <th>Address</th>
            {/* <th>History</th> */}
          </tr>
        </thead>
        <tbody>
        {records.map((x, index) => {
          return (
          <tr key={index} className='f row-hov'
            onClick={()=>{
            //   dispatchNew(incrementTab({"label":"Client","key":"2-7","id":x.id}));
              Router.push(`/setup/nonGlParties/${x.id}`);
            }}
          >
            <td> <span className=''>{x.code}</span></td>
            <td> <span className='blue-txt fw-7'>{x.name}</span></td>
            <td> {x.person1} {x.mobile1}<br/> {x.person2} {x.mobile2}<br/> </td>
            <td> {x.telephone1}<br/>{x.telephone2}</td>
            <td> {x.address1?.slice(0,30)}<br/> {x.address2?.slice(0,30)}<br/> </td>
            {/* <td>
              Created By: <span className='blue-txt fw-5'>{x.createdBy}</span> <br/>
              <span className='' style={{position:'relative', top:2}}>Load History</span>
              <HistoryOutlined onClick={()=>getHistory(x.id,'client')} className='modify-edit mx-2' />
            </td> */}
          </tr>
          )
        })}
        </tbody>
        </Table>
      </div>
    </Col>
    </Row>
    </div>
  )
}

export default Index