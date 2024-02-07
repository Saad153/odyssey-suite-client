import React, { useEffect, useReducer } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import Router from 'next/router';
import { Modal } from 'antd';
import CreateOrEdit from './CreateOrEdit';
import { EditOutlined, HistoryOutlined } from '@ant-design/icons';
import axios from 'axios';
import { IoMdArrowDropleft } from "react-icons/io";
import { RiShipLine } from "react-icons/ri";
import { BiCurrentLocation } from "react-icons/bi";
import { TbMap2 } from "react-icons/tb";

function recordsReducer(state, action){
    switch (action.type) {
      case 'toggle': { 
        return { ...state, [action.fieldName]: action.payload } 
      }
      case 'set': { 
        return { ...state, ...action.payload } 
      }
      case 'create': {
        return {
            ...state,
            edit: false,
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
        let returnVal = { ...state, visible: false, edit: false, destinations:[] };
        state.edit?returnVal.selectedRecord={}:null
        return returnVal
      }
      default: return state 
    }
}

const baseValues = {
  name:"",
  code:"",
  type:"",
  loading:"",
  carrier:""
}

const initialState = {
    records: [],
    load:false,
    visible:false,
    edit:false,
    values:baseValues,
    selectedRecord:{},
    destinations:[],
    destination:""
};

const Vessel = ({VesselData}) => {
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const { records, visible } = state;
  useEffect(() => { dispatch({type:'toggle', fieldName:'records', payload:VesselData.result}) }, [])

  return (
    <div className='base-page-layout'>
      <Row>
             
        <Col md={12}>
          <button className='btn-custom' 
            onClick={()=>Router.push("/setup/voyage")}
          >View Voyages
          </button>
        </Col>
        <Col><button className='btn-custom right' onClick={()=>dispatch({ type: 'create' })}>Create</button></Col>
      </Row>
      <hr className='my-2' />
      <Row>
        <Col md={12}>
        <div className='table-sm-1 mt-3' style={{maxHeight:500, overflowY:'auto'}}>
          <Table className='tableFixHead'>
          <thead>
            <tr>
              <th>Carrier</th>
              <th>Name</th>
              <th>EGM/IGM</th>
              <th>Type</th>
              <th>Port Of Loading</th>
              <th>Destinations</th>
            </tr>
          </thead>
          <tbody>
          {records.map((x, index) => {
            return (
            <tr key={index} className='f row-hov' onClick={()=>dispatch({type:'edit', payload:x})}>
              <td className='blue-txt'><strong>{x.carrier}</strong></td>
              <td><strong>{x.name}</strong></td>
              <td className='grey-txt'>{x.voyage}</td>
              <td className='blue-txt'>
                {x.type}
                {" "}
                <RiShipLine />
                <span>
                    {
                        x.type=="Export"?<IoMdArrowDropleft className="flip" />:
                        x.type=="Import"?<IoMdArrowDropleft className="" />:
                        <>
                            <IoMdArrowDropleft className="" />
                            <IoMdArrowDropleft className="flip" />
                        </>
                    }
                </span>
              </td>
              <td> <BiCurrentLocation className='mb-1 mx-1 blue-txt'/>{x.loading}</td>
              <td> <TbMap2 className='mb-1 mx-1 blue-txt' size={20} />{x.destinations}</td>
              
            </tr>
            )
          })}
          </tbody>
          </Table>
        </div>
        </Col>
      </Row>
    <Modal
      open={visible}
      onOk={()=>dispatch({ type: 'modalOff' })} onCancel={()=>dispatch({ type: 'modalOff' })}
      width={1000} footer={false} centered={false}
    >
      <CreateOrEdit state={state} dispatch={dispatch} baseValues={baseValues} />
    </Modal>
    </div>
  )
}

export default Vessel;