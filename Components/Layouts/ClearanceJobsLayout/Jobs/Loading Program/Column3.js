import React from 'react'
import DateComp from "../../../../Shared/Form/DateComp";
import InputComp from "../../../../Shared/Form/InputComp";
import TextAreaComp from "../../../../Shared/Form/TextAreaComp";
import RadioComp  from "../../../../Shared/Form/RadioComp";
import { Spinner } from 'react-bootstrap';


const Column3 = ({  register, control, state, load}) => {
  return (
    <div style={{ width: "30%" }}>
    <div className="fs-12" style={{ width: "40%", display: "flex" }}>
      <div>
        <label>SOB Date </label>
        <DateComp register={register} name="sobDate" control={control} width="100%" />
      </div>
    </div>
    <div className="fs-12 mt-1">
      <InputComp name="containerSplit" register={register} label="Container Split" control={control} width={"100%"} />
    </div>
    <div className="fs-12 mt-1">
      <InputComp name="blRequired" register={register} label="BL Required" control={control} width={"100%"} />
    </div>
    <div className="fs-12 mt-1">
      <RadioComp register={register} name='containerWt' control={control} label='Container WT'
        options={[
            { label: "Estimated", value: "Estimated" },
            { label: "Actual", value: "Actual" },
        ]} />
    </div>
    <div className="mt-1">
      <label className='fs-12'> Custom Clearance</label>
      <div className="d-flex justify-content-between">
        <div style={{border:"1px solid silver", padding:6, width:"100%"}}>
           {state?.selectedRecord?.customAgentId && state.fields?.vendor?.chaChb[state.fields.vendor.chaChb.findIndex((x)=>x.id==state.selectedRecord.customAgentId)]?.name} 
        </div>
      </div>
    </div>
    <div className="fs-12 mt-1">
      <label> Container Pickup</label>
      <div className="d-flex justify-content-between">
        <InputComp name="containerPickup" register={register} control={control} width={"100%"} />
      </div>
    </div>
    <div className="mt-1">
      <label className='fs-12'> Port Of Loading</label>
      <div className="d-flex justify-content-between">
      <div style={{border:"1px solid silver", padding:6, width:"100%"}}>
           {state.selectedRecord.pol}
        </div>
      </div>
    </div>
    <div className="fs-12 d-flex justify-content-between mt-1">
      <div style={{ width: "40%" }}>
        <label> Container Temprature </label>
        <InputComp register={register} name="containerTemp" control={control} />
      </div>
      <div style={{ width: "50%" }}>
        <label> Vent</label>
        <InputComp register={register} name="vent" control={control} width="100%" />
      </div>
    </div>

    <div className="d-flex mt-1">
      <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
        <label className="form-check-label" for="flexCheckDefault">
          Text 1
        </label>
      </div>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" />
        <label className="form-check-label" for="flexCheckChecked">
          Loading Terms
        </label>
      </div>
      <button type="button" className="btn-custom">
        Create
      </button>
    </div>
    <div className="fs-12">
      <label>Loading Terms </label>
      <TextAreaComp  name={`loadingTerms`} register={register} control={control} />
    </div>
    <div className="fs-12 mt-1">
      <label>Text 1 </label>
      <TextAreaComp name="text1" register={register} control={control} />
    </div>

    <br/>
  </div>
  )
}

export default Column3