import React from 'react'
import {  Row, Col } from 'react-bootstrap';
import SelectSearchComp from "../../../../Shared/Form/SelectSearchComp";
import DateComp from "../../../../Shared/Form/DateComp";
import TimeComp from "../../../../Shared/Form/TimeComp";
import InputComp from "../../../../Shared/Form/InputComp";
 

const Column1 = ({register, control, state}) => {
  return (
    <div style={{ width: "30%" }}>
    <div className='fs-12'>Job No # :</div>
    <div style={{border:'1px solid silver', padding:"7px 1px 4px 4px"}}>{state.selectedRecord.jobNo}</div>
  <Row className="fs-12 mt-1">
    <Col md={8}>
    <label>Local Custom</label>
      <SelectSearchComp name={`localCustom`} 
        register={register} control={control} width={"100%"} 
        options={[{id:"AFU-Jinnah Terminal-Karachi", name:"AFU-Jinnah Terminal-Karachi"}, {id:"PKKHI", name:"Karachi"}]} 
      />
    </Col>
    <Col md={4}>
      <div>Wharf :</div>
      <SelectSearchComp options={[{id:"EAST WHARF", name:"EAST WHARF"}, {id:"BAY WEST", name:"BAY WEST"}, {id:"QFS", name:"QFS"}]}
        register={register} control={control} width={"100%"} name="wharf" 
      />
    </Col>
  </Row>
  <div className="mt-1">
    <label className="fs-12"> Port of Discharge </label>
    <div style={{width:"full", padding:"5px 9px", height: "32px", border:"1px solid silver"}}>
     {state.selectedRecord.pod}
    </div>
  </div>
  <div className="fs-12  mt-1">
    <label> Loading Terminal </label>
    <div className="d-flex align-items-center justify-content-between">
      <SelectSearchComp name={`loadingTerminal`} width={"100%"}
        options={[{id:"QICT", name:"QICT"}, {id:"PICT", name:"PICT"}, {id:"SAPT", name:"SAPT"}, {id:"KICT", name:"KICT"}]}
        register={register}
        control={control}
      />
    </div>
  </div>
  <div className="fs-12  mt-1">
    <label> Discharge Terminal </label>
    <div className="d-flex align-items-center justify-content-between">
      <InputComp name="dischargeTerminal" register={register} control={control} width={"100%"} />
    </div>
  </div>
  <div className="fs-12 d-flex justify-content-between  mt-1">
    <div style={{ width: "40%" }}>
      <label> Loading Date </label>
      <DateComp register={register} name="loadingDate" control={control} />
    </div>
    <div style={{ width: "50%" }}>
      <label> Book # </label>
      <InputComp register={register} name={`book`} control={control} />
    </div>
  </div>
  <div className="fs-12 d-flex justify-content-between  mt-1">
    <div style={{ width: "40%" }}>
      <label> Loading Time </label>
      <TimeComp register={register} name="loadingTime" control={control} />
    </div>
    <div style={{ width: "50%" }}>
      <label> Gate Pass </label>
      <InputComp register={register} name="gatePass" control={control} />
    </div>
  </div>

  <div className="fs-12 d-flex justify-content-between mt-1">
    <div style={{ width: "40%" }}>
      <label> Arrival Date </label>
      <DateComp register={register} name="arrivalDate" control={control} />
    </div>
    <div style={{ width: "50%" }}>
      <label> Gate Pass Date </label>
      <DateComp register={register} name="gatePassDate" control={control} width="100%" />
    </div>
  </div>

  <div className="fs-12 d-flex justify-content-between mt-1">
    <div style={{ width: "40%" }}>
      <label> CRO Issue Date </label>
      <DateComp
        register={register}
        name="croIssueDate"
        control={control}
      />
    </div>
    <div style={{ width: "50%" }}>
      <label> Letter </label>
      <InputComp register={register} name="letter" control={control} width="70%" />
    </div>
  </div>

  <div className="fs-12 d-flex justify-content-between mt-1">
    <div style={{ width: "40%" }}>
      <label> Expiry Date </label>
      <DateComp
        register={register}
        name="expiryDate"
        control={control}
      />
    </div>
    <div style={{ width: "50%" }}>
      <label> CRO # </label>
      <InputComp register={register} name="cro" control={control} width="70%" />
    </div>
  </div>
  <div className="fs-12 d-flex justify-content-between mt-1">
    <div style={{ width: "40%" }}>
      <label> EGM #</label>
      <InputComp width={"50%"} register={register} name="egm" control={control} />
    </div>
    <div style={{ width: "50%" }}>
      <label> Validity Date </label>
      <DateComp register={register} name="validityDate" control={control} width="100%" />
    </div>
  </div>
  <div className="fs-12 mt-1" style={{ width: "40%", display: "flex" }}>
    <div>
      <label>ETD </label>
      <DateComp register={register} name="etd" control={control} />
    </div>
  </div>
  <div className="fs-12 d-flex justify-content-between mt-1">
    <div style={{ width: "40%" }}>
      <span> Cut Off Date </span>
      <p style={{ border: "1px solid silver", width: "100%", height: "32px", display:"flex", alignItems:"center", paddingLeft:10 }}>
        {state.selectedRecord.cutOffDate.slice(0, 10)}
      </p>
    </div>
    <div style={{ width: "50%" }}>
      <label> Cut Off Time </label>
      <p style={{ border: "1px solid silver", width: "100%", height: "32px", display:"flex", alignItems:"center", paddingLeft:10 }}>
        {state.selectedRecord.cutOffTime.slice(0, 10)}
      </p>
    </div>
  </div>
</div>
  )
}

export default Column1