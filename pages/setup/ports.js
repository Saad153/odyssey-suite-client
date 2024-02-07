import React from 'react'
import axios from 'axios';
import PortOfDischarge from '../../Components/Layouts/Setup/portOfDischarge';

const ports = ({portsData}) => {
  return (
    <div className='base-page-layout'>
        <PortOfDischarge portsData={portsData}/>
    </div>
  )
}

export default ports

export async function getServerSideProps(){
    const req = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_VIEW_PORT);
    const data = await req.data;

    return {
        props:{
            portsData:data
        }
    }
}