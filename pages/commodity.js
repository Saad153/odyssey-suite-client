import React from 'react';
import Commodity from '/Components/Layouts/Setup/Commodity';
import axios from 'axios';
import Cookies from 'cookies';

const commodity = ({CommodityData, sessionData}) => {
  return (
    <Commodity CommodityData={CommodityData} sessionData={sessionData} />
  )
}
export default commodity

export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res);
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);
  const CommodityRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_CREATE_COMMODITY).then((x)=>x.data);

  return{
      props: { sessionData:sessionRequest, CommodityData:CommodityRequest }
  }
}