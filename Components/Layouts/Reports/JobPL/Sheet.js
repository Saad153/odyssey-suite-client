import React, { useEffect } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import moment from 'moment';

const Sheet = ({state, overflow, fontSize}) => {

    const setCommas = (val) => {
        if(val){
            return val.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
        }else{
            return 0
        }
    }

  return (
    <div>
    <div className='' style={{maxHeight:overflow ? 600 : "100%", overflowY:'auto'}}>
        <Table className='tableFixHead vertical' bordered>
        <thead>
            <tr className='fs-10 text-center'>
                {/* <th>#</th> */}
                <th>Job No</th>
                <th style={{width:45}}>Date</th>
                <th style={{width:200}}>Client</th>
                <th>F. Dest</th>
                <th>Weight</th>
                <th>Containers</th>
                <th>Weight</th>
                <th>Volume</th>
                <th>Revenue</th>
                <th>Cost</th>
                <th>P/L</th>
                <th>Gain/Loss</th>
                <th>After Gain/Loss</th>
            </tr>
        </thead>
        <tbody>
        {state.records.map((x,index)=>{
        return (
        <tr key={index} className='f fs-10 text-center'>
            {/* <td>{index + 1}</td> */}
            <td>{x.jobNo}</td>
            <td>{moment(x.createdAt).format("MM/DD/YY")}</td>
            <td>{x.Client.name}</td>
            <td style={{width:80}}>{x.fd}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{setCommas(x.revenue)}</td>
            <td>{setCommas(x.cost)}</td>
            <td>{setCommas(x.actual)}</td>
            <td style={{color:x.gainLoss<0?'crimson':'green'}}>
                {setCommas(x.gainLoss<0?x.gainLoss*-1:x.gainLoss)}
            </td>
            <td>{setCommas(x.after)}</td>
        </tr>
        )})}
        <tr className='f fs-11 text-center'>
            <td colSpan={7}></td>
            <td>Total: </td>
            <td>{setCommas(state.totalRevenue)}</td>
            {/* <td>{setCommas(state.records?.reduce((x, c) => {return Number(c.revenue) + x},0)||0)}</td> */}
            {/* <td>{setCommas(state.totalCost)}</td> */}
            <td>{setCommas(state.records?.reduce((x, c) => {return Number(c.cost) + x},0)||0)}</td>
            <td>{setCommas(state.records?.reduce((x, c) => {return Number(c.actual) + x},0)||0)}</td>
            {/* <td>{setCommas(state.totalActual)}</td> */}
            <td>{setCommas(state.totalgainLoss)}</td>
            <td>{setCommas(state.totalAfter)}</td>
        </tr>
        </tbody>
        </Table>
        </div>
    </div>
  )
}

export default Sheet