import React from 'react';
import BlList from '/Components/Layouts/JobsLayout/BlList/';
import axios from 'axios';

const seBlList = ({partiesData, BlsData}) => {
  return <BlList partiesData={partiesData} BlsData={BlsData} type={"SE"} />
}
export default seBlList

export async function getServerSideProps({ req, res }){

  const partiesData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_NOTIFY_PARTIES).then((x)=>x.data.result);
  const BlsData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_BLS).then((x)=>x.data.result)

  return{
    props: { partiesData:partiesData, BlsData }
  }
}