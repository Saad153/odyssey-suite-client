import React from 'react';
import JobBalancingReport from '/Components/Layouts/Reports/JobBalancing/JobBalancingReport';
import axios from 'axios';

const report = ({result, query}) => {
  return (
    <JobBalancingReport result={result} query={query} />
  )
}

export default report

export async function getServerSideProps(context) {
    const { query } = context;
    const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_JOB_BALANCING,{
        headers:{
            "company":        query.company      ,
            "overseasagent":  query.overseasagent,
            "representator":  query.representator,
            "currency":       query.currency     ,
            "from":           query.from         ,
            "to":             query.to           ,
            "paytype":        query.paytype      ,
            "jobtypes":       query.jobtypes     ,
            "party":          query.party        ,
        }
        }).then((x)=>x.data)
    return{ 
        props: {
            result,
            query
        }
    }
}