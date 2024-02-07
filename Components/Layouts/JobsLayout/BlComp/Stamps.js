import React, { useRef, useEffect, useState, useReducer } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Radio } from "antd";
import { Modal } from "antd";
import { groups, stamps } from "./groupData";
import { CloseCircleOutlined } from "@ant-design/icons";
 import SelectSearchComp from "../../../Shared/Form/SelectSearchComp";
import BlPrint from "./BlPrint";

const Stamps = ({ state, control, register, useWatch, handleSubmit, fields, append, remove, onDelete, errors }) => {

  let inputRef = useRef(null);
  const [borders, setBorders] = useState(true);
  const allValues = useWatch({ control });
  const [value, setValue] = useState(1);
  const [visibleStamps, setVisibleStamps] = useState(false);
  const [checkModal, setCheckModal] = useState(false);
  const [cbm, setCbm] = useState(false);
  const [grossWeight, setgrossWeight] = useState(false);
  const [netWeight, setNetWeight] = useState(false);
  const [containerData, setcontainerData] = useState(false);
  const [formE, setFormE] = useState(false);
 
  const onChange = (e) => {
    e.target.value == 2 ? setBorders(true) : setBorders(false);
    setValue(e.target.value);
  };
  const Stamp = useWatch({ control, name: "stamps" });
  const onSubmit = () => {
    setVisibleStamps(false);
  };

  const border = borders ? "1px solid silver" : "1px solid white";
  const line = borders ? "silver" : "white";
  const heading = borders ? "grey-txt" : "wh-txt";
  return (
  <div style={{ height: 600, overflowY: "auto", overflowX: "hidden" }}>
    <div style={{ display: "flex", flexDirection:"column", gap:"1rem" }}>
      <Radio.Group onChange={onChange} value={value}>
        <Radio value={2}>Print On Blank Paper</Radio>
        <Radio value={1}>Print</Radio>
      </Radio.Group>
      <div style={{display:"flex", gap:"2rem"}}>
        <button type="button" onClick={() => setVisibleStamps(true)} className="btn-custom">Stamps</button>
        <Modal open={visibleStamps}
          width={"80%"}
          onOk={() => setVisibleStamps(false)}
          onCancel={() => setVisibleStamps(false)}
          footer={false}
          maskClosable={false}
          title={`View Stamps`}
        >
          <button type="button" className="btn-custom mb-3" style={{ width: "170px" }} onClick={()=>append()}> Add </button>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Table className="tableFixHead" bordered style={{ fontSize: 14 }}>
              <thead>
                <tr className="">
                  <th className="text-center ">S.No</th>
                  <th className="text-center ">Code</th>
                  <th className="text-center ">Stamp</th>
                  <th className="text-center ">Stamp Group</th>
                  <th className="text-center ">Delete</th>
                </tr>
              </thead>
              <tbody>
                {fields?.map((field, index) => {
                  return (
                    <tr key={field.id}>
                      <td>{index}</td>
                      <td>{Stamp ? Stamp[index]?.code : ""}</td>
                      <td>
                        <SelectSearchComp name={`stamps.${index}.code`} register={register} placeholder="Stamps"
                          options={stamps.map((stamp) => ({ id: stamp.value, name: stamp.label }))} control={control}
                        />
                      </td>
                      <td>
                        <SelectSearchComp name={`stamps.${index}.stamp_group`}  options={groups?.map((x) => { return { id: x?.value, name: x?.label }})}
                          style={{ width: "80px !important" }} register={register} control={control}
                        />
                      </td>
                      <td className="text-center">
                        <CloseCircleOutlined className="cross-icon" onClick={() => ( remove(index), onDelete(Stamp[index]?.id))} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <button className="btn-custom mb-3" type="submit">
              Submit
            </button>
          </form>
        </Modal>
      </div>
      <div className="d-flex flex-wrap flex-column">
      <h4>Hide</h4>
        <div style={{width:"450px", display:"flex", flexWrap:"wrap"}}>
          <div className="form-check">
          <input className="form-check-input" type="checkbox" value="" id="CBM" onClick={() => setCbm(!cbm)}/>
          <label className="form-check-label" htmlFor="CBM">CBM  </label>
          </div>
          <div className="form-check">
          <input className="form-check-input" type="checkbox" value="" id="grossWeight" onClick={() => setgrossWeight(!grossWeight)} />
          <label className="form-check-label" htmlFor="grossWeight">Gross Weight</label>
          </div>  
          <div className="form-check">
          <input className="form-check-input" type="checkbox" value="" id="netWeight"  onClick={() => setNetWeight(!netWeight)}/>
          <label className="form-check-label" for="netWeight">Net Weight</label>
          </div>
          <div className="form-check">
          <input className="form-check-input" type="checkbox" value="" id="containerData" onClick={() => setcontainerData(!containerData)} />
          <label className="form-check-label" htmlFor="containerData">Container Data</label>
          </div>
          <div className="form-check">
          <input className="form-check-input" type="checkbox" value="" id="formEno" onClick={() => setFormE(!formE)} />
          <label className="form-check-label" htmlFor="formEno">Form E No And Data</label>
          </div>
        </div>
      </div>
    </div>
    <BlPrint state={state} allValues={allValues} border={border} line={line} borders={borders} heading={heading} inputRef={inputRef} stamps={stamps} cbm={cbm} grossWeight={grossWeight} netWeight={netWeight}  containerData={containerData} formE={formE}/>
  </div>
)};

export default Stamps;