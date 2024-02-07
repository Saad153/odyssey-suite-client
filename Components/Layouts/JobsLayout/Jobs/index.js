import React, { useEffect, useReducer } from 'react';
import { recordsReducer, initialState } from './states';
import { getJobValues, getJobById } from '/apis/jobs';
import { useQuery } from '@tanstack/react-query';
import CreateOrEdit from './CreateOrEdit';
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";

const SeJob = ({id, type}) => {

  const { data, isSuccess:dataSuccess } = useQuery({queryKey: ['values'], queryFn: getJobValues});
  const { data:newdata, isSuccess, refetch } = useQuery({
    queryKey:["jobData", {id, type}], queryFn: () => getJobById({id, type}),
  });

  const companyId = useSelector((state) => state.company.value);
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);

  useEffect(() => {
    getData();
  }, [dataSuccess, isSuccess])
  
  const getData = async() => {
    let tempPerms = await JSON.parse(Cookies.get('permissions'));
    if(dataSuccess && newdata) {
      dispatch({type:'set',
        payload:{
          fields:data.result,
          selectedRecord:dataSuccess?newdata?.result:{},
          fetched:true,
          edit:id=="new"?false:true,
          permissions:tempPerms
        }
      })
    }
  }

  return (
  <div className='base-page-layout'>
    {state.fetched && 
      <CreateOrEdit
        jobData={isSuccess?newdata.result:{}}
        companyId={companyId}
        dispatch={dispatch}
        refetch={refetch}
        state={state}
        type={type}
        id={id}
      />
    }
  </div>
  )
}

export default React.memo(SeJob);