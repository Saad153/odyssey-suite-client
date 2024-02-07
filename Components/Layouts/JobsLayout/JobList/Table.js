import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { calculateDry, calculatePershable , weight, net , tare, total } from "./functions";
import {  Radio } from "antd";


const Modal = ({ result, groupBy}) => {
let title = []
const [group, setGroup] = useState('')
const [scvData, setCsvData] = useState([]);
const [type, setType] = useState("Perishable");


useEffect(() =>{
if(groupBy) {
    if (groupBy == 'ClientId') {
      setGroup('Client')
        result.map((x) =>  x.map((y) => title.push(y.Client.name)))
    }
    else if (groupBy == 'shippingLineId') {
      setGroup('shipping_line')

      result.map((x) =>  x.map((y) => title.push(y.shipping_line?.name)))
      console.log({title})
    
    }
    else if (groupBy == 'vesselId') {
      setGroup('vessel')
      result.map((x) =>  x.map((y) => title.push(y.vessel?.name)))
        
    }
    else if (groupBy == 'commodityId') {
      setGroup('commodity')
      result.map((x) =>  x.map((y) => title.push(y.commodity?.name)))
    }

}
}, [groupBy])


  return (
    <div>
    <div className="">

        <Radio.Group onChange={(e)=> {setType(e.target.value), setCsvData('')}} value={type}>
        <Radio value={"Perishable"}>Perishable</Radio>
        <Radio value={"Dry"}>Dry</Radio>  
        </Radio.Group>
        <button className="btn-custom mb-2" onClick={() => 
        type == "Perishable" ? calculatePershable(groupBy, result, setCsvData) 
        : calculateDry(groupBy, result, setCsvData)}>Generate File</button>
        {scvData.length>0 &&
          <CSVLink data={scvData} className='btn-custom mx-3 px-4 py-2 mb-2' style={{color:'white'}}>
            Download me
        </CSVLink>
        }
    </div>

    <div style={{ maxHeight: 760, overflowY: "auto", overflowX: "scroll" }}>

        <div className="table-sm-1">

          <Table className="tableFixHead" bordered style={{ fontSize: 14 }}>
            <thead>
              <tr className="custom-width fs-14">
                <th className="text-center px-1" style={{whiteSpace:"nowrap"}}>S.No #</th>
                <th className="text-center px-1" style={{whiteSpace:"nowrap"}} >Job No</th>
                <th className="text-center px-1" style={{whiteSpace:"nowrap"}} >HBL/HAWB</th>
                <th className="text-center px-1" style={{whiteSpace:"nowrap"}} >MBL / MAWB</th>
                <th className="text-center px-1" style={{whiteSpace:"nowrap"}} >Sales.Rep </th>
                <th className="text-center p-1" style={{whiteSpace:"nowrap"}}>Sailling Arrival</th>
                <th className="text-center p-1" style={{whiteSpace:"nowrap"}}>Shipper/ Consignee</th>
                <th className="text-center p-1" style={{whiteSpace:"nowrap"}}>Air/ Shipping Line</th>
                <th className="text-center p-1" style={{whiteSpace:"nowrap"}}>Local Agent</th>
                <th className="text-center p-1" style={{whiteSpace:"nowrap"}}>Final Dest</th>
                <th className="text-center p-1">Commodity</th>
                <th className="text-center p-1">Cnts</th>
                <th className="text-center p-1">WT</th>
                <th className="text-center p-1">Net</th>
                <th className="text-center p-1">Tare</th>
                <th className="text-center p-1">Total</th>
                <th className="text-center px-1" style={{whiteSpace:"nowrap"}}>Carrier Book No</th>
                <th className="text-center p-1">Vol</th>
              </tr>
            </thead>
            {groupBy ? result.length > 0 &&
            <tbody className="fs-14">
            {result.map((x, i) => {
            return (
              <>
              <tr><td colSpan={6}><b>{ x.length > 0  && x.map((y) => y[group]?.name)}</b></td></tr>
              { x.map((y, i) => {
                  return (
                    <tr key={i}>
                      <td>{i}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}} >{y.jobNo}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.hbl}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.mbl}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}} >
                        {y.sales_representator?.name }
                      </td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}></td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>
                      {y.shipper.name }
                      {y.consignee.name }
                      </td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y?.shipping_line?.name}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.local_vendor?.name}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.fd}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.commodity?.name}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.Container_Infos?.map((x) => x.no)} </td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.gross), 0 )}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.net), 0 )}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.tare), 0 )}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.Container_Infos?.reduce((x, cur) => x + (Number(cur.net) + Number(cur.tare) + Number(cur.gross)), 0 )}</td>
                      {/* <td className="text-center">{y.weight}</td> */}
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.carrier} </td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.vol}</td>
                    </tr>
                  );
              })}
              </>
              )})} 
              <tr>
              <td></td><td ></td><td ></td>
              <td ></td><td ></td><td ></td><td ></td><td ></td><td ></td><td ></td><td ></td><td ></td>
              <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{weight(groupBy, result)}</td>
              <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{net(groupBy, result)}</td>
              <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{tare(groupBy, result)}</td>
              <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{total(groupBy, result)}</td>
              <td ></td><td ></td>
              </tr>
            </tbody> 
            : 
              <tbody className="fs-14">
              {result.length > 0 &&
              result.map((y, i) => {
            return (
              <>
                 
                    <tr key={i}>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{i + 1}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.jobNo}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.hbl}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.mbl}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>
                        {y.sales_representator?.name }
                      </td>
                      <td className="text-center py-1 px-1"></td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>
                      {y.shipper.name }
                      {y.consignee.name }
                      </td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y?.shipping_line?.name}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y?.local_vendor?.name}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.fd}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.commodity?.name}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.Container_Infos?.map((x) => x.no)} </td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.gross), 0 )}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.net), 0 )}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.tare), 0 )}</td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.Bl.Container_Infos?.reduce((x, cur) => x + (Number(cur.net) + Number(cur.tare) + Number(cur.gross)), 0 )}</td>
                      {/* <td className="text-center">{y.weight}</td> */}
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.carrier} </td>
                      <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{y.vol}</td>
                    </tr>
              </>
              )})}

              <tr>
              <td></td><td ></td><td ></td>
              <td ></td><td ></td><td ></td><td ></td><td ></td><td ></td><td ></td><td ></td><td ></td>
              <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{weight(groupBy, result)}</td>
              <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{net(groupBy, result)}</td>
              <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{tare(groupBy, result)}</td>
              <td className="text-center py-1 px-1" style={{whiteSpace:"nowrap"}}>{total(groupBy, result)}</td>
              <td ></td><td ></td>
              </tr>
            </tbody>
            }
          </Table>
        </div>
    </div>
    
    </div>
  );
};

export default Modal;
