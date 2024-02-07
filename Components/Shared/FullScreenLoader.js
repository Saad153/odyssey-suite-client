import React from 'react';
import { Spinner } from 'react-bootstrap';

const FullScreenLoader = () => {
  return (
    <div style={{
        position:'fixed',
        height:"100vh",
        top:0,
        left:0,
        width:'100vw',
        zIndex:10,
        paddingTop:'40vh'
    }} className="bg-trans-grey">
        <h1 className='text-center'>Please Wait <Spinner/></h1>
    </div>
  )
}

export default FullScreenLoader
