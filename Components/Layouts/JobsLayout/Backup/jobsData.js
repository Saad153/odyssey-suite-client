import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Input, Tabs } from 'antd';
import BookingInfoBackup from './BookingInfo';
import Loader from '/Components/Shared/Loader';
import RoutingBackup from './Routing';

const JobsData = ({ data, setIsSwitch, type }) => {
    const [loading, setLoading] = useState(false);
    const [jobData, setJobData] = useState();

    useEffect(() => {
        setLoading(true);
        setJobData(data)
        setLoading(false)
    }, [])

    return (
        <>
        <div>
        <Row >
        <Col md={10}>
            <h5>{type == "SE" ? "SEA Export" : type == "SI" ? "SEA Import"
                : type == "AE" ? "AIR Export" : type == "AI" ? "AIR Import" : ""}
                Job List
            </h5>
        </Col>
        <Col md={2} className='text-end'>
            <button className='btn-custom px-4'
                onClick={() => setIsSwitch(false)}>Go back</button>
        </Col>
        </Row>
        <Row>
        <Tabs defaultActiveKey='1'>
            <Tabs.TabPane key={1} tab="Booking Info">
                {/* passing data  */}
                <BookingInfoBackup data={jobData} type={type} />
            </Tabs.TabPane>
            <Tabs.TabPane key={2} tab="Routing">
                {/* passing data  */}
                <RoutingBackup data={jobData} type={type} />
            </Tabs.TabPane>
        </Tabs>
        </Row>
        </div>
        {loading && <Loader />}
        </>
    );
};

export default JobsData;