import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Row, Col, Table, Spinner } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import openNotification from '/Components/Shared/Notification';
import { delay } from "/functions/delay"

const InvoiceEditor = ({data, reload}) => {

  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState(false);
  const [charges, setCharges] = useState([]);

  useEffect(() => {
    setCharges(data.resultOne.Charge_Heads)
  }, []);

  const appendCharge = () => {
    let tempState = [...charges];
    let tempCharge = {
      ...charges[0],
      key_id:uuidv4(),
      particular:'SAMPLE CHARGE',
      qty:'1',
      rate_charge:'1',
      net_amount:'1',
      local_amount:charges[0].ex_rate,
      charge:0
    }
    delete tempCharge.id
    tempState.push({
      ...tempCharge
    });
    setCharges(tempState)
  }

  const save = () => {
    if(!load){
      setLoad(true)
      axios.post(process.env.NEXT_PUBLIC_CLIMAX_SAVE_SE_HEADS_NEW, {
        charges:charges
      }).then(async() => {
        await delay(2000)
        setLoad(false)
        setVisible(false)
        openNotification('Success', `Sample Charge Added in Invoice!`, 'green')
        await delay(500)
        openNotification('Info', `Please Refresh The Job page To Get the updated Charges`, 'orange')
        reload()
      })
    }
  };

  return (
  <>
    <button className='btn-custom py-2 px-3 mx-3' type='button' onClick={()=>setVisible(true)}>
      <b>Add Charge</b>
    </button>
    {visible &&
      <Modal 
        open={visible}
        onOk={()=>setVisible(false)}
        onCancel={()=> setVisible(false)}
        footer={false}
        maskClosable={false}
      >   
        <Row>
          <Col md={3}>
            <div className='div-btn-custom text-center py-1 fw-8' onClick={appendCharge}>
              Add +
            </div>
          </Col>
          <Col md={12}>
            <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto', fontSize:10}}>
              <Table className='tableFixHead' bordered>
                <thead>
                  <tr className=''>
                    <th>Charge Name</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Ex. Rate</th>
                    <th>Local Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {charges.map((charge)=>{
                    return(
                      <tr key={charge.key_id||charge.id} className='f table-row-center-singleLine'>
                        <td>{charge.particular}</td>
                        <td>{charge.amount}</td>
                        <td>{charge.currency}</td>
                        <td>{charge.ex_rate}</td>
                        <td>{charge.local_amount}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col md={9}></Col>
          <Col md={3}>
            <div className='div-btn-custom text-center py-1 fw-8' onClick={save}>
              { load? <Spinner size='sm' /> : "Save" }
            </div>
          </Col>
        </Row>
      </Modal>
    }
  </>
  )
}

export default InvoiceEditor