import React, { useEffect, memo } from 'react'
import { Select, Modal } from "antd";
import { Controller } from "react-hook-form";
import { Table, Row, Col } from "react-bootstrap";
import { CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const CustomBoxSelect = ({reset, useWatch, control, state, dispatch}) => {

    const all = useWatch({control});

return(
    <Modal open={state.voyageVisible}
        onOk={()=>dispatch({type:'toggle', fieldName:'voyageVisible', payload:false})} 
        onCancel={()=>dispatch({type:'toggle', fieldName:'voyageVisible', payload:false})}
        width={600} footer={false} maskClosable={false}
    >
    {(state.voyageVisible) && 
    <>
        <h6>Select Voyage</h6><hr/>
        <div className='table-sm-1 mt-4' style={{maxHeight:300, overflowY:'auto', fontSize:12}}>
        <Table className='tableFixHead'>
        <thead>
            <tr>
            <th className=''>#</th>
            <th className=''>Voyage</th>
            <th className=''>Arrival Date</th>
            <th className=''>Sailing Date</th>
            <th className=''>Cutoff Date</th>
            <th className=''>Cutoff Time</th>
            </tr>
        </thead>
        <tbody>
        {state.voyageList.map((x, i)=>{
            return(
            <tr key={i} className={`fs-12 ${x.check?"table-select-list-selected":"table-select-list"}`}
                onClick={()=>{
                    if(!x.check){
                        let temp = [...state.voyageList];
                        temp.forEach((y, i2)=>{
                          if(y.id==x.id){
                            temp[i2].check=true
                          } else { 
                            temp[i2].check=false 
                          }
                        })
                        dispatch({type:'toggle', fieldName:'voyageList', payload:temp});
                      } else {
                        reset({
                            ...all,
                            VoyageId:x.id
                        })
                        dispatch({type:'toggle', fieldName:'voyageVisible', payload:false})
                      }
                }}
            >
                <td className='pt-1 px-3'>{x.check?<CheckCircleOutlined style={{color:'green',position:'relative',bottom:2}}/>:i+1}</td>
                <td className='pt-1'>{x.voyage}</td>
                <td className='pt-1'>{moment(x.importArrivalDate   ).format("DD-MM-YYYY")}</td>
                <td className='pt-1'>{moment(x.importOriginSailDate).format("DD-MM-YYYY")}</td>
                <td className='pt-1'>{moment(x.cutOffDate          ).format("DD-MM-YYYY")}</td>
                <td className='pt-1'>{moment(x.cutOffTime          ).format("DD-MM-YYYY")}</td>
            </tr>
        )})}
        </tbody>
        </Table>
        </div>
    </>
    }
    </Modal>
)}
export default memo(CustomBoxSelect)