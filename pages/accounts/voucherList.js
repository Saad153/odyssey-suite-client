import React from 'react';
import VoucherList from '/Components/Layouts/AccountsComp/Voucher/VoucherList';
import Cookies from 'cookies';
import axios from 'axios';

const voucherList = ({ sessionData, voucherData }) => {
  return (
    <VoucherList sessionData={ sessionData} voucherData={voucherData } />
  )
}

export default voucherList

export async function getServerSideProps({req, res}) {
  const cookies = new Cookies(req, res)
  const sessionData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  const voucherData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_VOUCHERS,{
    headers:{
      "id":`${cookies.get('companyId')}`,
      "offset":0
    }
  })
  .then((x)=>x.data);

  return{ 
    props: { sessionData, voucherData }
  }
}