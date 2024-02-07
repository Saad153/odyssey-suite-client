"use client"
import React, { useState, useEffect } from 'react'
import axios from "axios"
import moment from 'moment';
import { Row, Col, Table } from 'react-bootstrap';
import { Modal } from 'antd';

const VoucherHistory = ({ id, isOpen, onClose }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const handleFetch = async () => {
        setIsLoading(true)
        try {
            const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_VIEW_VOUCHER_HISTORY, {
                headers: {
                    id: id,
                }
            })
            setData(result.data.result)
            console.log(result)
            setIsLoading(false)
            return result
        } catch (error) {
            setIsLoading(false);
            console.log(error)
        }
    }

    useEffect(() => {
        if (id) {
            handleFetch()
        }
    }, [])

    return (
        <>
            <Modal bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }} title="Voucher History" open={isOpen} onOk={onClose} onCancel={onClose}>
                {
                    isLoading ? <span>loading..</span> : (
                        <div className=''>
                            <div className='my-4'>
                                <Table className='tableFixHead'>
                                    <thead>
                                        <tr className='fs-12'>
                                            <th>Name</th>
                                            <th>Created at</th>
                                            <th>Updated at</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((row, rowIndex) => (
                                            <tr className='fs-12' key={rowIndex}>
                                                <td>{row.html}</td>
                                                <td>
                                                    {/* Filtering the create date from type create */}
                                                    {data
                                                        .filter((entry) => entry.type === "Create" && entry.id === row.id)
                                                        .map((createdEntry, createdIndex) => (
                                                            <div key={createdIndex}>
                                                                {moment(createdEntry.createdAt).format("DD-MM-YYYY")}
                                                            </div>
                                                        ))}
                                                </td>
                                                <td>
                                                    {/* Filtering the update date from type update */}
                                                    {data
                                                        .filter((entry) => entry.type === "Update" && entry.id === row.id)
                                                        .map((updateEntry, updateIndex) => (
                                                            <div key={updateIndex}>
                                                                {moment(updateEntry.updateDate).format("DD-MM-YYYY")}
                                                            </div>
                                                        ))}
                                                </td>
                                            </tr>
                                        ))}
                                        {!data.length > 0 && <tr>No History found</tr>}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )
                }
            </Modal>
        </>
    )
}

export default VoucherHistory