import React from 'react';
import Vessel from '/Components/Layouts/Setup/Vessel';
import axios from 'axios';
import Cookies from 'cookies';

const vessel = ({VesselData, sessionData}) => {
  return (
    <Vessel VesselData={VesselData} sessionData={sessionData} />
  )
}
export default vessel

export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res);
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);
  const VesselRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VESSELS).then((x)=>x.data);

  return{
      props: { sessionData:sessionRequest, VesselData:VesselRequest }
  }
}