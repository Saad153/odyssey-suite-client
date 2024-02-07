import React from 'react';
import Non_Gl_Parties from '/Components/Layouts/Setup/Non_Gl_Parties';
import axios from 'axios';
import Cookies from 'cookies';

const nonGlParties = ({clientData, sessionData}) => {
  console.log({clientData})
  return (
    <div>
      <Non_Gl_Parties clientData={clientData} sessionData={sessionData}/>
    </div>
  )
}
export default nonGlParties;

export async function getServerSideProps({req,res}){
  
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  const ClientsRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_NON_GL_PARTIES).then((x)=>x.data);
  return{
    props: { sessionData:sessionRequest, clientData:ClientsRequest }
  }
}