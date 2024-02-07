import React from 'react';
import InvoiceAndBills from '../../Components/Layouts/AccountsComp/InvoiceAndBills';
import axios from 'axios';

const invoiceAndBills = ({invoiceData}) => {
  return (
    <InvoiceAndBills invoiceData={invoiceData} />
  )
}
export default invoiceAndBills

export async function getServerSideProps({req,res}){
  
  const invoiceData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_FILTERED_INVOICES,{
    headers:{ "type": "Job Invoice" }
  }).then((x)=>x.data);

  return{
      props: { invoiceData:invoiceData }
  }
}