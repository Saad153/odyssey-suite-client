import React, { useEffect, useReducer, useState } from "react";
import { Tabs } from "antd";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Spinner } from "react-bootstrap";
import openNotification from "../../../Shared/Notification";
import BlInfo from "./BlInfo";
import ContainerInfo from "./ContainerInfo";
import BlDetail from "./BlDetail";
import Stamps from "./Stamps";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { incrementTab } from "/redux/tabs/tabSlice";
import { stamps as stamp } from "./groupData";
import { validationSchema } from "./validion";
import { yupResolver } from "@hookform/resolvers/yup";
import { setAndFetchBlData, recordsReducer, initialState, baseValues, calculateContainerInfos, calculateItemInfos } from "./states";
import axios from 'axios';
import ItemDetail from "./ItemDetail";
import ChargesDetail from "./ChargesDetail";
import { getJobValues, getJobById } from '/apis/jobs';
import { useQuery } from '@tanstack/react-query';

const BlComp = ({id, blData, partiesData, type}) => {

  const currentJobValue = useSelector((state) => state.blCreationValues.value);
  const [state, dispatch] = useReducer(recordsReducer, initialState);
  const set = (a, b) => dispatch({ type: "toggle", fieldName: a, payload: b });
  const [deleteArr, setDeleteArr] = useState([]);
  const dispatchNew = useDispatch();
  const { refetch } = useQuery({
    queryKey:["jobData", {id:id=="new"?currentJobValue:blData.SEJobId, type:type}], 
    queryFn: () => getJobById({
      id:id=="new"?currentJobValue:blData.SEJobId, 
      type:type
    }),
  })
  const { register, control, handleSubmit, reset, formState: { errors }, } = useForm({
    defaultValues: state.values,
  });
  const allValues = useWatch({ control });
  const { fields, append, remove } = useFieldArray({
    name: "stamps",
    control,
  });
  
  useEffect(() => {
    set("partiesData", partiesData);
    if (id != "new") {
      setAndFetchBlData(reset, state, allValues, set, dispatch, blData);
    } else {
      // -------->>>>>>!!!!!    Important Note    !!!!!<<<<<<---------
      // ----->>>>>> New Jab Values are set in Booking Info <<<<<-----
      reset(baseValues);
    }
  }, [id]);

  const getStamps = async () => {
    const req = await axios.get(
      process.env.NEXT_PUBLIC_CLIMAX_GET_STAMPS_BY_ID,
      { headers: { id: id } }
    );
    const result = req.data.result;
    reset({ ...allValues, stamps: result });
  };

  const onDelete = (id) => {
    setDeleteArr((prev) => [...prev, id]);
  };

  const onSubmit = async (data) => {
    set("load", true);
    let tempData = {
      ...data,
      mblDate: data.mblDate,
      issueDate: data.issueDate,
      hblDate: data.hblDate,
      shipperContent: state.shipperContent,
      consigneeContent: state.consigneeContent,
      notifyOneContent: state.notifyOneContent,
      notifyTwoContent: state.notifyTwoContent,
      deliveryContent: state.deliveryContent,
      marksContent: state.marksContent,
      marksContentTwo: state.marksContentTwo,
      noOfPckgs: state.noOfPckgs,
      descOfGoodsContent: state.descOfGoodsContent,
      descOfGoodsContentTwo: state.descOfGoodsContentTwo,
      grossWeightContent: state.grossWeightContent,
      measurementContent: state.measurementContent,
      Container_Infos: state.Container_Infos,
      deletingContinersList: state.deletingContinersList,
      Item_Details:state.Item_Details,
      Dimensions:state.Dimensions,
      applyToCWT:data.applyToCWT[0]==1?'1':'0'
    };
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_BL, tempData).then(async(x) => {
      if (x.data.status == "success") {
        openNotification("Success", "BL Created Successfully", "green");
        dispatchNew(
          incrementTab({
            label: `${data.operation} BL`,
            key: data.operation=="SE"?"4-4":data.operation=="SI"?"4-7":data.operation=="AE"?"7-3":"7-6",
            id: x.data.result,
          })
        );
        Router.push(type=="SE"?`/seaJobs/export/bl/${x.data.result}`:type=="SI"?`/seaJobs/import/bl/${x.data.result}`:type=="AE"?`/airJobs/export/bl/${x.data.result}`:`/airJobs/import/bl/${x.data.result}`);
      } else {
        openNotification("Error","something went wrong, try again with correct values","red");
      }
      set("load", false);
    });
    await refetch();
  };

  const onEdit = async (data) => {
    set("load", true);
    const stamps = data.stamps?.map((x) => ({
      ...x,
      stamps: stamp[Number(x.code) - 1]?.label,
    }));
    let tempData = {
      ...data,
      id: id,
      stamps: stamps,
      mblDate: data.mblDate,
      issueDate: data.issueDate,
      hblDate: data.hblDate,
      deleteArr: deleteArr,
      shipperContent: state.shipperContent,
      consigneeContent: state.consigneeContent,
      notifyOneContent: state.notifyOneContent,
      notifyTwoContent: state.notifyTwoContent,
      deliveryContent: state.deliveryContent,
      marksContent: state.marksContent,
      marksContentTwo: state.marksContentTwo,
      noOfPckgs: state.noOfPckgs,
      descOfGoodsContent: state.descOfGoodsContent,
      descOfGoodsContentTwo: state.descOfGoodsContentTwo,
      grossWeightContent: state.grossWeightContent,
      measurementContent: state.measurementContent,
      Container_Infos: state.Container_Infos,
      deletingContinersList: state.deletingContinersList,
      Item_Details:state.Item_Details,
      deletingItemList:state.deletingItemList,
      Dimensions:state.Dimensions,
      deletingDimensionsList:state.deletingDimensionsList,
      applyToCWT:data.applyToCWT[0]==1?'1':'0'
    };
    let emp = stamps?.find(
      (x) => x.code == undefined && x.stamp_group == undefined
    );
    emp?openNotification("Error", "Fields Can't Be Empty", "red")
      :await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_EDIT_BL, tempData)
      .then(async(x) => {
        if (x.data.status == "error") {
          openNotification("Error", "Something went wrong", "red");
          set("load", false);
        } else {
          openNotification("Success", "Bl Eidted Successfully", "green");
          set("load", false);
        }
      })
      getStamps();
      await refetch();
  };

  useEffect(() => {
    if (state.tabState != "5") {
      dispatch({ type: "toggle", fieldName: "selectedInvoice", payload: "" });
    }
    if (state.tabState == 4) {
      getStamps();
    }
  }, [state.tabState]);

  useEffect(() => {
    calculateContainerInfos(state, set, reset, allValues)
  }, [state.Container_Infos]);
  useEffect(() => {
    calculateItemInfos(state, set, reset, allValues)
  }, [state.Item_Details]);

  const onError = (errors) => console.log(errors);

  return (
    <div className="base-page-layout">
      <div className="client-styles" style={{ overflowY: "auto", overflowX: "hidden" }}>
        <form onSubmit={handleSubmit(id != "new" ? onEdit : onSubmit, onError)}>
          <Tabs defaultActiveKey={state.tabState} activeKey={state.tabState} onChange={(e)=>dispatch({ type:"toggle", fieldName:"tabState", payload:e })}>
            <Tabs.TabPane tab={(type=="SE"||type=="SI")?"BL Info.":"AWB Info"} key="1">
              <BlInfo control={control} id={id} register={register} state={state} useWatch={useWatch} dispatch={dispatch} reset={reset} type={type} currentJobValue={currentJobValue} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={(type=="SE"||type=="SI")?"Container Info":"Item Detail"} key="2">
              {(type=="SE"|| type=="SI") && <ContainerInfo control={control} id={id} register={register} 
                state={state} useWatch={useWatch} dispatch={dispatch} reset={reset} 
              />}
              {(type=="AE"|| type=="AI") && <ItemDetail control={control} id={id} register={register} 
                state={state} useWatch={useWatch} dispatch={dispatch} reset={reset} 
              />}
            </Tabs.TabPane>
            {(type=="AE"||type=="AI") && <Tabs.TabPane tab={"Charges Detail"} key="5">
              <ChargesDetail control={control} id={id} register={register} state={state} useWatch={useWatch} dispatch={dispatch} reset={reset} />
            </Tabs.TabPane>}
            <Tabs.TabPane tab={(type=="SE"||type=="SI")?"BL Detail":"Basic Information"} key="3">
              <BlDetail control={control} id={id} register={register} state={state} useWatch={useWatch} dispatch={dispatch} reset={reset} type={type} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Ref No's / Stamps" key="4">
              {allValues.jobNo && <Stamps state={state} id={id} control={control} register={register} useWatch={useWatch} handleSubmit={handleSubmit} 
                fields={fields} append={append} remove={remove} onDelete={onDelete} errors={errors} 
              />}
            </Tabs.TabPane>
          </Tabs>
          {allValues.jobNo && (
            <button type="submit" disabled={state.load ? true : false} className="btn-custom mt-3">
              {state.load ? 
                <Spinner animation="border" size="sm" className="mx-3" />:
                <>
                  {(type=="SE"||type=="SI")?"Save BL":"Save AWBL"}
                </>
                }
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default React.memo(BlComp);