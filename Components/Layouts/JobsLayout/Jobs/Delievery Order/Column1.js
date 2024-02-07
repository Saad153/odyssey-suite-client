import React, { useEffect } from 'react'
import {  Row, Col } from 'react-bootstrap';
import DateComp from "/Components/Shared/Form/DateComp";
import InputComp from "/Components/Shared/Form/InputComp";
import { Input } from 'antd';
 

const Column1 = ({register, control, state, jobData, allValues, calculatePrice}) => {

  let exporter = jobData.shipperId &&  state.fields.party.shipper?.filter((x) => x.id == jobData.shipperId)
  let importer = jobData.consigneeId && state.fields.party.consignee?.filter((x) => x.id == jobData.consigneeId)
  let vessel = jobData.vesselId && state.fields.vessel?.filter((x) => x.id == jobData.vesselId)

  return (
    <div>
      <Row md={6}>
        <Col md={3}>
          <div className='fs-12'>Job No # :</div>
          <div style={{border:'1px solid silver', padding:"7px 1px 4px 4px"}}>{state.selectedRecord.jobNo}</div>
        </Col>
        <Col md={3}>
          <InputComp label="DO #" name="doNo" disabled={allValues.id==""?false:true} register={register} control={control}/>
        </Col>
        </Row>
        <Row md={6} className='fs-12'>
        <Col md={3}>
          <DateComp width={"100%"} name="date" label="Date" control={control} register={register}/>
        </Col>
        <Col md={3}>
          <DateComp width="100%" name="validDate" label="Valid Date" control={control} register={register}/>
        </Col>
      </Row>
      <hr />
      <Row className="fs-12">
        <Col md={4}><Col>
        <div className='fs-12'>Exporter</div>
        <div style={{border:'1px solid silver', padding:"7px 1px 4px 4px"}}>{exporter && exporter[0].name}</div>
        </Col>
        <Col className='mt-1'>
        <div className='fs-12'>Importer</div>
        <div style={{border:'1px solid silver', padding:"7px 1px 4px 4px"}}>{importer && importer[0].name}</div>
        </Col>
        <Col className='mt-1'>
        <div className='fs-12'>Vessel</div>
        <div style={{border:'1px solid silver', padding:"7px 1px 4px 4px"}}>{vessel && vessel[0].name}</div>
        </Col>
        <Col className='mt-1'>
        <div className='fs-12'>Voyage</div>
        <div style={{border:'1px solid silver', padding:"7px 1px 4px 4px", minHeight:32}}>{jobData.Voyage?.voyage}</div>
        </Col>
    

        <Row className='fs-12 mt-1'>
        <Col md={6}>
        <div className='fs-12'>HBL</div>
        <div style={{border:'1px solid silver', padding:"7px 1px 4px 4px", minHeight:32}}>{jobData.Bl?.hbl}</div>
        </Col>
        <Col md={6}>
        <div className='fs-12'>HBL Date</div>
        <div style={{border:'1px solid silver', padding:"7px 1px 4px 4px", minHeight:32}}>{jobData.Bl?.hblDate.substring(0, 10)}</div>
        </Col>
        </Row>
        </Col>
        <Col md={4}>
        <Row className=''>
          <Col>
            <div className='fs-12'>MBL</div>
            <div style={{border:'1px solid silver', padding:"7px 1px 4px 4px", minHeight:33}}>{jobData.Bl?.mbl}</div>
          </Col>
        </Row>
        <Col className='mt-1'>
          <div>Net Amount</div>
          <Input value={calculatePrice.receivable} />
        </Col>
        <Col className='mt-1'>
          <div>Received</div>
          <Input value={calculatePrice.recieved} />
        </Col>
        <Col className='mt-1'>
          <InputComp register={register} name="balance" label="Balance" control={control} />
        </Col>
        <Col className='mt-1'>
          <InputComp register={register} name="refNo" label="Refrence No" control={control} />
        </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Column1