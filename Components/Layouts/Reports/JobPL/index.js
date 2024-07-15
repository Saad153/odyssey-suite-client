import { recordsReducer, initialState, plainOptions,typeOptions } from './states';
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { Select, Checkbox, Modal, Radio } from 'antd';
import React, {useState, useEffect, useReducer } from 'react';
import Search from './Search';
import Sheet from './Sheet';
import AdvanceSearch from './AdvanceSearch';
import { incrementTab } from '/redux/tabs/tabSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Router from "next/router";
import { setFilterValues } from '/redux/filters/filterSlice';

const JobPL = () => {
  const dispatchNew = useDispatch();
  const [state, dispatch] = useReducer(recordsReducer, initialState);
  const set = (obj) => dispatch({ type: 'set', payload: obj });
  const [ jobType, setJobType ] = useState(['SE','SI','AE','AI']);
  const [ company, setCompany ] = useState(4);
  const [ subType, setSubtype ] = useState([]);

  const stateValues = {
    from: state.from,
    to: state.to,
    jobType: jobType,
    company: company,
    subType:state.subType,
    salesRepresentative: state.salesrepresentative,
    overSeasagent: state.overseasagent,
    client: state.client,
    reportType: state.reportType,
  }



  //getting selected Filter values from state by filter name
  const filterValues = useSelector((state) => state.filterValues);
  const filters = filterValues.find(page=>page.pageName==="jobPLreport");
  const values = filters ? filters.values : null;

  useEffect(() => {
    
    // setting default values from Redux state when component remounts
    if (filters) {
      set({
        from: values ? values.from : '',
        to: values?  values.to : '',
        jobType: values ? values.jobType : [],
        company: values? values.company : '',
        subType: values? values.subType : [],
        salesrepresentative: values ? values.salesRepresentative : undefined,
        overseasagent: values ? values.overSeasagent : undefined,
        client: values? values.client : undefined,
        reportType: values ? values.reportType : 'viewer',
      });



    }
    else {
      set({ jobType: plainOptions }); // Automatically check all job types if no filters
    }
  }, [filters]);

  const handleChange = (event) => {
    setCompany(event);
  };

  // const handleSubtypeChange = (event) => {
  //   console.log("e",event)
  //     setSubtype(event);
  // };



  return (
    <>
      <div className='base-page-layout pb-5'>
        <Row>
          <Col md={3}>
            <div>Start Date</div>
            <Form.Control type={"date"} size="sm" value={state.from} onChange={(e) => set({ from: e.target.value })} />
          </Col>
          <Col md={3}>
            <div>End Date</div>
            <Form.Control type={"date"} size="sm" value={state.to} onChange={(e) => set({ to: e.target.value })} />
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col md={2}>
            <div>Job Types</div>
            <Checkbox.Group options={plainOptions} value={jobType} onChange={(e) => setJobType(e)} />
          </Col>
          <Col md={2}>
            <div>Sub Types</div>
            <Checkbox.Group options={typeOptions} value={subType} onChange={(e) => setSubtype(e)} />
          </Col>
          
        </Row>
        <Row className='mt-3'>
          <Col md={3}>
            <div>Company</div>
            <Select style={{ width: "100%" }}
             value={company} onChange={handleChange}
             allowClear
             options={[
              {value:1,label:"Sea Net Shipping & Logistics"},
              {value:2,label:"Cargo Linkers"},
              {value:3,label:"Air Cargo Services"},
              {value:4,label:"SNS & ACS"},
            ]}
            />
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col md={3}>
            <div>Sales Representative</div>
            <Search getChild={(value) => set({ salesrepresentative: value })} placeholder={"Search"} style={{ width: "100%" }} type={"representative"} />
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col md={3}>
            <div>Overseas Agent</div>
            <Search getChild={(value) => set({ overseasagent: value })} placeholder={"Search"} style={{ width: "100%" }} type={"agent"} />
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col md={3}>
            <div>Client</div>
            <AdvanceSearch getChild={(value) => set({ client: value })} placeholder={"Search"} value={state.client} style={{ width: "100%" }} type={"client"} />
          </Col>
          <Col md={8}></Col>
          <Col md={2} style={{ border: '1px solid silver', marginLeft: 12, paddingRight: 40 }} className='py-1 mt-3'>
            Report Types
            <Radio.Group onChange={(e) => set({ reportType: e.target.value })} value={state.reportType}>
              <Radio value={"viewer"}>Viewer</Radio>
              <Radio value={"grid"}>Grid</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <button className='btn-custom mt-3'
          onClick={() => {
            //handleSubmit(set,state)
            const { to, from, client, overseasagent, salesrepresentative, reportType } = state
            dispatchNew(setFilterValues({
              pageName:"jobPLreport",
              values:stateValues    
            }));
            Router.push({
              pathname: `/reports/jobPLReport/report`,
              query: {
                to: to,
                from: from,
                client: client,
                company: company,
                subtype:subType,
                jobtype: jobType,
                overseasagent: overseasagent,
                salesrepresentative: salesrepresentative,
                report: reportType
              }
            });
            let url = `?to=${state.to}&from=${state.from}`;
            client? url = url + `&client=${client}`: null;
            company? url = url + `&company=${company}`: null;
            subType? url = url + `&subtype=${subType}`: null;
            jobType? url = url + `&jobtype=${jobType}`: null;
            salesrepresentative? url = url + `&salesrepresentative=${salesrepresentative}`: null;
            reportType? url = url + `&report=${reportType}`: null;
            overseasagent? url = url + `&overseasagent=${overseasagent}`: null;
            overseasagent? url = url + `&overseasagent=${overseasagent}`: null;
            
            dispatchNew(incrementTab({
              "label": "Job Profit & Loss", "key": "5-4-1",
              "id": url //`?to=${state.to}&from=${state.from}&client=${state.client}&company=${state.company}&jobtype=${state.jobType}&overseasagent=${state.overseasagent}&salesrepresentative=${state.salesrepresentative}&report=${state.reportType}`
            }));
          }}
          disabled={state.load}
        >
          {state.load ? <Spinner size='sm' /> : "Go"}
        </button>
      </div>
      <Modal title={"Job Profit & Loss Report"}
        open={state.visible}
        onOk={() => set({ visible: false })}
        onCancel={() => set({ visible: false })}
        footer={false} maskClosable={false}
        width={'100%'}
      >
        {state.records.length > 0 && <Sheet state={state} />}
      </Modal>
    </>
  )
}

export default JobPL