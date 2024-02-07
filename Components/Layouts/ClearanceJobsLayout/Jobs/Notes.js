import React from 'react';
import { Popover, Input } from "antd";
import { Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import openNotification from '../../../Shared/Notification';
import moment from 'moment'
import { useRouter } from 'next/router'

const Notes = ({state, dispatch}) => {
  const params = useRouter();
  const handleSubmit = async() => {

    if(state.title!=""&&state.note!=""){
      dispatch({type:'toggle', fieldName:'load', payload:true});
      setTimeout(async() => {
        await axios.post(process.env.NEXT_PUBLIC_CLIMAX_ADD_SEAJOB_NOTE,{
            title:state.title, note:state.note, recordId:state.selectedRecord.id, opened: "0", 
            recordId: state.selectedRecord.id,
            type: params.pathname.includes("airJobs/export") ? "AE" : params.pathname.includes("airJobs/import") ? "AI" :
            params.pathname.includes("seaJobs/import") ? "SI" : "SE",
            createdBy:Cookies.get('username')
        }).then((x)=>{
        if(x.data.status=='success'){
          const data = {opened : 1, recordId: x.recordId}
          openNotification('Success', `Note Added!`, 'green')
        }
        else{
          openNotification('Error', `An Error occured Please Try Again!`, 'red')
        }
        dispatch({type:'toggle', fieldName:'title', payload:""});
        dispatch({type:'toggle', fieldName:'note', payload:""}); 
        dispatch({type:'toggle', fieldName:'load', payload:false});
        })
      }, 3000);
    }
  }
  const getNotes = async() => {
    dispatch({type:'toggle', fieldName:'load', payload:true});
    setTimeout(async() => {
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_GET_SEAJOB_NOTES,{
        id: state.selectedRecord.id, type :state.selectedRecord.operation
      }).then((x)=>{
        if(x.data.status=='success'){
          const data = {opened : "1", recordId : x.data.result[0]?.recordId};
          updateNote(data);
          dispatch({type:'toggle', fieldName:'notes', payload:x.data.result});
        }
        dispatch({type:'toggle', fieldName:'load', payload:false})
      })
    }, 2000);
  }

  const updateNote = async(data) => {
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_UPDATE_SEAJOB_NOTES, {data})
  }

  return (
    <div className='my-2' >
      <p className='fs-16'>Tracing Notes</p>
      <Popover trigger="click"
        content={
          <div className='p-2 m-0' style={{border:'1px solid silver'}}>
            <h5>Add A Note</h5>
            <Input placeholder='title' value={state.title} 
              onChange={(e)=>dispatch({type:'toggle', fieldName:'title', payload:e.target.value})}
            />
            <Input.TextArea rows={4} placeholder='description' className='my-2' 
              value={state.note} 
              onChange={(e)=>dispatch({type:'toggle', fieldName:'note', payload:e.target.value})} 
            />
            <div className='div-btn px-3' style={{maxWidth:62}}  onClick={!state.load?handleSubmit:null}>
              {state.load?<Spinner size='sm' className='mx-2'/>:'Save'}
            </div>
          </div>
      }>
      <div className='div-btn px-3' style={{maxWidth:110}}>Add Notes</div>
      </Popover>

      <Popover content={
        <div className='p-2 m-0' style={{border:'1px solid silver'}}>
          {state.load && 
            <div style={{minWidth:400, maxHeight:100, textAlign:'center'}}>
              <Spinner size='sm' color='dark'/>
            </div>
          }
          {!state.load && 
            <>
            <Row style={{minWidth:400, maxWidth:401, maxHeight:200, overflowY:'auto'}}>
              {state.notes.length<1 && <div style={{minWidth:400, maxHeight:100, textAlign:'center' ,color:'silver'}}>Empty</div>}
              {state.notes.map((x, i)=>{
              return(
                <Col md={12} key={i}>
                  <div className='mt-3'>
                    <div style={{float:'right'}}>
                      <strong>By:</strong> {x.createdBy}<br/>
                    </div>
                    <div><strong>Title:</strong> {x.title}</div>
                    <div className='mt-2' style={{lineHeight:1.3}}>{x.note}</div>
                    <span style={{fontSize:12, color:'grey'}}>{moment(x.createdAt).fromNow()}</span>
                    <hr className='my-1' />
                  </div>
                </Col>
              )})}
            </Row>
            </>
          }
        </div>
        }
        trigger="click"
      >
      <div className='div-btn px-3 mt-2' style={{maxWidth:110}} onClick={()=>getNotes()}>View Notes</div>
      </Popover>
    </div>
  )
}

export default Notes