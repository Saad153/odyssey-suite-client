import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap';
//import readXlsxFile from 'read-excel-file'

const Requests = ({sessionData}) => {

  useEffect(() => {
    if(sessionData.isLoggedIn==false){
      Router.push('/login')
    }
  }, [sessionData]);

  const [files, setFiles] = useState();

  return (
    <div className='base-page-layout'>
        
    </div>
  )
}

export default Requests