import React from 'react';
//import { useRouter } from 'next/router';
import axios from "axios";
import Jobs from '/Components/Layouts/JobsLayout/Jobs';

const aeExport = ({id, type}) => {
  return (
    <Jobs id={id} type={type} />
  )
}
export default aeExport

export async function getServerSideProps(context) {
  const { params } = context;
  return {
    props: { id:params.id, type:"AE" }
  }
}