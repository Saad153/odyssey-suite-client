import React from 'react';
//import { useRouter } from 'next/router';
import axios from "axios";
import Jobs from '/Components/Layouts/JobsLayout/Jobs';

const seExport = ({id, type}) => {
  return (
    <>
      <Jobs id={id} type={type} />
    </>
  )
}
export default seExport

export async function getServerSideProps(context) {
  const { params } = context;

  return {
    props: { id:params.id, type:"SE" }
  }
}