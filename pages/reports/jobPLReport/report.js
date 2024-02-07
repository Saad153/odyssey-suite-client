import React from 'react';
import Report from '/Components/Layouts/Reports/JobPL/Report';

const report = ({query}) => {
  return (
    <Report query={query} />
  )
}

export default report

export async function getServerSideProps(context) {
    const { query } = context;
    return{ 
        props: {
            query
        }
    }
}