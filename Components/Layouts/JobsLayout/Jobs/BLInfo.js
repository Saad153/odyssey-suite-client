import React from 'react';
import moment from 'moment';

const BLInfo = ({blValues}) => {
  return (
    <>
        <div style={{border:'1px solid silver', marginTop:10, padding:4, flexDirection:'row', display:'flex'}}>
        {blValues==null &&<div style={{color:'silver', marginLeft:10}}> No Bl Attached</div>}
        {blValues!=null &&<>
        <div style={{marginLeft:20}}>BL Info: </div>
        <div className='mx-3'>
        <span><b>MBL #</b></span>
        <span> {blValues?.mbl}</span>
        </div>
        <div className=''>
        <span><b>Date:</b></span>
        <span> {moment(blValues?.mblDate).format("YYYY - MMM - DD")}</span>
        </div>
        <div className='mx-4' style={{color:'silver'}}>|</div>
        <div className='mx-3'>
        <span><b>HBL #</b></span>
        <span> {blValues?.hbl}</span>
        </div>
        <div className=''>
        <span><b>Date:</b></span>
        <span> {moment(blValues?.hblDate).format("YYYY - MMM - DD")}</span>
        </div>
        </>}
        </div>
    </>
  )
}

export default BLInfo