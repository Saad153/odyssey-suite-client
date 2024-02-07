import OpeningInvoice from '/Components/Layouts/AccountsComp/OpeningInvoices/OpeningInvoice';
import React from 'react';
import axios from 'axios';

const openingInvoices = () => {
  return <OpeningInvoice/>
}
export default openingInvoices;

// export async function getServerSideProps(context) {
//     const { params } = context
//     let voucherData = { }
//     if(params.id!="new") {
//         voucherData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VOUCHER_BY_ID, {
//             headers: { "id": `${params.id}` }
//         })
//         .then((x)=> x.data.result )
//         if (!voucherData.id) {
//             return { notFound: true }
//         }
//     }

//     return { props: { voucherData, id:params.id }}
// }