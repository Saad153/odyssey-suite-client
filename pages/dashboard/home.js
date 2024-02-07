import React from 'react';
import Home from '/Components/Layouts/Dashboard/Home/';
import axios from 'axios';
import Cookies from 'cookies';

const home = ({sessionData}) => {
  return (
    <Home sessionData={sessionData} />
  )
}

export default home

export async function getServerSideProps({req,res}){
    const cookies = new Cookies(req, res)
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
      headers:{"x-access-token": `${cookies.get('token')}`}
    }).then((x)=>x.data);
  
    return{
        props: { sessionData:sessionRequest,  }
    }
}