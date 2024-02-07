import React, { useEffect, useReducer, useRef } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import Router from 'next/router';
import { InputNumber, Input, Select, Checkbox, Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import cookies from 'js-cookie';
import openNotification from '/Components/Shared/Notification';
import PrintVoucher from './PrintVoucher';
import FullScreenLoader from '/Components/Shared/FullScreenLoader';
import { delay } from "/functions/delay"

function recordsReducer(state, action){
    switch (action.type) {
      case 'set': return {...state, ...action.payload} 
      default: return state 
    }
};

const initialState = {
  VoucherId:"",
  approved:false,
  visible:false,
  accountLoad:false,
  reverse:false,
  paid:"0",
  reverseAmount:0,
  settlementList:[],
  settlementAccount:'',
  secondaryAccount:'',
  secondaryList:[],
  load:false,
  EmployeeId:"",
  requestedBy:"",
  id:"",
  onAcOf:"",
  amount:"",
  descriptive:true,
  list:[{item:"", amount:0}]
};

const OfficeVoucher = ({voucherData, id, employeeData}) => {

  const formData = useRef();
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const companyId = useSelector((state) => state.company.value);
  const set = (value) => dispatch({ type:"set",payload:value });

  useEffect(() => {
    if(voucherData){
      let tempState = {...voucherData};
      if(tempState.descriptive){
        tempState.list = JSON.parse(tempState.onAcOf)
      }
      set(tempState);
    }
  }, [])

  const handleSubmit = async(e) => {
    set({load:true})
    const preparedBy = await cookies.get("username")
    e.preventDefault();
    let tempData = {...state};
    id=="new"? delete tempData.id:null;
    id=="new"? delete tempData.VoucherId:null;
    if(tempData.descriptive){
      tempData.onAcOf = JSON.stringify(tempData.list);
    }
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_UPSERT_OFFICE_VOUCHER, {
      ...tempData,
      EmployeeId:tempData.EmployeeId, amount:state.descriptive?calculateTotal():tempData.amount, preparedBy:preparedBy, CompanyId:companyId
    }).then((x)=>{
      if(x.data.status=="success"){
        openNotification("Success", `Voucher ${id=="new"?"Created":"Updated"} Successfully!`, "green")
        Router.push(`/accounts/officeVouchers/${x.data.result[0].id}`);
      }else{
        openNotification("Error", `Something Went Wrong, Try Again`, "red")
      }
    })
  }

  const calculateTotal = () => {
    let tempState = state.list;
    let tempAmount = 0.0;
    tempState.forEach((x)=>{
      tempAmount = tempAmount + x.amount
    })
    return tempAmount
  }

  const getAccounts = async() => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_FOR_TRANSACTION,{
      headers:{'type':'Cash', 'companyid':companyId}
    }).then(async(x)=>{
      await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_FOR_TRANSACTION,{
        headers:{'type':'officevouchers', 'companyid':companyId}
      }).then((y)=>{
        set({
          settlementList:x.data.result.map((i)=> { return{ value:i.id, label:i.title } }),
          secondaryList:y.data.result.map((i)=> { return{ value:i.id, label:i.title } })
        })
      })
    })
    set({accountLoad:false})
  }

  const handleApprove = async(e) => {
    set({load:true})
    e.preventDefault();
      if(state.settlementAccount=="" || state.secondaryAccount==""){
        openNotification("Warning", "Please Select Accounts", "orange")
      }else{
        let voucher = {
          CompanyId:companyId,
          costCenter:"KHI",
          type:"Payble",
          vType:"CPV",
          currency:"PKR",
          exRate:"1.00",
          payTo:employeeData.filter((x)=> {return x.value==state.EmployeeId})[0].label,
          Voucher_Heads:[
            {
              defaultAmount:"-",
              amount:state.amount,
              type:"credit",
              narration:"Office Vouchers",
              settlement:"1",
              ChildAccountId:state.settlementAccount
            },
            {
              defaultAmount:"-",
              amount:state.amount,
              type:"debit",
              narration:"Office Vouchers",
              settlement:"",
              ChildAccountId:state.secondaryAccount
            }
          ]
        }
        await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER,voucher)
        .then(async(x)=>{
          if(x.data.status=="success"){
            let obj = {approved:state.approved==false?true:false, id:state.id, VoucherId:x.data.result.id};
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_APPROVE_OFFICE_VOUCHER,obj)
            .then((y)=>{
              if(y.data.status=="success"){
                openNotification("Success", `Voucher ${id=="new"?"Approved":"Updated"} Successfully!`, "green")
                Router.push(`/accounts/officeVouchers/${id}`);
              }else{
                openNotification("Error", `Something went wrong! Try again with accurate data fields`, "red")
              }
            })
          }
        })
      }
  }

  const ModalBody = () => {

    return(
      <>
      <form onSubmit={handleApprove}>
        {state.accountLoad && <div className='text-center'><Spinner /></div>}
        {!state.accountLoad && 
        <>
        <div>Credit Account</div>
        <Select value={state.settlementAccount} onChange={(e)=>set({settlementAccount:e})} style={{ width: "100%"}} 
          options={state.settlementList?state.settlementList:[]}
          showSearch
          filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
          filterSort={(a, b) => (a?.label ?? '').toLowerCase().localeCompare((b?.label ?? '').toLowerCase())}
          required
        />
        <div className='mt-4'>Debit Account</div>
        <Select value={state.secondaryAccount} onChange={(e)=>set({secondaryAccount:e})} style={{ width: "100%"}} 
          options={state.secondaryList?state.secondaryList:[]}
          showSearch
          filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
          filterSort={(a, b) => (a?.label ?? '').toLowerCase().localeCompare((b?.label ?? '').toLowerCase())}
          required
        />
        <div className='mt-2'>Total Balance: <span style={{color:'green'}}> {state.amount} PKR</span></div>
        <hr className='mb-0' />
        <button type='submit' className='btn-custom mt-3'>Approve</button>
        </>}
      </form>
      <div>
        {state.load && <FullScreenLoader />}
      </div>
      </>
    )
  }

  const ReverseBody = () => {

    const recordReverse = async(e) => {
      e.preventDefault();
      set({load:true})
      const { recievingAmount } = formData.current;
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_RECORD_REVERSE,{
        reverseAmount:parseFloat(state.reverseAmount) + parseFloat(recievingAmount.value),
        VoucherId:state.VoucherId,
        id:id,
        paid:(parseFloat(state.reverseAmount) + parseFloat(recievingAmount.value) == parseFloat(state.amount))?'1':'2'
      }).then(async(x)=>{
        let tempVoucher = {...x.data.result};
        if(x.data.status=="success"){
          tempVoucher.type="Receivable";
          tempVoucher.payTo="Company";
          tempVoucher.vType="CRV";
          delete tempVoucher.id;
          delete tempVoucher.voucher_Id;
          delete tempVoucher.voucher_No;
          let tempType = tempVoucher.Voucher_Heads[0].type;
          //tempVoucher.Voucher_Heads[0].type = tempVoucher.Voucher_Heads[1].type;
          tempVoucher.Voucher_Heads[0] = {...tempVoucher.Voucher_Heads[0], type:tempVoucher.Voucher_Heads[1].type, amount:recievingAmount.value}
          tempVoucher.Voucher_Heads[1] = {...tempVoucher.Voucher_Heads[1], type:tempType, amount:recievingAmount.value};

          delete tempVoucher.Voucher_Heads[0].id
          delete tempVoucher.Voucher_Heads[1].id
          await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER,tempVoucher)
          .then((z)=>{
            console.log(z.data)
            if(z.data.status=="success"){
              openNotification("Success", `Voucher updated Successfully!`, "green")
              Router.push(`/accounts/officeVouchers/${id}`);
            }
          })
        }
      })
    }

    return(
      <form ref={formData}>
        <div>Amount</div>
        <InputNumber type='number' name='recievingAmount' max={parseFloat(state.amount) - state.reverseAmount} />
        <div className='mt-2'>Total Amount: <span style={{color:'green'}}>{state.amount} PKR</span></div>
        <div className='mt-2'>Remaining Balance: <span style={{color:'green'}}>{parseFloat(state.amount) - state.reverseAmount} PKR</span></div>
        <hr className='mb-0' />
      <button type="submit" onClick={recordReverse} className='btn-custom mt-3'>Approve</button>
      <div>
        {state.load && <FullScreenLoader />}
      </div>
      </form>
    )
  }
  
  const DissaproveBody = () => {
    return(
      <>
      <div>
        <h4>Disapprove Voucher?</h4>
        <hr/>
        <div className='pb-4'>
        <div style={{float:'right'}}>
        <button className='btn-custom mx-3' type='button'
          onClick={async()=>{
            set({load:true})
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_DELETE_VOUCHER,{
              id:state.VoucherId, type:"VoucherId Exists"
            }).then(async(x)=>{
              if(x.data.status=="success"){
                let obj = {approved:state.approved==false?true:false, id:state.id};
                await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_APPROVE_OFFICE_VOUCHER,obj)
                .then((y)=>{
                  if(y.data.status=="success"){
                    openNotification("Success", `Voucher Status changed Successfully!`, "green")
                    Router.push(`/accounts/officeVouchers/${id}`);
                  }else{
                    openNotification("Error", `Something Went Wrong please try again`, "red")
                  }
                })
              }
            })
          }}
        >Yes</button>
        <button className='btn-orange' onClick={()=>set({visible:false})}>Cancel</button>
        </div>
        </div>
      </div>
      <div>
        {state.load && <FullScreenLoader />}
      </div>
      </>
    )
  }

  return (
    <div className='base-page-layout'>
      <form onSubmit={handleSubmit}>
      <Row>
        <Col md={3}>
          <div>Paid To</div>
          <Select value={state.EmployeeId} onChange={(e)=>set({EmployeeId:e})} style={{ width: "100%"}} options={employeeData?employeeData:[]}
            showSearch 
            filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
            filterSort={(a, b) => (a?.label ?? '').toLowerCase().localeCompare((b?.label ?? '').toLowerCase())}
          />
        </Col>
        <Col md={3}>
          <div>Requested By</div>
          <Input value={state.requestedBy} onChange={(e)=>set({requestedBy:e.target.value})} />
        </Col>
        <Col md={2}>
          <div>Descriptive</div>
          <Checkbox defaultChecked checked={state.descriptive} onChange={()=>set({descriptive:!state.descriptive})} />
        </Col>
        <Col md={3} style={{border:'1px solid silver'}} className='px-3 py-2'>
          <div>Approve Voucher</div>
          <Checkbox defaultChecked className='mt-2' checked={state.approved}  disabled={id=="new"?true:false} 
            onChange={()=>{
              if(state.approved){
                set({visible:true});
              }else{
                set({visible:true, accountLoad:true});
                getAccounts();
              }
            }}
          />
          {state.approved && <button type='button' className='btn-custom mx-3'
            onClick={()=>set({reverse:true})}
          >Mark Return</button>}
        </Col>
        <Col md={8} className='mt-3'>
          {state.descriptive &&
          <>
          <div style={{display:'inline-block'}} className=''>Items</div>
          <div style={{display:'inline-block'}} className='mx-4 my-2'>
            <span className='btn-custom' onClick={()=>set({list:[...state.list, {item:"", amount:0}]})}>Add</span>
          </div>
          <hr className='mt-0 pt-0' />
          {state.list.map((x, i)=>{
          return(
            <Row key={i} className='mt-2'>
              <Col md={9} className=''>
              <Input value={x.item} placeholder={`Item #${i+1}`}
                onChange={(e)=>{
                  let tempArray = [...state.list];
                  tempArray[i].item = e.target.value
                  set({list:tempArray})
                }} required={state.descriptive?true:false}
              />
              </Col>
              <Col md={2} className='px-0'>
              <InputNumber value={x.amount} placeholder='Price'
                min={0.1}
                onChange={(e)=>{
                  let tempArray = [...state.list];
                  tempArray[i].amount = e;
                  set({list:tempArray})
                }} required={state.descriptive?true:false}
              />
              </Col>
              <Col md={1} className='px-0 py-1'>
                <CloseCircleOutlined className='close-btn' 
                  onClick={()=>{
                    let tempState = [...state.list];
                    if(state.list.length>1){
                      tempState.splice(i,1);
                    }
                    set({list:tempState});
                  }}
                />
              </Col>
            </Row>
          )})}
          <div className='mt-3'>Total Amount:</div><InputNumber value={state.amount} disabled />
          <div className='mt-3'>
            <div>Returned</div>
            <div style={{border:'1px solid silver', paddingTop:6, paddingBottom:3, paddingLeft:10, maxWidth:90}}>{state.reverseAmount}</div>
          </div>
          </>
          }
          {!state.descriptive &&
          <>
            <div>Description</div>
            <Input.TextArea value={state.onAcOf} onChange={(e)=>set({onAcOf:e.target.value})} placeholder='Enter Description' 
              required={!state.descriptive?true:false}
            />
            <Row>
              <Col md={2}>
                <div className='mt-3'>
                  <div>Total Amount</div>
                  <InputNumber value={state.amount} placeholder='Amount' required={!state.descriptive?true:false}
                    min={0.1}
                    onChange={(e)=>set({amount:e})}
                  />
                </div>
                <div className='mt-3'>
                  <div>Returned</div>
                  <div style={{border:'1px solid silver', paddingTop:6, paddingBottom:3, paddingLeft:10}}>{state.reverseAmount}</div>
                </div>
              </Col>
              <Col md={3}>
              </Col>
            </Row>
          </>
          }
        </Col>
      </Row>
      <div className='mt-4 d-flex' style={{display:'inline-block'}}>
        <button type='button' className='btn-orange' disabled={!state.descriptive?true:false}
          onClick={()=> set({amount:calculateTotal()})}
        >Calculate</button>
        <button type='submit' className={state.approved?'btn-custom-disabled mx-4':'btn-custom mx-4'} 
          disabled={state.load?true:state.approved?true:false}
        >Submit</button>
        {state.approved &&  <PrintVoucher state={state}  companyId={companyId}/>}
      </div>
      </form>
      <Modal title={!state.approved?"Account Selection":"Disapprove" } open={state.visible} onCancel={()=>set({visible:false})} footer={false}>
        {!state.approved && <ModalBody/>}
        {state.approved && <DissaproveBody/>}
      </Modal>
      <Modal title={"Record Amount"} open={state.reverse} onCancel={()=>set({reverse:false})} footer={false}>
        {state.reverse && <ReverseBody/>}
      </Modal>
      <div>
        {state.load && <FullScreenLoader />}
      </div>
    </div>
  )
}
export default OfficeVoucher