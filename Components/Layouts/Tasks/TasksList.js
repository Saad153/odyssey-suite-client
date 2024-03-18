import React, { useEffect, useReducer } from 'react';
import { Row, Col, Table, Spinner } from "react-bootstrap";
import { Modal, Input, Select, DatePicker } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { 
  recordsReducer, initialState, proiroties, categories, 
  fetchEmployees, statuses, createTask, fetchTasks,
  updateTask
} from './states';
import moment from 'moment';

const TasksList = () => {

  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const set = (payload) => dispatch({type:'set', payload:{ ...payload }});

  const showModal = () => set({isOpen:true, edit:false, task:{}});
  const handleOk = () => set({isOpen:false});
  const handleCancel = () => set({isOpen:false});

  const handleChange = (variable, value) => {
    let temp = state.task;
    temp[variable] = value
    set({task:temp})
  };

  const handleSub = (index, value) => {
    let temp = state.task;
    temp.subTasks[index].title = value
    set({task:temp})
  };

  const append = () => {
    let temp = {...state.task};
    temp.subTasks.push({title:'', status:0});
    set({task:temp})
  };

  const remove = (data, index) => {
    let temp = {...state.task};
    let deleteList = [];
    if(data){
      deleteList = [...state.deleteList];
      deleteList.push(data.id)
    }
    temp.subTasks = temp.subTasks.filter((x, i)=>{
      return index!=i
    });
    set({
      task:temp,
      deleteList:deleteList
    })
  };

  const handleSubmit = async (e) => {
    set({load:true})
    e.preventDefault();
     state.edit? await updateTask(state):await createTask(state.task)
    await getTasks();
  };

  useEffect(() => {
    getEmployees();
    getTasks();
  }, []);

  const getEmployees = () => {
    fetchEmployees().then((x) => {
      set({employeeList:x})
    })
  };

  const getTasks = () => {
    fetchTasks().then((x) => {
      set({taskList:x, edit:false, isOpen:false, load:false})
    })
  };

  const editTask = (x) => {
    set({
      task:{
        ...x,
        due: moment(x.due),
        subTasks:x.Sub_Tasks,
      },
      edit:true,
      isOpen:true
    })
  };

  return (
  <>
    <Row>
      <Col md={6}><h5>Tasks</h5></Col>
      <Col md={6}>
        <button className='btn-custom px-5' style={{float:'right'}} onClick={showModal}>Create</button>
      </Col>
    </Row>
    <hr/>
    <Row>
    <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
      <Table className='tableFixHead'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
        {state.taskList.map((x, i)=>{
        return (
          <tr 
            key={x.id} 
            className='row-hov' 
            onClick={()=>editTask(x)}
          >
            <td>{x.title}</td>
            <td style={{color:'orange'}}>{x.priority}</td>
            <td style={{color:'silver'}}><b>{x.status}</b></td>
            <td>{moment(x.createdAt).format("YYYY-MM-DD")}</td>
            <td>{moment(x.due).format("YYYY-MM-DD")}</td>
          </tr>
        )})}
        </tbody>
      </Table>
    </div>
    </Row>
    <Modal 
      open={state.isOpen} 
      onOk={handleOk}
      onCancel={handleCancel} 
      title={state.edit?'Edit A Task':'Create A Task'}
      footer={false}
    >
      <form onSubmit={handleSubmit}>
      <div>Title</div>
      <Input 
        value={state.task.title} onChange={(e)=>handleChange('title', e.target.value)}
        placeholder='Enter Task Title' required
      />
      <button onClick={append} className='btn-custom-small mt-2' type={'button'}>+ Sub Task</button>
      <>
        {state?.task?.subTasks?.map((x, i)=>{
          return(
          <div key={i} className='my-2' style={{display:'flex'}}>
            <Input value={x.title} onChange={(e)=>handleSub(i, e.target.value)} />
            <CloseCircleOutlined className='mx-2 red-txt cur' onClick={()=>remove(x,i)} />
          </div>
        )})}
      </>
      <Row>
        <Col md={6}>
          <div className='mt-2'>Priority</div>
          <Select
            defaultValue="Medium"
            style={{width:'100%'}}
            value={state.task.priority}
            onChange={(e)=>handleChange('priority', e)}
            options={proiroties}
          />
        </Col>
        <Col md={6}>
          <div className='mt-2'>Category</div>
          <Select
            defaultValue="Air"
            style={{width:'100%'}}
            value={state.task.category}
            onChange={(e)=>handleChange('category', e)}
            options={categories}
          />
        </Col>
        <Col md={6}>
          <div className='mt-2'>Assign To</div>
          <Select
            style={{width:'100%'}}
            value={state.task.EmployeeId}
            onChange={(e)=>handleChange('EmployeeId', e)}
            options={state.employeeList.map((x)=>{ return {label:`${x.name} (${x.designation})`, value:x.id} })}
          />
        </Col>
        <Col md={6}>
          <div className='mt-2'>Status</div>
          <Select
            defaultValue="Backlog"
            style={{width:'100%'}}
            value={state.task.status}
            onChange={(e)=>handleChange('status', e)}
            options={statuses}
          />
        </Col>
        <Col md={6}>
          <div className='mt-2'>Due Date</div>
          <DatePicker value={state.task.due} onChange={(e)=>handleChange('due', e)}  />
        </Col>
        <Col md={12}><hr className='mt-3'/></Col>
        <Col md={4}>
          <button className='btn-custom px-5' disabled={state.load} >{!state.load?'Submit':<Spinner size='sm' />}</button>
        </Col>
      </Row>
      </form>
    </Modal>
  </>
  )
}

export default TasksList