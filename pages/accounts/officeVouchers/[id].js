import React from 'react';
import OfficeVoucher from '/Components/Layouts/AccountsComp/OfficeVouchers/OfficeVoucher';
import axios from 'axios';

const officeVoucher = ({voucherData, id, employeeData}) => {
  return (
    <OfficeVoucher voucherData={voucherData} id={id} employeeData={employeeData} />
  )
}

export default officeVoucher

export async function getServerSideProps(context) {
  const { params } = context;
  let voucherData = { }
  const employeeData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_EMPLOYEE_ID_AND_NAME)
  .then((x)=>x.data.result);
  if(params.id!="new") {
    voucherData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_OFFICE_VOUCHER_BY_ID,{
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
      id:params.id,
      employeeData
    }
  }
}