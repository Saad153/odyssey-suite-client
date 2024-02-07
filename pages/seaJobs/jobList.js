import React from 'react'
import JobList from '/Components/Layouts/JobsLayout/JobList'
import axios from 'axios'
const jobList = ({data}) => {
  return (
    <div>
        <JobList data={data}/>
    </div>
  )
}

export default jobList


export async function getServerSideProps({req,res}){

  const data = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_SEAJOB_VALUES_JOB_LIST)
  .then((x)=>x.data.result);
  
 
  return{
      props: { data:data }
  }
}