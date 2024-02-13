import React, { useEffect, useState } from 'react';
import { Col, Row, Table } from "react-bootstrap";
import moment from 'moment';
import numToWords from '../../../../functions/numToWords';
import Cookies from 'js-cookie';

const VoucherPrint = ({ compLogo, voucherData }) => {

    const [debitTotal, setDebitTotal] = useState(null);
    const [creditTotal, setCreditTotal] = useState(null);

    const paraStyles = { lineHeight: 1.2, fontSize: 11 }
    const heading = { lineHeight: 1, fontSize: 11, fontWeight: '800', paddingBottom: 5 };
    const Line = () => <div style={{ backgroundColor: "grey", height: 1, position: 'relative', top: 12 }}></div>
    const border = "1px solid black";
    const fomratedDate = moment(voucherData.createdAt).format("yyyy-MM-DD");
    const commas = (a) => a < 1 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
    let debitSum = 0;
    let creditSum = 0;
    const calculateTotal = () => {
        const { Voucher_Heads } = voucherData;
        Voucher_Heads.forEach((x) => {
            if (x.type == "debit") {
                debitSum += parseFloat(x.amount);
            } else {
                creditSum += parseFloat(x.amount)
            }
            setDebitTotal(debitSum);
            setCreditTotal(creditSum);
        });
    }

    // useEffect(() => {
    //     console.log(voucherData)
    // }, []);

    useEffect(() => {
        calculateTotal();
    }, [voucherData])

    return (
        <div className='pb-5 px-5 pt-4'>
            <Row>
                <Col md={4} className='text-center'>
                    {compLogo == "1" &&
                        <>
                            <img src={'/seanet-logo.png'} style={{ filter: `invert(0.5)` }} height={100} />
                            <div>SHIPPING & LOGISTICS</div>
                        </>
                    }
                    {compLogo == "3" &&
                        <>
                            <img src={'/aircargo-logo.png'} style={{ filter: `invert(0.5)` }} height={100} />
                        </>
                    }
                </Col>
                <Col className='mt-4'>
                    <div className='text-center '>
                        <div style={{ fontSize: 20 }}><b>{compLogo == "1" ? "SEA NET SHIPPING & LOGISTICS" : "AIR CARGO SERVICES"}</b></div>
                        <div style={paraStyles}>House# D-213, DMCHS, Siraj Ud Daula Road, Karachi</div>
                        <div style={paraStyles}>Tel: 9221 34395444-55-66   Fax: 9221 34385001</div>
                        <div style={paraStyles}>Email: {compLogo == "1" ? "info@seanetpk.com" : "info@acs.com.pk"}   Web: {compLogo == "1" ? "www.seanetpk.com" : "www.acs.com.pk"}</div>
                        <div style={paraStyles}>NTN # {compLogo == "1" ? "8271203-5" : "0287230-7"}</div>
                    </div>
                </Col>
            </Row>
            <Row className='my-2'>
                <Col md={4}><Line /></Col>
                <Col md={4}>
                    <div className='text-center fs-15' style={{ whiteSpace: 'nowrap' }}>
                        <strong>
                            {
                                voucherData.vType == "SI" ?
                                    "Settlemen Inovice" :
                                    voucherData.vType == "PI" ?
                                        "Payble Inovice" :
                                        voucherData.vType == "JV" ?
                                            "General Voucher" :
                                            voucherData.vType == "BPV" ?
                                                "Bank Payment Voucher" :
                                                voucherData.vType == "BRV" ?
                                                    "Bank Recieve Voucher" :
                                                    voucherData.vType == "CRV" ?
                                                        "Cash Recieve Voucher" :
                                                        voucherData.vType == "CPV" ?
                                                            "Cash Payment Voucher" :
                                                            "Undefined Type"
                            }
                        </strong>
                    </div>
                </Col>
                <Col md={4}><Line /></Col>
            </Row>
            <Row className='my-2'>
                <Col md={4}>
                    <label className=' mt-2 me-2 font-bold fs-10'>Voucher # :</label>
                    <input
                        readOnly
                        style={{ outline: "none" }}
                        type='text'
                        className='border-top-0 border-start-0 border-end-0 fs-10'
                        defaultValue={voucherData.voucher_Id}
                    />
                </Col>
                <Col md={4}>
                    <label className=' mt-2 font-bold fs-10'>Source No # :</label>
                    <input
                        readOnly
                        style={{ outline: "none" }}
                        type='text'
                        className='border-top-0 border-start-0 border-end-0 fs-10'
                    />
                </Col>
                <Col md={4}>
                    <label className='mt-2 font-bold fs-10'>Date # :</label>
                    <input
                        readOnly
                        style={{ outline: "none" }}
                        type='text'
                        className='border-top-0 border-start-0 border-end-0 fs-10'
                        defaultValue={fomratedDate}
                    />
                </Col>
            </Row>
            <Row className='my-2 '>
                <Col md={8}>
                    <label className='mt-2 font-bold fs-10'>Cheque No :</label>
                    <input
                        readOnly
                        style={{ outline: "none", }}
                        type='text'
                        className='border-top-0 border-start-0 border-end-0 fs-10'
                        defaultValue={voucherData.chequeNo ? voucherData.chequeNo : ""}
                    />
                </Col>
                <Col md={4}>
                    <label className='mt-2 font-bold fs-10'>Cheque Date :</label>
                    <input
                        readOnly
                        style={{ outline: "none" }}
                        type='text'
                        className='border-top-0 border-start-0 border-end-0 fs-10'
                        defaultValue={voucherData.chequeDate ? voucherData.chequeDate : ""}
                    />
                </Col>
            </Row>
            <Row className='my-2'>
                <Col md={12}>
                    <label className=' mt-2 font-bold fs-10'>Pay to :</label>
                    <input
                        readOnly
                        style={{ outline: "none", width: "80%" }}
                        type='text'
                        className='border-top-0 border-start-0 border-end-0 fs-10'
                        defaultValue={voucherData.payTo ? voucherData.payTo : ""}
                    />
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <label className='mt-2 font-bold fs-10'>Narration :</label>
                    <input
                        readOnly
                        style={{ outline: "none", width: "80%", }}
                        type='text'
                        className='border-top-0 border-start-0 border-end-0 fs-10'
                        defaultValue={voucherData.payTo ? voucherData.payTo : ""}
                    />
                </Col>
            </Row>
            <div className='mt-4' style={{ maxHeight: 500, overflowY: 'auto' }}>
                <Table bordered className='tableFixHead'>
                    <thead style={{ fontSize: "10px" }}>
                        <tr>
                            <th>Code</th>
                            <th>Head of Account</th>
                            <th>Cost Center</th>
                            <th>Debit</th>
                            <th>Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            voucherData.Voucher_Heads.map((x, index) => {
                                return (
                                    <>
                                        <tr key={index} className='fs-10' >
                                            <td>{index + 1}</td>
                                            <td>
                                                <span className=''>{x.narration}</span>
                                            </td>
                                            <td>
                                                <span className=''>{"KHI"}</span>
                                            </td>
                                            <td className='text-end' >
                                                <span>{x.type === "debit" ? commas(x.amount) : ""}</span>
                                            </td>
                                            <td className='text-end'>
                                                <span>{x.type === "credit" ? commas(x.amount) : ""}</span>
                                            </td>
                                        </tr>
                                    </>
                                )
                            })}
                        <tr className='text-end fw-bold fs-10'>
                            <td colSpan={3} >
                                Total
                            </td>
                            <td>
                                {commas(debitTotal)}
                            </td>
                            <td>
                                {commas(creditTotal)}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            <Row className='my-2'>
                <Col md={12}>
                    <label className='fs-10'>Total amount in words :</label>
                    <input
                        type='text'
                        style={{ width: 100, outline: "none" }}
                        className='w-75 border-top-0 border-start-0 border-end-0 fs-10'
                        readOnly
                        defaultValue={numToWords(creditTotal)}
                    />
                </Col>
            </Row>
            <Row style={{ position: "fixed", bottom: 100, width: "90%" }}>
                <Col md={4}>
                    <div className='d-flex flex-column justify-content-center'>
                        <input
                            style={{ outline: "none" }}
                            type='text'
                            className='border-top-0 border-start-0 border-end-0 fs-10'
                            readOnly
                        />
                        <label className='text-center fs-10 fw-bold'>Prepared by</label>
                    </div>
                </Col>
                <Col md={4}>
                    <div className='d-flex flex-column justify-content-center'>
                        <input
                            style={{ outline: "none" }}
                            type='text'
                            className='border-top-0 border-start-0 border-end-0 fs-10'
                            readOnly
                        />
                        <label className='text-center fs-10 fw-bold'>Checked by</label>
                    </div>
                </Col>
                <Col md={4}>
                    <div className='d-flex flex-column justify-content-center'>
                        <input
                            style={{ outline: "none" }}
                            type='text'
                            className='border-top-0 border-start-0 border-end-0 fs-10'
                            readOnly
                        />
                        <label className='text-center fs-10 fw-bold'>Approved by</label>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: "20px", position: "fixed", bottom: 20, width: "90%" }}>
                <Col md={6}>
                    <div className='text-start'>
                        <span className='fs-10'>Printed on : {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })} at {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </Col>
                <Col md={6}>
                    <div className='text-end'>
                        <span className='fs-10'>Printed by :{Cookies.get("username")} </span>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default VoucherPrint