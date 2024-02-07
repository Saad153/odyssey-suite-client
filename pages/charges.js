import React from 'react';
import Charges from '/Components/Layouts/Setup/Charges';
import axios from 'axios';
import Cookies from 'cookies';

const charges = ({chargeData}) => {
  return (
    <Charges chargeData={chargeData} />
  )
}
export default charges;

export async function getServerSideProps({req, res}) {
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  const chargeData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHARGES)
  .then((x)=>x.data);

  return{ 
    props: { sessionData:sessionRequest, chargeData:chargeData }
  }
}