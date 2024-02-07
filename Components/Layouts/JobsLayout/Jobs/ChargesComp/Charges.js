import { useWatch } from "react-hook-form";
import { CloseCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import SelectSearchComp from "../../../../Shared/Form//SelectSearchComp";
import InputNumComp from "../../../../Shared/Form/InputNumComp";
import { Select, Modal, Tag, InputNumber } from 'antd';
import { getVendors, getClients } from '../states';
import SelectComp from "../../../../Shared/Form/SelectComp";
import { Row, Col, Table, Spinner } from 'react-bootstrap';
import PopConfirm from '../../../../Shared/PopConfirm';
import React, { useEffect } from 'react';
import PartySearch from './PartySearch';
import { saveHeads, calculateChargeHeadsTotal, makeInvoice, getHeadsNew } from "../states";
import { useQueryClient } from '@tanstack/react-query';
import { delay } from "/functions/delay";
import { v4 as uuidv4 } from 'uuid';

const ChargesList = ({state, dispatch, type, append, reset, fields, chargeList, remove, control, register, companyId, operationType, allValues, chargesData}) => {
    
    const queryClient = useQueryClient();
    const { permissions } = state;

    useEffect(() => {
        if(chargeList){
            let list = chargeList.filter((x)=>x.check);
            dispatch({
                type:'set', payload:{
                selection:{
                    InvoiceId:list.length>0?list[0].InvoiceId:null,
                    partyId:list.length>0? list[0].partyId:null
                }}
            })
        }
    }, [chargeList])

    const calculate  = () => {
        let tempChargeList = [...chargeList];
        for(let i = 0; i<tempChargeList.length; i++){
            let amount = tempChargeList[i].amount*tempChargeList[i].rate_charge - tempChargeList[i].discount;
            let tax = 0.00;
            if(tempChargeList[i].tax_apply==true){
                tax = (amount/100.00) * tempChargeList[i].taxPerc;
                tempChargeList[i].tax_amount = tax;
                tempChargeList[i].net_amount =( amount + tax ) * parseFloat(tempChargeList[i].qty);
            }else{
                tempChargeList[i].net_amount = (amount * parseFloat(tempChargeList[i].qty)).toFixed(2);
            }
            if(tempChargeList[i].currency=="PKR"){
                tempChargeList[i].local_amount = (tempChargeList[i].net_amount*1.00).toFixed(2);
            }else{
                tempChargeList[i].local_amount = (tempChargeList[i].net_amount*tempChargeList[i].ex_rate).toFixed(2);
            }
        }
        let tempChargeHeadsArray = calculateChargeHeadsTotal(tempChargeList, 'full');
        dispatch({type:'set', payload:{...tempChargeHeadsArray}})
        reset({ chargeList: tempChargeList });
    }

    const permissionAssign=(perm, x)=>x.Invoice?.approved=="1"?true:false;
    
    const saveCharges = async () => {
        if(!state.chargeLoad){
            await dispatch({type:'toggle', fieldName:'chargeLoad', payload:true})
            await saveHeads(chargeList, state, dispatch, reset);
            //chargesData.refetch();
        }
    }

    const appendCharge = ()=>{
        if(!state.chargeLoad){
        append({
            type:type, description:'', basis:'', key_id:uuidv4(),
            new:true,  ex_rate: parseFloat(state.exRate), pp_cc:state.selectedRecord.freightType=="Prepaid"?'PP':'CC', 
            local_amount: 0,  size_type:'40HC', dg_type:state.selectedRecord.dg=="Mix"?"DG":state.selectedRecord.dg, 
            qty:1, rate_charge:1, currency:'USD', amount:1, check: false, bill_invoice: '', charge: '', particular: '',
            discount:0, tax_apply:false, taxPerc:0.00, tax_amount:0, net_amount:0, invoiceType:"", name: "", 
            partyId:"", sep:false, status:'', approved_by:'', approval_date:'', InvoiceId:null, 
            SEJobId:state.selectedRecord.id
        })}
    }

    const generateInvoice = async () => {
        if(!state.chargeLoad){
            dispatch({type:'toggle', fieldName:'chargeLoad', payload:true})
            await makeInvoice(chargeList, companyId, reset, operationType, dispatch, state);
        }
    }

  return(
<>
    <Row>
    <Col style={{maxWidth:150}}>
        <div className='div-btn-custom text-center py-1 fw-8' onClick={appendCharge}>Add +</div>
    </Col>
    <Col>
        <div className='div-btn-custom mx-2 py-1 px-3 fl-right' onClick={saveCharges}>Save Charges</div>
        <div className='div-btn-custom-green fl-right py-1 px-3' onClick={generateInvoice}>Generate Invoice No</div>
        <div className='mx-2' style={{float:'right'}}>
            <InputNumber placeholder='Ex.Rate' size='small' className='my-1' min={"0.1"}  style={{position:'relative', bottom:2}}
                value={state.exRate} onChange={(e)=>dispatch({type:'toggle',fieldName:'exRate',payload:e})} 
            />
        </div>
        <div className='my-1' style={{float:'right'}}>Ex.Rate</div>
    </Col>
    </Row>
    <div className='table-sm-1 mt-3' style={{maxHeight:300, overflowY:'auto'}}>
    {!state.chargeLoad &&
    <Table className='tableFixHead' bordered>
    <thead>
    <tr className='table-heading-center'>
        <th>x</th>
        <th>.</th>
        <th>Bill/Invoice</th>
        <th>Charge</th>
        <th>Party</th>
        <th>Basis</th>
        <th>PP/CC</th>
        {(operationType=="SE"||operationType=="SI") &&<th>SizeType</th>}
        {(operationType=="SE"||operationType=="SI") &&<th style={{minWidth:95}}>DG Type</th>}
        <th>Qty/Wt</th>
        {(operationType=="AI"||operationType=="AE")&&<th>Rate</th>}
        <th>Currency</th>
        <th>Amount</th>
        <th>Discount</th>
        <th style={{minWidth:60}}>Tax</th>
        <th style={{minWidth:100}}>Tax Amount</th>
        <th style={{minWidth:100}}>Net Amount</th>
        <th>Ex.Rate</th>
        <th style={{minWidth:110}}>Local Amount</th>
        <th>Particular</th>
        <th>Status</th>
        <th style={{minWidth:110}}>Approved By</th>
        <th style={{minWidth:120}}>Approval Date</th>
    </tr>
    </thead>
    {chargeList && <tbody>
    {fields.map((x, index) => {
    return(
        <>
        {x.type==type && 
        <tr key={x.key_id} className='f table-row-center-singleLine'>
        <td className='text-center'>
            <CloseCircleOutlined className='cross-icon' style={{ position: 'relative', bottom: 3 }}
                onClick={() => {
                if((x.Invoice==null || x.Invoice?.status==null || x.Invoice?.approved=="0")) {
                    PopConfirm("Confirmation", "Are You Sure To Remove This Charge?",
                    () => {
                        let tempState = [...chargeList];
                        let tempDeleteList = [...state.deleteList];
                        tempDeleteList.push(tempState[index].id);
                        tempState.splice(index, 1);
                        reset({ chargeList: tempState });
                        dispatch({ type: 'toggle', fieldName: 'deleteList', payload: tempDeleteList });
                })}}}
            />
        </td>
        <td className='text-center'>
            {(x.InvoiceId==null && x.new!=true) &&
            <input type="checkbox" {...register(`chargeList.${index}.check`)}
                style={{ cursor: 'pointer' }}
                disabled={
                    x.partyId==state.selection.partyId?
                        false:
                        state.selection.partyId==null?
                            false:
                            true
                }
            />}
        </td>
        <td className='text-center'>{/* Invoice Number */}
            {x.invoice_id != null &&
                <Tag color="geekblue" style={{ fontSize:15, cursor:"pointer" }}
                    onClick={()=>dispatch({type:'set',payload:{selectedInvoice:x.invoice_id,tabState:"5"}})}
                >{x.invoice_id}</Tag>
            }
        </td>
        <td style={{ padding: 3, minWidth: 100 }}> {/* charge selection */}
            <Select className='table-dropdown' showSearch value={x.charge} style={{ paddingLeft: 0 }}
            disabled={permissionAssign(permissions, x)}
            onChange={(e) => {
                let tempChargeList = [...chargeList];
                state.fields.chargeList.forEach(async (y, i) => {
                if (y.code == e) {
                    tempChargeList[index] = {
                        ...tempChargeList[index],
                        charge: e,
                        particular: y.name,
                        basis: y.calculationType,
                        taxPerc: y.taxApply == "Yes" ? parseFloat(y.taxPerc) : 0.00,
                        qty:(y.calculationType!="Per Unit"||allValues.cwtClient=="")?1:allValues.cwtClient
                    }
                    let partyType = "";
                    let choiceArr = ['', 'defaultRecivableParty', 'defaultPaybleParty'];// 0=null, 1=recivable, 2=payble
                    partyType = y[choiceArr[parseInt(state.chargesTab)]];
                    let searchPartyId;
                    switch (partyType) {
                        case "Client":
                        searchPartyId = state.selectedRecord.ClientId;
                        break;
                        case "Local-Agent":
                        searchPartyId = state.selectedRecord.localVendorId;
                        break;
                        case "Custom-Agent":
                        searchPartyId = state.selectedRecord.customAgentId;
                        break;
                        case "Transport-Agent":
                        searchPartyId = state.selectedRecord.transporterId;
                        break;
                        case "Forwarding-Agent":
                        searchPartyId = state.selectedRecord.forwarderId;
                        break;
                        case "Overseas-Agent":
                        searchPartyId = state.selectedRecord.overseasAgentId;
                        break;
                        case "Shipping-Line":
                        searchPartyId = state.selectedRecord.shippingLineId;
                        break;
                        default:
                        searchPartyId = state.selectedRecord.localVendorId;
                        break;
                    }
                    let partyData = partyType == "Client" ? await getClients(searchPartyId) : await getVendors(searchPartyId);
                    if (state.chargesTab == '1') {
                        tempChargeList[index].invoiceType = partyData[0].types.includes("Overseas Agent") ? "Agent Bill" : "Job Invoice";
                    } else {
                        tempChargeList[index].invoiceType = partyData[0].types.includes("Overseas Agent") ? "Agent Invoice" : "Job Bill";
                    }
                    tempChargeList[index].name = partyData[0].name;
                    tempChargeList[index].partyId = partyData[0].id;
                    tempChargeList[index].partyType = partyType == "Client" ? "client" : "vendor";
                    reset({ chargeList: tempChargeList })
                }
            })}}
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={state.fields.chargeList}
            />
        </td>
        <td className='text-center'>{/* Party Selection */}
                {!x.invoice_id && <RightCircleOutlined style={{ position: 'relative', bottom: 3 }}
                    onClick={() => {
                        dispatch({ type: 'set', payload: { headIndex: index, headVisible: true } }); //<--Identifies the Head with there Index sent to modal
                    }}
                />
                }
                {x.name != "" ? <span className='m-2 '><Tag color="geekblue" style={{ fontSize: 15 }}>{x.name}</Tag></span> : ""}
        </td>
        <td>{x.basis=="Per Shipment"?'P/Shp':'P/Unit'} {/* Basis */}
        </td>
        <td style={{ padding: 3, minWidth: 50 }}> {/* PP?CC */}
            <SelectComp register={register} name={`chargeList.${index}.pp_cc`} control={control} width={60} font={13} 
                disabled={permissionAssign(permissions, x)}
                options={[
                    { id: 'PP', name: 'PP' },
                    { id: 'CC', name: 'CC' }
                ]}
            />
        </td>
        {(operationType=="SE"||operationType=="SI") &&<td style={{ padding: 3 }}> {/* Size/Type */}
            <SelectSearchComp register={register} name={`chargeList.${index}.size_type`} control={control} width={100} font={13} 
            disabled={permissionAssign(permissions, x)}
                options={[
                    { id: '40HC', name: '40HC' },
                    { id: '20HC', name: '20HC' }
                ]}
            />
        </td>}
        {(operationType=="SE"||operationType=="SI") &&
        <td style={{ padding: 3 }}> {/* DG */}
            <SelectSearchComp register={register} name={`chargeList.${index}.dg_type`} control={control} width={95} font={13} disabled={permissions.admin?false:x.InvoiceId!=null?true:false}
                options={[
                    { id: 'DG', name: 'DG' },
                    { id: 'non-DG', name: 'non-DG' }
                ]}
            />
        </td>}
        <td style={{ padding: 3 }}>{/* QTY */}
            <InputNumComp register={register} name={`chargeList.${index}.qty`} control={control} width={30} font={13} 
            disabled={permissionAssign(permissions, x)}/>
        </td> 
        {(operationType=="AI"||operationType=="AE") &&<td style={{ padding: 3 }}>{/* rate_charge */}
            <InputNumComp register={register} name={`chargeList.${index}.rate_charge`} control={control} width={30} font={13} 
            disabled={permissionAssign(permissions, x)}/>
        </td> }
        <td style={{ padding: 3 }} > {/* Currency */}
            <SelectSearchComp register={register} name={`chargeList.${index}.currency`} control={control} width={100} font={13} 
            disabled={permissionAssign(permissions, x)}
                options={[
                    { id: 'PKR', name: 'PKR' },
                    { id: 'USD', name: 'USD' },
                    { id: 'EUR', name: 'EUR' },
                    { id: 'GBP', name: 'GBP' },
                    { id: 'AED', name: 'AED' }
                ]}
            />
        </td>
        <td style={{ padding: 3 }}> {/* Amount */}
            <InputNumComp register={register} name={`chargeList.${index}.amount`} control={control} label='' width={20} 
            disabled={(operationType=="AI"||operationType=="AE")?true:permissionAssign(permissions, x)} />
        </td>
        <td style={{ padding: 3 }}>  {/* Discount */}
            <InputNumComp register={register} name={`chargeList.${index}.discount`} control={control} width={30} font={13} 
            disabled={permissionAssign(permissions, x)} />
        </td>
        <td style={{ textAlign: 'center' }}> {/* Tax Apply */}
            <input type="checkbox" {...register(`chargeList.${index}.tax_apply`)} style={{ cursor: 'pointer' }} 
            disabled={permissionAssign(permissions, x)} />
        </td>
        <td>{x.tax_amount}</td> {/* Tax Amount */}
        <td>{x.net_amount}</td>
        <td style={{ padding: 3 }}> {/* Ex. Rate */}
            {chargeList[index]?.currency!="PKR" && <InputNumComp register={register} name={`chargeList.${index}.ex_rate`}  control={control} label='' width={10} 
                disabled={permissionAssign(permissions, x)} 
            />}
            {chargeList[index]?.currency=="PKR" && 
            <InputNumber value={1.00}
            />}
        </td>
        <td>{x.local_amount}</td>
        <td>{x.particular}</td>
        <td>Un-Approved</td><td></td><td></td>
        </tr>
        }
        </>
    )})}
    </tbody>}
    </Table>
    }
    {state.chargeLoad && 
    <div style={{textAlign:"center", paddingTop:'5%', paddingBottom:"5%"}}>
        <Spinner/>
    </div>
    }
    <Modal
        open={state.headVisible}
        onOk={()=>dispatch({type:'toggle', fieldName:'headVisible', payload:false})} 
        onCancel={()=>dispatch({type:'toggle', fieldName:'headVisible', payload:false})}
        width={1000} footer={false} maskClosable={false}
    >{state.headVisible && <PartySearch state={state} dispatch={dispatch} reset={reset} useWatch={useWatch} control={control} />}
    </Modal>
    </div>
    <div className='div-btn-custom-green text-center py-1 px-3 mt-3' style={{float:'right'}} onClick={()=>{calculate(chargeList)}}>Calculate</div>
</>
  )
}
export default React.memo(ChargesList)