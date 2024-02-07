import React from 'react';
import Client from '/Components/Layouts/Setup/Client';
import axios from 'axios';
import Cookies from 'cookies';

const clientList = ({sessionData, representativeData, clientData}) => {
  return (
    <div>
      <Client sessionData={sessionData} representativeData={representativeData} clientData={clientData} />
    </div>
  )
}
export default clientList;

export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  const representativesRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_REPRESENTATIVES_EMPLOYEES,{
    headers:{"id": `${cookies.get('companyId')}`}
  }).then((x)=>x.data);

  const ClientsRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CLIENTS,{
    headers:{"id": `${cookies.get('companyId')}`}
  }).then((x)=>x.data);
  return{
      props: { sessionData:sessionRequest, representativeData:representativesRequest, clientData:ClientsRequest }
  }
}