import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Table } from 'react-bootstrap';
import { incrementTab } from '/redux/tabs/tabSlice';
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import Router from 'next/router';
import moment from 'moment';
import axios from 'axios';
import PopConfirm from '../../../../Shared/PopConfirm';
import Pagination from '../../../../Shared/Pagination';
import { Input, Tabs } from 'antd';

const commas = (a) => a == 0 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")

const ListData = ({ voucherData }) => {
  const [rowData, setRowData] = useState();
  const [originalData, setOriginalData] = useState();
  const dispatch = useDispatch();
  //search 
  const [query, setQuery] = useState("")
  const keys = ["voucher_Id", "type", "amount"]

  const handleDelete = (id) => {
    PopConfirm("Confirmation", "Are You Sure To Remove This Charge?",
      () => {
        axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_DELETE_BASE_VOUCHER, {
          id: id
        }).then((x) => {
          Router.push("/accounts/voucherList")
        })
      })
  }
  const handleEdit = async (voucherId) => {
    await Router.push(`/accounts/vouchers/${voucherId}`);
    dispatch(incrementTab({ "label": "Voucher", "key": "3-5", "id": `${voucherId}` }));
  };
  
  // search funtionalites
  const search = (data) => {
    return data.filter(item => {
      return keys.some(key => 
        typeof item[key] === 'string' && 
        item[key]?.toLowerCase().includes(query.toLowerCase())
      );
    });
  };

  useEffect(() => {
    if (originalData) {
      const filterData = search(originalData);
      setRowData(filterData);
    }
  }, [query, originalData]);

  useEffect(() => {
    setData(voucherData);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = rowData ? rowData.slice(indexOfFirst, indexOfLast) : [];
  const noOfPages = rowData ? Math.ceil(rowData.length / recordsPerPage) : 0;

  const setData = async (data) => {
    let tempData = data
    await tempData?.forEach((x, i) => {
      x.no = i + 1;
      x.amount = x.Voucher_Heads?.reduce((x, cur) => x + Number(cur.amount), 0),
        x.date = moment(x.createdAt).format("YYYY-MM-DD")
    });
    setRowData(tempData);
    setOriginalData(tempData);
  }

  return (
    <>
      <Row>
        <Col md="6"><h5></h5></Col>
        <Col md="4">
          <div className='d-flex justify-content-end'>
            <Input type="text" placeholder="Enter Voucher No" size='sm' onChange={e => setQuery(e.target.value)} />
          </div>
        </Col>
        <Col md="2">
          <button className='btn-custom left'
            onClick={async () => {
              await Router.push(`/accounts/vouchers/new`)
              dispatch(incrementTab({ "label": "Voucher", "key": "3-5", "id": "new" }))
            }}
          > Create </button>
        </Col>
      </Row>
      <hr />
      <div className='mt-3' style={{ maxHeight: "55vh", overflowY: 'auto', overflowX: "scroll" }}>
        <Table className='tableFixHead'>
          <thead>
            <tr>
              <th >Voucher No.</th>
              <th>Type</th>
              <th>Cheque Date</th>
              <th>Paid to</th>
              <th>Amount</th>
              <th>Voucher Date</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              currentRecords?.map((x, index) => {
                return (
                  <tr key={index}>
                    <td className='blue-txt fw-6 fs-12'>{x.voucher_Id}</td>
                    <td>{x.type}</td>
                    <td>{x.chequedate ? moment(x.chequedate).format("YYYY-MM-DD") : "-"}</td>
                    <td>{x.payTo}</td>
                    <td>
                      <span style={{ color: 'grey' }}>Rs. </span>
                      <span className='blue-txt fw-6'>{commas(x.amount)}</span>
                    </td>
                    <td>{moment(x.createdAt).format("YYYY-MM-DD")}</td>
                    <td style={{cursor:"pointer"}} onClick={() => handleEdit(x.id)}>
                      <span className='fs-15 text-dark'><RiEdit2Fill /></span>
                    </td>
                    <td style={{cursor:"pointer"}} onClick={() => handleDelete(x.id)}>
                      <span className='fs-15 text-danger'><RiDeleteBin2Fill /></span>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
      <div className='d-flex justify-content-end items-end my-4' style={{ maxWidth: "100%" }} >
        <Pagination noOfPages={noOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </>
  );
};

export default React.memo(ListData)