import React from 'react';
import PaymentsReceiptNew from '/Components/Layouts/AccountsComp/PaymentsReceiptNew';
import axios from 'axios';

const paymentReceipt = ({id, voucherData}) => {
  return <PaymentsReceiptNew id={id} voucherData={voucherData} />
}
export default paymentReceipt

export async function getServerSideProps(context) {
    const { params } = context;
    let voucherData = {};
    
    if(params.id!="new"&&params.id!="undefined"){
        voucherData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VOUCHER_BY_ID_ADVANCED,{
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