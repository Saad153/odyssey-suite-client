import React from 'react'
import Column1 from './Column1';
import Column2 from './Column2';
import Column3 from './Column3';
import { Col } from 'react-bootstrap';

const LoadingForm = ({handleSubmit, register, control, onSubmit, state, load, allValues, jobData, clearingAgents, calculatePrice}) => {

  return (
  <div style={{overflowY:"scroll", height:700, overflowX:"hidden"}}>
    <form className="d-flex justify-content-between flex-column" >
      <Col>
        <Column1 registr={register} control={control} state={state} jobData={jobData} allValues={allValues} calculatePrice={calculatePrice} />
        <hr />
        <Column2 registr={register} control={control} state={state} jobData={jobData} clearingAgents={clearingAgents} />
        <hr />
        <Column3 registr={register}  load={load} control={control} state={state}  onSubmit={onSubmit} handleSubmit={handleSubmit}/>
      </Col>
      <Col md={3} className='py-3'>
        <button className='btn-custom' onClick={handleSubmit(onSubmit)}>Save DO</button>
      </Col>
    </form>
  </div>
  )
}

export default LoadingForm