import React from 'react'
import RiderAssign from '../../../../Components/Layouts/Tasks/RiderAssign'
import axios from 'axios'
const riderTasks = ({riderData, id, tasks}) => {
  return (
    <div>
      <RiderAssign riderData={riderData} id={id} tasks={tasks}/>
    </div>
  )
}

export default riderTasks


export async function getServerSideProps(context) {
  const { params } = context;
  let riderData = '';
  let tasks = []

  if(params.id!="new"){
    // riderData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_EMPLOYEE_ID_AND_NAME,{})
    tasks = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_EMPLOYEE_TASK,{
      headers:{ "id": `${params.id}` }
    }).then((x)=>x.data.result);
  }
  return {
    props: { riderData:riderData, tasks:tasks, id:params.id }
  }
}