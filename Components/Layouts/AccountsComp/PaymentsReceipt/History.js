import React, { useEffect, useState } from 'react';
import { Empty, InputNumber, Checkbox, Radio, Select, DatePicker, Input } from 'antd';
import { Spinner, Table, Col, Row } from 'react-bootstrap';
import moment from "moment";
import { CloseCircleOutlined } from '@ant-design/icons';


const BillComp = ({transaction, oldOnvoices, payType}) => {
    const commas = (a) => a<1?'0':parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
    const [values, setValues] = useState({})
    useEffect(() => {
      setValues(transaction)
    }, [transaction])
    
  return (
    <>
    <div>
        <Row>
            <Col md={7}>
            <Row>
                <Col md={5}>
                    <div className='grey-txt mb-1 fs-14'>Transaction Mode</div>
                    <Radio.Group value={values.mode}>
                        <Radio value={"Cash"}>Cash</Radio>
                        <Radio value={"Bank"}>Bank</Radio>
                        <Radio value={"Adjust"}>Adjust</Radio>
                    </Radio.Group>
                </Col>
                <Col md={3} className="">
                    <div className='grey-txt fs-14'>Date</div>
                    <DatePicker size='small' value={moment(values.tranDate)} />
                </Col>
                <Col md={4} className="">
                    <div className='grey-txt fs-14'>Sub Type</div>
                    <Select size='small' 
                        style={{ width:'100%'}} value={values.subType}
                        options={[
                            { value:'Cheque', label:'Cheque' },
                            { value:'Credit Cart', label:'Credit Cart' },
                            { value:'Online Transfer', label:'Online Transfer' },
                            { value:'Wire Transfer', label:'Wire Transfer' },
                            { value:'Cash', label:'Cash' },
                        ]}
                    />
                </Col>
                <Col md={3} className="mt-3">
                    <div className='grey-txt fs-14'>Cheque / Tran #</div>
                    <Input size='small' value={values.chequeTran} />
                </Col>
                <Col className="mt-3" md={4}>
                    <span className="grey-txt fs-14"> Account #</span>
                    <span style={{marginLeft:6, position:'relative', bottom:2}} className='close-btn'>
                        <CloseCircleOutlined  />
                    </span>
                    <div className="custom-select-input-small" style={{minHeight:23}}>
                        {values.payAcc}
                    </div>
                </Col>
                <Col md={4} className="mt-3">
                    <div className='grey-txt fs-14'>On Account</div>
                    <Select size='small' 
                        style={{ width:'100%'}} value={values.onAcc}
                        options={[
                            { value:'Client', label:'Client' },
                            { value:'Importer', label:'Importer' },
                            { value:'Shipper', label:'Shipper' },
                            { value:'Clearing Agent', label:'Clearing Agent' }
                        ]}
                    />
                </Col>
                <Col md={8} className="mt-0">
                    <div className='grey-txt fs-14 mt-3'>Drawn At</div>
                    <Input size='small' value={values.drawn} />
                </Col>
                <Col md={3} className=""></Col>
                <Col md={3} className="mt-3">
                    <div className='grey-txt fs-14'>Bank Charges</div>
                    <InputNumber size='small' style={{width:'90%'}} value={values.bankCharges} />
                </Col>
                <Col className="mt-3" md={6}>
                    <span className="grey-txt fs-14">Bank Charges Account</span>
                    <span style={{marginLeft:6, position:'relative', bottom:2}} className='close-btn'>
                        <CloseCircleOutlined />
                    </span>
                    <div className="custom-select-input-small"  style={{minHeight:23}}>
                        {values.bankAcc}
                    </div>
                </Col>
            </Row>
            </Col>
            <Col md={5}>
            <div className="mb-2" style={{cursor:'pointer', borderBottom:'1px solid silver', paddingBottom:2}}>
                <span><Checkbox style={{position:'relative', bottom:1}} disabled /></span>
                <span className='mx-2'>Auto Knock Off</span>
            </div>
            <Row>
                <Col md={5}>
                    <span className='grey-txt'>Amount</span>
                    <InputNumber 
                        size='small'
                        min="0" stringMode 
                        style={{width:'100%', paddingRight:10}}
                        value={values.amount} 
                    />
                </Col>
                <Col md={4}>
                    <span className='grey-txt'>Ex. Rate</span>
                    <InputNumber size='small'
                        min="1.00" stringMode 
                        style={{width:'100%', paddingRight:20}} 
                        value={values.exRate}
                    />
                </Col>
                <Col md={3}>
                    <br/>
                    <button className={'btn-custom-disabled'} style={{fontSize:10}}>Set</button>
                </Col>
                <Col md={3} className="mt-3">
                    <div className='grey-txt fs-14'>Tax Amount</div>
                    <InputNumber size='small' value={values.taxAmount} />
                </Col>
                <Col className="mt-3" md={5}>
                    <span className="grey-txt fs-14">Tax Account #</span>
                    <span style={{marginLeft:6, position:'relative', bottom:2}} className='close-btn'>
                        <CloseCircleOutlined onClick={()=>{
                            
                        }} />
                    </span>
                    <div className="custom-select-input-small"  style={{minHeight:23}}
                    >{values.taxAc}
                    </div>
                </Col>
                <Col></Col>
                <Col md={4} className="mt-3">
                    <div className='grey-txt fs-14'>
                        {values.gainLoss==0.00 && <br/>}
                        {(values.gainLoss>0 && payType!="Recievable") && <span style={{color:'red'}}><b>Loss</b></span>}
                        {(values.gainLoss>0 && payType=="Recievable") && <span style={{color:'green'}}><b>Gain</b></span>}
                        {(values.gainLoss<0 && payType!="Recievable") && <span style={{color:'green'}}><b>Gain</b></span>}
                        {(values.gainLoss<0 && payType=="Recievable") && <span style={{color:'red'}}><b>Loss</b></span>}
                    </div>
                    <div className="custom-select-input-small" >{Math.abs(values.gainLoss)}</div>
                </Col>
                <Col className="mt-3" md={8}>
                    <span className="grey-txt fs-14">Gain / Loss Account</span>
                    <span style={{marginLeft:7, position:'relative', bottom:2}} className='close-btn'>
                        <CloseCircleOutlined />
                    </span>
                    <div className="custom-select-input-small" style={{minHeight:23}}>{values.gainLossAc}
                    </div>
                </Col>
            </Row>
            </Col>
        </Row>
        <div style={{minHeight:250}}>
        <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
        <Table className='tableFixHead' bordered>
        <thead>
            <tr className='fs-12'>
            <th>Sr.</th>
            <th>Job #</th>
            <th>Inv/Bill #</th>
            <th>HBL</th>
            <th>MBL</th>
            <th>Type</th>
            <th>Currency</th>
            <th>{payType=="Recievable"? 'Inv':'Bill'} Bal</th>
            <th>Balance</th>
            </tr>
        </thead>
        <tbody>
        {oldOnvoices.map((x, index) => {
        return (
        <tr key={index} className='f fs-12'>
            <td style={{width:30}}>{index + 1}</td>
            <td style={{width:100}} className="text-center">{x.SE_Job.jobNo}</td>
            <td style={{width:100}}>{x.invoice_No}</td>
            <td>HBL</td>
            <td>MBL</td>
            <td style={{width:50}}>{x.SE_Job.subType}</td>
            <td style={{width:100}}>PKR</td>
            <td>{commas(parseFloat(x.total)/parseFloat(x.ex_rate) + parseFloat(x.roundOff))}</td>
            <td>
                {commas((parseFloat(x.total)-parseFloat(x.recieved)-parseFloat(x.paid))/parseFloat(x.ex_rate)+ parseFloat(x.roundOff))}
            </td>
        </tr>
        )})}
        </tbody>
        </Table>
        </div>
        </div>
    </div>
    {/* {load && <div className='text-center' ><Spinner /></div>} */}
    </>
  )
}

export default React.memo(BillComp)