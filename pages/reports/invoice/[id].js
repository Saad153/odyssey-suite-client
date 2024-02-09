import axios from "axios"
import {useSelector} from 'react-redux';
import InvoiceCharges from '../../../Components/Shared/InvoiceCharges';

const InvoiceDetails = ({invoiceData}) => {
  const companyId = useSelector((state) => state.company.value);
  return (
    <div className='base-page-layout'>
      <InvoiceCharges data={invoiceData} companyId={companyId}/>
    </div>
  );
};

export default InvoiceDetails;

export async function getServerSideProps(context) {
  const { params } = context;
  const invoiceData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BY_ID, {
    headers: { "invoiceid": `${params.id}`}
  }).then((x)=>x.data.result)
  return {
    props:{
      invoiceData:invoiceData
    }
  }
}