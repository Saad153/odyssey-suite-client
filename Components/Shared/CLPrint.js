import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Row, Col, Table } from 'react-bootstrap';
import inWords from '/functions/numToWords';

const CLPrint = ({ records, invoice }) => {
    const [values, setValues] = useState({
        tax: 0,
        taxPercent:0,
        total: 0,
        serviceCharges: 0,
        netBalance: 0,
    });
    const commas = (a) => { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") }
    const Line = () => <div style={{ backgroundColor: "black", height: 3, position: 'relative', top: 12 }}></div>
    const border = "1px solid black";

    useEffect(() => {
        let result = 0;
        let temptax = 0;
        let taxPercent = 0;
        let serviceCharges = 0;
        let netBalance = 0;
        records.forEach((x) => {
            temptax = temptax + parseFloat(x.tax_amount);
            taxPercent = parseFloat(x.taxPerc)
            result = result + parseFloat(x.local_amount);
            serviceCharges = parseFloat(x.amount);
            netBalance = parseFloat(x.local_amount) + parseFloat(x.tax_amount)
        });
        setValues({
            tax: temptax,
            total: result.toFixed(2),
            serviceCharges:serviceCharges,
            netBalance:netBalance,
            taxPercent:taxPercent
        });
    }, [records])

    return (
        <>
            <div className='pb-5 px-5 pt-2'>
                <Row>
                    <Col>
                        <header className='justify-content-center text-center'>
                            <span className='fs-6'><strong>CARGO LINKERS</strong></span> <br />
                            <span className='fs-12' style={{ lineHeight: "-20px" }}>F-50 BLOCK-6 SHAHRAH-E-FAISAL KARACHI</span>
                        </header>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <header className='justify-content-center text-center'>
                            <span className='fs-12'>NTN.5322935-2</span> <br />
                        </header>
                    </Col>
                </Row>

                <Row>
                    <Col md={5}><Line /></Col>
                    <Col md={2}>
                        <div className='text-center fs-15' style={{ whiteSpace: 'nowrap' }}>
                            <strong>Invoice</strong>
                        </div>
                    </Col>
                    <Col md={5}><Line /></Col>
                </Row>

                <Row style={{ paddingLeft: 12, paddingRight: 12, marginTop: "20px" }}>
                    <Col md="6" style={{ borderTop: border, borderRight: border, borderLeft: border, borderBottom: border, }}>
                        <div className='d-flex'>
                            <div className='fs-10 pe-3 fw-bold'>M/S :</div>
                            <div className='fs-10'>
                                <span className='fs-10'>{invoice.SE_Job.Client ? invoice.SE_Job.Client.name : ""}</span> <br />
                                <span className='fs-10'>{invoice.SE_Job.Client ? invoice.SE_Job.Client.address1 : ""}</span> <br />
                            </div>
                        </div>
                    </Col>
                    <Col md="6" style={{ borderTop: border, borderRight: border, borderLeft: border, borderBottom: border, textAlign: "center" }}>
                        <div className='d-flex justify-content-center'>
                            <div className='text-end' style={{ lineHeight: "-20px" }}>
                                <span className='fs-10 pe-3 fw-bold'>Invoice No :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>Invoice Date :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>Client Ref # :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>GST Invoice # :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>Job Type :</span><br />
                            </div>
                            <div className='text-start' style={{ lineHeight: "-20px" }}>
                                <span className='fs-10'>{invoice.invoice_No ? invoice.invoice_No : ""}</span><br />
                                <span className='fs-10'>{invoice.createdAt ? moment(invoice.createdAt).format("ll") : ""}</span><br />
                                <span className='fs-10'></span><br />
                                <span className='fs-10'></span><br />
                                <span className='fs-10'>{invoice.operation ? invoice.operation : ""}</span><br />
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row style={{ paddingLeft: 12, paddingRight: 12, }}>
                    <Col md="4" style={{ borderLeft: border, borderBottom: border }}>
                        <div className='d-flex justify-content-start'>
                            <div className='text-start'>
                                <span className='fs-10 pe-3 fw-bold'>Job # :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>No Of Packages :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>Description # :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>Shipment From # :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>Vessel :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>HBL No :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>MBL No :</span><br />
                            </div>
                            <div className='text-start'>
                                <span className='fs-10'>{invoice.SE_Job.jobNo ? invoice.SE_Job.jobNo : ""}</span><br />
                                <span className='fs-10'>{invoice.SE_Job.pcs ? invoice.SE_Job.pcs : ""} Cartons</span><br />
                                <span className='fs-10'>{invoice.SE_Job.commodity ? invoice.SE_Job.commodity.name : ""}</span><br />
                                <span className='fs-10'></span><br />
                                <span className='fs-10'>{invoice.SE_Job.vessel ? invoice.SE_Job.vessel.name : ""}</span><br />
                            </div>
                        </div>
                    </Col>
                    <Col md="4" style={{ borderBottom: border }}>
                        <div className='d-flex justify-content-start'>
                            <div className='text-start'>
                                <span className='fs-10 pe-3 fw-bold'>File Job # :</span><br />
                                <span className='fs-10 pe-3 fw-bold mt-6'>Index :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>IGM Date :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>IGM No :</span><br />
                            </div>
                            <div className='text-start'>
                                <span className='fs-10'>{invoice.SE_Job ? invoice.SE_Job.jobNo : ""}</span><br />
                                <span className='fs-10 mt-6'></span><br />
                                <span className='fs-10'></span><br />
                                <span className='fs-10'></span><br />
                            </div>
                        </div>
                    </Col>
                    <Col md="4" style={{ borderRight: border, borderBottom: border }}>
                        <div className='d-flex justify-content-start'>
                            <div className='text-start'>
                                <span className='fs-10 pe-3 fw-bold'>Ref. Invoice # :</span><br />
                                <span className='fs-10 pe-3 fw-bold mt-6'>Invoice Value :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>Delivered On :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>LC No :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>GD/Machine No :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>
                                    {(invoice.operation == "CAE" || invoice.operation == "CSE")
                                        ? "Departure Date" : "Arrival Date"
                                    } # :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>Form E # :</span><br />
                                <span className='fs-10 pe-3 fw-bold'>Form E Date # :</span><br />
                            </div>
                            <div className='text-start'>
                                <span className='fs-10'></span><br />
                                <span className='fs-10 mt-6'></span><br />
                                <span className='fs-10'></span><br />
                                <span className='fs-10'></span><br />
                                <span className='fs-10'></span><br />
                                <span className='fs-10 mt-6'></span><br />
                                <span className='fs-10'></span><br />
                                <span className='fs-10'></span><br />
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col >
                        <Table bordered variant='white' size='sm' style={{ borderLeft: border, borderRight: border, borderBottom: border }}>
                            <thead className='fs-10 text-center' style={{ borderBottom: border }}>
                                <th style={{ borderRight: border }}>SNO</th>
                                <th style={{ borderRight: border }}>PARTICULARS</th>
                                <th style={{ borderRight: border }}>REMARKS/DESCRIPTION</th>
                                <th style={{ borderRight: border }}>PAID BY U</th>
                                <th style={{ borderRight: border }}>PAID BY US</th>
                                <th>TOTALS</th>
                            </thead>
                            <tbody>
                                {records.map((x, i) => {
                                    return (
                                        <>
                                            <tr key={x.id} className='fs-10 text-start' style={{ lineHeight: 1 }}>
                                                <td >{i + 1}</td>
                                                <td >{x.particular}</td>
                                                <td >{x.basis}</td>
                                                <td >0.00</td>
                                                <td >{x.net_amount}</td>
                                            </tr>
                                        </>
                                    )
                                })}
                                <tr className='fs-10 text-start'>
                                    <td colSpan={"4"}>
                                        <span className='pe-3 fw-bold'>
                                            Amount in words :
                                        </span>
                                        <span>
                                            {inWords(parseFloat(values.total) + invoice?.roundOff)}
                                        </span>
                                    </td>
                                    <td className='text-end'>
                                        <span className='fw-bold'>Total Expense</span> <br />
                                        <span className='fw-bold'>Service Charges</span> <br />
                                        <span className='fw-bold'>Sale Tax {values.taxPercent} %</span> <br />
                                        <span className='fw-bold'>Balance Invoice</span> <br />
                                        <span className='fw-bold'>Advnace Recieved</span> <br />
                                        <span className='fw-bold'>Net Balance</span> <br />
                                    </td>
                                    <td className='text-end'>
                                        <span>{commas(values.total)}</span> <br />
                                        <span>{commas(values.serviceCharges)}</span> <br />
                                        <span>{commas(values.tax)}</span> <br />
                                        <span>{commas(values.total)}</span> <br />
                                        <span>0.00</span> <br />
                                        <span>{commas(values.netBalance)}</span> <br />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                <Row className='mt-6'>
                    <Col md="8">
                        <span className='fw-bold fs-10'>
                            Disclaimer :
                        </span>
                    </Col>
                    <Col md="4" className='text-end'>
                        <span className='fs-10 pe-3 fw-bold'>For :</span>
                        <span className='fs-10 fw-bold'>CARGO LINKERS</span>
                    </Col>
                </Row>
                
            </div>
        </>
    )
}

export default CLPrint