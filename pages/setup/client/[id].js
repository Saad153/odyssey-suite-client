import React from 'react';
import axios from "axios";
import Cookies from 'cookies';
import CreateOrEditComp from '/Components/Layouts/Setup/Client/CreateOrEditComp';

const client = ({id, representativeData, clientData}) => {
  return (
    <>
        <CreateOrEditComp id={id}  representativeData={representativeData} clientData={clientData} />
    </>
  )
}
export default client

export async function getServerSideProps(context) {
  const { params } = context;
  let clientData = {};
  const { companyId } = context.req.cookies;

  const representativesRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_REPRESENTATIVES_EMPLOYEES,{
    headers:{"id": `${companyId}`}
  }).then((x)=>x.data);
  if(params.id!="new"){
    clientData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_CLIENT_BY_ID,{
      headers:{ "id": `${params.id}` }
    }).then((x)=>x.data.result);
    if (!clientData) {
      return {
        notFound: true
      }
    }
  }
  return {
    props: { 
        id:params.id, 
        representativeData:representativesRequest,
        clientData:clientData
    }
  }
}