import { Row, Col, Table } from 'react-bootstrap';
import React, { useEffect, useReducer } from 'react';
import { Modal, Input } from 'antd';
import CreateOrEdit from './CreateOrEdit';
import { EditOutlined } from '@ant-design/icons';

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
      let returnVal = { ...state, visible: false, edit: false, viewHistory:false };
      state.edit?returnVal.selectedRecord={}:null
      return returnVal
    }
    default: return state 
  }
}

const baseValues = {
  //Basic Info
  id:'',
  code:"",
  currency:"",
  name:"",
  short:"",
  calculationType:"",
  defaultPaybleParty:"",
  defaultRecivableParty:"",
  taxApply:"No",
  taxPerc:"",
  fixAmount:0.00
}

const initialState = {
    records: [],
    load:false,
    visible:false,
    edit:false,
    search:"",
    values:baseValues,
    // Editing Records
    selectedRecord:{},
};

const Charges = ({chargeData}) => {
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const { records, visible, viewHistory } = state;

  useEffect(() => dispatch({type:'toggle', fieldName:'records', payload:chargeData.result}), [])

  return (
    <div className='base-page-layout'>
    <Row>
        <Col><h5>Charges</h5></Col>
        <Col>
        <Row>
            <Col md={4}></Col>
            <Col md={5}>
                <Input value={state.search} placeholder="search"
                    style={{borderRadius:"5px"}}
                    className='ant-input'
                    onChange={(e)=>dispatch({type:'toggle', fieldName:'search', payload:e.target.value})} 
                />
                </Col>
            <Col md={3}><button className='btn-custom right' onClick={()=>dispatch({type:'create'})}>Create</button></Col>
        </Row>
        </Col>
    </Row>
    <div className='table-sm-1 mt-3' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead'>
        <thead>
          <tr>
            <th>Code</th>
            <th>Currency</th>
            <th>Name</th>
            <th>Short Name</th>
            <th>Calculation Type</th>
            <th>Default Payble</th>
            <th>Default Receivable</th>
          </tr>
        </thead>
        <tbody>
        {records.filter((x)=>{
            if(
              x.code.toLowerCase()==state.search.toLowerCase() ||
              x.name.toLowerCase()==state.search.toLowerCase() ||
              x.short.toLowerCase()==state.search.toLowerCase()||
              x.currency.toLowerCase()==state.search.toLowerCase()){
              return x
            } else if(state.search==""){
              return x
            }
        }).map((x, index) => {
          return (
          <tr key={index} className='f row-hov' onClick={()=>dispatch({type:'edit', payload:x})}>
            <td>{x.code}</td>
            <td>{x.currency}</td>
            <td>{x.name}</td>
            <td>{x.short}</td>
            <td>{x.calculationType}</td>
            <td>{x.defaultPaybleParty}</td>
            <td>{x.defaultRecivableParty}</td>
          </tr>
          )
        })}
        </tbody>
        </Table>
    </div>
    <Modal
      open={visible}
      onOk={()=>dispatch({ type: 'modalOff' })} onCancel={()=>dispatch({ type: 'modalOff' })}
      width={1000} footer={false} centered={false}
    >
      {!viewHistory && <CreateOrEdit state={state} dispatch={dispatch} baseValues={baseValues} />}
      {/* {viewHistory && <History history={state.history} load={state.load} />} */}
    </Modal>
    </div>
  )
}

export default React.memo(Charges)
