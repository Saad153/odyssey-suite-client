import React from 'react';
import OfficeVouchers from '/Components/Layouts/AccountsComp/OfficeVouchers';
import axios from 'axios';

const list = ({voucherList}) => {
  return (
    <OfficeVouchers voucherList={voucherList} />
  )
}

export default list
//
export async function getServerSideProps(context) {
  const { companyId } = context.req.cookies;
    const voucherList = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_OFFICE_VOUCHERS,{
      headers:{ "companyId": `${companyId}` }
    }).then((x)=>x.data.result);
  return{ 
    props: {
      voucherList
    }
  }
}