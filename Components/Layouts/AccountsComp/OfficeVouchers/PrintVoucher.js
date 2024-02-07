import React, {useEffect, useLayoutEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ReactToPrint from "react-to-print";

const PrintVoucehr = ({ state, companyId }) => {

  const border = "1px solid black";
  let inputRef = useRef(null);

  const lineHeight = (x) => {
    console.log(Math.ceil(x.length / 69))
    return Math.ceil(x.length / 69) * 22
  }

  let companyName = () => {
    if (companyId == 1) {
      return "Sea Net Shipping";
    } else if (companyId == 2) {
      return "Cargo linkers";
    } else if (companyId == 3) {
      return "Air Cargo Service";
    }
  };

  return (
  <div>
    <ReactToPrint content={() => inputRef} trigger={() => (<div className="div-btn-custom text-center p-2 px-4">Print</div>)} />
    <div className="d-none px-4">
    <div style={{ paddingLeft:"60px", paddingRight:"40px"}} ref={(res) => (inputRef = res)}>
      {/* heading */}
      <div style={{ padding:"2rem", display:"flex", flexDirection: "column", alignItems: "center" }}>
        <h3 style={{ textAlign:"center", borderBottom:border }}>
          {companyName()}
        </h3>
        <p style={{ textAlign:"center" }}>FREIGHT, FORWARDING & SHIPPING AGENTS</p>
        <p style={{textAlign:"center", borderBottom:border, marginTop:"-10px" }}>
          Cash Payment Voucher
        </p>
      </div>
      {/* voucher no */}
      <div className="px-1" style={{ height: "20px", marginTop: "-40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p>
            V.R No:{" "}
            <span style={{ width: "100px", borderBottom: border, height: "20px" }}>
              {state.Voucher?.voucher_Id}
            </span>
          </p>{" "}
        </div>
        <div>
          <p>
            DATE :
            <span
              style={{
                width: "100px",
                borderBottom: border,
                height: "20px",
              }}
            >
              {state?.createdAt?.slice(0, 10)}
            </span>
          </p>{" "}
        </div>
      </div>
      {/* vouicher details */}
      <div style={{border:border}}>
        <Row className='p-0 m-0'>
          <Col md={10} style={{border:border, paddingTop:33, paddingRight:0}}>
            <div style={{display:'inline-block', width:'12%'}}>PAID TO:</div>
            <div style={{borderBottom:border, display:'inline-block', width:'88%'}}></div>
            <br/>
            <div style={{display:'inline-block', width:'22%'}}>REQUESTED BY :</div>
            <div style={{borderBottom:border, display:'inline-block', width:'78%'}}></div>
            <br/>
            {!state.descriptive &&
            <>
              <div style={{display:'inline-block', width:'15%'}}>ON A/C OF:</div>
              <p style={{textDecoration:'underline', whiteSpace:'pre-wrap'}}>{state.onAcOf}</p>
            </>
            }
            <>
              {state.descriptive && <div style={{display:'inline-block', width:'15%'}}>ON A/C OF:</div>}
              {state.descriptive && state.list.map((x, i)=>{
              return(
                <div  style={{borderBottom:border, display:'inline-block', width:i==0?"85%":"100%"}} key={i}> 
                  <div style={{marginLeft:i==0?30:115}}>{x.item} </div>
                </div>
              )})}
            </>
          </Col>
          <Col md={2} style={{border:border}} className='px-0' >
            <div className='text-center' style={{borderBottom:border}}>Amount</div>
            <div className='text-center' style={{borderBottom:border, borderTop:border}}>Rs</div>
            <div style={{marginTop:30}} />
            <>
            {state.descriptive && state.list.map((x, i)=>{
              return(
                
                <div style={{borderBottom:border, display:'inline-block', width:"100%"}} key={i}> 
                  <div className='text-center' style={{height: ` ${lineHeight(x.item)}px `}}>{x.amount} </div>
                </div>
              )
            })}
            </>
            {state.descriptive && 
            <div style={{borderTop:border, display:'inline-block', width:"100%", marginBottom:"0"}} > 
              <div className='text-center'>{state.amount}</div>
            </div>}
          </Col>
          {!state.descriptive && 
          <Row className="p-0 m-0">
            <div style={{borderBottom:border, display:'inline-block', width:"83.2%"}}></div>
            <div style={{borderBottom:border, borderLeft:"2px solid black", display:'inline-block', width:"16.8%"}} > 
              <div className='text-center'>{state.amount}</div>
            </div>
          </Row>
          }
          <Row className='d-flex justify-content-around' style={{height:"80px"}}>
            <Col style={{borderTop:border, maxWidth:"150px", alignSelf:"flex-end"}}>PREPARED BY</Col>
            <Col style={{borderTop:border, maxWidth:"150px", alignSelf:"flex-end"}}>APPROVED BY</Col>
            <Col style={{borderTop:border, maxWidth:"150px", alignSelf:"flex-end"}}>RECIEVED BY</Col>
          </Row>
        </Row>
      </div>
    </div>
    </div>
    </div>
  );
};
export default PrintVoucehr