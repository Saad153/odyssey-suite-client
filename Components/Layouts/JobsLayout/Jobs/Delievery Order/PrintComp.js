import React, { useRef, useEffect } from "react";
import { Col, Row, Table } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import moment from "moment";

const DoPrint = ({ allValues, state, companyId }) => {
  const data = state.selectedRecord;
  let importer = data.consigneeId && state.fields.party.consignee?.filter((x) => x.id == data.consigneeId);
  let commodity = data.commodityId && state.fields.commodity?.filter((x) => x.id == data.commodityId);
  let shipper = data.shipperId && state.fields.party.shipper?.filter((x) => x.id == data.shipperId);
  console.log(allValues)
  console.log(data)
  const paraStyles = { lineHeight: 1.2, fontSize: 11 }
  const Line = () => <div style={{ backgroundColor: "grey", height: 1, position: 'relative', top: 12 }}></div>

  useEffect(() => {

  }, [])

  return (
    <>
      {data.jobNo ?<div className='pb-5 px-5 pt-4'>
        <Row>
          <Col md={4} className='text-center'>
            {companyId == "1" ?
              <>
                <img src={'/seanet-logo.png'} style={{ filter: `invert(0.5)` }} height={100} />
                <div>SHIPPING & LOGISTICS</div>
              </>
              :
              <>
                <img src={'/aircargo-logo.png'} style={{ filter: `invert(0.5)` }} height={100} />
              </>
            }
          </Col>
          <Col className='mt-4'>
            <div className='text-center '>
              <div style={{ fontSize: 20 }}><b>{companyId == "1" ? "SEA NET SHIPPING & LOGISTICS" : "AIR CARGO SERVICES"}</b></div>
              <div style={paraStyles}>House# D-213, DMCHS, Siraj Ud Daula Road, Karachi</div>
              <div style={paraStyles}>Tel: 9221 34395444-55-66   Fax: 9221 34385001</div>
              <div style={paraStyles}>Email: {companyId == "1" ? "info@seanetpk.com" : "info@acs.com.pk"}   Web: {companyId == "1" ? "www.seanetpk.com" : "www.acs.com.pk"}</div>
              <div style={paraStyles}>NTN # {companyId == "1" ? "8271203-5" : "0287230-7"}</div>
            </div>
          </Col>
        </Row>

        <Row className="my-2">
          <Col md="4"><Line /></Col>
          <Col md="4">
            <div className="text-center fs-15" >
              <strong>Delivery Order</strong>
            </div>
          </Col>
          <Col md="4"><Line /></Col>
        </Row>

        <Row className="my-2">
          <Col md="12">
            <label className=' mt-2 me-2 font-bold fs-10'>Delivery Req To :</label>
            <input
              readOnly
              style={{ outline: "none", width: "85%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={allValues.deliveryReqTo ? allValues.deliveryReqTo : ""}
            />
          </Col>
        </Row>

        <Row className="my-2">
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>Date :</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={allValues.date ? moment(allValues.date).format("MMMM Do YYYY") : ""}
            />
          </Col>
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>No :</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={data.jobNo ? data.jobNo : ""}
            />
          </Col>
        </Row>

        <Row style={{ marginTop: "40px" }}>
          <Col md="12">
            <label className=' mt-2 me-2 font-bold fs-10'>Please Deliver to Mrs/Messers <br /> Consignment Described here in :</label>
            <input
              readOnly
              style={{ outline: "none", width: "70%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={importer && importer[0]?.name}
            />
          </Col>
        </Row>

        <Row className="my-2">
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>MAWB No :</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={data.Bl && data.Bl.mbl ? data?.Bl?.mbl : ""}
            />
          </Col>
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>{(data.operation == "SI" || data.operation == "AI")
              ? "Arrival Date :" : "Departure Date"
            }</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={
                (data.operation == "SI" || data.operation == "AI")
                  ? data.arrivalDate ? moment(data?.arrivalDate).format("MMMM Do YYYY") : ""
                  : data.arrivalDate ? moment(data?.etd).format("MMMM Do YYYY") : ""
              }
            />
          </Col>
        </Row>

        <Row className="my-2">
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>HAWB No :</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={data?.Bl && data.Bl.hbl ? data.Bl.hbl : ""}
            />
          </Col>
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>IGM #</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
            // defaultValue={voucherData.voucher_Id}
            />
          </Col>
        </Row>

        <Row className="my-2">
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>No of Pkg :</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={data.pcs ? data.pcs : ""}
            />
          </Col>
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>Flight #</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={data.flightNo ? data.flightNo : ""}
            />
          </Col>
        </Row>

        <Row className="my-2">
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>Weight :</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={data.weight ? data.weight : ""}
            />
          </Col>
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>Index #</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={allValues.indexNo ? allValues.indexNo : ""}
            />
          </Col>
        </Row>

        <Row className="my-2">
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>Contents :</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={commodity && commodity[0]?.name}
            />
          </Col>
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>Original D/O No :</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={allValues.doNo ? allValues.doNo : ""}
            />
          </Col>
        </Row>

        <Row className="my-2">
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>Shipper :</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={shipper && shipper[0].name}
            />
          </Col>
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>Sub Index :</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={"01"}
            />
          </Col>
        </Row>

        <Row className="my-2">
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>Commodity :</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
              defaultValue={commodity && commodity[0]?.name}
            />
          </Col>
          <Col md="6">
            <label className=' mt-2 me-2 font-bold fs-10'>Shade No :</label>
            <input
              readOnly
              style={{ outline: "none", width: "60%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
            // defaultValue={voucherData.voucher_Id}
            />
          </Col>
        </Row>

        <Row className="my-2">
          <Col md="12">
            <label className=' mt-2 me-2 font-bold fs-10'>Remarks :</label>
            <input
              readOnly
              style={{ outline: "none", width: "80%" }}
              type='text'
              className='border-top-0 border-start-0 border-end-0 fs-10'
            // defaultValue={voucherData.voucher_Id}
            />
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <span className="fs-10">Yours Faithfully,</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span className="fs-12">
              <strong>
                {companyId == "1" ? "SEA NET SHIPPING & LOGISTICS" : "AIR CARGO SERVICE"}
              </strong>
            </span>
          </Col>
        </Row>

        <Row style={{ marginTop: "30px" }}>
          <Col>
            <span className="fs-12"><strong>IMPORT DEPARTMENT</strong></span><br />
            <span className="fs-10" style={{ marginTop: "-10px" }}>
              {"(Authorize Signature & Seal)"}
            </span>
          </Col>
        </Row>

      </div > : ""}
    </>
  );
};

export default DoPrint;
