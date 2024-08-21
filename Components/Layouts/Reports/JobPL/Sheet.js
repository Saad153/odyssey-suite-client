import React, { useEffect } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import { useRouter } from 'next/router';
import moment from 'moment';

const Sheet = ({state, overflow, fontSize}) => {

    const router = useRouter();
    const dispatch = useDispatch();

    const setCommas = (val) => {
        if(val){
            return val.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
        }else{
            return 0
        }
    }
    const recordState = state?.records;
  return (
    <div>
    <div className='' style={{maxHeight:overflow ? 600 : "100%", overflowY:'auto', overflowX:'auto'}}>
        <Table className='tableFixHead vertical' bordered>
        <thead>
            <tr className='fs-10 text-center'>
                <th>#</th>
                <th style={{ minWidth: 100 }}>Job No</th> 
                <th >Date</th>
                <th style={{ minWidth:200 }}>Client</th>
                <th>SubType</th>
                <th > HBL/HAWB</th>
                <th>Weight</th>
                <th style={{ minWidth:90 }}>Revenue</th>
                <th style={{ minWidth:90 }}>Cost</th>
                <th style={{ minWidth:90 }}>P/L</th>
                <th style={{ minWidth:90 }}>Gain/Loss</th>
                <th style={{ minWidth:90 }}>After Gain/Loss</th>
                <th style={{ minWidth:150 }}>F. Dest</th>
                <th style={{ minWidth:150 }}>Shipper</th>
                <th style={{ minWidth:100 }}>Local Agent</th>
                <th>Type</th>

            </tr>
        </thead>
        <tbody>
        {recordState.length>0 && recordState?.map((x,index)=>{
        return (
        <tr key={index} className='f fs-10 text-center'>
            <td>{index + 1}</td>
            <td className='row-hov blue-txt'
                    onClick={()=>{
                    let type = x.operation;
                    dispatch(incrementTab({
                        "label":type=="SE"?"SE JOB":type=="SI"?"SI JOB":type=="AE"?"AE JOB":"AI JOB",
                        "key":type=="SE"?"4-3":type=="SI"?"4-6":type=="AE"?"7-2":"7-5",
                        "id":x.id
                    }));
                    router.push(type=="SE"?`/seaJobs/export/${x.id}`:type=="SI"?`/seaJobs/import/${x.id}`:
                        type=="AE"?`/airJobs/export/${x.id}`:`/airJobs/import/${x.id}`
                    )
                }}
            >{x.jobNo}</td>
            <td>{moment(x.createdAt).format("MM/DD/YY")}</td>
            <td>{x.Client.name}</td>
            <td>{x.subType}</td>
            <td>{x.Bl?.hbl}</td>
            <td>{x.weight}</td>
            <td>{setCommas(x.revenue)}</td>
            <td>{setCommas(x.cost)}</td>
            <td>{setCommas(x.actual)}</td>
            <td style={{color:x.gainLoss<0?'crimson':'green'}}>
                {setCommas(x.gainLoss<0?x.gainLoss*-1:x.gainLoss)}
            </td>
            <td>{setCommas(x.after)}</td>

            <td >{x.fd}</td>
            <td>{x.shipper?.name}</td>
            <td >{x.local_vendor?.name}</td>
            <td >{x.jobType}</td>
        
  
            
        </tr>
        )})}
        <tr className='f fs-11 text-center'>
            <td colSpan={6}></td>
            <td>Total: </td>
            <td>{setCommas(state.totalRevenue)}</td>
            <td>
  {setCommas(
    Array.isArray(state.records)
      ? state.records.reduce((x, c) => Number(c.cost) + x, 0)
      : 0
  )}
</td>  
<td>         
{setCommas(
    Array.isArray(state.records)
      ? state.records.reduce((x, c) => Number(c.actual) + x, 0)
      : 0
  )}
</td>   
 {/* <td>{setCommas(state.records?.reduce((x, c) => {return Number(c.actual) + x},0)||0)}</td> */}
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