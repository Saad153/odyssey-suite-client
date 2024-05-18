import openNotification from "/Components/Shared/Notification";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema, defaultValues } from "./state";
import { useForm, useWatch } from "react-hook-form";
import { Spinner } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Vouchers from "./Vouchers";
import axios from "axios";
import { delay } from "/functions/delay"
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from "next/router";
import { useQuery } from '@tanstack/react-query';
import { getVoucherById } from "../../../../apis/vouchers";
import Cookies from 'js-cookie'


const Voucher = ({ id }) => {

  const dispatch = useDispatch();
  const CompanyId = useSelector((state) => state.company.value);
  const [child, setChild] = useState([]);
  const [settlement, setSettlement] = useState([]);
  const [load, setLoad] = useState(false);
  const [voucherData, setVoucherData] = useState({})
  //getting employeeid and name from cookies
  const employeeId = Cookies.get("loginId");
  const employeeName = Cookies.get("username");

  const { data:newData, isSuccess, refetch } = useQuery({
    queryKey:["voucherData", {id}], queryFn: () => getVoucherById({id}),
  })

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues
  });

  //funtion responsible for creating and updating voucher history
  async function createHistory (id,mode){
      const data = {
        html:mode == "Create" ? `Created by ${employeeName}` : `Updated by ${employeeName}`,
        updateDate:new Date().toISOString(),
        type:mode == "Create" ? "Create" : "Update"
      }
      try {
          const result = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER_HISTORY,data,{
            headers:{
                recordId:id,
                EmployeeId:employeeId
            }
        }) 
          return result
      } catch (error) {
          console.log(error)
      }
  }
   

  const onSubmit = async (data) => {
    setLoad(true)
    let settlementAmmount = 0.00;
    let debit = 0.00, credit = 0.00;
    let voucher = { ...data }
    let newHeads = [...data.Voucher_Heads];
    if (voucher.ChildAccountId) {
      voucher.Voucher_Heads.map((x) => {
        settlementAmmount = settlementAmmount + x.amount;
        if (x.type == "debit") {
          debit = debit + x.amount;
        } else {
          credit = credit + x.amount;
        }
      })

      let difference = debit - credit
      newHeads.push({
        ChildAccountId: voucher.ChildAccountId,
        amount: difference > 0 ? difference : -1 * (difference),
        type: difference > 0 ? 'credit' : 'debit', //voucher.vType==("CRV"||"BRV")?"debit":"credit",
        settlement: "1",
        narration: voucher.payTo,
        defaultAmount: voucher.currency == "PKR" ? 0 : parseFloat(difference) / parseFloat(voucher.exRate)
      })
      voucher.Voucher_Heads = newHeads
    }
    voucher.CompanyId = CompanyId ? CompanyId : 1;
    voucher.type = (voucher.vType == "BPV" || voucher.vType == "CPV") ? "Payble" : (voucher.vType == "BRV" || voucher.vType == "CRV") ? "Recievable" : voucher.vType == "TV" ? "Trasnfer Voucher" : "General Voucher"

    //voucher.createdAt = voucherData.createdAt
    console.log(voucher)
    // <----- Create New Voucher ----->
    if (id == "new") {
      delete voucher.id;
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER, {...voucher, createdBy:employeeName}).then((x) => {
        if (x.data.status == "success") {
          //passing id and mode to create history funtion when create method triggers
          createHistory(x.data.result.id,"Create")

          openNotification("Success", `Voucher Created Successfully!`, "green");
          setLoad(false);
          dispatch(incrementTab({ "label": "Voucher", "key": "3-5", "id": `${x.data.result.id}` }));
          Router.push(`/accounts/vouchers/${x.data.result.id}`);
        } else {
          openNotification("Error", `An Error occured Please Try Again!`, "red");
          setLoad(false);
        }
      });
    }
    // <----- Update Existing Voucher ----->
    else {
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_UPDATE_VOUCEHR, { ...voucher, id: id }).then((x) => {
        x.data.status == "success"
        ? openNotification("Success", `Voucher Updated Successfully!`, "green")
        : openNotification("Error", `An Error occured Please Try Again!`, "red");
        //passing id and mode to history funtion when the update method triggers
        createHistory(id,"Update");
      });
    }
    await delay(1000);
    setLoad(false)
  };

  // useEffect(() => {
  //   isSuccess?console.log(newData):null
  // }, [isSuccess])
  
  return (
    <div className="base-page-layout fs-11">
      <form onSubmit={handleSubmit(onSubmit)}>
        {isSuccess && <Vouchers register={register} control={control}
          child={child} voucherData={newData} setChild={setChild} id={id}
          reset={reset} setSettlement={setSettlement} errors={errors} settlement={settlement} CompanyId={CompanyId}
        />}
        { !isSuccess && <Spinner size="sm" className="mx-3" /> }
        <button className="btn-custom" disabled={load ? true : false} type="submit"
        >{load ? <Spinner size="sm" className="mx-3" /> : "Save"}
        </button>
      </form>
    </div>
  );
};

export default Voucher;