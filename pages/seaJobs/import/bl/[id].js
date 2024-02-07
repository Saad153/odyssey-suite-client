import React from 'react';
import BlComp from '/Components/Layouts/JobsLayout/BlComp';
import axios from "axios";

const siBl = ({id, blData, partiesData}) => {
  return (
    <div>
      <BlComp id={id} blData={blData} partiesData={partiesData} type={"SI"} />
    </div>
  )
}

export default siBl

export async function getServerSideProps(context) {
  const { params } = context;
  const partiesData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_NOTIFY_PARTIES)
  .then((x)=>x.data.result);
  let blData = {};
  if(params.id!="new"){
    blData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_BL_BY_ID,{
      headers:{ "id": `${params.id}` }
    }).then((x)=>x.data.result);
    if (!blData.id) {
      return {
        notFound: true
      }
    }
  }
  return {
    props: { 
        blData:blData, 
        id:params.id,
        partiesData:partiesData
    }
  }
}