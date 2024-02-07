import React from 'react';
import axios from 'axios';
import Cookies from 'cookies';
import Main from '/Components/Layouts/Main/';

const index = ({sessionData, chartData}) => {
  return (
    <Main sessionData={sessionData} chartData={chartData} />
  )
}

export default index

export async function getServerSideProps({req,res}){
  
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  const chartData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_DASHBOARD_DATA)
  .then((x)=>x.data)

  return{
    props: { 
      sessionData:sessionRequest,
      chartData:chartData
    }
  }
}