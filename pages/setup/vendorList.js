import React from 'react';
import axios from 'axios';
import Cookies from 'cookies';
import Vendor from '/Components/Layouts/Setup/Vendor/';

const vendorList = ({sessionData, vendorData}) => {
  return (
    <Vendor sessionData={sessionData} vendorData={vendorData} />
  )
}
export default vendorList

export async function getServerSideProps({req,res}){
  
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  // const representativesRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_REPRESENTATIVES_EMPLOYEES,{
  //   headers:{"id": `${cookies.get('companyId')}`}
  // }).then((x)=>x.data);

  const vendorsRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_VENDORS).then((x)=>x.data);
  
  return{
    props: { 
      sessionData:sessionRequest, 
      //representativeData:representativesRequest, 
      vendorData:vendorsRequest 
    }
  }
}