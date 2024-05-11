import React from 'react';
import { Radio, Select, Input, InputNumber } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { getCompanyName } from './states';
import moment from 'moment';

const PrintTranInfo = ({state}) => {
  
  return (
  <>
    <Row>
      <Col md={12} className='mb-2'>
        <div className='grey-txt mb-1 fs-14'>Transaction Mode</div>
        <Radio.Group value={state.transaction}>
          <Radio value={"Cash"}>  Cash  </Radio>
          <Radio value={"Bank"}>  Bank  </Radio>
          <Radio value={"Adjust"}>Adjust</Radio>
        </Radio.Group>
      </Col>
      <Col md={3}>
        <span className="grey-txt fs-14">Date</span>
        <div className="custom-select-input-small">
          {moment(state.date).format("YYYY-MM-DD")}
        </div>
      </Col>
      <Col md={3}>
        <div className='grey-txt fs-14'>Sub Type</div>
        <Select size='small'
          value={state.subType}
          style={{ width:'100%' }}
          options={[
            { value:'Cheque', label:'Cheque' },
            { value:'Credit Cart', label:'Credit Cart' },
            { value:'Online Transfer', label:'Online Transfer' },
            { value:'Wire Transfer', label:'Wire Transfer' },
            { value:'Cash', label:'Cash' },
          ]}
        />
      </Col>
      <Col md={4}>
        <div className='grey-txt fs-14'>Cheque/Tran</div>
        <Input 
          size='small' 
          value={state.checkNo} 
          disabled={state.transaction=="Cash"?true:false}
        />
      </Col>
      <Col className="mt-3" md={6}>
          <span className="grey-txt fs-14">{state.payType=="Recievable"?"Recieving":"Paying"} Account</span>
          <div className="custom-select-input-small">
            {state.payAccountRecord!=null && Object.keys(state.payAccountRecord).length==0?
              <span style={{color:'silver'}}>Select Account</span>:
              <span style={{color:'black'}}>{state?.payAccountRecord?.title} ~ {getCompanyName(state?.payAccountRecord?.Parent_Account?.CompanyId)}</span>
            }
          </div>
      </Col>
      <Col md={4} className="mt-3">
        <div className='grey-txt fs-14'>On Account</div>
        <Select size='small' 
          value={state.onAccount}
          style={{ width:'100%' }}
          options={[
            { value:'Client', label:'Client' },
            { value:'Shipper', label:'Shipper' },
            { value:'Importer', label:'Importer' },
            { value:'Clearing Agent', label:'Clearing Agent' }
          ]}
        />
      </Col>
      <Col md={10} className="mt-2">
        <div className='grey-txt fs-14'>Drawn At</div>
        <Input size='small' value={state.drawnAt} />
      </Col>
      <Col md={3} className="mt-3">
        <div className='grey-txt fs-14'>Bank Charges</div>
        <InputNumber 
          size='small'
            style={{width:'90%'}} 
            value={state.bankCharges} 
            min="0.0" 
        />
      </Col>
      <Col className="mt-3" md={7}>
        <span className="grey-txt fs-14">Bank Charges Account</span>
        <div className="custom-select-input-small">
        {Object.keys(state.bankChargesAccountRecord).length==0?
          <span style={{color:'silver'}}>Select Account</span>:
          <span style={{color:'black'}}>{state.bankChargesAccountRecord.title}</span>
        }
        </div>
      </Col>
    </Row>
  </>
  )
}

export default PrintTranInfo