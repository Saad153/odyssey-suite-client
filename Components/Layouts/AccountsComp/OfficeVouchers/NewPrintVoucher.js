import React, { useRef } from 'react'
import { Col, Row } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';

const NewPrintVoucehr = ({state, companyId}) => {

    let border1 = "1px solid black";
    let inputRef = useRef(null);
    let companyName = () => {
      let name;
      if (companyId == 1) {
        return (name = "Sea Net Shipping");
      } else if (companyId == 2) {
        return (name = "Cargo linkers");
      } else if (companyId == 3) {
        return (name = "Air Cargo Service");
      }
    };
  return (
    <div>
    <ReactToPrint
      content={() => inputRef}
      trigger={() => (
        <div className="div-btn-custom text-center p-2 px-4">Print</div>
      )}
    />
    <div className="d-none px-4">
      <div
        style={{ paddingLeft: "60px", paddingRight: "40px" }}
        ref={(response) => (inputRef = response)}
      >
        {/* heading */}
        <div
          style={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3 style={{ textAlign: "center", borderBottom: border1 }}>
            {companyName()}
          </h3>
          <p style={{ textAlign: "center" }}>
            FREIGHT, FORWARDING & SHIPPING AGENTS
          </p>
          <p
            style={{
              textAlign: "center",
              borderBottom: border1,
              marginTop: "-10px",
            }}
          >
            Cash Payment Voucher
          </p>
        </div>
        {/* voucher no */}
        <div
          className="px-1"
          style={{
            height: "20px",
            marginTop: "-40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p>
              V.R No :
              <span
                style={{
                  width: "100px",
                  borderBottom: border1,
                  height: "20px",
                }}
              >
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
                  borderBottom: border1,
                  height: "20px",
                }}
              >
                {state?.createdAt?.slice(0, 10)}
              </span>
            </p>{" "}
          </div>
        </div>
          {/* details */}
          <div style={{ border: border1 }}>
        <Row className='p-0 m-0'>

         <Col md="9">
          
        <Row style={{minHeight:"46px"}} className='d-flex'>
        <Col md="2" className='align-self-end'><span >Paid To : </span>  </Col>
        <Col md="10" className='align-self-end border-bottom border-dark m-0 p-0'> <span>text</span> </Col>
        </Row>
            
        <Row>
        <Col md="3">Requested By : </Col>
        <Col md="9" className='border-bottom border-dark m-0 p-0'> text</Col>
        </Row>
            
         {/* on descriptive */}
        {state.descriptive ? 
        <Row>
        <Col md="3">On A/C Of : </Col>
        <Col md="9" className='border-bottom border-dark m-0 p-0'> { state.descriptive && state.list[0]?.item } </Col>
        </Row> :
        <Row style={{minHeight:"23px", whiteSpace:"pre"}}>
        <Col md="3">On A/C Of : </Col>
         <Col md="9" className='border-bottom border-dark m-0 p-0'>{state.onAcOf}</Col>
         </Row>
        }

        {state.descriptive && (state.list.length > 1 && state.list.map((x, i) => {
            return (
            <Row style={{minHeight:"23px"}} key={i}>
            <Col md="12" className='border-bottom border-dark m-0 p-0'>{state.list[i + 1]?.item}</Col>
            </Row>)
        }))  }

        {state.descriptive  && [...Array(7 - state.list.length )].map((x, i) =>{
        return ( <Row md="12" style={{minHeight:"23px"}} key={i}>
         <Col md="12" className='border-bottom border-dark m-0 p-0'> </Col></Row>)})}

        {state.descriptive &&  <Row > 
        <Col md="12" className='border-bottom border-dark m-0 p-0' style={{minHeight:"23px"}}>{" "}</Col>
        </Row>
        } </Col>
         
         {/* side table and amount section */}
        <Col md="3" className='p-0 m-0' >
            <Row className='p-0 m-0 text-center' style={{ borderLeft: border1, borderBottom : border1}}>
               <span>
                 Amount
                </span>
            </Row>
            <Row className='p-0 m-0'>
                <Col md="9 text-center" style={{borderLeft: border1, borderBottom:border1}}>
                <span  >Rs</span>
                </Col>
                <Col md="3" style={{borderLeft: border1, borderBottom:border1}}>
                <span className='text-center' >Ps</span>
                </Col>
            </Row>
            <Row className='p-0 m-0'  style={{minHeight:"23px", maxHeight:"23px",  }}>
                <Col md="9" style={{borderLeft: border1}}>
                <p className='text-center' ></p>
                </Col>
                <Col md="3" style={{borderLeft: border1}}>
                <p className='text-center' ></p>
                </Col>
            </Row>
            
            <Row className='p-0 m-0'  style={{minHeight:"23px", maxHeight:"23px",  }}>
                <Col md="9" style={{borderLeft: border1}}>
                <p className='text-center' >{state.descriptive && state.list[0]?.amount}</p>
                </Col>
                <Col md="3" style={{borderLeft: border1}}>
                <p className='text-center' ></p>
                </Col>
            </Row>

            {state.list.length > 1 && state.list.map((x, i) => {
                return (
                    <Row className='p-0 m-0'  style={{minHeight:"23px", maxHeight:"23px",  }} key={i}>
                    <Col className='text-center'  md="9" style={{borderLeft: border1}}>
                    <span >{state.descriptive && state.list[i + 1]?.amount}</span>
                    </Col>
                    <Col md="3" style={{borderLeft: border1}}>
                    <span className='text-center' ></span>
                    </Col>
                </Row>
                )
            })}
            { state.descriptive && [...Array(7 - state.list.length )].map((x, i) =>{
               return (
                <Row key={i} className='p-0 m-0'  style={{minHeight:"23px", maxHeight:"23px",  }}>
                <Col className='text-center'  md="9" style={{borderLeft: border1}}>
                <span >{}</span>
                </Col>
                <Col md="3" style={{borderLeft: border1}}>
                <span className='text-center' ></span>
                </Col>
            </Row>
            )  
            })}

            <Row className='p-0 m-0' style={{maxHeight:"23px", borderBottom:border1, borderTop:border1}}>
                <Col md="9" className='text-center' style={{borderLeft: border1,  }}>
                <span  >{state.amount}</span>
                </Col>
                <Col md="3" style={{borderLeft: border1}}>
                <span  ></span>
                </Col>
            </Row>
        </Col>

        {/* bottom signature section */}
        <Row className=' d-flex justify-content-around ' style={{height:"80px"}}>
        <Col style={{ borderTop: border1, maxWidth: "150px", alignSelf:"flex-end"   }}>PREPARED BY</Col>
        <Col style={{ borderTop: border1, maxWidth: "150px", alignSelf:"flex-end"  }}>APPROVED BY</Col>
        <Col style={{ borderTop: border1, maxWidth: "150px", alignSelf:"flex-end"  }}>RECIEVED BY</Col>

        </Row>
        </Row>     
    
    </div>
    
    </div>
        </div>
        </div>
  )
}

export default NewPrintVoucehr