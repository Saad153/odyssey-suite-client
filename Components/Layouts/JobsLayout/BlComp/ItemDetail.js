import React, { useEffect } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { Input, InputNumber, Select } from 'antd';
import { CloseCircleOutlined } from "@ant-design/icons";
import CheckGroupComp from "/Components/Shared/Form/CheckGroupComp"

const ItemDetail = ({control, register, state, useWatch, dispatch, reset}) => {

  const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b});
  const allValues = useWatch({control})

  const onChange = (e, i, variable, type) => {
    let temp = [...state.Item_Details];
    temp[i][variable] = type=='e'?e:e.target.value;
    temp.forEach((x)=>{
        x.total = (parseFloat(x.chargableWt?x.chargableWt:0) * parseFloat(x.rate_charge?x.rate_charge:0)).toFixed(2)||0
    })
    //set('Item_Details', temp);
    calculateRateTotal(temp)
  }

  const confirmClose = (index, id) => {
    let temp = [...state.Item_Details];
    if(id!==null){
        let tempDeleteList = [...state.deletingItemList];
        let newTemp = [...temp];

        temp = temp.filter((x)=>{
            return x.id!==id
        })
        newTemp.forEach((x)=>{
            if(x.id==id){
              tempDeleteList.push(x.id);
            }
        })
        set('deletingItemList', tempDeleteList)
    } else {
        let newTemp = temp;
        temp = [];
        newTemp.forEach((x, i)=>{
            if(i!=index){
                temp.push(x)
            }
        })
    }
    set('Item_Details', temp)
  }

  const onChange2 = (e, i, variable, type) => {
    let temp = [...state.Dimensions];
    temp[i][variable] = type=='e'?e:e.target.value;
    temp.forEach((x)=>{
        x.vol = ((parseFloat(x.length?x.length:0) * parseFloat(x.width?x.width:0) * parseFloat(x.height?x.height:0) * parseFloat(x.qty?x.qty:0))/1000000.00).toFixed(3)||0
        x.weight = ((parseFloat(x.length?x.length:0) * parseFloat(x.width?x.width:0) * parseFloat(x.height?x.height:0) * parseFloat(x.qty?x.qty:0))/6000.00).toFixed(3)||0
    })
    if(allValues.applyToCWT[0]==1){
        calculateChargableWeight(temp)
    }
    set('Dimensions', temp);
  }

  const confirmClose2 = (index, id) => {
    let temp = [...state.Dimensions];
    if(id!==null){
        let tempDeleteList = [...state.deletingDimensionsList];
        let newTemp = [...temp];

        temp = temp.filter((x)=>{
            return x.id!==id
        })
        newTemp.forEach((x)=>{
            if(x.id==id){
              tempDeleteList.push(x.id);
            }
        })
        set('deletingDimensionsList', tempDeleteList)
    } else {
        let newTemp = temp;
        temp = [];
        newTemp.forEach((x, i)=>{
            if(i!=index){
                temp.push(x)
            }
        })
    }
    set('Dimensions', temp);
  }

  const calculateChargableWeight = (values) => {
    console.log("Hit 1")
    if(state.Item_Details.length>0){
        let finalWeight = 0.0;
        values.forEach((x)=>{
            finalWeight = parseFloat(finalWeight) + parseFloat(x.weight)
        })
        let tempItemDetail = [...state.Item_Details];
        tempItemDetail[0].chargableWt = finalWeight.toFixed(2);
        tempItemDetail.forEach((x)=>{
            x.total = (parseFloat(x.chargableWt?x.chargableWt:0) * parseFloat(x.rate_charge?x.rate_charge:0)).toFixed(3)||0;
        })
        dispatch({type:"set", payload:{
            Item_Details:tempItemDetail
        }})
    }
  }

  const calculateRateTotal = (temp) => {
    console.log("Hit 2")
    temp.forEach((x)=>{
        x.total = (parseFloat(x.chargableWt?x.chargableWt:0) * parseFloat(x.rate_charge?x.rate_charge:0)).toFixed(3)||0;
    })
    set('Item_Details', temp);
  }

  const weightUnit = [
    {label:'KG', value:'KG'},
    {label:'LBS', value:'LBS'},
    {label:'MTON', value:'MTON'}
  ]
  
  useEffect(() => {
    if(allValues.applyToCWT[0]==1){
        let temp = [...state.Dimensions]
        calculateChargableWeight(temp)
    }
  }, [allValues.applyToCWT, state.Dimensions])
  
  useEffect(() => {
    console.log(state.deletingDimensionsList)
  }, [state.deletingDimensionsList])
  

