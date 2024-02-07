import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import InputComp from "../../Shared/Form/InputComp";
import InputNumComp from "../../Shared/Form/InputNumComp";
import TextAreaComp from "../../Shared/Form/TextAreaComp";
import DateComp from "/Components/Shared/Form/DateComp";

const Modal = ({index,  register, control}) => {

  return (
  <div style={{ maxHeight: 760, overflowY: "auto", overflowX:'hidden', padding:"10px" }}>   
  <Col md={12}>

    <Row>
      <Col md={6}>
        <Row>
          <Col md={12}>
            <TextAreaComp control={control} register={register} label={"Shipper's Name and Address"} width={"100%"} name={`Manifest_Jobs.${index}.shipper_content`}/>
          </Col>
          <Col md={12}>
            <InputComp control={control} register={register} label={"Shipper's Account No"} name={`Manifest_Jobs.${index}.shipper_account_no`}/>  
          </Col>
        </Row>
      </Col>
      <Col md={6}>
        <Row>
          <Col md={12}>
            <InputComp control={control} register={register} label={"Not Negotiable Bill"} name={`Manifest_Jobs.${index}.non_negotiable`}/>
          </Col>
          <Col md={12}>
            <InputComp control={control} register={register} label={"Issued By"} name={`Manifest_Jobs.${index}.issued_by`}/>
          </Col>
          <Col md={12}>
            <div className="px-1" style={{textAlign:"center"}}>Copies 1, 2 and 3 of this Air Waybill are originals and have the same validity.</div>
          </Col>
        </Row>
      </Col>
    </Row>

    <Row className="mt-2" >
      <Col md={6} >
      <Row>
        <Col md={12}>
          <TextAreaComp control={control} register={register} label={"Consignee's Name and Address"} width={"100%"} name={`Manifest_Jobs.${index}.consignee_content`}/>
        </Col>
        <Col md={12}>
          <InputComp control={control} register={register} label={"Consignee's Account No"} name={`Manifest_Jobs.${index}.consignee_account_no`}/>  
        </Col>
      </Row>
      </Col>
      <Col md={6} >
        <Row>
          <Col md={12}>
            <InputComp control={control} register={register} label={"Recieved In Good Order And Condition"} name={`Manifest_Jobs.${index}.recieved_condition`}/>
          </Col>
          <Row>
          <Col md={6}>
            <InputComp control={control} register={register} label={"At"} name={`Manifest_Jobs.${index}.at`}/>
          </Col>
          <Col md={6}>
            <InputComp control={control} register={register} label={"On"} name={`Manifest_Jobs.${index}.on`}/>
          </Col>
          </Row>
          <Col md={12}>
            <div style={{textAlign:"center" }}>Signature Of Consignee or his Agent</div>
          </Col>
        </Row>
      </Col>
    </Row>

    <Row className="mt-2" >
      <Col md={6} >
        <Row>
          <Col md={12}>
          <TextAreaComp control={control} register={register} label={"Issuing Carrier's Agent Name and City"} name={`Manifest_Jobs.${index}.carriar_agent_content`}/>
          </Col>
          <Col md={6}>
          <InputComp control={control} register={register} label={"Agents's IAT Code"} name={`Manifest_Jobs.${index}.agent_IATA_code`}/>  
          </Col>
          <Col md={6}>
          <InputComp control={control} register={register} label={"Account No"} name={`Manifest_Jobs.${index}.account_no`}/>  
          </Col>
        </Row>
      </Col>
      <Col md={6} >    
        <TextAreaComp control={control} register={register} width="100%"
        label={"Account Information"} name={`Manifest_Jobs.${index}.accounting_information`}/>
      </Col>
    </Row>

    <Row className="mt-2" >
      <Col md={6} >
        <Row>
          <Col md={12}>
            <InputComp control={control} register={register} label={"Airport Of Departure And Requested Route"} name={`Manifest_Jobs.${index}.airport_of_departure`}/>
          </Col>      
        </Row>
      </Col>
      <Col md={6} >
        <Row>
          <Col md={6}>
            <InputComp control={control} register={register} label={"Refrence Number"} name={`Manifest_Jobs.${index}.refrence_number`}/>
          </Col>      
          <Col md={6}>
            <InputComp control={control} register={register} label={"Optional Shipping Information"} name={`Manifest_Jobs.${index}.optional_shipping_information`}/>
          </Col>
        </Row>
      </Col>
    </Row>

    <Row className="mt-2" >
    <Col md={6} >
    <Row>
    <Col md={2} className=" m-0">
    <InputComp control={control} register={register} label={"To"} name={`Manifest_Jobs.${index}.to`}/>
    </Col>
    <Col md={6} className="p-0 m-0">
    <InputComp control={control} register={register} label={"By First Carrier"} name={`Manifest_Jobs.${index}.by_first_carrier`}/>
    </Col>
    <Col md={1} className="p-0 m-0">
    <InputComp control={control} register={register} label={"To"} name={`Manifest_Jobs.${index}.to1`}/>
    </Col>
    <Col md={1} className="p-0 m-0">
    <InputComp control={control} register={register} label={"By"} name={`Manifest_Jobs.${index}.by1`}/>
    </Col>
    <Col md={1} className="p-0 m-0">
    <InputComp control={control} register={register} label={"To"} name={`Manifest_Jobs.${index}.to2`}/>
    </Col>
    <Col md={1} className="p-0 m-0">
    <InputComp control={control} register={register} label={"By"} name={`Manifest_Jobs.${index}.by2`}/>
    </Col>      
    </Row>
    </Col>

    <Col md={6} >
    <Row>
    <Col md={2}>
    <InputComp control={control} register={register} label={"Currency"} name={`Manifest_Jobs.${index}.currency`}/>
    </Col>  
    <Col md={1} className="p-0">
    <InputComp control={control} register={register} label={"CHGS"} name={`Manifest_Jobs.${index}.chgs`}/>
    </Col>
    <Col md={1} className="p-0">
    <InputComp control={control} register={register} label={"PPD"} name={`Manifest_Jobs.${index}.ppd`}/>
    </Col>
    <Col md={1} className="p-0">
    <InputComp control={control} register={register} label={"COLL"} name={`Manifest_Jobs.${index}.coll`}/>
    </Col>
    <Col md={1} className="p-0">
    <InputComp control={control} register={register} label={"PPD"} name={`Manifest_Jobs.${index}.ppd2`}/>
    </Col>
    <Col md={1} className="p-0">
    <InputComp control={control} register={register} label={"COLL"} name={`Manifest_Jobs.${index}.coll2`}/>
    </Col>
    <Col md={6} >
    <InputComp control={control} register={register} label={"Declared Value Of Carriage"} name={`Manifest_Jobs.${index}.declared_value_carriage`}/>
    </Col>
    <Col md={6} >
    <InputComp control={control} register={register} label={"Declared Value Of Custom"} name={`Manifest_Jobs.${index}.declared_value_customs`}/>
    </Col>

    </Row>
    </Col>
    </Row>

    <Row className="mt-2" >
    <Col md={6} >
    <Row>
    <Col md={6}>
    <InputComp control={control} register={register} label={"Airport of Destination"} name={`Manifest_Jobs.${index}.airport_of_destination`}/>
    </Col>
    <Col md={3}>
    <InputComp control={control} register={register} label={"Requested Flight"} name={`Manifest_Jobs.${index}.requested_flight`}/>
    </Col>
    <Col md={3}>
    <DateComp control={control} register={register} label={"Requested Flight Date"} name={`Manifest_Jobs.${index}.requested_flight_date`}/>
    </Col>      
    </Row>
    </Col>

    <Col md={6} >
    <Row>
    <Col md={3}>
    <InputComp control={control} register={register} label={"Amount Of Insurance"} name={`Manifest_Jobs.${index}.amount_of_insurance`}/>
    </Col>  
    <Col md={9} style={{lineHeight:"19px"}}>
    INSURANCE - If carrier offers insurance and such insuranc is requested in accordance with the conditions there of, indicate amount to be insured in figures in box marked &quot;Amount of Insurance&quot;.
    </Col>

    </Row>
    </Col>
    </Row>

    <Row className="mt-2" >
    <Col md={9}>
    <TextAreaComp control={control} register={register} label={"Handing Information"} name={`Manifest_Jobs.${index}.handing_information`}/>
    </Col>
    <Col md={3}>
    <TextAreaComp control={control} register={register} label={"SCI"} name={`Manifest_Jobs.${index}.sci`}/>
    </Col>
    </Row>

    <Row className="mt-2" >
    <Col md={2}>
      <InputNumComp control={control} register={register} label={"No Of Pieces RCP"} name={`Manifest_Jobs.${index}.no_of_pc`}/>
    </Col>
    <Col md={1}>
      <InputNumComp control={control} register={register} label={"G Weight"} name={`Manifest_Jobs.${index}.goross_wt`}/>
    </Col>
    <Col md={1}>
      <InputComp control={control} register={register} label={"KG / LB"} name={`Manifest_Jobs.${index}.kg`}/>
    </Col>
    <Col md={1}>
      <InputComp control={control} register={register} label={"Rate Class"} name={`Manifest_Jobs.${index}.rate_class`}/>
    </Col>
    <Col md={1}>
      <InputComp control={control} register={register} label={"Commodity"} name={`Manifest_Jobs.${index}.commodity_no`}/>
    </Col>
    <Col md={2}>
      <InputNumComp control={control} register={register} label={"Chargeable Weight"} name={`Manifest_Jobs.${index}.chargeable_weight`}/>
    </Col>
    <Col md={1}>
      <InputNumComp control={control} register={register} label={"Rate/Chrg"} name={`Manifest_Jobs.${index}.rate`}/>
    </Col>
    <Col md={1}>
      <InputComp control={control} register={register} label={"Total"} name={`Manifest_Jobs.${index}.total`}/>
    </Col>
    <Col md={2}>
    <InputComp control={control} register={register} label={"Nature of Goods"} name={`Manifest_Jobs.${index}.nature_of_good`}/>
    </Col>
    </Row>

    <Row className="mt-2" >
    <Col md={4}>
    <Col>
    <Row>
    <Col md={4}>
    <InputComp control={control} register={register} label={"Prepaid"} name={`Manifest_Jobs.${index}.prepaid`}/>
    </Col>
    <Col md={4}>
    <InputComp control={control} register={register} label={"Weight Charge"} name={`Manifest_Jobs.${index}.weight_charge`}/>
    </Col>
    <Col md={4}>
    <InputComp control={control} register={register} label={"Collect"} name={`Manifest_Jobs.${index}.collect`}/>
    </Col>
    </Row>
    <Row>
    <Col md={12}>
    <InputComp control={control} register={register} label={"Valuation Charge"} name={`Manifest_Jobs.${index}.valuation_charge`}/>
    </Col>
    </Row>
    <Row>
    <Col md={12}>
    <InputComp control={control} register={register} label={"Tax"} name={`Manifest_Jobs.${index}.tax`}/>
    </Col>
    </Row>
    </Col>
    </Col>
    <Col md={8}>
    <Col md={12}>
    <TextAreaComp control={control} label={"Other Charges"} name={`Manifest_Jobs.${index}.other_charges`} register={register}/>
    </Col>
    </Col>
    </Row>

    <Row className="mt-2" >
    <Col md={4}>
    <Col md={12}>
    <InputComp control={control} register={register} label={"Total Other Charges Due Agent"} name={`Manifest_Jobs.${index}.total_other_charges_due_agnet`}/>
    </Col>
    <Col md={12}>
    <InputComp control={control} register={register} label={"Total Other Charges Due Carrier"} name={`Manifest_Jobs.${index}.total_other_charges_due_carrier`}/>
    </Col>
    </Col>
    <Col md={8}>
    <Col md={12}>
    <TextAreaComp control={control} label={""} name={`Manifest_Jobs.${index}.shipper_certifies`} register={register}/>
    </Col>
    <Col md={12}>
      <div style={{textAlign:"center"}}>
      Signature Of Shipper Or His Agent
      </div>
    </Col>
    </Col>
    </Row>

    <Row className="mt-2" >
    <Col md={4}>
    <Row>
    <Col md={6}>
    <InputComp control={control} register={register} label={"Total Prepaid"} name={`Manifest_Jobs.${index}.total_prepaid`}/>
    </Col>
    <Col md={6}>
    <InputComp control={control} register={register} label={"Total Collect"} name={`Manifest_Jobs.${index}.total_collect`}/>
    </Col>
    </Row>
 
    <Row >
    <Col md={6}>
    <InputComp control={control} register={register} label={"Currency Conversion"} name={`Manifest_Jobs.${index}.currency_conversion_rate`}/>
    </Col>
    <Col md={6}>
    <InputComp control={control} register={register} label={"CC Charges in Dest Currency"} name={`Manifest_Jobs.${index}.cc_charges_dest_currency`}/>
    </Col>
    </Row>
    </Col>

    <Col md={8}>
    <Row>
    <Col md={3}>
    <DateComp control={control} label={"Excluded On Date"} name={`Manifest_Jobs.${index}.excluded_on_date`} register={register} width={"100%"}/>
    </Col> 
    <Col md={3}>
    <InputComp control={control} label={"At(place)"} name={`Manifest_Jobs.${index}.at2`} register={register}/>
    </Col> 
    <Col md={6}>
    <InputComp control={control} label={"Signature Of Issuing Carrieres And It's Agent"} name={`Manifest_Jobs.${index}.issuing_agent`} register={register}/>
    </Col> 
    </Row>
    </Col>
    </Row>

    <Row className="mt-2" >
    <Col md={4}>
    <InputComp control={control} register={register} label={"Charges At Destination"} name={`Manifest_Jobs.${index}.charges_at_destination`}/>
    </Col>
    <Col md={4}>
    <InputComp control={control} register={register} label={"Total Collect Charges"} name={`Manifest_Jobs.${index}.total_collect_charges`}/>
    </Col>    
   
    </Row>
  </Col>
  </div>
  );
};

export default Modal;
