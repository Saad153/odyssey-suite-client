import React, { useEffect } from 'react';
import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';
import DateComp from '/Components/Shared/Form/DateComp';
import TimeComp from '/Components/Shared/Form/TimeComp';
import InputComp from '/Components/Shared/Form/InputComp';
import Dates from './Dates';
import { Popover } from "antd";
import { Row, Col } from "react-bootstrap";

const Carrier = ({state, register, control, pageLinking, dispatch, getStatus, approved, VoyageId, vesselId, type}) => {

    function getVoyageNumber (id) {
        let result = '';
        if(state.voyageList[0]){
            state.voyageList.forEach((x)=>{
            if(x.id==id){
                result = x.voyage
            }
            })
        }
        return result
    }

    const filterVessels = (list) => {
        let result = [];
        list.forEach((x)=>{
            result.push({id:x.id, name:x.name+" ~ "+x.code, code:x.code})
        })
        return result
    }

  return (
    <>
    <div className='mt-3'>Carrier Info</div>
    <div className='px-2 pb-3 pt-2 ' style={{border:'1px solid silver'}}>
        {(type=="CSE"||type=="CSI") &&<>
        <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", shippingLineId)} >Sline/Carrier</div>
        <SelectSearchComp register={register} name='shippingLineId' control={control} label='' disabled={getStatus(approved)} options={state.fields.vendor.sLine} width={"100%"} />
        </>}
        {(type=="CAE"||type=="CAI") &&<>
        <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", airLineId)} >Air line *</div>
        <SelectSearchComp register={register} name='airLineId' control={control} label='' disabled={getStatus(approved)} options={state.fields.vendor.airLine} width={"100%"} />
        </>}
        
        <div className='custom-link mt-2' onClick={()=>pageLinking("vessel")} >Vessel *</div>
        <SelectSearchComp register={register} name='vesselId' control={control} label=''disabled={getStatus(approved)} width={"100%"}
            options={filterVessels(state.fields.vessel)} 
        />
        <div className='mt-2'>Voyage *</div>
        <div className="dummy-input"
            onClick={()=>{
                if(vesselId!=undefined && vesselId!=''){
                    dispatch({type:'voyageSelection', payload:vesselId})
                }
            }}
        >{getVoyageNumber(VoyageId)}</div>
    </div> 
    </>
  )}

export default React.memo(Carrier)