import React from 'react'
import { Checkbox, Radio } from "antd";
import ports from '../../../../jsonData/ports'
import InputComp from "../../../Shared/Form/InputComp";
import DateComp from "../../../Shared/Form/DateComp";
import { Col, Row } from "react-bootstrap";  
import SelectSearchComp from "../../../Shared/Form/SelectSearchComp";
import moment from "moment";

const JobList = ({register, data, onChange, control ,onsubmit, handleSubmit,
    errors ,sortBy, setDg, setGroupBy, setApproved,
     groupBy, dg ,approved, setSortBy}) => {
 
  return (
  <>
    <form onSubmit={handleSubmit(onsubmit)}>
    <Col md={6}>
    <Row> 
    <Col>
    <DateComp control={control} register={register} name="from" label={"From"}  width={"100%"}/>
    {errors.from && <div className='error-line'>This Field Is Required*</div>}
    </Col>
    <Col style={{marginLeft:"5px"}}>
    <DateComp control={control} register={register} name="to" label={"To"}  width={"100%"}/>
    {errors.to && <div className='error-line'>This Field Is Required*</div>}  
    </Col>
    </Row>

    <Col className='m-0 p-0'>
    <Col className='' >
      <SelectSearchComp
        width={"100%"}  
        name={"client"}
        register={register}
        control={control}
        label="Client"
        options={data.party?.client.map((x) => ({
          id: x.id,
          name: x.name,
        }))}
        />
    </Col>

    <Col>
      <SelectSearchComp
      width={"100%"}
        name={"shipping_air_line"}
        register={register}
        control={control}
        options={data.vendor_details?.sLine.map((x) => ({id:x.id, name:x.name}))}
        label="Shipping Line"
      />
    </Col>
    <Col>
      <SelectSearchComp
      width={"100%"}
        name={"air_line"}
        register={register}
        control={control}
        options={data.vendor_details?.airLine.map((x) => ({id:x.id, name:x.name}))}
        label="Air Line"
      />
    </Col>

    <Col>
    <SelectSearchComp
      width={"100%"}
        name={"vendor"}
        register={register}
        control={control}
        label="Vendor"
        options={data.vendor?.map((x) => ({
          id: x.id,
          name: `${x.name} (${x.code})`,
        }))}
      />
    </Col>

    <Col>
    <SelectSearchComp
        width={"100%"}
        label={"Final Destination"}
        register={register}
        control={control}
        name="final_destination"
        options={ports.ports.map((x) => ({
          id: x.id,
          name: x.name,
        }))}
      />
    </Col>

    <Col>
    <SelectSearchComp
        width={"100%"}
        name={"overseas_agent"}
        register={register}
        control={control}
        label="Overseas Agent"
        options={data.vendor_details.overseasAgent.map((x) => ({
          id: x.id,
          name: x.name,
        }))}
      />
    </Col>

    <Col>
    <SelectSearchComp
        width={"100%"}
        name={"consignee"}
        register={register}
        control={control}
        label="Consignee"
        options={data.party?.consignee.map((x) => ({
          id: x.id,
          name: x.name,
        }))}
      />
    </Col>

    <Col>
    <SelectSearchComp
        width={"100%"}
        name={"Vessel"}
        register={register}
        control={control}
        label="Vessel"
        options={data.vessel?.map((x) => ({
          id: x.id,
          name: `${x.name} (${x.code})`,
        }))}
      />
    </Col>

    <Col>
    <SelectSearchComp
        width={"100%"}
        name={"clearing_agent"}
        register={register}
        control={control}
        label="Clearing Agent"
        options={data.vendor_details?.chaChb.map((x) => ({
          id: x.id,
          name: `${x.name}`,
        }))}
      />
    </Col>

    <Row className="">
     
      <Col md={4}>
        <InputComp
          name={"HBL"}
          register={register}
          control={control}
          label="HBL"
        />
      </Col>
      <Col md={4}>
        <InputComp
          name={"MBL"}
          register={register}
          control={control}
          label="MBL"
        />
      </Col>
    </Row>
    </Col>

    <Row >
    <Col>
      <h6 className="mt-2">All Job Types</h6>

      <Col>
      <Checkbox.Group
      options={[{label:"Sea Export", value:"export"},{label:"Sea Imports", value:"import"}]}
      onChange={onChange}
    />
      </Col>
    </Col>
    <Col >
      <h6 className="mt-2">Sort By</h6>
      <Col>
        <Radio.Group onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <Col>
            <Radio value={"jobNumber"}>Job Number</Radio>
          </Col>
          <Col>
            <Radio value={"hbl"}>HBL / HAWB </Radio>
          </Col>
          <Col>
            <Radio value={"mbl"}>MBL / MAWB</Radio>
          </Col>
        </Radio.Group>
      </Col>
    </Col>

    <Col>
      <h6 className="mt-2">Group By</h6>
      <Col>
        <Col>
          <Radio.Group onChange={(e) => setGroupBy(e.target.value)} value={groupBy}>
            <Col>
              <Radio value={"ClientId"}>Client</Radio>
            </Col>
            <Col>
              <Radio value={"shippingLineId"}>Air Shipping Line</Radio>
            </Col>
            <Col>
              <Radio value={"vesselId"}>Vessel</Radio>
            </Col>
            <Col>
              <Radio value={"commodityId"}>Commodity</Radio>
            </Col>
          </Radio.Group>
        </Col>
      </Col>
    </Col>
    </Row>

    <Row className="mt-2">
    <Col md={5}>
      <Radio.Group onChange={(e)=> setDg(e.target.value)} value={dg}>
        <Radio value={"all"}>All</Radio>
        <Radio value={"dg"}>DG</Radio>
        <Radio value={"nonGg"}>NonDG</Radio>
      </Radio.Group>
    </Col>
    <Col md={7}>
      <Radio.Group onChange={(e) => setApproved(e.target.value)} value={approved}>
        <Radio value={"all"}>All</Radio>
        <Radio value={"approved"}>Approved</Radio>
        <Radio value={"unUpproved"}>Un Approved</Radio>
      </Radio.Group>
    </Col>
    </Row>
    </Col>
    <button type="submit" className="btn-custom mt-1">Get Jobs</button>
    </form>
  </>
  )
}

export default JobList