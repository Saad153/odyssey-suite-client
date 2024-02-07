import React, { useState } from 'react';
import { InputNumber } from 'antd';
import { Row, Col } from "react-bootstrap";
import { CSVLink } from "react-csv";

const AWBCalculator = () => {

    const [prefix, setPrefix] = useState(0);
    const [digits, setDigits] = useState(0);
    const [qty, setQty] = useState(0);
    const [scvData, setCsvData] = useState([]);

    const calculate = () => {
        let tempData = [["HAWB Series"]]
        for (let index = 0; index < qty; index++) {
            let newDigit = digits + index;
            tempData.push([`${prefix}-${newDigit}${newDigit%7}`]);
        }
        setCsvData(tempData);
    }

  return (
    <div className='base-page-layout'>
      <Row>
        <Col md={12}>
            <div>
                <h4 style={{display:'inline-block', width:70 , textAlign:'center' }}>Prefix</h4>
                <h4 style={{display:'inline-block', width:120, textAlign:'center' }}>Digits</h4>
                <h4 style={{display:'inline-block', width:70, textAlign:'center' }}>Qty</h4>
            </div>
            <div>
                <InputNumber style={{display:'inline-block', width:70}} value={prefix} onChange={setPrefix}  min={0} />
                <InputNumber style={{display:'inline-block', width:120}} value={digits} onChange={setDigits} min={0} />
                <InputNumber style={{display:'inline-block', width:70}} value={qty} onChange={setQty} min={0} />
            </div>
            <button className='btn-custom mt-3 px-5 py-1' onClick={calculate}>Go</button>

            {scvData.length>0 &&
            <CSVLink data={scvData} className='btn-custom mx-3 px-4 py-2' style={{color:'white'}}>
                Download me
            </CSVLink>
            }
            {scvData.length>0 &&
            <>
                <hr/>
                <div style={{maxHeight:400, backgroundColor:'#f0f0f0', width:150, overflowY:'auto'}}>
                    {scvData.map((x, i)=>{
                        return(
                            <div key={i} className='text-center'>
                                <b>{i==0?"_":""}{x[0]}{i==0?"_":""}</b>
                            </div>
                        )
                    })}
                </div>
            </>
            }
        </Col>
      </Row>
    </div>
  )
}

export default AWBCalculator