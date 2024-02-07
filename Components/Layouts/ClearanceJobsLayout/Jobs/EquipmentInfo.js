import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Select, Input, InputNumber  } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import PopConfirm from '../../../Shared/PopConfirm';

const EquipmentInfo = ({state, dispatch}) => {

  const width = 162;
  
  const addEquipment = () => {
    let tempState = [...state.equipments];
    tempState.push({size:'', qty:'', dg:'', gross:'', teu:''});
    dispatch({type:'toggle', fieldName:'equipments', payload:tempState});
  }

  return (
  <div style={{minHeight:630, maxHeight:630}}>
    <button type='button' className='btn-custom fw-8' onClick={addEquipment}>Add +</button>
    <Table className='mt-2'>
      <thead>
        <tr>
          <th>Size/Type</th>
          <th>Qty</th>
          <th>DG/Non-DG</th>
          <th>Gross WT/CNT</th>
          <th>TEU</th>
          <th>Modify</th>
        </tr>
      </thead>
      <tbody>
      {state.equipments.map((x, i) => {
      return(
        <tr className='f' key={i}>
          <td>
          <Select style={{width:width}} value={x.size}
            onChange={(e)=>{
              let tempState = [...state.equipments];
              tempState[i].size = e;
              if(e=='40HC'){// 1 * 2
                tempState[i].gross = 3900;
              }else if(e=='20HC') { // 1 * 1
                tempState[i].gross = 0; 
              }else if(e=='20SD'){// 1 * 1
                tempState[i].gross = 2350; 
              }else if(e=='20FR'){// 1 * 1
                tempState[i].gross = 2900; 
              }else if(e=='40SD'){ // 1 * 2
                tempState[i].gross = 3750; 
              }else if(e=='45HC'){ // 1 * 2
                tempState[i].gross = 4800; 
              }
              dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
            }}
            options={[
              {value:'40HC', label:'40HC'},
              {value:'20HC', label:'20HC'},
              {value:'20SD', label:'20SD'},
              {value:'20FR', label:'20FR'},
              {value:'40SD', label:'40SD'},
              {value:'45HC', label:'45HC'},
            ]}
          />
          </td>
          <td>
            <InputNumber placeholder="Basic usage" value={x.qty} style={{width:width}}
              min={1}
              onChange={(e)=>{
                let tempState = [...state.equipments];
                console.log(tempState[i].gross)
                tempState[i].qty = e;
                let value = 0;
                tempState[i].size=="40HC"?
                  value = 3900:
                  tempState[i].size=="20HC"?
                  value = 0:
                  tempState[i].size=="20SD"?
                  value = 2350:
                  tempState[i].size=="20FR"?
                  value = 2900:
                  tempState[i].size=="40SD"?
                  value = 3750:
                  value = 4800; // 45HC
                tempState[i].gross = value * tempState[i].qty;
                tempState[i].teu = tempState[i].qty*2;
                dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
              }} />
          </td>
          <td>
            <Select style={{ width: width }} value={x.dg}
              onChange={(e)=>{
                let tempState = [...state.equipments];
                tempState[i].dg = e;
                dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
              }} 
              options={[
                {value:'non-DG', label:'non-DG'},
                {value:'DG', label:'DG'},
              ]}
            />
          </td>
          <td>
            {(state.selectedRecord.operation=="SE"||state.selectedRecord.operation=="AE")? 
              <Input placeholder="" style={{width:width}} value={x.gross} />:
              <Input placeholder="" style={{width:width}} disabled />
            }
          </td>
          <td><Input placeholder="" style={{width:width}} value={x.teu} /></td>
          <td>
            <CloseCircleOutlined className='mx-3 cross-icon' onClick={()=>{
              PopConfirm(
                "Confirmation",
                "Are You Sure To Delete This Equipment",
                ()=>{
                  let tempState = [...state.equipments];
                  tempState.splice(i, 1);
                  dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                })
              }}
            />
          </td>
        </tr>
      )})}
      </tbody>
    </Table>
  </div>
  )
}

export default React.memo(EquipmentInfo)