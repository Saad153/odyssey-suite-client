import React from 'react';
//import Accounts from '../../Components/Layouts/Accounts';
import ChartOFAccount from '../../Components/Layouts/AccountsComp/ChartOFAccount';
import axios from 'axios';
import Cookies from 'cookies';

const accounts = ({accountsData}) => {
  return (
    <div>
      <ChartOFAccount accountsData={accountsData} />
    </div>
  )
}

export default accounts

export async function getServerSideProps({req,res}){

  const cookies = new Cookies(req, res)
  const accountRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_ACCOUNTS,{
      headers:{
          "id": `${cookies.get('companyId')}`
      }
  }).then((x)=>x.data);
  const accountsData = await accountRequest

  return{
      props: { accountsData:accountsData }
  }
}