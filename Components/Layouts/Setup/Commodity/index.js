import React, { useEffect, useReducer } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import Router from 'next/router';
import { Modal } from 'antd';
import CreateOrEdit from './CreateOrEdit';
import { EditOutlined, FireOutlined } from '@ant-design/icons';
import axios from 'axios';

function recordsReducer(state, action){
    switch (action.type) {
      case 'toggle': { 
        return { ...state, [action.fieldName]: action.payload } 
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
        let returnVal = { ...state, visible: false, edit: false };
        state.edit?returnVal.selectedRecord={}:null
        return returnVal
      }
      default: return state 
    }
}

const baseValues = {
  name:"",
  hs:"",
  cargoType:"",
  commodityGroup:"",
  active:"",
  isHazmat:[],
  packageGroup:"",
  hazmatCode:"",
  hazmatClass:"",
  chemicalName:"",
  unoCode:""
}

const initialState = {
    records: [],
    load:false,
    visible:false,
    edit:false,
    values:baseValues,
    selectedRecord:{},
};

const Commodity = ({CommodityData}) => {
  
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const { records, visible } = state;

  useEffect(() => {
    dispatch({type:'toggle', fieldName:'records', payload:CommodityData.result});
  }, [])

  return (
    <div className='base-page-layout'>
      <Row>
        <Col><h5>Commodity</h5></Col>
        <Col><button className='btn-custom right' onClick={()=>dispatch({ type: 'create' })}>Create</button></Col>
      </Row>
      <hr className='my-2' />
      <Row>
        <Col md={12}>
        <div className='table-sm-1 mt-3' style={{maxHeight:500, overflowY:'auto'}}>
          <Table className='tableFixHead'>
          <thead>
            <tr>
              <th>Name</th>
              <th>HSC</th>
              <th>Cargo Type</th>
              <th>Commpodity Group</th>
              <th>Hazmat</th>
              <th>Hazmat Details</th>
              <th>Modify</th>
            </tr>
          </thead>
          <tbody>
          {
            records.map((x, index) => {
            return (
            <tr key={index} className='f'>
              <td><strong>{x.name}</strong></td>
              <td>{x.hs}</td>
              <td>{x.cargoType}</td>
              <td>{x.commodityGroup}</td>
              <td>
                {x.isHazmat==1?
                <span className='green-txt'>
                  <strong>Yes</strong>
                  <FireOutlined className='mx-1' style={{position:'relative', bottom:3}} />
                </span>:
                <span className='grey-txt'><strong>No</strong></span>
                }
              </td>
              <td>
                {x.isHazmat==1?
                  <div>
                    {x.hazmatClass}{", "}
                    {x.hazmatCode}{", "}
                    {x.packageGroup}{", "}
                    {x.chemicalName}{", "}
                    {x.unoCode}
                  </div>:
                  <></>
                }
              </td>
              <td>
                <span>
                  <EditOutlined className='modify-edit' onClick={()=>dispatch({type:'edit', payload:x})}/>
                </span>
              </td>
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

export default Commodity;