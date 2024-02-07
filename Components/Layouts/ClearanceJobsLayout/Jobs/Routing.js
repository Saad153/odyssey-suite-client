import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';
import InputComp from '/Components/Shared/Form/InputComp';
import DateComp from '/Components/Shared/Form/DateComp';
import { Row, Col } from 'react-bootstrap';
import ports from "/jsonData/ports";
import airports from "/jsonData/airports";
import React from 'react';

const Routing = ({register, control, errors, state, useWatch, type}) => {

  const Space = () => <div className='mt-2'/>

  return (
    <>
    <Row>
        <Col md={6}>
            <SelectSearchComp register={register} name='pol' control={control} 
                label={(type=="SE"||type=="SI")?'Port Of Loading':'Airport of Loading'} 
                width={"100%"}
                options={(type=="SE"||type=="SI")?ports.ports:airports} />
            <Space/>
        </Col>
        <Col md={6} style={{paddingTop:19}}> 
            <DateComp register={register} name='polDate' control={control} label=''  /> <Space/>
        </Col>
        <Col md={6}>
            <SelectSearchComp register={register} name='pod' control={control} 
                label={(type=="SE"||type=="SI")?'Port Of Discharge':'Airport of Discharge'} width={"100%"}
                options={(type=="SE"||type=="SI")?ports.ports:airports} />
            <Space/>
        </Col>
        <Col md={6} style={{paddingTop:19}}> 
            <DateComp register={register} name='podDate' control={control} label='' /> <Space/>
        </Col>
        <Col md={6}>
            <SelectSearchComp register={register} name='fd' control={control} label='Final Destination' width={"100%"}
                options={ports.ports} />
            <Space/>
        </Col>
        <Col md={6}></Col>
        <Col md={6} className='my-1'>
            <InputComp register={register} name='freightPaybleAt' control={control} label='Freight Payble At' width={300} /> <Space/>
        </Col>
        <Col md={6}></Col>
        <Col md={6}>
            <SelectSearchComp register={register} name='terminal' control={control} label='Terminal' width={"100%"}
                options={[  
                    {id:'Direct', name:'Direct'},
                ]}
            />
            <Space/>
        </Col>
        <Col md={6}></Col>
        <Col md={6}>
            <SelectSearchComp register={register} name='delivery' control={control} label='Delivery' width={"100%"}
                options={[  
                    {id:'CY/CY', name:'CY/CY'},
                ]}
            /> <Space/>
        </Col>
        <Col md={6}></Col>
        <div style={{minHeight:258}}></div>
    </Row>
    </>
  )
}

export default React.memo(Routing)