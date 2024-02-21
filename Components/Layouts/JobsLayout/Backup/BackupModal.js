"use client"
import React, { useState,useRef } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { useCallback } from 'react';
import { useMemo } from 'react';
import Cookies from "js-cookie";
import { Row, Col } from 'react-bootstrap';
import { Modal} from 'antd';
//seanet data
import SNS_SEJ from "/jsonData/oldjobs/seanet/SNS_SEJ" //export 
import SNS_SIJ from "/jsonData/oldjobs/seanet/SNS_SIJ" //import
import SNS_AE from "/jsonData/oldjobs/seanet/SNS_AE" //air export
import SNS_AI from "/jsonData/oldjobs/seanet/SNS_AI" //air import
//aircargo data
import ACS_AE from "/jsonData/oldjobs/aircargo/ACS_AE" //export
import ACS_AI from "/jsonData/oldjobs/aircargo/ACS_AI" //import
import ACS_SEJ from "/jsonData/oldjobs/aircargo/ACS_SEJ" //sea export
import ACS_SIJ from "/jsonData/oldjobs/aircargo/ACS_SIJ" //sea import
import JobsData from './jobsData';

const JobsBackupData = ({ isOpen, onClose,type }) => {
    const company = Cookies.get("companyId")
    //json data
    const seaNetData = type=="SE"?SNS_SEJ:type=="SI"?SNS_SIJ:type=="AE"?SNS_AE:type=="AI"?SNS_AI:"";
    const airCargoData = type=="AE"?ACS_AE:type=="AI"?ACS_AI:type=="SE"?ACS_SEJ:type=="SI"?ACS_SIJ:"";
    //configuring data based on the selected company
    const data = company=="1"?seaNetData:company=="3"?airCargoData:null;
    //getting selected jobId
    const [jobId,setJobId] = useState("")
    const [isSwitch,setIsSwitch] = useState(false)
    //filtering jobdata based on the id
    const selectedJobData = data.filter((x)=>x.job__==jobId)

    const gridRef = useRef();
    const [columnDefs,setColumnDefs] = useState([
        {headerName:"Job No", field:"job__",filter:true,
           cellRenderer:(params)=>{
            return <span onClick={()=>{
              setJobId(params.data.job__);
              setIsSwitch(true)
            }} style={{cursor:"pointer"}}>{params.data.job__}</span>
           }
        },
        {headerName:"HBL/HAWB", field:"hbl___hawb",filter:true},
        {headerName:"MBL/MAWB", field:"mbl___mawb",filter:true},
        {headerName:"Vessel", field:"vessel",filter:true},
        {headerName:"Voyage", field:"voyage",filter:true},
        {headerName:"Sales.Rep", field:"sales_rep",filter:true},
        {headerName:"Overseas Agent", field:"overseas_agent",filter:true},
        {headerName:"Client", field:"client",filter:true},
        {headerName:"Sailing Date", field:"sailing_date",filter:true},
        {headerName:"Shipper", field:"shipper",filter:true},
        {headerName:"Air/Shipping Line", field:"air_shipping_line",filter:true},
        {headerName:"Local Agent", field:"local_agent",filter:true},
        {headerName:"Final Des.", field:"final_dest",filter:true},
        {headerName:"Consignee.", field:"consignee",filter:true},
        {headerName:"Commodity", field:"commodity",filter:true},
        {headerName:"Cnts", field:"cnts",filter:true},
        {headerName:"Wieght", field:"wt",filter:true},
        {headerName:"Volume", field:"vol",filter:true},
        {headerName:"Sub Type", field:"sub_type_name",filter:true},
        {headerName:"Operation Type", field:"operation_type",filter:true},
        {headerName:"Carrier Booking No", field:"carrierbookingno",filter:true},
        {headerName:"POD", field:"podname",filter:true},
        {headerName:"POL", field:"polname",filter:true},
        {headerName:"Port of Delivery", field:"port_of_delivery",filter:true},
        {headerName:"POR Date", field:"por_date",filter:true},
        {headerName:"SI cutt of Date", field:"si_cut_off_date",filter:true},
        {headerName:"File No", field:"filenumber",filter:true},
        {headerName:"Bl Shipper", field:"blshipper",filter:true},
        {headerName:"Bl Consignee", field:"blconsignee",filter:true},
        {headerName:"Notify Party 1", field:"notify_party1",filter:true},
        {headerName:"Notify Party 1", field:"notify_party2",filter:true},
        {headerName:"Delivery Agent", field:"delivery_agent",filter:true},
        {headerName:"Agent Stamp", field:"agent_stamp",filter:true},
        {headerName:"Frieght Type Id", field:"freight_typeid",filter:true},
        {headerName:"No of Original", field:"no_of_original",filter:true},
        {headerName:"Gross Wieght", field:"gross_weight",filter:true},
        {headerName:"Net Wieght", field:"net_wieght",filter:true},
        {headerName:"Coload CBM", field:"coload_cbm",filter:true},
        {headerName:"Package Code", field:"packages_code",filter:true},
        {headerName:"HS Code", field:"hs_code",filter:true},
        {headerName:"Hazmat Class Type", field:"hazmat_class_typeid",filter:true},
        {headerName:"UNO Code", field:"uno_code",filter:true},
        {headerName:"Marks No", field:"marks___no",filter:true},
        {headerName:"No of Pkgs", field:"no_of_pkgs",filter:true},
        {headerName:"Description", field:"description",filter:true},
        {headerName:"Measurement", field:"measurement",filter:true},
        {headerName:"On Board Date", field:"on_board_date",filter:true},
        {headerName:"Place of Issue Date", field:"place_of_issue_date",filter:true},
        {headerName:"KLM Id", field:"klmid",filter:true},
        {headerName:"Total NetWt", field:"total_netwt",filter:true},
        {headerName:"Gross Wieght", field:"gross_wt",filter:true},
        {headerName:"Hazmat Pkg Group", field:"hazmat_packing_group",filter:true},
        {headerName:"Form E-num", field:"formenum",filter:true},
        {headerName:"Form E-date", field:"formedate",filter:true},
        {headerName:"Sailing/Arrival", field:"sailing_arrival",filter:true},
        {headerName:"Container String", field:"containerstring",filter:true},
        {headerName:"Container Qty", field:"container_qty",filter:true},
        {headerName:"Job Date", field:"jobdate",filter:true},
        {headerName:"Inco Name", field:"inconame",filter:true},
        {headerName:"Cost Center", field:"cost_center",filter:true},
        {headerName:"Delivery Date", field:"delivery_date",filter:true},
        {headerName:"Pkg Unit", field:"pkg_unit",filter:true},
        {headerName:"Final Destination", field:"finaldestination_name",filter:true},
        {headerName:"Clearing Agent", field:"clearingagent",filter:true},
        {headerName:"Type Name", field:"type_name",filter:true},
        {headerName:"Teus", field:"teus",filter:true},
        {headerName:"Operation type", field:"operation_types",filter:true},
        {headerName:"Vessel Voyage", field:"vesselvoyage",filter:true},
    ])

    const getRowHeight = useCallback(() => {
      return 38;
    }, []);
    const defaultColDef = useMemo(() => ({
      sortable: true,
      resizable: true,
    }));

    return (
        <>
        <Modal bodyStyle={{ overflowY: 'auto', overflowX:"auto",height:"75vh" }}  style={{ top: 20 }} width={1000} 
            title="Old Jobs" open={isOpen} onOk={onClose} onCancel={onClose}>
            {!isSwitch && <h5>{type == "SE" ? "SEA Export" : type == "SI" ? "SEA Import"
              : type == "AE" ? "AIR Export" : type == "AI" ? "AIR Import" : ""} 
              Job List
            </h5>}
            <Row>
            {!isSwitch && 
                <Col md={12}>
                    <div className="ag-theme-alpine" style={{ width: "100%", height: '60vh' }}>
                    <AgGridReact 
                        ref={gridRef} //grid ref
                        rowData={data} // data to be displayed
                        columnDefs={columnDefs} //header and field names
                        animateRows={true} //row animations
                        defaultColDef={defaultColDef} // col def for sorting and resizing
                        rowSelection='multiple' // Options - allows click selection of rows
                        getRowHeight={getRowHeight} //row hieght
                    />   
                    </div>
                </Col>}
            {isSwitch &&
                //passing data  
                <JobsData data={selectedJobData} setIsSwitch={setIsSwitch} type={type}/>}
            </Row>
        </Modal>
        </>
    )
}

export default JobsBackupData