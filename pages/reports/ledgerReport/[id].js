import React from 'react';
import axios from 'axios';
import LedgerReport from '/Components/Layouts/Reports/Ledger/LedgerReport';

const paymentReceipt = ({voucherData, from, to, name, company, currency}) => {
  return <LedgerReport voucherData={voucherData} from={from} to={to} name={name} company={company} currency={currency} />
}
export default paymentReceipt

export async function getServerSideProps(context) {
    const { query } = context;
    const voucherData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VOUCEHR_LEDGER_BY_DATE, {
        headers:{ id: query.id, from:query.from, to: query.to, currency:query.currency }}
    ).then((x)=>x.data);
    return{ 
        props: {
            voucherData:voucherData, 
            from:query.from,
            to:query.to, 
            name:query.name,
            company:query.company,
            currency:query.currency
        }
    }
}