return (
    <div style={{height:600}}>
    <Row>
    <Col md={1} className=''>
        <div className='div-btn-custom text-center py-1' 
            onClick={()=>{
                let temp = [...state.Item_Details];
                temp.push({
                    id:null, noOfPcs:'0', unit:'',grossWt:'0', kh_lb:'', r_class:'', itemNo:'',
                    chargableWt:'0', rate_charge:'0', total:'0', lineWeight: '0'
                })
                set('Item_Details', temp)
            }}
        >Add Item</div>
    </Col>
    <Col md={12} className=''>
        <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
        <Table className='tableFixHead' bordered>
            <thead className=''>
            <tr className='table-heading-center no-lineBr fs-12'>
                <th></th>
                <th>No. of Pcs</th>
                <th>Unit</th>
                <th>Gross WT</th>
                <th>Kg/Lb</th>
                <th>R/Class</th>
                <th>Item No</th>
                <th>Chargable WT</th>
                <th>Rate/Charge</th>
                <th>Total</th>
                <th><b>Line Weight</b></th>
            </tr>
            </thead>
            <tbody>
            {state.Item_Details.map((x,i)=>{
            return (
            <tr key={i} className='f table-row-no-padding' >
                <td>
                    <CloseCircleOutlined className='close-btn mx-2 mt-2' 
                        style={{fontSize:15}}
                        onClick={()=>confirmClose(i, x.id)}
                    />
                </td>
                <td><InputNumber value={x.noOfPcs}   onChange={(e)=>onChange(e,i,'noOfPcs', 'e')}min="0.00" /></td>
                <td><Input value={x.unit}            onChange={(e)=>onChange(e,i,'unit')} /></td>
                <td><InputNumber value={x.grossWt}   onChange={(e)=>onChange(e,i,'grossWt', 'e')}min="0.00" /></td>
                <td><Select value={x.kh_lb} style={{width:90}} onChange={(e)=>onChange(e,i,'kh_lb','e')} options={weightUnit} /></td>
                <td><Input value={x.r_class}          onChange={(e)=>onChange(e,i,'r_class')} /></td>
                <td><Input value={x.itemNo}           onChange={(e)=>onChange(e,i,'itemNo')} /></td>
                <td><InputNumber value={x.chargableWt}style={{width:120}} onChange={(e)=>allValues.applyToCWT[0]==1?null:onChange(e,i,'chargableWt','e')} min="0.00" /></td>
                <td><InputNumber value={x.rate_charge}onChange={(e)=>onChange(e,i,'rate_charge','e')}min="0.00" /></td>
                <td><InputNumber value={x.total}  min="0.00"  /></td>
                <td><InputNumber value={x.lineWeight} style={{width:120}} onChange={(e)=>onChange(e,i,'lineWeight','e')} min="0.00" /></td>
            </tr>)})}
            </tbody>
        </Table>
        </div>
    </Col>
    </Row>
    <hr/>
    <Row>
    <Col md={2}>
        <div className='div-btn-custom text-center py-1' 
            onClick={()=>{
                let temp = [...state.Dimensions];
                temp.push({
                    id:null, length:'0', width:'0', height:'0', qty:'0', vol:'0', weight:'0'
                })
                set('Dimensions', temp)
            }}
        >Add Dimensions</div>
    </Col>
    <Col md={10}>
    
    <CheckGroupComp register={register} name='applyToCWT' control={control} label='' 
            options={[{ label:"Apply To Chargable Weight", value:"1" }]} 
          />
    </Col>
    <Col md={8} style={{paddingRight:95}}>
        <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
        <Table className='tableFixHead' bordered>
            <thead className=''>
            <tr className='table-heading-center no-lineBr fs-12'>
                <th></th>
                <th>Length</th>
                <th>Width</th>
                <th>Height</th>
                <th>Qty</th>
                <th>Vol</th>
                <th>Weight</th>
            </tr>
            </thead>
            <tbody>
            {state.Dimensions?.map((x,i)=>{
            return (
            <tr key={i} className='f table-row-no-padding' >
                <td>
                    <CloseCircleOutlined className='close-btn mx-2 mt-2' 
                        style={{fontSize:15}}
                        onClick={()=>confirmClose2(i, x.id)}
                    />
                </td>
                <td><InputNumber value={x.length} style={{width:"100%"}} onChange={(e)=>onChange2(e,i,'length','e')}min="0.00" /></td>
                <td><InputNumber value={x.width}  style={{width:"100%"}} onChange={(e)=>onChange2(e,i,'width','e')}min="0.00" /></td>
                <td><InputNumber value={x.height} style={{width:"100%"}} onChange={(e)=>onChange2(e,i,'height','e')} min="0.00" /></td>
                <td><InputNumber value={x.qty}    style={{width:"100%"}} onChange={(e)=>onChange2(e,i,'qty','e')} min="0.00" /></td>
                <td><InputNumber value={x.vol}    style={{width:"100%"}} /></td>
                <td><InputNumber value={x.weight} style={{width:"100%"}} /></td>
            </tr>)})}
            </tbody>
        </Table>
        </div>
    </Col>
    </Row>
    </div>
)}

export default React.memo(ItemDetail)