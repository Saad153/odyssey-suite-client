import React from 'react';
import Requests from '/Components/Layouts/Dashboard/Requests';
import axios from 'axios';
import Cookies from 'cookies';

const requests = ({sessionData}) => {
  return (
    <Requests sessionData={sessionData} />
  )
}

export default requests

export async function getServerSideProps({req,res}) {

    const cookies = new Cookies(req, res);
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
      headers:{"x-access-token": `${cookies.get('token')}`}
    }).then((x)=>x.data);

    return{
        props: { sessionData:sessionRequest,  }
    }
}