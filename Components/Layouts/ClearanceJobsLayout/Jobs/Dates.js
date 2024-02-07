import React from 'react';
import DateComp from '../../../Shared/Form/DateComp';
import TimeComp from '../../../Shared/Form/TimeComp';
import { Row, Col } from 'react-bootstrap'

const Dates = ({register, control}) => {
  return (
    <>
    <Row className='my-1'>
        <Col md={6}>
            <DateComp register={register} name='aesDate' control={control} label='AES Date' />
        </Col>
        <Col md={6}>
            <TimeComp register={register} name='aesTime' control={control} label="AES Time" />
        </Col>
    </Row>
    <Row className='my-1'>
        <Col md={6}>
            <DateComp register={register} name='siCutOffDate' control={control} label='SI Cut Off Date' />
        </Col>
        <Col md={6}>
            <TimeComp register={register} name='siCutOffTime' control={control} label="SI Cut Off Time" />
        </Col>
    </Row>
    <Row className='my-1'>
        <Col md={6}>
            <DateComp register={register} name='eRcDate' control={control} label='Earliest Reciveable Date' />
        </Col>
        <Col md={6}>
            <TimeComp register={register} name='eRcTime' control={control} label="Earliest Reciveable Time" />
        </Col>
    </Row>
    <Row className='my-1'>
        <Col md={6}>
            <DateComp register={register} name='eRlDate' control={control} label='Earliest Release Date' />
        </Col>
        <Col md={6}>
            <TimeComp register={register} name='eRlTime' control={control} label="Earliest Release Time" />
        </Col>
    </Row>
    <Row className='my-1'>
        <Col md={12}>
            <DateComp register={register} name='doorMove' control={control} label='Door Move Date' />
        </Col>
    </Row>
    <Row className='my-1'>
        <Col md={6}>
            <DateComp register={register} name='vgmCutOffDate' control={control} label='VGM Cut Off Date' />
        </Col>
        <Col md={6}>
            <TimeComp register={register} name='vgmCutOffTime' control={control} label='VGM Cut Off Time' />
        </Col>
    </Row>
    </>
  )
}

export default Dates
