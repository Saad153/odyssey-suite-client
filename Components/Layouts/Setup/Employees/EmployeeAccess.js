import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EmployeeAccess = () => {

  const [values, setValues] = useState({
    name:'',
  })

  useEffect(() => {
    fetchData();
    console.log('Acess Page') ;
  }, [])

  const fetchData = async() => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_EMPLOYEES)
    .then((x)=>console.log(x.data));
  }

  return (
    <div>
      Employee Access
    </div>
  )
}

export default EmployeeAccess
