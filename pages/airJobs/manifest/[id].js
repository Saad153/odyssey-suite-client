import React from 'react'
import CreateOrEdit from '/Components/Layouts/Manifest/CreateOrEdit'
import axios from 'axios'
const index = ({manifest, awb}) => {
  return (
    <CreateOrEdit manifest={manifest} awbNo={awb}/>
  )
}

export default index

export async function getServerSideProps(context){
    const {params} = context;
    const values = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_MANIFEST_BY_ID, {headers:{id: params.id}})
    .then((x)=>x.data);
    const awb = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_AWB_NUMBER)
    .then((x)=>x.data);
    return{
      props: { manifest :values, awb }
    }
  }