import React from 'react';
import axios from "axios";
import Cookies from 'cookies';
import CreateOrEditComp from '/Components/Layouts/Setup/Non_Gl_Parties/CreateOrEditComp';

const client = ({id, clientData}) => {
  return (
    <>
        <CreateOrEditComp id={id}  clientData={clientData} />
    </>
  )
}
export default client

export async function getServerSideProps(context) {
  const { params } = context;
  const { companyId } = context.req.cookies;

  
    const clientData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_NON_GL_PARTIES_BY_ID,{
      headers:{ "id": `${params.id}` }
    }).then((x)=>x.data.result);
    if (!clientData) {
      return {
        notFound: true
      }
    
  }
  return {
    props: { 
        id:params.id, 
        clientData:clientData
    }
  }
}