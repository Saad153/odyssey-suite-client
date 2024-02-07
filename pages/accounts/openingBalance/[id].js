import React from 'react';
import OpeningBalance from '../../../Components/Layouts/AccountsComp/OpeningBalance';
import axios from 'axios';

const openingBalance = ({id, voucherData}) => {
  return (
    <OpeningBalance id={id} voucherData={voucherData} />
  )
}

export default openingBalance;

export async function getServerSideProps(context) {
  const { params } = context;
  let voucherData = {};
  
  if(params.id!="new"){
      voucherData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VOUCHER_BY_ID,{
      headers:{ "id": `${params.id}` }
      }).then((x)=>x.data.result);
      if (!voucherData.id) {
      return {
          notFound: true
        }
      }
  }
  return{ 
      props: {
          voucherData,
          id:params.id
      }
  }
}