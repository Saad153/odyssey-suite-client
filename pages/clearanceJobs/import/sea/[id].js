import React from 'react';
import Jobs from '/Components/Layouts/ClearanceJobsLayout/Jobs';

const airExport = ({id, type}) => {
  return <Jobs id={id} type={type} />
}
export default airExport

export async function getServerSideProps(context) {
  const { params } = context;

  return {
    props: { id:params.id, type:"CSI" }
  }
}