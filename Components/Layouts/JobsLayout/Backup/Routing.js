import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { Row, Col } from 'react-bootstrap';

const RoutingBackup = ({data,type}) => {
  return (
    <div>
        {data && data.map((x,i)=>{
            return(
                <div key={i}>
                <Row>
                    <Col md={6}>
                        <div className="mt-1 fs-13">Port Of Loading</div>
                        <Input disabled defaultValue={x.port_of_loading?x.port_of_loading:""} 
                        className='fs-12'/>
                        <div className="mt-1 fs-13">Port Of Discharge</div>
                        <Input disabled defaultValue={x.port_of_discharge?x.port_of_discharge:""} 
                        className='fs-12'/>
                        <div className="mt-1 fs-13">Final Destination</div>
                        <Input disabled defaultValue={x.finaldestination_name?x.finaldestination_name:""} 
                        className='fs-12'/>
                        <div className="mt-1 fs-13">Frieght Payable At</div>
                        <Input disabled
                        className='fs-12'/>
                        <div className="mt-1 fs-13">Terminal</div>
                        <Input disabled defaultValue={x.terminal?x.terminal:""} 
                        className='fs-12'/>
                        <div className="mt-1 fs-13">Delivery</div>
                        <Input disabled defaultValue={""} 
                        className='fs-12'/>
                    </Col>
                    <Col md={6}>
                        <div className="mt-1 fs-13">Date</div>
                        <Input disabled defaultValue={""} 
                        className='fs-12'/>
                        <div className="mt-1 fs-13">Date</div>
                        <Input disabled defaultValue={""} 
                        className='fs-12'/>
                    </Col>
                </Row>
                </div>
            )
        })}
    </div>
  )
}

export default RoutingBackup