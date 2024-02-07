import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import InputNumComp from "/Components/Shared/Form/InputNumComp";
import SelectComp from "/Components/Shared/Form/SelectComp";
import InputComp from "/Components/Shared/Form/InputComp";
import { InputNumber } from "antd";
import { getStatus } from './states';

const Weights = ({register, control, type, approved, equipments, useWatch}) => {
    
    const allValues = useWatch({control})

    function getWeight(){
        let weight = 0.0, teu = 0, qty = 0;
        equipments.forEach((x) => {
          if(x.gross!=''&&x.teu!=''){
            weight = weight + parseFloat(
                x.gross//.replace(/,/g, '')
                );
            teu = teu + parseInt(x.teu);
            qty = qty + parseInt(x.qty);
          }
        });
        return {weight, teu, qty}
      }

    return(
    <Row style={{border:'1px solid silver', paddingBottom:15, margin:0}}>
        <Col md={6} className='mt-2'>
        <InputNumComp register={register} name='weight' control={control} width={"100%"} label='Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='bkg' control={control} width={"100%"} label='BKG Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='shpVol' control={control} label='Shp Vol' width={"100%"} step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='vol' control={control} label='Vol' width={"100%"} step={'0.00001'} disabled={getStatus(approved)}/>
        </Col>
        <Col md={4} className='mt-2'>
            <InputNumComp register={register} name='pcs' control={control}  label='PCS' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={8} className='mt-2'>
            <SelectComp register={register} name='pkgUnit' control={control} label='.' width={"100%"} disabled={getStatus(approved)}
            options={[  
            {"id":"BAGS"   , "name":"BAGS"},
            {"id":"BALES"  , "name":"BALES"},
            {"id":"BARRELS", "name":"BARRELS"},
            {"id":"CARTONS", "name":"CARTONS"},
            {"id":"BLOCKS" , "name":"BLOCKS"},
            {"id":"BOATS"  , "name":"BOATS"}
            ]} />
        </Col>

     
    </Row>
    )
}
export default React.memo(Weights)