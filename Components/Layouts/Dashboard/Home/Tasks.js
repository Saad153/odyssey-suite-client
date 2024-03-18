import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { Spinner, Table } from "react-bootstrap";
import moment from 'moment';
import Cookies from 'js-cookie';
import { Modal, Switch, Select } from "antd";

const Tasks = () => {

const [tasks, setTasks] = useState([]);
const [isOpen, setIsOpen] = useState(false);
const [load, setLoad] = useState(true);
const [selected, setSelected] = useState({});

const statuses = [
  { value: 'Backlog', label: 'Backlog' },
  { value: 'In-progress', label: 'In-progress' },
  { value: 'In-Review', label: 'In-Review' },
  { value: 'Done', label: 'Done' },
];

  useEffect(() => {
    const req = async() => {
    let userId = await Cookies.get('loginId')
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_ASSIGNED_TASKS,{
      headers:{id:`${userId}`}
    }).then((x) => {
      if(x.data.status === 'success') {
        setTasks(x.data.result);
        setLoad(false);
        // console.log(x.data.result)
      }})
    };
    req();
  }, []);

  const handleCancel = () => setIsOpen(false)

  const handleOk = () => {

  };

  const toggleSubtask = (subTask) => {
    let status = subTask.status=="0"?"1":"0";
    let task = {...selected}
    let taskList = [...tasks]
    task.Sub_Tasks.forEach((x)=>{
      if(x.id==subTask.id){
        x.status = status
      }
    });
    taskList.forEach((x)=>{
      if(x.id==selected.id){
        x.Sub_Tasks = task.Sub_Tasks
      }
    });
    setTasks(taskList)
    setSelected(task)
    
    axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_TOGGLE_SUBTASK,{
      status:status,
      id:subTask.id
    }).then((x)=>{
      console.log(x.data)
    })
  }

  const handleStatus = (e) => {
    let taskList = [...tasks]
    let status = e;
    setSelected({
      ...selected,
      status:e
    });

    taskList.forEach((x)=>{
      if(x.id==selected.id){
        x.status = e
      }
    });
    setTasks(taskList)

    axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CHANGE_TASK_STATUS,{
      status:status,
      id:selected.id
    })
  }

  const priorityColor = (priority) => {
    return priority=="Low"?
      'silver':
      priority=="Medium"?"yellow":
      priority=="High"?"orange":
      priority=="Highest"?"red":
      "white"
  }

  return (
  <div className="notificationSide">
    {!load && <div className='' style={{maxHeight:500, overflowY:'auto'}}>
      <Table className='tableFixHead'>
      <thead>
        <tr>
          <th>Sr.</th>
          <th>Title</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Due Date</th>
        </tr>
      </thead>
      <tbody>
      {tasks.map((x, index) => {
        return (
          <tr key={index} className='f row-hov' 
            onClick={()=>{
              setIsOpen(true);
              setSelected(x);
            }}
          >
            <td>{index + 1}</td>
            <td>{x.title}</td>
            <td>
              <div style={{display:'inline-block'}}> {x.priority} </div>{" "}
              <div style={{display:'inline-block', border:'1px solid silver', borderRadius:100,height:10, width:10,
                background:priorityColor(x.priority), // <- None priority
                }}></div>
            </td>
            <td>{x.status}</td>
            <td>{moment(x.due).format("MMM / dddd / D")}</td>
          </tr>
      )})}
      </tbody>
      </Table>
    </div>
    }
    { load && <div className='text-center py-5'><Spinner  /></div> }
    <Modal 
      open={isOpen} 
      onOk={handleOk}
      onCancel={handleCancel} 
      title={selected.title}
      footer={false}
    >
      <div>
        <h6 className='my-2'><b>Sub Tasks</b></h6>
        <div>
          {selected?.Sub_Tasks?.map((x)=>{
            return(
            <div
              key={x.id}
              style={{display:'flex', cursor:'pointer', justifyContent:'space-between', alignItems:'center', border:'1px solid silver', padding:"4px 10px", marginBottom:4, borderRadius:4}}
              onClick={()=>toggleSubtask(x)}
            >
              <div>{x.title}</div>
              <Switch size="small" checked={x.status=="0"?false:true} />
            </div>
          )})}
        </div>
        <h6 className='mt-3 mb-2'><b>Status</b></h6>
        <div>
          <Select
            value={selected.status}
            style={{ width: '100%' }}
            onChange={handleStatus}
            options={statuses}
          />
        </div>
        <h6 className='mt-3 mb-2'><b>Priority</b></h6>
        <div style={{display:'flex', border:'1px solid silver', padding:'4px 10px', borderRadius:4, alignItems:'center'}}>
          <div style={{backgroundColor:priorityColor(selected.priority), height:10, width:10, marginRight:5}} >{}</div>
          {selected.priority}
        </div>
        <h6 className='mt-3 mb-2'><b>Due Date</b></h6>
        <div style={{display:'flex', border:'1px solid silver', padding:'4px 10px', borderRadius:4, alignItems:'center'}}>
          <div style={{backgroundColor:priorityColor(selected.priority), height:10, width:10, marginRight:5}} >{}</div>
          Done By: {moment(selected.due).format("MMM / dddd / D")}
        </div>
      </div>
    </Modal>
  </div>
  )
}

export default React.memo(Tasks)