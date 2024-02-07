import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';
import moment from 'moment';

const Vouchers = ({vouchers, setVouchers, voucherList}) => {
    const dispatchNew = useDispatch();
  return (
    <div>
      <Modal title="Voucher History" open={vouchers} onCancel={()=>setVouchers(false)} width={700} footer={false}>
        {voucherList.length == 0 && <div className='text-center'>Empty</div>}
        {voucherList.length > 0 && <div className=''>
        <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
            <Table className='tableFixHead'>
                <thead>
                <tr>
                    <th>Prepared By</th>
                    <th>Requested By</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                {voucherList.map((x, i)=>{
                    return(
                    <tr key={i} className='row-hov'
                        onClick={()=>{
                            dispatchNew(incrementTab({"label": "Office Voucher","key": "3-8","id":x.id}))
                            Router.push(`/accounts/officeVouchers/${x.id}`)
                    }}>
                        <td>{x.preparedBy}</td>
                        <td>{x.requestedBy}</td>
                        <td>{moment(x.createdAt).format("DD/MMM/YYYY")}</td>
                        <td>{x.approved?<span style={{color:'green'}}>Approved</span>: <span style={{color:'silver'}}>Un-Approved</span>}</td>
                        <td>Rs. {x.amount}</td>
                    </tr>
                    )
                })}
                </tbody>
            </Table>
        </div>
        </div>
        }
      </Modal>
    </div>
  )
}

export default Vouchers
