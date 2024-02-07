import React from 'react'
import PrintComp from './PrintComp';
import { useState } from 'react';
import Column1 from './Column1';
import Column2 from './Column2';
import Column3 from './Column3';
import { Popover } from 'antd';
import { Row, Col, Spinner } from "react-bootstrap";

const LoadingForm = ({handleSubmit, register, control, onSubmit, state, load, allValues}) => {

  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <div>
    <form className="d-flex justify-content-between flex-column">
      
    <Popover content={<div>{(open && allValues.id ) && <PrintComp allValues={allValues} state={state} />}</div>}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <button type="button" className="btn-custom mt-1" style={{width:"100px"}}>Print</button>
    </Popover>
    <div className='d-flex d-flex justify-content-between'>

    <Column1 registr={register} control={control} state={state} />
    <Column2 registr={register} control={control} state={state} />
    <Column3 registr={register}  load={load} control={control} state={state} />
    </div>
    <Row>
      <Col>
        <button type="button" className="btn-custom mt-1" onClick={handleSubmit(onSubmit)}>
          {load ? <Spinner size='sm'/> : "Save Data"}
        </button>
      </Col>
    </Row>
    </form>
  </div>
  )
}

export default LoadingForm