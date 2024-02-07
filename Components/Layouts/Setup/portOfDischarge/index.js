// "use client"
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Row, Col, Table } from 'react-bootstrap';

const PortOfDischarge = ({ portsData }) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <Row>
                <Col md="6"><h5>Ports to Add</h5></Col>
            </Row>
            <hr />
            <div className='mt-3' style={{ maxHeight: "60vh", overflowY: 'auto', overflowX: "scroll" }}>
                <Table className='tableFixHead'>
                    <thead>
                        <tr>
                            <th>Port Code</th>
                            <th>Port Name</th>
                            <th>Port Country</th>
                            <th>Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            portsData.result.map((x, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{x.portId}</td>
                                        <td>{x.portName}</td>
                                        <td>{x.portCountry}</td>
                                        <td>{moment(x.createdAt).format("DD-MM-YYYY")}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default PortOfDischarge