import SelectSearchComp from "/Components/Shared/Form/SelectSearchComp";
import InputNumComp from "/Components/Shared/Form/InputNumComp";
import SelectComp from "/Components/Shared/Form/SelectComp";
import React, { useEffect, useState, useRef } from "react";
import InputComp from "/Components/Shared/Form/InputComp";
import { useFieldArray, useWatch } from "react-hook-form";
import { CloseCircleOutlined } from "@ant-design/icons";
import DateComp from "/Components/Shared/Form/DateComp";
import PopConfirm from '../../../Shared/PopConfirm';
import { AiFillRightCircle } from "react-icons/ai";
import { Spinner, Table } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import ReactToPrint from 'react-to-print';
import VoucherPrint from "./VoucherPrint";
import { InputNumber } from "antd";
import moment from "moment";
import axios from "axios";
import Router from "next/router";
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import VoucherHistory from "./history";
import { MdDeleteOutline } from "react-icons/md";
import { FaPrint } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { CiBoxList } from "react-icons/ci";

const Vouchers = ({ register, control, errors, CompanyId, child, settlement, reset, voucherData, setSettlement, setChild, id }) => {

  let inputRef = useRef(null);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  //toggle state for opening and closing voucher History modal
  const [isOpen,setIsOpen] = useState(false)

  const { fields, append, remove } = useFieldArray({
    name: "Voucher_Heads",
    control,
    rules: {
      required: "Please append at least 1 item",
    },
  });
  const [accountLoad, setAccountLoad] = useState(true);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [closing, setClosing] = useState(0);
  const [first, setFirst] = useState(true);
  const allValues = useWatch({ control });

  const commas = (a) => a == 0 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
  const box = { border: '1px solid silver', paddingLeft: 10, paddingTop: 5, paddingBottom: 3, minHeight: 31 }

  useEffect(() => { getValues(); }, []);

  useEffect(() => {
    (allValues.vType != "" && CompanyId != NaN && allValues.vType) ?
      getAccounts() :
      null;
  }, [allValues.vType]);

  useEffect(() => {
    let totalDebit = 0.00;
    let totalCredit = 0.00;
    allValues?.Voucher_Heads?.forEach((x) => {
      if (x.type == "debit" && x.amount != 0) {
        totalDebit = totalDebit + parseFloat(x.amount);
      } else if (x.type == "credit" && x.amount != 0) {
        totalCredit = totalCredit + parseFloat(x.amount);
      }
    })
    setTotalDebit(totalDebit);
    setTotalCredit(totalCredit);
  }, [allValues.Voucher_Heads]);

  async function getValues() {
    const { chequeNo, payTo, vType, type, exRate, currency } = voucherData;
    let iD = "";
    let settleId = "";
    let ChildAccountId = "";
    let createdAt = voucherData.createdAt ? moment(voucherData.createdAt) : "";
    let chequeDate = voucherData.chequeDate ? moment(voucherData.chequeDate) : "";
    let Voucher_Heads = voucherData.Voucher_Heads?.filter((x) => x.settlement !== "1");
    voucherData?.Voucher_Heads?.filter((x) => {
      if (x.settlement === "1") {
        ChildAccountId = x.ChildAccountId;
        settleId = x.id;
        iD = voucherData.id
      }
    });
    reset({
      CompanyId, vType, chequeDate, chequeNo, payTo, type, createdAt,
      Voucher_Heads, exRate, currency: currency == undefined ? "PKR" : currency,
      ChildAccountId, settleId, id: iD, voucher_Id:voucherData.voucher_Id
    });
    
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS, {
      headers: {
        CompanyId: CompanyId
      }
    }).then((x) => {
      setChild(x.data.result);
    })
  }

  async function handleDelete() {
    PopConfirm("Confirmation", "Are You Sure To Remove This Charge?",
      () => {
        axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_DELETE_BASE_VOUCHER, {
          id
        }).then((x) => {
          Router.push("/accounts/voucherList")
        })
      })
  }

  const getAccounts = async () => {
    let y = "";
    switch (allValues.vType) {
      case "BPV":
      case "BRV":
        y = "Bank";
        break;
      case "CPV":
      case "CRV":
        y = "Cash";
        break;
      case "TV":
        y = "All";
        break;
      default:
        break;
    }
    if (y != "") {
      await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_FOR_TRANSACTION_VOUCHER, {
        headers: { companyid: CompanyId, type: y }
      }).then((x) => {
        setSettlement(x.data.result);
        let tempHeads = allValues.Voucher_Heads || [];
        tempHeads.forEach((x) => {
          x.amount = parseFloat(x.amount).toFixed(2);
          x.type = first?x.type:(allValues.vType == "BRV" || allValues.vType == "CRV") ? "credit" : "debit";
        })
        reset({
          ...allValues, 
          type: allValues.vType === "BPV" || allValues.vType === "CPV" ? "Payable" : "Recievable",
          Voucher_Heads: tempHeads, 
          ChildAccountId: id == "new" ? (first?allValues.ChildAccountId:null) : allValues.ChildAccountId
        });
        first?setFirst(false):null
        // This first actually loades the cached version of the data then after changing 
        // the voucher types voucher heads types changes according to their corresponding types
      })
    } else {
      reset({ ...allValues, ChildAccountId: id == "new" ? null : allValues.ChildAccountId });
    }
    setAccountLoad(false)
  };

  // calculationg closing balance
  useEffect(() => {
    if(allValues.ChildAccountId && id!="new"){
      axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VOUCEHR_LEDGER_FOR_CLOSING,{
        headers:{
          currency:allValues.currency,
          id:allValues.ChildAccountId,
        }
      }).then((x)=>{
        if(x?.data?.status=="success"){
          let closingBalance = 0;
          x?.data?.result?.forEach((x)=>{
            x.type == "debit" ?
            closingBalance = closingBalance + parseFloat(x.amount): 
            closingBalance = closingBalance - parseFloat(x.amount)
          })
          setClosing(closingBalance)
        }
      })
    }
  }, [allValues.ChildAccountId]);

  useEffect(() => {
    // if(id=="new"){
      preserveData();
    // }
  }, [allValues]);

  async function preserveData(){
    let data = {...allValues};
    data.id = id;
    let settlementAmmount = 0.00;
    let debit = 0.00, credit = 0.00;
    let voucher = await { ...data }
    let newHeads = await allValues?.Voucher_Heads?.length>0?[...data?.Voucher_Heads]:[]
    if (voucher.ChildAccountId) {
      await voucher.Voucher_Heads.map((x) => {
        settlementAmmount = settlementAmmount + x.amount;
        if (x.type == "debit") {
          debit = debit + x.amount;
        } else {
          credit = credit + x.amount;
        }
      })

      let difference = debit - credit
      await newHeads.push({
        ChildAccountId: voucher.ChildAccountId,
        amount: difference > 0 ? difference : -1 * (difference),
        type: difference > 0 ? 'credit' : 'debit',
        settlement: "1",
        narration: voucher.payTo,
        defaultAmount: voucher.currency == "PKR" ? 0 : parseFloat(difference) / parseFloat(voucher.exRate)
      })
      voucher.Voucher_Heads = await newHeads
    }
    voucher.CompanyId = await CompanyId ? CompanyId : 1;
    voucher.type = await (voucher.vType == "BPV" || voucher.vType == "CPV") ? "Payble" : (voucher.vType == "BRV" || voucher.vType == "CRV") ? "Recievable" : voucher.vType == "TV" ? "Trasnfer Voucher" : "General Voucher"
    if(id!="new"){
      voucher.voucher_Id = data.voucher_Id
    }
    queryClient.setQueryData(['voucherData', {id}], (x)=>voucher)
  };

  return (
    <>
    <Row>
      <Col md={6}>
        <Row>
          <Col md={6}>
            <div>Voucher No.</div>
            <div style={box}>{voucherData?.voucher_Id || ""}</div>
          </Col>
          <Col md={3}>
            <DateComp register={register} name="createdAt" label="Date" control={control} width={"100%"} />
          </Col>
          <Col md={3}>
            <SelectSearchComp label="Type" name="vType" register={register} control={control} width={"100%"}
              options={[
                { id: "CPV", name: "CPV" },
                { id: "CRV", name: "CRV" },
                { id: "BRV", name: "BRV" },
                { id: "BPV", name: "BPV" },
                { id: "TV", name: "TV" },
                { id: "JV", name: "JV" },
              ]}
              disabled={id == "new" ? false : true}
            />
            <p className="error-line">{errors?.vType?.message}</p>
          </Col>
          <Col md={12} className="mb-2">
            <div>Company</div>
            <div style={box}>{CompanyId == 1 ? "SEANET SHIPPING & LOGISTICS" : CompanyId == 2 ? "CARGO LINKERS" : "AIR CARGO SERVICES"}</div>
          </Col>
          <Col md={12}>
            <SelectSearchComp className="form-select" name="ChildAccountId" label="Settlement Account" register={register} control={control} width={"100%"}
              options={settlement.length > 0 ? settlement.map((x) => { return { id: x?.id, name: x?.title } }) : []}
              disabled={(allValues.vType == "CPV" || allValues.vType == "CRV" || allValues.vType == "BRV" || allValues.vType == "BPV" || allValues.vType == "TV") ? false : true}
            />
          </Col>
          <Col md={5} className="my-2">
            <InputComp className="form-control" name={"chequeNo"} label="Cheque No" placeholder="Cheque No" register={register} control={control} />
          </Col>
          <Col md={2}></Col>
          <Col md={5} className="my-2">
            <DateComp register={register} name="chequeDate" label="Cheque Date" control={control} width={"100%"} />
          </Col>
          <Col md={5}>
            <SelectComp className="form-select" name={`currency`} label="Currency" register={register} control={control}
              width={"100%"}
              options={[
                { id:"PKR", name:"PKR"},
                { id:"USD", name:"USD"},
                { id:"EUR", name:"EUR"},
                { id:"GBP", name:"GBP"},
                { id:"AED", name:"AED"},             
                { id:"OMR", name:"OMR"},
                { id:"BDT", name:"BDT"},             
                { id:"CHF", name:"CHF"},
              ]}
            />
          </Col>
          <Col md={2}></Col>
          <Col md={5}>
            <InputNumComp name="exRate" label="Ex.Rate" register={register} control={control} width={"100%"} />
          </Col>
          <Col md={12} className="mt-2">
            <InputComp name="payTo" label="Pay/Recieve To" register={register} control={control} width={"100%"} />
            <p className="error-line">{errors?.payTo?.message}</p>
          </Col>
        </Row>
      </Col>
      <Col className="p-3" md={2}>
        <h6 className="blue-txt cur border p-2">
          <b>Go To Invoice <AiFillRightCircle style={{ position: 'relative', bottom: 1 }} /></b>
        </h6>
        <div>Debit Total</div>
        <div style={{ color: 'grey', paddingTop: 3, paddingRight: 6, border: '1px solid grey', fontSize: 16, textAlign: 'right' }}>{commas(totalDebit)}</div>
        <div className="mt-2">Credit Total</div>
        <div style={{ color: 'grey', paddingTop: 3, paddingRight: 6, border: '1px solid grey', fontSize: 16, textAlign: 'right' }}>{commas(totalCredit)}</div>
        <hr/>
        <div className="mt-2"><b>Closing Balance</b></div>
        <div style={{ color: closing>0?'green':'red', paddingTop: 3, paddingRight: 6, border: '1px solid grey', fontSize: 16, textAlign: 'right' }}><b>{commas(closing)}</b></div>
      </Col>
      <Col md={4}>
        <button type="button" className="btn-custom fs-11 px-4" 
          onClick={async () => {
            queryClient.removeQueries(['voucherData', { id: 'new' }]);
            await Router.push("/accounts/vouchers/new")
            dispatch(incrementTab({ "label": "Voucher", "key": "3-5", "id": "new" }))
          } }
        >
          <b>+</b> New
        </button>
        {id !== "new" && <button type="button" className="btn-red mb-3 fs-11 mx-2" 
          onClick={() => {handleDelete()}}
        >
          <MdDeleteOutline className="pr-b2" /> Delete
        </button>}
        {id !== "new" && <button type="button">
          {/* //print button  */}
          <ReactToPrint
            content={() => inputRef}
            trigger={() => (
              <div className="btn-custom px-4"><FaPrint/> Print</div>
            )}
          />
        </button>}
        {/* voucher history modal toggle states  */}
        {id !== "new" && <button type="button" className="btn-custom fs-11 px-4" onClick={()=>setIsOpen(true)}> <FaHistory/> History</button>}
        {isOpen && <VoucherHistory id={id} isOpen={isOpen} onClose={()=>setIsOpen(false)}/>}
        <button type="button" className="btn-custom fs-11 px-4" onClick={()=>Router.push("/accounts/voucherList")}> 
          <CiBoxList/> Show old
        </button>
        
        {isOpen && <VoucherHistory id={id} isOpen={isOpen} onClose={()=>setIsOpen(false)}/>}
      </Col>

    </Row>
    <button type="button" className="btn-custom mb-3" style={{ width: "110px", float: 'right' }}
      onClick={() => append({
        type: (allValues.vType == "BRV" || allValues.vType == "CRV") ? "credit" : "debit",
        ChildAccountId: "",
        narration: "",
        amount: 0,
        defaultAmount: 0
      })}>Add</button>
    <div className="table-sm-1 col-12" style={{ maxHeight: 300, overflowY: "auto" }} >
      <Table className="tableFixHead" bordered>
        <thead>
          <tr>
            <th className="col-3">Account</th>
            <th>Type</th>
            {allValues.currency != "PKR" && <th>{allValues.currency}</th>}
            <th>Amount</th>
            <th>Narration</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => {
            return (
              <tr className="f table-row-center-singleLine" key={index}>
                <td style={{ padding: 3, minWidth: 500 }}>
                  <SelectSearchComp className="form-select" name={`Voucher_Heads.${index}.ChildAccountId`} register={register}
                    control={control} width={"100%"}
                    options={child.length > 0 ? child.map((x) => { return { id: x?.id, name: x?.title } }) : []}
                  />
                </td>
                <td style={{ padding: 3, width: 90 }}>
                  <SelectComp className="form-select" name={`Voucher_Heads.${index}.type`} register={register} control={control}
                    width={"100%"} options={[{ id: "debit", name: "Debit" }, { id: "credit", name: "Credit" }]}
                  />
                </td>
                {allValues.currency != "PKR" &&
                  <td style={{ padding: 3, width: 90 }}>
                    <InputNumber value={field.defaultAmount} style={{ width: '100%' }}
                      onChange={(e) => {
                        let tempRecords = [...allValues.Voucher_Heads];
                        tempRecords[index].defaultAmount = e;
                        tempRecords[index].amount = e ? (parseFloat(e) * parseFloat(allValues.exRate)).toFixed(2) : tempRecords[index].amount;
                        reset({ ...allValues, Voucher_Heads: tempRecords });
                      }}
                    />
                  </td>}
                <td style={{ padding: 3, width: 90 }}>
                  <InputNumComp name={`Voucher_Heads.${index}.amount`} register={register} control={control} width={"100%"} />
                </td>
                <td style={{ padding: 3 }}>
                  <InputComp type="text" name={`Voucher_Heads.${index}.narration`} placeholder="Narration" control={control} register={register} />
                </td>
                <td className="text-center" style={{ padding: 3, paddingTop: 6 }}>
                  <CloseCircleOutlined className="cross-icon" onClick={() => remove(index)} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
    {(accountLoad && allValues.vType) && <Spinner size="sm" className="my-2" />}
    <br />
    <div style={{
      display: 'none'
    }}>
      <div ref={(response) => (inputRef = response)}>
        {
          id !== "new" ? 
          ( <VoucherPrint compLogo={CompanyId} voucherData={voucherData} /> )
          :null
        }
      </div>
    </div>
    </>
  )
};

export default React.memo(Vouchers);