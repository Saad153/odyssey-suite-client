import React from 'react'
import  Manifest  from '/Components/Layouts/Manifest'
import axios from 'axios'

const manifist = ({manifest}) => {
  return (
    <Manifest manifest={manifest}/>
  )
}

export default manifist


export async function getServerSideProps(){
  
  const values = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_MANIFEST)
  .then((x)=>x.data.result);

  return{
    props: { manifest : values }
  }
}