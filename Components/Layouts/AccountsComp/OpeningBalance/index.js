import { Row, Col, Table, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import { Select, InputNumber, Input } from 'antd';
import Router from "next/router";
import axios from 'axios';
import { CloseCircleOutlined } from "@ant-design/icons";
import openNotification from "/Components/Shared/Notification";

const OpeningBalance = ({id, voucherData}) => {

  const [ voucher_Id, setVoucher_Id ] = useState("");
  const [ load, setLoad ] = useState(false);
  const [ exRate, setExRate ] = useState("1");
  const [ accounts, setAccounts ] = useState([]);
  const [ currency, setCurrency ] = useState("PKR");
  const [ companyId, setCompanyId ] = useState("");
  const [ voucherAccounts, setVoucherAccounts ] = useState([]);

  const [ deleteList, setDeleteList ] = useState([]);

  useEffect(() => {
    if(id!="new"){
      setExRate(voucherData.exRate)
      setCurrency(voucherData.currency)
      setVoucher_Id(voucherData.voucher_Id)
      setCompanyId(parseInt(voucherData.CompanyId))
      setVoucherAccounts(voucherData.Voucher_Heads)
    }
  }, [])

  useEffect(() => {
    if(companyId!="") {
      setLoad(true);
      axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS,{
        headers:{ companyid: companyId }
      }).then((x) => {
        setAccounts(x.data.result);
        setLoad(false);
      })
    }
  }, [companyId]);

  const setVouchers = (e, i, name, condition)=> {
    let tempState = [...voucherAccounts];
    tempState[i][name] = e;
    condition?tempState[i].amount = (parseFloat(e) * parseFloat(exRate)).toFixed(2):null;
    setVoucherAccounts(tempState);
  }

  const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const submitData = async() => {
    setLoad(true)
    if(id=="new"){
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_OPENING_BALANCE, {
        exRate, currency, companyId, vType:"OP", costCenter:"KHI", 
        type:"Opeing Balance", Voucher_Heads:voucherAccounts
      }).then((x) => {
        if(x.data.status=="success"){
          Router.push(`/accounts/openingBalance/${x.data.result.id}`)
        }
      })
    }else{
      axios.post(process.env.NEXT_PUBLIC_CLIMAX_UPDATE_VOUCEHR, {        
        id:voucherData,id, exRate, currency,
        companyId, vType:"OP", costCenter:"KHI", 
        type:"Opeing Balance", Voucher_Heads:voucherAccounts
      }).then((x)=>{
        if(x.data.status=="success"){
          openNotification("Success", `Opening Balance Updated Successfully!`, "green")
        }else{
          openNotification("Error", `Some Error Occured`, "red")
        }
        setLoad(false)
      })
    }
  }

  const removeList = (id) => {
    let tempList = [...voucherAccounts];
    tempList = tempList.filter((x)=>{
      return x.id!==id;
    })
    setVoucherAccounts(tempList);
  }

  return (
  <div className='base-page-layout fs-12' >
    <h5>{id=="new"?"Create An Opening":""}</h5>
    <Row>
      <Col md={2}>
        <div>Document #</div>
        <div style={{border:'1px solid silver', padding:3, paddingLeft:10, height:30, paddingTop:5}}>{voucher_Id}</div>
      </Col>
      <Col md={12}>
        <Row>
          <Col md={5}>
            <div className='mt-2'>Company</div>
            <Select style={{width:"100%"}} value={companyId} disabled={id!="new"}
              options={[
                { value:1, label:'SEA NET LOGISTICS'  },
                { value:2, label:'CARGO LINKERS'      },
                { value:3, label:'AIR CARGO SERVICES' },
              ]}
              onChange={(e)=>{
                setCompanyId(e);
                if(voucherAccounts.length>0){
                  let tempState = [...voucherAccounts];
                  tempState.forEach((x)=>{
                    x.ChildAccountId = ""
                  })
                  setVoucherAccounts(tempState);
                }
            }}/>
          </Col>
        </Row>
      </Col>
      <Col md={12}>
        <Row>
          <Col md={2}>
            <div className='mt-2'>Currency</div>
            <Select style={{width:"100%"}} value={currency} 
              onChange={(e)=>{
                setCurrency(e);
                setExRate('1')
              }}
              options={[
                { value:"PKR", label:"PKR"},
                { value:"USD", label:"USD"},
                { value:"GBP", label:"GBP"},
              ]}
            />
          </Col>
          <Col md={2}>
            <div className='mt-2'>Ex. Rate</div>
            <InputNumber style={{width:"100%"}} value={exRate} 
              min='0.0' disabled={currency=="PKR"}
              onChange={(e)=>{
                setExRate(e);
                if(voucherAccounts.length>0){
                  let tempState = [...voucherAccounts];
                  tempState.forEach((x)=>{
                    x.amount = parseFloat(x.defaultAmount) * parseFloat(e)
                  })
                  setVoucherAccounts(tempState);
                }
              }}
            />
          </Col>
        </Row>
      </Col>
      <Col md={12}>
      <hr/>
      <button className='btn-custom mb-3' onClick={() => {
          let tempAccounts = [...voucherAccounts];
          tempAccounts.push({ defaultAmount:1, amount:0.00, type:"", narration:"", ChildAccountId:"" });
          setVoucherAccounts(tempAccounts);
        }}>Add</button>
      <div>
      <Table bordered>
        <thead>
          <tr>
            <th style={{minWidth:300}}>Account</th>
            <th style={{width:100}}>Type</th>
            {currency!="PKR"&&<th style={{width:100}}>{currency}</th>}
            <th style={{width:140}}>Amount</th>
            <th>Narration</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {voucherAccounts.map((x, i)=>{
            return(
            <tr key={i}>
              <td className='p-1'>
                {!load &&<Select style={{width:'100%'}} defaultValue={""} value={x.ChildAccountId} 
                  onChange={(e)=>setVouchers(e,i,'ChildAccountId')}
                  showSearch
                  filterOption={filterOption}
                  options={ accounts.map((y) => {
                    return { label:y.title, value:y.id }
                  })}
                />}
                {load && <div className='text-center pt-2'><Spinner size='sm' /></div> }
              </td>
              <td className='p-1'>
                <Select style={{width:"100%"}} value={x.type} 
                  onChange={(e)=>setVouchers(e,i,'type')}
                  options={[
                    { value:"debit", label:'Debit' },
                    { value:"credit", label:'Credit' },
                  ]}
                />
              </td>
              {currency!="PKR" &&<td className='p-1'>
                <InputNumber style={{width:"100%"}} value={x.defaultAmount} onChange={(e)=>setVouchers(e,i,'defaultAmount',true)} min={"0.0"} />
              </td>}
              <td className='p-1'>
                <InputNumber style={{width:"100%"}} value={x.amount} onChange={(e)=>setVouchers(e,i,'amount')} min={"0.0"} disabled={currency!="PKR"} />
              </td>
              <td className='p-1'>
                <Input style={{width:"100%"}} value={x.narration} onChange={(e)=>setVouchers(e.target.value,i,'narration')} />
              </td>
              <td className='text-center'>
                <CloseCircleOutlined className="fs-15 cross-icon" onClick={()=>removeList(x.id)} />
              </td>
            </tr>
          )})}
        </tbody>
      </Table>
      </div>
      <button className='btn-custom' onClick={submitData} disabled={load}>{!load?"Save":<Spinner size="sm" className="mx-2" />}</button>
      </Col>
    </Row>
  </div>
)}

export default OpeningBalance;