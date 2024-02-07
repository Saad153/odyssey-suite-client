import React, { useEffect } from 'react'
import { Col, Row, Table } from 'react-bootstrap';
import InputNumComp from '/Components/Shared/Form/InputNumComp';

const ChargesDetail = ({register, control, useWatch, reset}) => {

    const allValues = useWatch({ control });

    useEffect(() => {

        let pp = parseFloat(allValues.ppWeightCharges) +    
        parseFloat(allValues.ppvaluationCharges)       +
        parseFloat(allValues.ppTax)                    +
        parseFloat(allValues.ppOtherDueChargeAgent)    +
        parseFloat(allValues.ppOtherDueChargeCarrier)  

        let cc = parseFloat(allValues.ccWeightCharges) +        
        parseFloat(allValues.ccvaluationCharges)       +
        parseFloat(allValues.ccTax)                    +
        parseFloat(allValues.ccOtherDueChargeAgent)    +
        parseFloat(allValues.ccOtherDueChargeCarrier)  
        reset({...allValues, ppTotal:pp.toFixed(2), ccTotal:cc.toFixed(2)})
    }, [
        allValues.ppWeightCharges           ,allValues.ccWeightCharges          ,
        allValues.ppvaluationCharges        ,allValues.ccvaluationCharges       ,
        allValues.ppTax                     ,allValues.ccTax                    ,
        allValues.ppOtherDueChargeAgent     ,allValues.ccOtherDueChargeAgent    ,
        allValues.ppOtherDueChargeCarrier   ,allValues.ccOtherDueChargeCarrier  ,
    ])
    
  return (
    <div>
        <Row>
            <Col md={6}>
            <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
                <Table className='tableFixHead' bordered>
                <thead className=''>
                <tr className='table-heading-center no-lineBr fs-12'>
                    <th></th>
                    <th>Prepaid</th>
                    <th>Collect</th>
                </tr>
                </thead>
                <tbody>
                <tr className='f table-row-no-padding text-end'>
                    <td><div className="mt-1 mx-4">Weight Charges:</div></td>
                    <td><InputNumComp register={register} name='ppWeightCharges' control={control} width={"100%"} /></td>
                    <td><InputNumComp register={register} name='ccWeightCharges' control={control} width={"100%"} /></td>
                </tr>
                <tr className='f table-row-no-padding text-end' >
                    <td><div className="mt-1 mx-4">Valuation Charges:</div></td>
                    <td><InputNumComp register={register} name='ppvaluationCharges' control={control} width={"100%"} /></td>
                    <td><InputNumComp register={register} name='ccvaluationCharges' control={control} width={"100%"} /></td>
                </tr>
                <tr className='f table-row-no-padding text-end' >
                    <td><div className="mt-1 mx-4">Tax:</div></td>
                    <td><InputNumComp register={register} name='ppTax' control={control} width={"100%"} /></td>
                    <td><InputNumComp register={register} name='ccTax' control={control} width={"100%"} /></td>
                </tr>
                <tr className='f table-row-no-padding text-end' >
                    <td><div className="mt-1 mx-4">Total Other Chrg. Due Agent:</div></td>
                    <td><InputNumComp register={register} name='ppOtherDueChargeAgent' control={control} width={"100%"} /></td>
                    <td><InputNumComp register={register} name='ccOtherDueChargeAgent' control={control} width={"100%"} /></td>
                </tr>
                <tr className='f table-row-no-padding text-end' >
                    <td><div className="mt-1 mx-4">Total Other Chrg. Due Carrier:</div></td>
                    <td><InputNumComp register={register} name='ppOtherDueChargeCarrier' control={control} width={"100%"} /></td>
                    <td><InputNumComp register={register} name='ccOtherDueChargeCarrier' control={control} width={"100%"} /></td>
                </tr>
                <tr className='f table-row-no-padding text-end' >
                    <td><div className="mt-1 mx-4"><b>Total:</b></div></td>
                    <td><InputNumComp register={register} name='ppTotal' control={control} width={"100%"} disabled={true} /></td>
                    <td><InputNumComp register={register} name='ccTotal' control={control} width={"100%"} disabled={true} /></td>
                </tr>
                </tbody>
                </Table>
                </div>
            </Col>
        </Row>
    </div>
  )
}

export default ChargesDetail