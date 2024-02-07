import React, { useEffect, useReducer } from 'react';
import { Row, Col, Table, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Modal } from 'antd';
import CreateOrEdit from './CreateOrEdit';
import { useForm, useWatch } from "react-hook-form";
import moment from 'moment';
import openNotification from '../../../Shared/Notification';
import { delay } from "/functions/delay";
import Router from 'next/router';
import { getJobValues } from '/apis/jobs';
import { useQuery } from '@tanstack/react-query';

function recordsReducer(state, action){
    switch (action.type) {
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
            selectedVoyage:{},
            edit: true,
            visible: true,
            selectedVoyage:action.payload
        }
      }
      case 'modalOff': {
        let returnVal = {
          ...state,
          visible: false,
          edit: false
        };
        state.edit?returnVal.selectedVoyage={}:null
        return returnVal
      }
      default: return state 
    }
}
const baseValues = {
  id:"",
  pol:"",
  pod:"",
  voyage:"",
  importOriginSailDate:"",
  importArrivalDate:"",
  exportSailDate:"",
  destinationEta:"",
  cutOffDate:"",
  cutOffTime:"",
  type:"Export",
  //vesselId:""
}
const initialState = {
    records: [],
    voyagerecords: [],
    load:false,
    selectedVoyage:{},
    submitLoad:false,
    visible:false,
    edit:false,
    values:baseValues,
    selectedRecord:{},
    selectedId:'',
};
const Voyage = ({vesselsData}) => {

  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b});
  const { refetch } = useQuery({
    queryKey:['values'],
    queryFn:getJobValues
  });

  const{ register, control, handleSubmit, reset, formState:{errors} } = useForm({defaultValues:state.values});

  const getRecords = async(id) => {
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_FIND_ALL_VOYAGES, {id:id})
    .then((x)=>{
      set('voyagerecords', x.data.result);
  }); 
  }

  const findVoyages = async(data) => {
    set('load', true);
    set('selectedRecord', data);
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_FIND_ALL_VOYAGES,{id:data.id})
    .then((x)=>{
        set('voyagerecords', x.data.result);
    }); 
    set('load', false);
  }

  useEffect(()=>{set('records',vesselsData)}, [])
  
  const onSubmit = async(data) => {
    set('submitLoad', true);
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_VOYAGE,{...data, VesselId:state.selectedRecord.id})
    .then((x)=>{
      if(x.data.status=="success"){
        openNotification("Success", "Voyage Created", "green");
        refetch();
      }else{
        openNotification("Error", "Something Went Wrong", "red")
      }
    }); 
    await delay(200);
    set('submitLoad', false);
    dispatch({ type: 'modalOff' })
    await getRecords(state.selectedRecord.id);
  };

  const onEdit = async(data) => {
    set('submitLoad', true);
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_EDIT_VOYAGE,{...data, VesselId:state.selectedRecord.id})
    .then((x)=>{
      if(x.data.status=="success"){
        openNotification("Success", "Voyage Updated", "green");
        refetch();
      }else{
        openNotification("Error", "Something Went Wrong", "red")
      }
    }); 

    await delay(200);
    set('submitLoad', false);
    dispatch({ type: 'modalOff' })
    await getRecords(state.selectedRecord.id);
   };

  const onError = (errors) => console.log(errors);

  return (
    <div className='base-page-layout'>
    <Row>
      <Col md={12}>
      <button className='btn-custom' 
        onClick={()=>Router.push("/setup/vessel")}
      >View Vessels
      </button>
      </Col>
    </Row>
    <hr/>
    <Row>
    <Col md={4}>
      <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead'>
        <thead><tr><th>Sr.</th><th>Code</th><th>Name</th></tr></thead>
        <tbody>
        {
        state.records.map((x, index) => {
        return (
        <tr key={index} className={`f row-hov ${x.id==state.selectedRecord.id?"bg-blue-selected":""}`} onClick={()=>findVoyages(x)} >
          <td>{index + 1}</td>
          <td className='blue-txt fw-7'> {x.code}</td>
          <td style={{minWidth:150}}>
            <div style={{fontSize:14,lineHeight:1}}>{x.name}</div>
            <div style={{fontSize:12,color:'grey'}}>{x.carrier}</div>
          </td>
        </tr>
        )})}
        </tbody>
        </Table>
      </div>
    </Col>
    <Col md={8}>
    <div className='border p-2 mt-3' style={{minHeight:100}}>
      {Object.keys(state.selectedRecord).length==0 &&<div className='text-center my-4'>Select A Vessel</div>}
      {Object.keys(state.selectedRecord).length>0 &&<>
      {!state.load && 
      <Row>
        <Col md={12}>
          <button className='btn-custom'  onClick={()=>{ reset(baseValues); dispatch({type:'create'})}}>Create</button>
        </Col>
        {state.voyagerecords.length==0 && <div className='text-center my-5'>Empty</div>}
        {state.voyagerecords.length>0 && <div className=''>
        <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
          <Table className='tableFixHead' style={{fontSize:13}}>
            <thead><tr><th>Voyage #</th><th>Arrival</th><th>Sailing</th><th>Cut-Off Date</th><th>Cut-Off Time</th><th>Ports</th></tr></thead>
            <tbody>
            {state.voyagerecords.map((x,i)=>{
            return (
            <tr key={i} className='f row-hov' onClick={()=>{
              dispatch({type:'edit', payload:x});
              
              reset({
                ...x,
                cutOffDate:x.cutOffDate==""?"":moment(x.cutOffDate),
                cutOffTime:x.cutOffTime==""?"":moment(x.cutOffTime),
                destinationEta:x.destinationEta==""?"":moment(x.destinationEta),
                exportSailDate:x.exportSailDate==""?"":moment(x.exportSailDate),
                importArrivalDate:x.importArrivalDate==""?"":moment(x.importArrivalDate),
                importOriginSailDate:x.importOriginSailDate==""?"":moment(x.importOriginSailDate),
              });
            }}>
              <td className='blue-txt fw-7'> {x.voyage}</td>
              <td>{x.importArrivalDate!="" && moment(x.importArrivalDate).format("DD-MM-YY")}</td>
              <td>{x.exportSailDate!="" && moment(x.exportSailDate).format("DD-MM-YY")}</td>
              <td>{x.cutOffDate!="" && moment(x.cutOffDate).format("DD-MM-YY")}</td>
              <td>{x.cutOffTime!="" && moment(x.cutOffTime).format("hh:mm a")}</td>
              <td style={{fontSize:10}}>POL : {x.pol}<br/>POD: {x.pod}</td>
            </tr>)})}
            </tbody>
          </Table>
          </div>
          </div>
        }
      </Row>
      }
      </>}
      {state.load && <div className='text-center py-5'><Spinner  /></div>}
    </div>
    </Col>
    </Row>
    <Modal open={state.visible} maskClosable={false}
      onOk={()=>dispatch({ type: 'modalOff' })} onCancel={()=>dispatch({type:'modalOff'})}
      width={800} footer={false} //centered={true}
    >
      {state.visible && 
      <form onSubmit={handleSubmit(state.edit?onEdit:onSubmit, onError)}>
        <CreateOrEdit 
          state={state} 
          dispatch={dispatch} 
          baseValues={baseValues} 
          register={register} 
          control={control} 
          useWatch={useWatch} 
        />
      </form>
      }
    </Modal>
    </div>
  )
}

export default Voyage