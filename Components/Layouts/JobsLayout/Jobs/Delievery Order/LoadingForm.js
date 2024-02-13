import React, { useRef } from 'react'
import Column1 from './Column1';
import Column2 from './Column2';
import Column3 from './Column3';
import { Col } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import DoPrint from './PrintComp';
import { useSelector } from 'react-redux';

const LoadingForm = ({ handleSubmit, register, control, onSubmit, state, load, allValues, jobData, clearingAgents, calculatePrice }) => {
  let inputRef = useRef(null);
  const companyId = useSelector((state) => state.company.value);
  return (
    <>
      <div style={{ overflowY: "scroll", height: 700, overflowX: "hidden" }}>
        <form className="d-flex justify-content-between flex-column" >
          <Col>
            <Column1 registr={register} control={control} state={state} jobData={jobData} allValues={allValues} calculatePrice={calculatePrice} />
            <hr />
            <Column2 registr={register} control={control} state={state} jobData={jobData} clearingAgents={clearingAgents} />
            <hr />
            <Column3 registr={register} load={load} control={control} state={state} onSubmit={onSubmit} handleSubmit={handleSubmit} />
          </Col>
          <Col md={3} className='py-3'>
            <button className='btn-custom' onClick={handleSubmit(onSubmit)}>Save DO</button>
            {/* print trigger */}
            {Object.keys(jobData).length > 0 && (
              <button type="button">
                <ReactToPrint
                  content={() => inputRef}
                  trigger={() => <div className='div-btn-custom text-center px-3 py-2'>Print</div>}
                />
              </button>
            )}
          </Col>
          {/* Printing Component */}
          <div style={{
            display: "none"
          }}>
            <div ref={(response) => (inputRef = response)}>
              {
                Object.keys(jobData).length > 0 ? <DoPrint companyId={companyId} state={state} allValues={allValues} /> : null
              }
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default LoadingForm