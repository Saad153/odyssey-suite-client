import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { Row, Col } from 'react-bootstrap';

const BookingInfoBackup = ({ data, type }) => {
    const Space = () => <div className='mt-2' />
    return (
        <>
        {data && data.map((x, i) => {
            return (
            <div key={i}>
                <Row>
                    <Col md={2}>
                        <div className="mt-1 fs-13">Job No.</div>
                        <Input defaultValue={x.job__?x.job__:""} 
                        className='fs-12'/>
                    </Col>
                    <Col md={2}>
                        <div className="mt-1 fs-13">Job Type</div>
                        <Input disabled />
                    </Col>
                    <Col md={2}>
                        <div className="mt-1 fs-13">Job Kind</div>
                        <Input disabled />
                    </Col>
                    <Col md={2}>
                        <div className="mt-1 fs-13">Job Date</div>
                        <Input disabled defaultValue={x.jobdate?x.jobdate:"" } 
                        className='fs-12'/>
                    </Col>
                    <Col md={2}>
                        <div className="mt-1 fs-13">Ship Date</div>
                        <Input disabled defaultValue={x.delivery_date?x.delivery_date:""} 
                        className='fs-12'/>
                    </Col>
                    <Col md={2}>
                        <div className="mt-1 fs-13">Ship Status</div>
                        <Input disabled className='fs-12'/>
                    </Col>
                </Row>
                <Row>
                    <Col md={1}>
                        <div className="mt-1 fs-13">Cost Cen.</div>
                        <Input disabled defaultValue={x.cost_center?x.cost_center:""} 
                        className='fs-12'/>
                    </Col>
                    <Col md={1}>
                        <div className="mt-1 fs-13">Sub Type</div>
                        <Input disabled defaultValue={x.sub_type_name?x.sub_type_name:""} 
                        className='fs-12'/>
                    </Col>
                    <Col md={1}>
                        <div className="mt-1 fs-13">DG Type</div>
                        <Input disabled  
                        className='fs-12'/>
                    </Col>
                    <Col md={1}>
                        <div className="mt-1 fs-13">FR. Type</div>
                        <Input disabled defaultValue={x.freight_typeid?x.freight_typeid:""} 
                        className='fs-12' />
                    </Col>
                    <Col md={2}>
                        <div className="mt-1 fs-13">Nomination</div>
                        <Input disabled />
                    </Col>
                    <Col md={2}>
                        <div className="mt-1 fs-13">Inco Terms</div>
                        <Input disabled defaultValue={x.inconame?x.inconame:""} 
                        className='fs-12'/>
                    </Col>
                    <Col md={2}>
                        <div className="mt-1 fs-13">Customer Ref #</div>
                        <Input disabled defaultValue={x.clientrefno?x.clientrefno:""} 
                        className='fs-12'/>
                    </Col>
                    <Col md={2}>
                        <div className="mt-1 fs-13">File #</div>
                        <Input disabled defaultValue={x.filenumber?x.filenumber:""}
                        className='fs-12' />
                    </Col>
                </Row>
                <hr className='mb-0' />
                <Row>
                    <Col md={4}>
                        <div className="mt-1 fs-13">Client</div>
                        <Input disabled defaultValue={x.client?x.client:""}
                        className='fs-12' />
                        <div className="mt-1 fs-13">Consignee</div>
                        <Input disabled defaultValue={x.consignee?x.consignee:""}
                        className='fs-12' />
                        {(type == "SE" || type == "AE") && <>
                            <div className="mt-1 fs-13">Shipper</div>
                            <Input disabled defaultValue={x.shipper?x.shipper:""}
                            className='fs-12' />
                        </>}
                        <div className="mt-1 fs-13">Port of Loading</div>
                        <Input disabled defaultValue={x.port_of_loading?x.port_of_loading:""}
                        className='fs-12' />
                        <div className="mt-1 fs-13">Port of Discharge</div>
                        <Input disabled defaultValue={x.port_of_discharge?x.port_of_discharge:""}
                        className='fs-12' />
                        <div className="mt-1 fs-13">Final destination</div>
                        <Input disabled defaultValue={x.finaldestination_name?x.finaldestination_name:""}
                        className='fs-12' />
                        <div className="mt-1 fs-13">Forwarder/Coloader</div>
                        <Input disabled className='fs-12' />
                        <div className="mt-1 fs-13">Sales Representator</div>
                        <Input disabled defaultValue={x.sales_rep?x.sales_rep:""}
                        className='fs-12' />
                    </Col>
                    <Col md={4}> <Space />
                        <div className="mt-1 fs-13">Overseas Agent</div>
                        <Input disabled defaultValue={x.overseas_agent?x.overseas_agent:""}
                        className='fs-12' />
                        <div className="mt-1 fs-13">Local vendor</div>
                        <Input disabled defaultValue={x.local_agent?x.local_agent:""}
                        className='fs-12' />
                        <div className="mt-1 fs-13">Slime/Carrier</div>
                        <Input disabled 
                        className='fs-12' />
                        <div className="mt-1 fs-13">Vessel</div>
                        <Input disabled defaultValue={x.vessel?x.vessel:""}
                        className='fs-12' />
                        <div className="mt-1 fs-13">Voyage</div>
                        <Input disabled defaultValue={x.voyage?x.voyage:""}
                        className='fs-12' />
                        <div className="mt-1 fs-13">ETD</div>
                        <Input disabled 
                        className='fs-12' />
                        <div className="mt-1 fs-13">ETA</div>
                        <Input disabled 
                        className='fs-12' />
                        <Row>
                            <Col md={6}>
                                <div className="mt-1 fs-13">Cutt Off</div>
                                <Input disabled 
                                className='fs-12' />
                            </Col>
                            <Col md={6}>
                                <div className="mt-1 fs-13">Time</div>
                                <Input disabled 
                                className='fs-12' />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4}>
                        <div className="mt-1 fs-13">Commodity</div>
                        <Input disabled defaultValue={x.commodity?x.commodity:""}
                        className='fs-12' />
                        <div className="mt-1 fs-13">Transport</div>
                        <Input disabled 
                        className='fs-12' />
                        <div className="mt-1 fs-13">Custom Clearance</div>
                        <Input disabled 
                        className='fs-12' />
                        <Row>
                            <Col md={6}>
                                <div className="mt-1 fs-13">Wieght</div>
                                <Input disabled defaultValue={x.wt?x.wt:0}
                                className='fs-12' />
                            </Col>
                            <Col md={6}>
                                <div className="mt-1 fs-13">BKG Wieght</div>
                                <Input disabled 
                                className='fs-12' />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mt-1 fs-13">Container</div>
                                <Input disabled defaultValue={x.container_qty?x.container_qty:0}
                                className='fs-12' />
                            </Col>
                            <Col md={6}>
                                <div className="mt-1 fs-13">Ship Volume</div>
                                <Input disabled defaultValue={x.vol?x.vol:0}
                                className='fs-12' />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mt-1 fs-13">TEU</div>
                                <Input disabled defaultValue={x.teus?x.teus:0}
                                className='fs-12' />
                            </Col>
                            <Col md={6}>
                                <div className="mt-1 fs-13">Vol</div>
                                <Input disabled defaultValue={x.vol?x.vol:0}
                                className='fs-12' />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mt-1 fs-13">PCS</div>
                                <Input disabled defaultValue={x.no_of_pkgs?x.no_of_pkgs:0}
                                className='fs-12' />
                            </Col>
                            <Col md={6}>
                                <div className="mt-1 fs-13">Cartons</div>
                                <Input disabled defaultValue={x.pkg_unit?x.pkg_unit:0}
                                className='fs-12' />
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </div>
            )
        })}
        </>
    )
}

export default BookingInfoBackup