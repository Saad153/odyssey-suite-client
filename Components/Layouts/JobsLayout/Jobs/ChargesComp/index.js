import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getChargeHeads } from "/apis/jobs";
import { Row, Col } from 'react-bootstrap';
import { setHeadsCache, getHeadsNew } from '../states';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import Charges from './Charges';
import { Tabs } from 'antd';

const ChargesComp = ({state, dispatch, type, allValues}) => {

  const queryClient = useQueryClient();
  const companyId = useSelector((state) => state.company.value);
  const { register, control, handleSubmit, reset } = useForm({});
  const { fields, append, remove } = useFieldArray({ control, name:"chargeList" });
  const chargeList = useWatch({ control, name:'chargeList' });

  const chargesData = useQuery({
    queryKey:["charges", {id:state.selectedRecord.id}],
    queryFn: () => getChargeHeads({id:state.selectedRecord.id})
  });

  // useEffect(() => {
  //   setHeadsCache(chargesData, dispatch, reset);
  // }, [chargesData.status])

  useEffect(() => {
    getHeadsNew(state.selectedRecord.id, dispatch, reset)
  }, [])

  // useEffect(() => {
  //   let obj = { charges:chargeList, payble:state.payble, reciveable:state.reciveable };
  //   queryClient.setQueryData(['charges', {id:state.selectedRecord.id}], (x)=>x?{...obj}:x);
  // }, [chargeList])

  return (
    <>
    <div style={{minHeight:525, maxHeight:525}}>
      <Tabs defaultActiveKey="1" onChange={(e)=> dispatch({type:'toggle', fieldName:'chargesTab',payload:e})}>
      <Tabs.TabPane tab="Recievable" key="1">
        <Charges state={state} dispatch={dispatch} type={"Recievable"} register={register}
          chargeList={chargeList} fields={fields} append={append} reset={reset} control={control} 
          companyId={companyId} operationType={type} allValues={allValues} chargesData={chargesData}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Payble" key="2">
        <Charges state={state} dispatch={dispatch} type={"Payble"} register={register}
          chargeList={chargeList} fields={fields} append={append} reset={reset} control={control} 
          companyId={companyId} operationType={type} allValues={allValues} chargesData={chargesData}
        />
      </Tabs.TabPane>
    </Tabs>
    <hr/>
    </div>
    <div className='px-3'>
    <Row className='charges-box' >
      <Col md={9}>
        <Row className='my-1'>
          <Col style={{maxWidth:100}} className="py-4">
            Recievable:
          </Col>
          <Col>
            <div className='text-center'>PP</div>
            <div className="field-box p-1 text-end">
              {state.reciveable.pp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>CC</div>
            <div className="field-box p-1 text-end">
              {state.reciveable.cc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>Tax</div>
            <div className="field-box p-1 text-end">
              {state.reciveable.tax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>Total</div>
            <div className="field-box p-1 text-end">
              {state.reciveable.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
        </Row>
        <Row className='my-1'>
          <Col style={{maxWidth:100}} className="py-4">
            Payble:
          </Col>
          <Col>
            <div className='text-center'>PP</div>
            <div className="field-box p-1 text-end">
              {state.payble.pp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>CC</div>
            <div className="field-box p-1 text-end">
              {state.payble.cc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>Tax</div>
            <div className="field-box p-1 text-end">
              {state.payble.tax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>Total</div>
            <div className="field-box p-1 text-end">
              {state.payble.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
        </Row>
      </Col>
      <Col md={2} className="py-4">
        <div className='text-center mt-3'>Net</div>
        <div className="field-box p-1 text-end">
          {(state.reciveable.total-state.payble.total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      </Col>
    </Row>
    </div>
    </>
  )
}

export default React.memo(ChargesComp)