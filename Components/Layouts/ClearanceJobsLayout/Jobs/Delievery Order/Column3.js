import React from 'react'
import InputComp from "../../../../Shared/Form/InputComp";
import TextAreaComp from "../../../../Shared/Form/TextAreaComp";
import RadioComp  from "../../../../Shared/Form/RadioComp";
import ports from "../../../../../jsonData/ports.json"
import { Col, Row } from 'react-bootstrap';
import SelectSearchComp from "../../../../Shared/Form/SelectSearchComp";
import CheckGroupComp from "../../../../Shared/Form/CheckGroupComp";
import DateComp from "../../../../Shared/Form/DateComp";
import TimeComp from "../../../../Shared/Form/TimeComp";import { Spinner } from 'react-bootstrap';


const Column3 = ({  register, control, state, handleSubmit, onSubmit, load}) => {
  return (
      <Col className='fs-12'>
      <Col md={6}>

      <TextAreaComp width="100%" name="acknoledgeEmails" control={control} register={register} label="Acknoledge Email"/>
      <TextAreaComp width="100%" name="endoresementInstruction" control={control} register={register} label="Endoresement Instruction"/>
      </Col>
      <Col md={8} >
      <CheckGroupComp register={register} name='type' control={control}
      options={[{label:"Clearing Agent", value:"clearingAgent"}, 
      {label:"Consignee", value:"consignee"},
      {label:"Client", value:"client"},
      {label:"CC To Admin", value:"cc_to_admin"},
      {label:"CC To Me", value:"cc_to_me"},

      ]}/>
      </Col>
  </Col>
  )
}

export default Column3