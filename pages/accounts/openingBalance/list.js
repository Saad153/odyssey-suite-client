import React from 'react';
import OpeningBalance from '/Components/Layouts/AccountsComp/OpeningBalance/List';
import axios from 'axios';
import Cookies from 'cookies';

const openingBalancesList = ({ sessionData, openingBalancesList }) => {
  return (
    <OpeningBalance  sessionData={sessionData} openingBalancesList={openingBalancesList} />
  )
}

export default openingBalancesList;

export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res)
  const sessionData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  const openingBalancesList = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_OPENING_BALANCES,{
    headers:{"id": `${cookies.get('companyId')}`}
  }).then((x)=>x.data);
  return{
      props: { sessionData, openingBalancesList }
  }
}