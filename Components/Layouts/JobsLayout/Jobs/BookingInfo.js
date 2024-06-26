import React, { useEffect, useState } from 'react';
import { Popover, Tag, Modal } from "antd";
import SelectComp from '/Components/Shared/Form/SelectComp';
import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';
import CheckGroupComp from '/Components/Shared/Form/CheckGroupComp';
import DateComp from '/Components/Shared/Form/DateComp';
import TimeComp from '/Components/Shared/Form/TimeComp';
import { Row, Col } from 'react-bootstrap';
import CustomBoxSelect from '/Components/Shared/Form/CustomBoxSelect';
import Notes from "./Notes";
import ports from "/jsonData/ports";
import destinations from "/jsonData/destinations";
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab, removeTab } from '/redux/tabs/tabSlice';
import { getStatus } from './states';
import Router from 'next/router';
import InputComp from '/Components/Shared/Form/InputComp';
import { addBlCreationId } from '/redux/BlCreation/blCreationSlice';
import Weights from './WeightComp';
import BLInfo from './BLInfo';
import airports from "/jsonData/airports";
import Carrier from './Carrier';
import AddPort from './AddPort';
import { FaPlus } from "react-icons/fa6";

const BookingInfo = ({ handleSubmit, onEdit, companyId, register, control, errors, state, useWatch, dispatch, reset, id, type }) => {
  const tabs = useSelector((state) => state.tabs.tabs)
  //const companyId = useSelector((state) => state.company.value);
  const dispatchNew = useDispatch();
  const transportCheck = useWatch({ control, name: "transportCheck" });
  const transporterId = useWatch({ control, name: "transporterId" });
  const customCheck = useWatch({ control, name: "customCheck" });
  const customAgentId = useWatch({ control, name: "customAgentId" });
  const vesselId = useWatch({ control, name: "vesselId" });
  const VoyageId = useWatch({ control, name: "VoyageId" });
  const ClientId = useWatch({ control, name: "ClientId" });
  const shipperId = useWatch({ control, name: "shipperId" });
  const consigneeId = useWatch({ control, name: "consigneeId" });
  const overseasAgentId = useWatch({ control, name: "overseasAgentId" });
  const airLineId = useWatch({ control, name: "airLineId" });
  const forwarderId = useWatch({ control, name: "forwarderId" });
  const shippingLineId = useWatch({ control, name: "shippingLineId" });
  const localVendorId = useWatch({ control, name: "localVendorId" });
  const approved = useWatch({ control, name: "approved" });
  let allValues = useWatch({ control });
  const [isOpen, setIsOpen] = useState(false);
  const Space = () => <div className='mt-2' />

  useEffect(() => {
    if (allValues.freightType == "Prepaid") {
      reset({ ...allValues, freightPaybleAt: 'Karachi, Pakistan' });
    } else {
      reset({ ...allValues, freightPaybleAt: 'Destination' });
    }
  }, [allValues.freightType])

  const handleOk = () => {
    allValues.approved = approved
    handleSubmit(onEdit(allValues))
    dispatch({
      type: "set", payload: {
        isModalOpen: false,
      }
    })
  };

  const handleCancel = () => {
    dispatch({
      type: "set", payload: {
        isModalOpen: false,
      }
    })
    reset({ ...allValues, approved: approved[0] != 1 ? ['1'] : [] })
  };

  const pageLinking = (pageType, value) => {
    let route = "";
    let obj = {};

    if (pageType === "client") {
      // Checking if id is defined and not null
      if (value !== undefined && value !== null && value !== "") {
        route = `/setup/client/${value}`;
        obj = {
          label: "Client",
          key: "2-7",
          id: value,
        };
      } else {
        // Navigating to a default/new page if id is undefined or null
        route = "/setup/client/new";
        obj = {
          label: "Client",
          key: "2-7",
          id: "new",
        };
      }
    } else if (pageType === "vendor") {
      // Checking if id is defined and not null
      if (value !== undefined && value !== null && value !== "") {
        route = `/setup/vendor/${value !== "" && value !== null ? value : "new"}`;
        obj = {
          label: "Vendor",
          key: "2-8",
          id: value !== "" && value !== null ? value : "new",
        };
      } else {
        // Navigating to a default/new page if id is undefined or null
        route = "/setup/vendor/new";
        obj = {
          label: "Vendor",
          key: "2-8",
          id: "new"
        }
      }
    } else if (pageType === "vessel") {
      route = "/setup/voyage/";
      obj = {
        label: "Voyages",
        key: "2-4",
      };
    }
    dispatchNew(incrementTab(obj));
    Router.push(route);
  };

  const ShipperComp = () => {
    return (
      <>
        <div className='custom-link mt-2' onClick={() => pageLinking("client", shipperId)}>
          Shipper *
        </div>
        <SelectSearchComp register={register} name='shipperId' control={control} label=''
          disabled={getStatus(approved)} width={"100%"}
          options={state.fields.party.shipper}
        />
        <Space />
      </>
    )
  }
  // console.log(state)
  return (
    <>
      <Row style={{ fontSize: 12 }}>
        <Col md={2} className=''>
          <div className="mt-1">Job No.</div>
          <div className="dummy-input">
            {state.edit ? (state.selectedRecord?.jobNo) : <span style={{ color: 'white' }}>.</span>}
          </div>
        </Col>
        <Col md={2} className='py-1'>
          <SelectComp register={register} name='jobType' control={control} label='Job Type' width={"100%"} disabled={getStatus(approved)}
            options={[
              { id: 'Direct', name: 'Direct' },
              { id: 'Coloaded', name: 'Coloaded' },
              { id: 'Cross Trade', name: 'Cross Trade' },
              { id: 'Liner Agency', name: 'Liner Agency' },
            ]} />
        </Col>
        <Col md={2} className='py-1'>
          <SelectComp register={register} name='jobKind' control={control} label='Job Kind' width={"100%"} disabled={getStatus(approved)}
            options={[
              { id: 'Current', name: 'Current' },
              { id: 'Opening', name: 'Opening' },
            ]} />
        </Col>
        <Col md={2} className='py-1'>
          <DateComp register={register} name='jobDate' control={control} label='Job Date' width={"100%"} disabled={getStatus(approved)} />
          {errors.registerDate && <div className='error-line'>Required*</div>}
        </Col>
        <Col md={2} className='py-1'>
          <DateComp register={register} name='shipDate' control={control} label='Ship Date' disabled={getStatus(approved)} width={"100%"} />
          {errors.registerDate && <div className='error-line'>Required*</div>}
        </Col>
        <Col md={2} className='py-1'>
          <SelectComp register={register} name='shipStatus' control={control} label='Ship Status:' width={"100%"} disabled={getStatus(approved)}
            options={[
              { id: 'Hold', name: 'Hold' },
              { id: 'Booked', name: 'Booked' },
              { id: 'Delivered', name: 'Delivered' },
              { id: 'Shipped', name: 'Shipped' },
              { id: 'Closed', name: 'Closed' }
            ]} />
        </Col>
        <Col md={1} className='py-1'>
          <SelectComp register={register} name='costCenter' control={control} label='C. Center' width={"100%"} disabled={getStatus(approved)}
            options={[
              { id: 'FSD', name: 'FSD' },
              { id: 'KHI', name: 'KHI' }
            ]} />
        </Col>
        <Col md={1} className='py-1'>
          {(type == "SE" || type == "SI") && <SelectComp register={register} name='subType' control={control} disabled={getStatus(approved) || state.selectedRecord.id != null}
            label='Sub Type' width={"100%"}
            options={[
              { id: 'FCL', name: 'FCL' },
              { id: 'LCL', name: 'LCL' },
            ]} />}
        </Col>
        <Col md={1} className='py-1'>
          <SelectComp register={register} name='dg' control={control} label='DG Type' width={"100%"} disabled={getStatus(approved)}
            options={[
              { id: 'DG', name: 'DG' },
              { id: 'non-DG', name: 'non-DG' },
              { id: 'Mix', name: 'Mix' },
            ]} />
        </Col>
        <Col md={1} className='py-1'>
          <SelectComp register={register} name='freightType' control={control} label='Fr. Type' width={"100%"} disabled={getStatus(approved)}
            options={[
              { id: 'Prepaid', name: 'Prepaid' },
              { id: 'Collect', name: 'Collect' },
            ]} />
        </Col>
        <Col md={2} className='py-1'>
          <SelectComp register={register} name='nomination' control={control} label='Nomination' width={"100%"} disabled={getStatus(approved)}
            options={[
              { id: 'Free Hand', name: 'Free Hand' },
              { id: 'Nominated', name: 'Nominated' },
              { id: 'B2B', name: 'B2B' },
            ]} />
        </Col>
        <Col md={2} className='py-1'>
          <SelectComp register={register} name='incoTerms' control={control} label='Inco Terms' width={"100%"} disabled={getStatus(approved)}
            options={[
              { id: 'EXW', name: 'EXW' },
              { id: 'FCP', name: 'FCP' },
              { id: 'FAS', name: 'FAS' },
              { id: 'FOB', name: 'FOB' },
              { id: 'CFR', name: 'CFR' },
              { id: 'CIF', name: 'CIF' },
              { id: 'CIP', name: 'CIP' },
              { id: 'CPT', name: 'CPT' },
              { id: 'DAP', name: 'DAP' },
              { id: 'DPU', name: 'DPU' },
              { id: 'DDP', name: 'DDP' },
              { id: 'CNI', name: 'CNI' },
              { id: 'DTP', name: 'DTP' },
              { id: 'DPP', name: 'DPP' },
              { id: 'DAT', name: 'DAT' },
              { id: 'DDU', name: 'DDU' },
              { id: 'DES', name: 'DES' },
              { id: 'DEQ', name: 'DEQ' },
              { id: 'DAF', name: 'DAF' },
              { id: 'CNF', name: 'CNF' },
            ]} />
        </Col>
        <Col md={2} className='py-1'>
          <InputComp register={register} name='customerRef' control={control} label='Customer Ref#' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={2} className='pt-1 mb-0 pb-0'>
          <InputComp register={register} name='fileNo' control={control} label='File #' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col className='py-0 my-0'>
          <BLInfo blValues={state.selectedRecord.Bl} />
        </Col>
      </Row>
      <hr className='mb-0' />
      <Row style={{ fontSize: 12 }}>
        <Col md={3} className=''>
          <div className='custom-link mt-2' onClick={() => pageLinking("client", ClientId)} >Client *</div>
          <SelectSearchComp register={register} name='ClientId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
            options={state.fields.party.client} />
          {(type == "SE" || type == "AE") && <ShipperComp />}
          <div className='custom-link mt-2' onClick={() => pageLinking("client", consigneeId)} >Consignee *</div>
          <SelectSearchComp register={register} name='consigneeId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
            options={state.fields.party.consignee} /><Space />
          {(type == "SI" || type == "AI") && <ShipperComp />}
          {(type == "SE" || type == "SI") && <>
            <SelectSearchComp register={register} name='pol' control={control} label='Port Of Loading' disabled={getStatus(approved)} width={"100%"}
              options={ports.ports} /><Space />
            <SelectSearchComp register={register} name='pod' control={control} label='Port Of Discharge *' disabled={getStatus(approved)} width={"100%"}
              options={ports.ports} />
            <FaPlus onClick={() => setIsOpen(true)} style={{ cursor: "pointer" }} />
            <Space />
            {isOpen && <AddPort isOpen={isOpen} onClose={() => setIsOpen(false)} />}
          </>
          }
          {(type == "AE" || type == "AI") && <>
            {type == "AI" && <>
              <SelectSearchComp register={register} name='pol' control={control} label='Air Port Of Loading' disabled={getStatus(approved)} width={"100%"}
                options={airports} /><Space />
              <SelectSearchComp register={register} name='pod' control={control} label='Air Port Of Discharge *' disabled={getStatus(approved)} width={"100%"}
                options={airports} />
                
              <FaPlus onClick={() => setIsOpen(true)} style={{ cursor: "pointer" }} />
              <Space />
              {isOpen && <AddPort isOpen={isOpen} onClose={() => setIsOpen(false)} />}
            </>}
          </>}
          <SelectSearchComp register={register} name='fd' control={control} label='Final Destination *' disabled={getStatus(approved)} width={"100%"}
            options={destinations}
          /><Space />
          <div className='custom-link mt-2' onClick={() => pageLinking("vendor", forwarderId)} >Forwarder/Coloader *</div>
          <SelectSearchComp register={register} name='forwarderId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
            options={state.fields.vendor.forwarder} /><Space />
          <SelectSearchComp register={register} name='salesRepresentatorId' control={control} label='Sales Representator' disabled={getStatus(approved)}
            options={state.fields.sr} width={"100%"} />
        </Col>
        
        <Col md={3}><Space />
          <div className='custom-link mt-2' onClick={() => pageLinking("vendor", overseasAgentId)} >Overseas Agent *</div>
          <SelectSearchComp register={register} name='overseasAgentId' control={control} label='' disabled={getStatus(approved)} options={state.fields.vendor.overseasAgent} width={"100%"} />

          <div className='custom-link mt-2' onClick={() => pageLinking("vendor", localVendorId)} >Local Vendor *</div>
          <SelectSearchComp register={register} name='localVendorId' control={control} label=''
            disabled={getStatus(approved)} options={state.fields.vendor.localVendor} width={"100%"}
          />
          {(type == "SE" || type == "SI") && <>
            <div className='custom-link mt-2' onClick={() => pageLinking("vendor", shippingLineId)} >Sline/Carrier</div>
            <SelectSearchComp register={register} name='shippingLineId' control={control} label='' disabled={getStatus(approved)} options={state.fields.vendor.sLine} width={"100%"} />
          </>}
          {(type == "AE" || type == "AI") && <>
            <div className='custom-link mt-2' onClick={() => pageLinking("vendor", airLineId)} >Air line *</div>
            <SelectSearchComp register={register} name='airLineId' control={control} label='' disabled={getStatus(approved)} options={state.fields.vendor.airLine} width={"100%"} />
          </>}
          <Carrier state={state} register={register} control={control} pageLinking={pageLinking} dispatch={dispatch}
            getStatus={getStatus} approved={approved} VoyageId={VoyageId} vesselId={vesselId} type={type}
          />
        </Col>
        <Col md={3}><Space />
          <SelectSearchComp register={register} name='commodityId' control={control} label='Commodity *' disabled={getStatus(approved)} width={"100%"}
            options={state.fields.commodity}
          />
          <div className='mt-2' />
          <Row>
            <Col md={1}>
              <CheckGroupComp register={register} name='transportCheck' control={control} label='' disabled={getStatus(approved)}
                options={[{ label: "", value: "Transport" }]} />
            </Col>
            <Col md={3}>
              <div className='custom-link' onClick={() => pageLinking("vendor", transporterId)} >Transport</div>
            </Col>
            <Col>.</Col>
          </Row>
          <SelectSearchComp register={register} name='transporterId' control={control} label=''
            options={state.fields.vendor.transporter} disabled={getStatus(approved) || transportCheck.length == 0} width={"100%"} />
          <div className='mt-2'></div>
          <Row>
            <Col md={1}>
              <CheckGroupComp register={register} name='customCheck' control={control} label='' disabled={getStatus(approved)}
                options={[{ label: "", value: "Custom Clearance" }]} />
            </Col>
            <Col md={6}>
              <div className='custom-link' onClick={() => pageLinking("vendor", customAgentId)} >Custom Clearance</div>
            </Col>
            <Col>.</Col>
          </Row>
          <SelectSearchComp register={register} name='customAgentId' control={control} label='' width={"100%"}
            options={state.fields.vendor.chaChb} disabled={getStatus(approved) || customCheck.length == 0}
          />
          <div style={{ marginTop: 13 }}></div>
          <Weights state={state} register={register} control={control} equipments={state.equipments}
            type={type} approved={approved} useWatch={useWatch}
          />
        </Col>
        <Col md={3}>
          {state.edit && <Notes state={state} dispatch={dispatch} />}
          {approved == "1" && <img src={'/approve.png'} height={100} />}
          <div onClick={() => dispatch({ type: "set", payload: { isModalOpen: true, } })}>
            <CheckGroupComp register={register} name='approved' control={control} label='_____________________'
              options={[{ label: "Approve Job", value: "1" }]}
            />
          </div>
          <hr />
          {id != "new" && <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
            <button className='btn-custom px-4' type="button"
              onClick={
                async () => {
                  if (id != "new") {
                    let oldTabs = await type == "SE" ? tabs.filter((x) => { return x.key != "4-3" }) :
                      await type == "SI" ? tabs.filter((x) => { return x.key != "4-6" }) :
                        await type == "AE" ? tabs.filter((x) => { return x.key != "7-2" }) :
                          await tabs.filter((x) => { return x.key != "7-5" })
                    dispatchNew(await removeTab(oldTabs)); // First deleting Job Tab
                    dispatchNew(await incrementTab({ // Then Re adding Job Tab with updated info
                      "label": `${type} JOB`,
                      "key": type == "SE" ? "4-3" : type == "SI" ? "4-6" : type == "AE" ? "7-2" : "7-5",
                      "id": state.selectedRecord.id
                    }));
                    dispatchNew(await addBlCreationId(id)); // Sending JobId to Bl
                    dispatchNew(await incrementTab({ // Now Adding a BL Tab
                      "label": `${type} ${type == "SE" || type == "SI" ? "" : "AW"}BL`,
                      "key": type == "SE" ? "4-4" : type == "SI" ? "4-7" : type == "AE" ? "7-3" : "7-6",
                      "id": state.selectedRecord.Bl != null ? `${state.selectedRecord.Bl.id}` : "new"
                    }));
                    await Router.push(`${type == "SE" ? "/seaJobs/export/bl/" : type == "SI" ? "/seaJobs/import/bl/" : type == "AE" ? "/airJobs/export/bl/" : "/airJobs/import/bl/"}${state.selectedRecord.Bl != null ? state.selectedRecord.Bl.id : "new"}`);
                  }
                }}
            >{(type == "SE" || type == "SI") ? "BL" : "AWBL"}</button>
            <Popover
              content={
                <>{state.InvoiceList?.map((x, i) =>
                (<div key={i} className='my-1'>
                  <Tag color="geekblue" style={{ fontSize: 15, cursor: "pointer", width: 130, textAlign: 'center' }}
                    onClick={() => {
                      dispatch({
                        type: 'set',
                        payload: { selectedInvoice: x.invoice_No, tabState: "5" }
                      })
                    }}>
                    {x.invoice_No}
                  </Tag>
                </div>))}
                </>}>
              <button type="button" className="btn-custom">Invoice/Bills {`(${state.InvoiceList.length})`}</button>
            </Popover>

            {(type=="AE" || type=="SE") && 
            <button className='btn-custom px-4' type='button' onClick={() => dispatch({ type: 'set', payload: { loadingProgram: 1, tabState: "6" } })}
            >Loading Program</button>}

            {(type=="AI" || type=="SI") && <button className='btn-custom px-4' type='button' onClick={() => dispatch({ type: 'set', payload: { do: 1, tabState: "7" } })}>
              DO
            </button>}
          </div>}
        </Col>
      </Row>
      {(state.voyageVisible && approved[0] != "1") &&
        <CustomBoxSelect reset={reset} useWatch={useWatch} control={control} state={state} dispatch={dispatch} />
      }
      <Modal open={state.isModalOpen} onOk={handleOk} onCancel={handleCancel} maskClosable={false}>
        {approved == "1" ? "Are You Sure You Want To Approve This Job? " : "Are You Sure You Want To Disapprove This Job?"}
      </Modal>
    </>
  )
}
export default React.memo(BookingInfo)