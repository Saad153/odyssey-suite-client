import React from 'react';
import { MdDeleteForever } from "react-icons/md";
import { Modal } from 'antd';
import Router from 'next/router';
import axios from 'axios';

const DeleteVoucher = ({companyId, setAll, state, id, setShowTable}) => {

  const deleteVoucher = () => {
    axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_DELETE_PAY_REC,{
      id:id
    }).then((x) => {
      console.log(x.data.status)
      if(x.data.status=="success"){
        console.log("Router.push")
        setShowTable(true)
        Router.push(`/accounts/paymentReceipt/new`)
      }
    })
    
  }

  return (
    <>
      <button className='btn-red mx-3' style={{fontSize:11}} onClick={() => setAll({deleteVisible:true})}>
        Delete <MdDeleteForever />
      </button>
      <Modal 
        open={state.deleteVisible}
        onOk={()=>setAll({deleteVisible:false})}
        onCancel={()=> setAll({deleteVisible:false})}
        footer={false}
        maskClosable={false}
        title={<>Delete Voucher</>}
      >   
        <div>
          <h4>Are you sure?</h4>
          <div className='flex '>
            <button className='btn-red' onClick={()=>{
              deleteVoucher()
              setAll({deleteVisible:false})
            }}>Confirm</button>
            <button className='btn-custom mx-2 px-3'  onClick={() => setAll({deleteVisible:false})}>Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default React.memo(DeleteVoucher)