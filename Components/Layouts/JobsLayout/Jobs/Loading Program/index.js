import openNotification from "/Components/Shared/Notification";
import { useForm, useWatch } from "react-hook-form";
import React,{useEffect, useState} from "react";
import LoadingForm from "./LoadingForm";
import {initialState} from "./states";
import moment from "moment";
import axios from "axios";

const LoadingProgram = ({ state, jobData }) => {

  const [load, setLoad] = useState(false);
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: initialState.values,
  });
  
  const allValues = useWatch({ control });

  const onSubmit = async (data) => {
    setLoad(true);
    const SEJobId = jobData.id;
    data.id == "" ? delete data.id : data.id;
    console.log(data)
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_UPSERT_LOADING_PROGRAM, {
        ...data,
        SEJobId,
    }).then((x) => {
      if(x.data.status=="success"){
        if(!data.id){
          reset({...allValues, id:x.data.result[0].id});
        }
        openNotification("Success", "Loading Program Saved!", "Green")
      }else{
        openNotification("Error", "Something Went Wrong, please try again", "red")
      }
    })
    setLoad(false)
  };

  useEffect(() => {
    getValues();
  }, []);

  const getValues = async() => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOADING_PROGRAM, {
      headers: { id: jobData.id },
    })  .then((res) => {
      if (res.data.result !== null) {
        let loadingProgram = res.data.result;
        reset({
          ...loadingProgram,
          loadingDate:loadingProgram.loadingDate ==""?"":moment(loadingProgram.loadingDate),
          croIssueDate:loadingProgram.croIssueDate == ""?"": moment(loadingProgram.croIssueDate),
          expiryDate:loadingProgram.expiryDate ==""?"":moment(loadingProgram.expiryDate),
          loadingTime:loadingProgram.loadingTime == ""?"": moment(loadingProgram.loadingTime),
          arrivalDate:loadingProgram.arrivalDate == ""?"": moment(loadingProgram.arrivalDate),
          sobDate:loadingProgram.sobDate == ""?"": moment(loadingProgram.sobDateDate),
          etd: loadingProgram.etd ==""?"" : moment(loadingProgram.etd),
          gatePassDate:loadingProgram.getGatePassDate==""?"":moment(loadingProgram.getGatePassDate),
          validityDate:loadingProgram.validityDate==""?"":moment(loadingProgram.validityDate)
          // dischargeTerminal: loadingProgram.dischargeTerminal,
          // localCustom:loadingProgram.localCustom==""?"":loadingProgram.localCustom,
          // loadingTerminal: loadingProgram.loadingTerminal,
          // letter: loadingProgram.letter,
          // book: loadingProgram.book,
          // egm: loadingProgram.egm,
          // gatePass: loadingProgram.gatePass,
          // letter: loadingProgram.letter,
          // cro: loadingProgram.cro,
          // berth: loadingProgram.berth,
          // viaPort: loadingProgram.viaPort,
          // containerInfo: loadingProgram.containerInfo,
          // portOfReciept: loadingProgram.portOfReciept,
          // instruction: loadingProgram.instruction,
          // loadingFlag: loadingProgram.loadingFlag,
          // status: loadingProgram.status,
          // allocAvailable: loadingProgram.allocAvailable,
          // contAvailable: loadingProgram.contAvailable,
          // containerSplit: loadingProgram.containerSplit,
          // blRequired: loadingProgram.blRequired,
          // containerWt: loadingProgram.containerWt,
          // containerTemp: loadingProgram.containerTemp,
          // vent: loadingProgram.vent,
          // loadingTerms: loadingProgram.loadingTerms,
          // cargoStauts: loadingProgram.cargoStauts,
          // instruction: loadingProgram.instruction,
          // loadingTerms: loadingProgram.loadingTerms
        })
      }
    })
  }

  return (
    <LoadingForm onSubmit={onSubmit} register={register} control={control} handleSubmit={handleSubmit}
      load={load} allValues={allValues} state={state}
    />
  );
};

export default React.memo(LoadingProgram)