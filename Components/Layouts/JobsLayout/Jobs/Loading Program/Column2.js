import React from 'react'
import SelectSearchComp from "../../../../Shared/Form/SelectSearchComp";
import InputComp from "../../../../Shared/Form/InputComp";
import TextAreaComp from "../../../../Shared/Form/TextAreaComp";
import RadioComp  from "../../../../Shared/Form/RadioComp";
import { landigFlagStatus  } from "./states";
import ports from "../../../../../jsonData/ports.json"

const Column2 = ({register, control, state}) => {
  return (
    <div style={{ width: "30%" }}>
    <div className="fs-12 ">
      <InputComp name="berth" register={register} label="Berth" control={control} width={"100%"} />
    </div>
    <div className="fs-12 mt-1">
      <label>Via Port </label>
      <div className="d-flex justify-content-between">
        <InputComp name="viaPort" register={register} control={control} width={"100%"} />
      </div>
    </div>
    <div className="fs-12 mt-1">
      <label>Container Info </label>
      <TextAreaComp name="containerInfo" register={register} control={control} />
    </div>

    <div className="fs-12 mt-1">
      <label> Port of Reciept </label>
      <div className="d-flex justify-content-between">
        <SelectSearchComp name="portOfReciept" options={ports.ports}
          register={register} control={control} width={"100%"}
        />

      </div>
    </div>
    <div className="fs-12 mt-1">
      <label>Special Instructions </label>
      <TextAreaComp
        name="instruction"
        register={register}
        control={control}
      />
    </div>
    <div className="fs-12 mt-1">
      <label>Cargo Status </label>
      <p style={{ border: "1px solid silver", width: "100%", height: "32px", display:"flex", alignItems:"center", paddingLeft:10 }}>
        {state.selectedRecord.subType}
      </p>
    </div>
    <div className="fs-12 mt-1">
      <label>Landing Flag </label>
      <SelectSearchComp name="loadingFlag" options={landigFlagStatus.map((x) => x)}
        register={register} control={control} width={"100%"}
      />
    </div>
    <div className="fs-12 mt-1">
      <RadioComp register={register} name='status' control={control} label='Status'
        options={[
            { label: "Ok", value: "Ok" },
            { label: "Cancel", value: "Cancel" },
        ]} />
    </div>
    <div className="fs-12 mt-1">
      <label>Cost Center </label>
      <p style={{ border: "1px solid silver", width: "100%", height: "32px", display:"flex", alignItems:"center", paddingLeft:10 }}>
        {state.selectedRecord.costCenter}
      </p>
    </div>
    <div className="fs-12 mt-1">
      <label>Alloc Available </label>
      <SelectSearchComp name="allocAvailable" options={[{id:"Yes", value:"Yes"},{id:"No", value:"No"}]}
        register={register} control={control} width={"100%"}
      />
    </div>
    <div className="fs-12 mt-1">
      <label>Cont Available </label>
      <SelectSearchComp name="contAvailable" options={[{id:"Yes", value:"Yes"},{id:"No", value:"No"}]}
        register={register} control={control} width={"100%"}
      />
    </div>
  </div>
  )
}

export default Column2