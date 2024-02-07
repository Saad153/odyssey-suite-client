import { Row, Col, Form } from "react-bootstrap";
import { Select, Input, Checkbox, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getJobValues } from '/apis/jobs';
import { incrementTab } from '/redux/tabs/tabSlice';
import { useDispatch, useSelector } from 'react-redux';
import Router from "next/router";
import moment from 'moment';
import { setFilterValues } from "../../../../redux/filters/filterSlice";

const InvoiceBalaincing = () => {

    const dispatch = useDispatch();

    const [from, setFrom] = useState(moment("2023-07-01").format("YYYY-MM-DD"));
    const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
    const [company, setCompany] = useState(1);
    const [overseasAgent, setOverseasAgent] = useState("");
    const [representator, setRepresentator] = useState("");
    const [currency, setCurrency] = useState("");
    const [reportType, setReportType] = useState("viewer");
    const [jobTypes, setJobTypes] = useState([]);
    const [values, setValues] = useState();
    const [payType, setPayType] = useState("Payble");
    const { data, status } = useQuery({ queryKey: ['values'], queryFn: getJobValues });
    const commas = (a) => a ? parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") : '0.0';

    const stateValues = {
        from,
        to,
        company,
        payType,
        overseasAgent,
        representator,
        currency,
        jobTypes,
        reportType,
    }

    const filterValues = useSelector(state => state.filterValues);
    const filters = filterValues.find(page => page.pageName === "AgentInvoiceBalancing");
    const value = filters ? filters.values : null

    useEffect(() => { if (status == "success") setValues(data.result) }, [status]);
    useEffect(() => {
        if (filters) {
                setFrom(value.from),
                setTo(value.to),
                setCompany(value.company),
                setPayType(value.payType),
                setOverseasAgent(value.overseasAgent),
                setRepresentator(value.representator),
                setCurrency(value.currency),
                setJobTypes(value.jobTypes),
                setReportType(value.reportType)
        }
    }, [filters])

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const plainOptions = [
        { label: 'Sea Export', value: 'SE' },
        { label: 'Sea Import', value: 'SI' },
        { label: 'Air Export', value: 'AE' },
        { label: 'Air Import', value: 'AI' }
    ];
    const handleSearch = async () => {
        Router.push({
            pathname: `/reports/invoiceBalancing/report`,
            query: {
                "company": company,
                "overseasagent": overseasAgent,
                "representator": representator,
                "jobtypes": jobTypes,
                "currency": currency,
                "from": from,
                "to": to,
                "paytype": payType,
                "report": reportType
            }
        });
        dispatch(incrementTab({
            "label": "Agt Inovice Bal Report",
            "key": "5-8",
            "id": `report?company=${company}&overseasagent=${overseasAgent}&representator=${representator}&currency=${currency}&jobtypes=${jobTypes}&to=${to}&from=${from}&paytype=${payType}&report=${reportType}`
        }))
        dispatch(setFilterValues({
            pageName: "AgentInvoiceBalancing",
            values: stateValues
        }));
    }

    return (
        <div className='base-page-layout fs-12'>
            {status == "success" &&
                <Row>
                    <Col md={7} style={{ border: '1px solid silver' }} className='mx-3 py-2'>
                        Company
                        <Select size='small' style={{ width: '100%', marginBottom: 5 }}
                            allowClear
                            value={company}
                            onChange={(e) => { setCompany(e) }}
                            options={[
                                { value: 1, label: "Sea Net Shipping & Logistics" },
                                { value: 2, label: "Cargo Linkers" },
                                { value: 3, label: "Air Cargo Services" },
                            ]}
                        />
                        <Row>
                            <Col md={3}>
                                Pay Type
                                <Select defaultValue="" style={{ width: '100%', marginBottom: 5 }} size='small'
                                    onChange={(e) => { setPayType(e) }} value={payType}
                                    options={[
                                        { value: "Recievable", label: "Recievable" },
                                        { value: "Payble", label: "Payble" },
                                        { value: "All", label: "All" },
                                    ]}
                                />
                            </Col>
                            <Col md={4}>
                                Job #
                                <Input style={{ marginBottom: 10 }} size='small' />
                            </Col>
                            <Col>
                                File #
                                <Input style={{ marginBottom: 10 }} size='small' />
                            </Col>
                        </Row>
                        Overseas Agent
                        <Select defaultValue="" style={{ width: '100%', marginBottom: 5 }} size='small'
                            onChange={(e) => setOverseasAgent(e)}
                            showSearch
                            filterOption={filterOption}
                            options={values?.vendor?.overseasAgent.map((x) => { return { value: x.id, label: x.name } })}
                        />
                        Client
                        <Select defaultValue="" onChange={() => { }} style={{ width: '100%', marginBottom: 5 }} size='small' disabled
                            options={[
                                { value: 1, label: "Sea Net Shipping & Logistics" },
                                { value: 2, label: "Cargo Linkers" },
                                { value: 3, label: "Air Cargo Services" },
                            ]}
                        />
                        Local Vendor
                        <Select defaultValue="" onChange={() => { }} style={{ width: '100%', marginBottom: 5 }} size='small' disabled
                            options={[
                                { value: 1, label: "Sea Net Shipping & Logistics" },
                                { value: 2, label: "Cargo Linkers" },
                                { value: 3, label: "Air Cargo Services" },
                            ]}
                        />
                        Forwarder/Coloader
                        <Select defaultValue="" onChange={() => { }} style={{ width: '100%', marginBottom: 5 }} size='small' disabled
                            options={[
                                { value: 1, label: "Sea Net Shipping & Logistics" },
                                { value: 2, label: "Cargo Linkers" },
                                { value: 3, label: "Air Cargo Services" },
                            ]}
                        />
                        Shipping Line
                        <Select defaultValue="" onChange={() => { }} style={{ width: '100%', marginBottom: 5 }} size='small' disabled
                            options={[
                                { value: 1, label: "Sea Net Shipping & Logistics" },
                                { value: 2, label: "Cargo Linkers" },
                                { value: 3, label: "Air Cargo Services" },
                            ]}
                        />
                        Air Line
                        <Select defaultValue="" onChange={() => { }} style={{ width: '100%', marginBottom: 5 }} size='small' disabled
                            options={[
                                { value: 1, label: "Sea Net Shipping & Logistics" },
                                { value: 2, label: "Cargo Linkers" },
                                { value: 3, label: "Air Cargo Services" },
                            ]}
                        />
                        Sales Representor
                        <Select defaultValue="" style={{ width: '100%', marginBottom: 5 }} size='small'
                            onChange={(e) => { setRepresentator(e) }}
                            showSearch
                            filterOption={filterOption}
                            options={values?.sr?.map((x) => { return { value: x.id, label: x.name } })}
                        />
                        <Row>
                            <Col md={4}>
                                Currency
                                <Select defaultValue="" style={{ width: '100%', marginBottom: 5 }} size='small'
                                    onChange={(e) => { setCurrency(e) }}
                                    options={[
                                        { value: "PKR", label: "PKR" },
                                        { value: "USD", label: "USD" },
                                        { value: "GBP", label: "GBP" },
                                    ]}
                                />
                            </Col>
                            <Col md={4}>
                                Flight #
                                <Input style={{ marginBottom: 10 }} size='small' />
                            </Col>
                            <Col md={4}>
                                Voyage #
                                <Input style={{ marginBottom: 10 }} size='small' />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md={3} style={{ border: '1px solid silver', marginLeft: 12 }} className='py-1'>
                                Job Types
                                <Checkbox.Group options={plainOptions} defaultValue={['SE']} onChange={(e) => setJobTypes(e)} />
                            </Col>
                            <Col md={2} style={{ border: '1px solid silver', marginLeft: 12 }} className='py-1'>
                                Report Types
                                <Radio.Group onChange={(e) => setReportType(e.target.value)} value={reportType}>
                                    <Radio value={"viewer"}>Viewer</Radio>
                                    <Radio value={"grid"}>Grid</Radio>
                                </Radio.Group>
                            </Col>
                            <Col md={5}></Col>
                            <Col md={1}><button className='btn-custom' onClick={() => handleSearch()}>Go</button></Col>
                        </Row>

                    </Col>
                    <Col style={{ border: '1px solid silver' }} className='py-2' md={3}>
                        From
                        <Form.Control type="date" size='sm' value={from} onChange={(e) => setFrom(e.target.value)} className='mb-2' />
                        To
                        <Form.Control type="date" size='sm' value={to} onChange={(e) => setTo(e.target.value)} />
                    </Col>
                </Row>
            }
        </div>
    );
}
export default React.memo(InvoiceBalaincing);