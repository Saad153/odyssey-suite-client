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
    <Row style={{border:'1px solid silver', paddingBottom:15}}>
        {(type=="SE" && allValues.subType=="FCL") && 
        <>
        <Col md={6} className='mt-2'>
        <InputNumComp register={register} name='weight' control={control} width={"100%"} label='Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='bkg' control={control} width={"100%"} label='BKG Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <div>Container</div><InputNumber value={getWeight().qty} disabled style={{width:"100%"}} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='shpVol' control={control} label='Shp Vol' width={"100%"} step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <div>TEU</div><InputNumber value={getWeight().teu} disabled style={{width:"100%", color:'black'}} />
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
        </>}
        {(type=="SE" && allValues.subType=="LCL") && 
        <>
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
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='weight' control={control} width={"100%"} label='Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <SelectComp register={register} name='weightUnit' control={control} label='WT Unit' width={"100%"} disabled={getStatus(approved)}
                options={[  
                {"id":"LBS"  , "name":"LBS"},
                {"id":"KG"   , "name":"KG"},
                {"id":"MTON", "name":"MTON"}
                ]} 
            />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='billVol' control={control} label='Bill Vol' width={"100%"} step={'0.00001'} disabled={getStatus(approved)}/>
        </Col>
        </>}
        {(type=="SI" && allValues.subType=="FCL") && 
        <>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='weight' control={control} width={"100%"} label='Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='vol' control={control} label='Vol' width={"100%"} step={'0.00001'} disabled={getStatus(approved)}/>
        </Col>
        <Col md={12} className='mt-2'>
            <div>Container</div><InputNumber value={getWeight().qty} disabled style={{width:"100%"}} />
        </Col>
        <Col md={12} className='mt-2'>
            <div>TEU</div><InputNumber value={getWeight().teu} disabled style={{width:"100%", color:'black', textAlign:'right'}} />
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
        </>}
        {(type=="SI" && allValues.subType=="LCL") && 
        <>
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
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='weight' control={control} width={"100%"} label='Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <SelectComp register={register} name='weightUnit' control={control} label='WT Unit' width={"100%"} disabled={getStatus(approved)}
                options={[  
                {"id":"LBS"  , "name":"LBS"},
                {"id":"KG"   , "name":"KG"},
                {"id":"MTON", "name":"MTON"}
                ]} 
            />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='shpVol' control={control} label='Shp Vol' width={"100%"} step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <div>MT</div>
            <div className="py-1"><b>{parseFloat(parseFloat(allValues.weight)/1000).toFixed(2)}</b></div>
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='billVol' control={control} label='Bill Vol' width={"100%"} step={'0.00001'} disabled={getStatus(approved)}/>
        </Col>
        </>}
        {(type=="AE"||type=="AI") && 
        <>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='weight' control={control} width={"100%"} label='Weight' step={'0.01'} disabled={getStatus(approved)} />
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
        <Col md={4} className='mt-2'>
            <InputNumComp register={register} name='volWeight' control={control}  label='Vol.WT' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={8}></Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='cwtLine' control={control}  label='CWT (Line)' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='cwtClient' control={control}  label='CWT (Client)' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        </>}
    </Row>
    )
}
export default React.memo(Weights)