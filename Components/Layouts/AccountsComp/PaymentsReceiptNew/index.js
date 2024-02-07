import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Input, List, Radio, Modal, Select } from 'antd';
import { recordsReducer, initialState } from './states';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import { Row, Col, Table } from 'react-bootstrap';
import Router, { useRouter } from 'next/router';
import AgentBillComp from './AgentBillComp';
import moment from 'moment';
import axios from 'axios';
import React, { useState, useRef, useEffect, useMemo, useCallback, useReducer} from 'react';
import { AgGridReact } from 'ag-grid-react';

const PaymentsReceiptNew = ({id, voucherData}) => {

    const dispatchNew = useDispatch();
    const [ state, dispatch ] = useReducer(recordsReducer, initialState);
    const setAll = (x) => dispatch({type:'setAll', payload:x})
    const router = useRouter()
    const companyId = useSelector((state) => state.company.value);

    useEffect(() => {
        if(router?.query?.id=='undefined') {
            Router.push({pathname:"/accounts/paymentReceipt/new"}, undefined,{shallow:true});
            dispatchNew(incrementTab({
                "label": "Payment / Receipt",
                "key": "3-4",
                "id":"new"
            }))
        } else if (router.query.name!='undefined' && router.query.partyid!='undefined' && router.query.partyid){
            setAll({ 
                selectedParty:{id:router.query.partyid, name:router.query.name}, 
                partytype:router.query.type,
                payType:router.query.paytype,
                invoiceCurrency:router.query.currency,
                tranVisible:true
            })
        }else if(router?.query?.id!='undefined'&&router?.query?.id!='new') {
            let payAcc = {}, partyAcc = {}, taxAc = {acc:{}, amount:0}, bankAc = {acc:{}, amount:0}, gainLoss = {acc:{}, amount:0}
            voucherData?.Voucher_Heads.forEach((x)=>{
                if(x.accountType=='payAccount'){
                    payAcc = x.Child_Account
                }
                if(x.accountType=="partyAccount"){
                    partyAcc = x.Child_Account
                }
                if(x.accountType=="Tax"){
                    taxAc.acc = x.Child_Account
                    taxAc.amount = x.amount
                }
                if(x.accountType=="BankCharges"){
                    bankAc.acc = x.Child_Account
                    bankAc.amount = x.amount
                }
                if(x.accountType=="gainLoss"){
                    gainLoss.acc = x.Child_Account
                }
            });
            setAll({
                voucherHeads:voucherData.Voucher_Heads,
                id:id,
                createdAt:voucherData.createdAt,
                edit:true,
                oldInvoices:voucherData.invoices,
                selectedParty:{id:voucherData.partyId, name:voucherData.partyName}, 
                partytype:voucherData.partyType,
                payType:voucherData.vType=="BRV"?
                    "Recievable":
                    voucherData.vType=="CRV"?"Recievable":"Payble",
                invoiceCurrency:voucherData.currency,
                tranVisible:true,
                transaction:
                    (voucherData.vType=="BRV"||voucherData.vType=="BPV")?"Bank":
                    (voucherData.vType=="CRV"||voucherData.vType=="CPV")?"Cash":"Adjust",
                date:moment(voucherData.tranDate),
                checkNo:voucherData.chequeNo,
                payAccountRecord:payAcc,
                partyAccountRecord:partyAcc,
                bankChargesAccountRecord:bankAc.acc,
                bankCharges:bankAc.amount,
                taxAccountRecord:taxAc.acc,
                taxAmount:taxAc.amount,
                gainLossAccountRecord:gainLoss.acc,
                onAccount:voucherData.onAccount,
                drawnAt:voucherData.drawnAt,
                manualExRate:voucherData.exRate,
                subType:voucherData.subType
            })
        }
    }, [router]);

    useEffect(() => { searchParties() }, [state.search]);

    const searchParties = async() => {
        if(state.search.length>2){
        await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_BY_SEARCH, 
            { search:state.search, type:state.partytype }
        ).then((x)=> {
            if(x.data.status=="success"){
                setAll({partyOptions:x.data.result})
            } else {
                setAll({partyOptions:[]})
            }
        })
        }
    }

    const ListComp = ({data}) => {
    return(
    <List size="small" bordered dataSource={data}
        renderItem={(item)=>
        <List.Item key={item.id} className='searched-item' onClick={() => {
            Router.push({
                pathname:"/accounts/paymentReceipt/new", 
                query:{
                    name:item.name, partyid:item.id, type:state.partytype,
                    paytype:state.payType, currency:state.invoiceCurrency
                }
            }, undefined,{shallow:true});
            dispatchNew(incrementTab({
                "label": "Payment / Receipt",
                "key": "3-4",
                "id":`new?name=${item.name}&partyid=${item.id}&type=${state.partytype}&paytype=${state.payType}&currency=${state.invoiceCurrency}`
            }))
            setAll({selectedParty:{id:item.id, name:item.name}, tranVisible:true, search:""});
        }}>{item.name}</List.Item>} 
    />)}

    const gridRef = useRef(); 
    const [columnDefs, setColumnDefs] = useState([
        {headerName: '#', field:'no', width: 50 },
        {headerName: 'Voucher No.', field:'voucher_Id', filter: true},
        {headerName: 'Name', field:'partyName', filter: true},
        {headerName: 'Party', field:'partyType', filter: true},
        {headerName: 'Type', field:'vType', width:124, filter: true},
        {headerName: 'Date', field:'tranDate', filter: true},
    ]);
    const defaultColDef = useMemo( ()=> ({
        sortable: true
    }));

    const cellClickedListener = useCallback((e)=> {
        dispatchNew(incrementTab({"label": "Payment / Receipt","key": "3-4","id":e.data.id}))
        Router.push(`/accounts/paymentReceipt/${e.data.id}`)
    }, []);

    const getRowHeight = useCallback(() => {
        return 38;
    }, []);

  return (
    <div className='base-page-layout'>
    <Row>
        <Col md={4}>
            <b>Type: </b>
            <Radio.Group className='mt-1' size='small' value={state.partytype}
                onChange={(e) => {
                let value="", TempInvoiceCurrency = "";
                if(e.target.value=="vendor"){
                    value="Payble"
                    TempInvoiceCurrency="PKR"
                } else if(e.target.value=="client"){
                    value="Recievable";
                    TempInvoiceCurrency="PKR"
                } else if(e.target.value=="agent"){
                    value="Payble";
                    TempInvoiceCurrency="USD"
                }
                setAll({
                    selectedParty:{id:"", name:""}, partytype:e.target.value, 
                    search:"", payType:value, invoiceCurrency:TempInvoiceCurrency
                })
            }}>
                <Radio value={"client"}>Client</Radio>
                <Radio value={"vendor"}>Vendor</Radio>
                <Radio value={"agent"} >Agent </Radio>
            </Radio.Group>
        </Col>
        <Col md={4}>
                <b>Pay Type: </b>
                <Radio.Group className='mt-1' value={state.payType} onChange={(e)=> setAll({search:"", payType:e.target.value})} >
                    <Radio value={"Payble"}>Payble</Radio>
                    <Radio value={"Recievable"}>Receivable</Radio>
                </Radio.Group>
        </Col>
        <Col className='text-end'>
            <button className='btn-custom' style={{fontSize:11}}
                onClick={()=>{
                    axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_OLD_PAY_REC_VOUCHERS)
                    .then((x)=>{
                        let tempData = []
                        x.data.result.forEach((y, i)=>{
                            tempData.push({...y, no:i+1})
                        })
                        setAll({oldVouchers:true, oldVouchersList:tempData});
                    })
                }}
            >Show Old</button>
        </Col>
        <Col md={6} className='mt-3'>
            <Input placeholder="Search" size='small'
                suffix={state.search.length>2?<CloseCircleOutlined onClick={()=>setAll({search:""})} />:<SearchOutlined/>} 
                value={state.search} onChange={(e)=>setAll({search:e.target.value})}
            />
            {state.search.length>2 &&
                <div style={{position:"absolute", zIndex:10}}>
                    <ListComp data={state.partyOptions} />
                </div>
            }
        </Col>
        <Col md={1} className='mt-3'>
            <Select disabled={state.partytype!="agent"?true:false} value={state.invoiceCurrency} size='small'
                onChange={(e)=> setAll({invoiceCurrency:e})}
                options={[
                    { value:'PKR', label:'PKR' },
                    { value:'USD', label:'USD' },
                    { value:'GBP', label:'GBP' },
                    { value:'EUR', label:'EUR' },
                    { value:'Multi', label:'Multi' },
                ]}
            />
        </Col>
        <Col md={4} className='mt-3'style={{border:'1px solid silver'}}>{state.selectedParty.name}</Col>
        <Col md={12}><hr className='p-0 my-3' /></Col>
    </Row>
    {state.tranVisible && <AgentBillComp companyId={companyId} state={state} dispatch={dispatch} />}
    <Modal open={state.oldVouchers} width={'80%'}
        onOk={()=>{setAll({oldVouchers:false})}} 
        onCancel={()=>{ setAll({oldVouchers:false}) }}
        footer={false} maskClosable={false}
        title={ <>Old Vouchers</>}
    >   
    {state.oldVouchers &&
    <div className="ag-theme-alpine" style={{width:"100%", height:'72vh'}}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={state.oldVouchersList} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection='multiple' // Options - allows click selection of rows
          onCellClicked={cellClickedListener} 
          getRowHeight={getRowHeight}
        />
    </div>
    }
    </Modal>
    </div>
  )
}

export default React.memo(PaymentsReceiptNew)