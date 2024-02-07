import React from 'react';
import axios from 'axios';
import CreateOrEditComp from '/Components/Layouts/Setup/Vendor/CreateOrEditComp';

const vendor = ({sessionData, representativeData, vendorData, id}) => {
  return (
    <CreateOrEditComp sessionData={sessionData} representativeData={representativeData} vendorData={vendorData} id={id} />
  )
}
export default vendor

export async function getServerSideProps(context){
  
  const { params } = context;
  const { companyId, token } = context.req.cookies;
  let vendorsRequest = {}

  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${token}`}
  }).then((x)=>x.data);

  const representativesRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_REPRESENTATIVES_EMPLOYEES,{
    headers:{"id": `${companyId}`}
  }).then((x)=>x.data);
  
  if(params.id!="new"){
    vendorsRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VENDOR_BY_ID,{
      headers:{ "id": `${params.id}` }
    }).then((x)=>x.data);
  }
  
  return{
    props: { 
      sessionData:sessionRequest, 
      representativeData:representativesRequest, 
      vendorData:vendorsRequest,
      id:params.id
    }
  }
}