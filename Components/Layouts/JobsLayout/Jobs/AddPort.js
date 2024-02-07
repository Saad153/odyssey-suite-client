"use client"
import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap';
import axios  from "axios"
import { Modal, Input } from 'antd';
import openNotification from '../../../Shared/Notification';

const AddPort = ({ isOpen, onClose }) => {

    const [data, setData] = useState({})

    const onSubmit =async () => {
        try {
            console.log(data)
            const res = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_PORT,data).then((x)=>{
                openNotification("Success","Port Created","green")
            })
            onClose()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Modal bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }} title="Add New Port" open={isOpen} onOk={onClose} onCancel={onClose}>
                <Row className='d-flex justify-content-center'>
                    <div className='my-2 py-2'>
                        <label>Code *</label>
                        <Input placeholder="Enter code" className='rounded' onChange={(e) => setData({ ...data, portId: e.target.value })} />
                    </div>
                    <div className='my-2'>
                        <label>Port Name *</label>
                        <Input placeholder="Enter Port Name" className='rounded' onChange={(e) => setData({ ...data, portName: e.target.value })} />
                    </div>
                    <div className='my-2'>
                        <label>Country *</label>
                        <Input placeholder="Enter Country" className='rounded' onChange={(e) => setData({ ...data, portCountry: e.target.value })} />
                    </div>
                    <div className='my-2'>
                        <label>operation *</label>
                        <Input placeholder="Enter Operation" className='rounded' onChange={(e) => setData({ ...data, operation: e.target.value })} />
                    </div>
                </Row>
                <div className='d-flex justify-content-end mt-4'>
                    <button className='btn-custom-blue fs-11 px-4' onClick={onSubmit}>
                        Create
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default AddPort