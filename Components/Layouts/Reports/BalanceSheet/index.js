import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Select, Radio, Modal } from 'antd';

const BalanceSheet = () => {

    const [company, setCompany] = useState(1);
    const [load, setLoad] = useState(false);
    const [visible, setVisible] = useState(false);

    const [assets, setAssets] = useState([{ total:0.00, Parent_Accounts:[{}] }]);
    const [liabilities, setLiabilities] = useState([{ total:0.00, Parent_Accounts:[{}] }]);
    const [capital, setCapital] = useState([{ total:0.00, Parent_Accounts:[{}] }]);
    const [drawings, setDrawings] = useState([{ total:0.00, Parent_Accounts:[{}] }]);
    const [earnings, setEarnings] = useState(0.00);
    const [effect, setEffect] = useState(0.00);
    const commas = (a) =>  { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}
    async function handleSubmit(){
        setLoad(true);
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_BALANCE_SHEET,{
            headers:{
                companyid:company
            }
        })
        .then((x)=>{
            console.log(x.data)
            let tempassets = x.data.result.assets;
            let templiabilities = x.data.result.liabilities;
            let tempcapital = x.data.result.capital;
            let tempdrawings = x.data.result.drawings;
            let tempselling = x.data.result.selling;
            let tempcosting = x.data.result.costing;
            tempassets.forEach((z) => {
                let total = 0.00;
                z.Parent_Accounts.forEach((i)=>{
                    let totalParent = 0.00;
                    i.Child_Accounts.forEach((j)=>{
                        let totalChild = 0.00;
                        j.Voucher_Heads.forEach((k)=>{
                            let totalVoucher = 0.00;
                            k.type=="debit"?totalVoucher = totalVoucher + parseFloat(k.amount):totalVoucher = totalVoucher - parseFloat(k.amount);
                            totalChild = totalChild + totalVoucher
                        })
                        j.totalChild = totalChild;
                        totalParent = totalParent + totalChild
                    })
                    i.totalParent = totalParent
                    total = total + totalParent
                })
                z.total = total;
            });
            templiabilities.forEach((z) => {
                let total = 0.00;
                z.Parent_Accounts.forEach((i)=>{
                    let totalParent = 0.00;
                    i.Child_Accounts.forEach((j)=>{
                        let totalChild = 0.00;
                        j.Voucher_Heads.forEach((k)=>{
                            let totalVoucher = 0.00;
                            k.type=="credit"?totalVoucher = totalVoucher + parseFloat(k.amount):totalVoucher = totalVoucher - parseFloat(k.amount);
                            totalChild = totalChild + totalVoucher
                        })
                        j.totalChild = totalChild;
                        totalParent = totalParent + totalChild
                    })
                    i.totalParent = totalParent
                    total = total + totalParent
                })
                z.total = total;
            });
            tempcapital.forEach((z) => {
                let total = 0.00;
                z.Parent_Accounts.forEach((i)=>{
                    let totalParent = 0.00;
                    i.Child_Accounts.forEach((j)=>{
                        let totalChild = 0.00;
                        j.Voucher_Heads.forEach((k)=>{
                            let totalVoucher = 0.00;
                            k.type=="credit"?totalVoucher = totalVoucher + parseFloat(k.amount):totalVoucher = totalVoucher - parseFloat(k.amount);
                            totalChild = totalChild + totalVoucher
                        })
                        j.totalChild = totalChild;
                        totalParent = totalParent + totalChild
                    })
                    i.totalParent = totalParent
                    total = total + totalParent
                })
                z.total = total;
            });
            tempdrawings.forEach((z) => {
                let total = 0.00;
                z.Parent_Accounts.forEach((i)=>{
                    let totalParent = 0.00;
                    i.Child_Accounts.forEach((j)=>{
                        let totalChild = 0.00;
                        j.Voucher_Heads.forEach((k)=>{
                            let totalVoucher = 0.00;
                            k.type=="credit"?totalVoucher = totalVoucher + parseFloat(k.amount):totalVoucher = totalVoucher - parseFloat(k.amount);
                            totalChild = totalChild + totalVoucher
                        })
                        j.totalChild = totalChild;
                        totalParent = totalParent + totalChild
                    })
                    i.totalParent = totalParent
                    total = total + totalParent
                })
                z.total = total;
            });
            tempcosting.forEach((z) => {
                let total = 0.00;
                z.Parent_Accounts.forEach((i)=>{
                    let totalParent = 0.00;
                    i.Child_Accounts.forEach((j)=>{
                        let totalChild = 0.00;
                        j.Voucher_Heads.forEach((k)=>{
                            let totalVoucher = 0.00;
                            k.type=="debit"?totalVoucher = totalVoucher + parseFloat(k.amount):totalVoucher = totalVoucher - parseFloat(k.amount);
                            totalChild = totalChild + totalVoucher
                        })
                        j.totalChild = totalChild;
                        totalParent = totalParent + totalChild
                    })
                    i.totalParent = totalParent
                    total = total + totalParent
                })
                z.total = total;
            });
            tempselling.forEach((z) => {
                let total = 0.00;
                z.Parent_Accounts.forEach((i)=>{
                    let totalParent = 0.00;
                    i.Child_Accounts.forEach((j)=>{
                        let totalChild = 0.00;
                        j.Voucher_Heads.forEach((k)=>{
                            let totalVoucher = 0.00;
                            k.type=="debit"?totalVoucher = totalVoucher + parseFloat(k.amount):totalVoucher = totalVoucher - parseFloat(k.amount);
                            totalChild = totalChild + totalVoucher
                        })
                        j.totalChild = totalChild;
                        totalParent = totalParent + totalChild
                    })
                    i.totalParent = totalParent
                    total = total + totalParent
                })
                z.total = total;
            });
            tempselling = tempselling.length>0?tempselling[0].total:0;
            tempcosting = tempcosting.length>0?tempcosting[0].total:0;
            setAssets(tempassets)
            setLiabilities(templiabilities)
            setCapital(tempcapital)
            setDrawings(tempdrawings)
            setEarnings(tempselling+tempcosting);
            setEffect(tempassets[0].total - ( templiabilities.length>0?templiabilities[0].total:0 + tempcapital.length>0?tempcapital[0].total:0 + tempdrawings.length>0?tempdrawings[0].total:0 + tempselling+tempcosting))
            // console.log("assets",tempassets);
            // console.log("liabilities",templiabilities);
            // console.log("capital",tempcapital);
            // console.log("drawings",tempdrawings);
            // console.log("selling",tempselling);
            // console.log("costing",tempcosting);
        })
        setLoad(false);
        setVisible(true);
    }
    const lineHeight = 1.1;
  return (
    <div className='base-page-layout'>
    <h4 className='fw-7'>Balance Sheet</h4>
    <hr/>
    <Row>
        <Col md={3}>
            <h3>Select Company</h3>
            <Radio.Group className='mt-1' 
                value={company}
                onChange={(e)=>{
                    setCompany(e.target.value);
                }} 
            >
                <Radio value={1}>SEA NET SHIPPING & LOGISTICS</Radio>
                <Radio value={2}>CARGO LINKERS</Radio>
                <Radio value={3}>AIR CARGO SERVICES</Radio>
            </Radio.Group>
        </Col>
    </Row>
    <Row className='my-3'>
        <Col>
        <button className='btn-custom' disabled={load?true:false} onClick={handleSubmit}>
          {load? <Spinner size='sm' className='mx-3' />:"View"}
        </button>
        </Col>
    </Row>
    <Modal 
        open={visible} 
        width={"60%"}
        onOk={()=>setVisible(false)} 
        onCancel={()=> { setVisible(false); }}
        footer={false} maskClosable={false}
    >
        <div style={{minHeight:650, overflowY:'auto', overflowX:'hidden', fontSize:14}}>
            <h4 className='mb-0 pb-0'>Assets</h4>
            {assets.length>0 &&
                <>
                {assets[0].Parent_Accounts.map((x, i)=>{
                return(
                    <Row key={i} className='row-btm-line' style={{lineHeight:lineHeight}}>
                        <Col md={6}><div>{x.title}</div></Col>
                        <Col md={6}><div className='fl-r'>{commas(x.totalParent)}</div></Col>
                    </Row>
                )})}
                <Row className='row-btm-line fw-8'  style={{lineHeight:lineHeight}}>
                    <Col md={6} className='px-4'><div>Total For Assets</div></Col>
                    <Col md={6}><div className='fl-r'>{commas(assets[0].total)}</div></Col>
                </Row>
                </>
            }

            <h4 className='mb-0 pb-0 mt-3'>liabilities</h4>
            {liabilities[0].Parent_Accounts.map((x, i)=>{
            return(
                <Row key={i} className='row-btm-line'  style={{lineHeight:lineHeight}}>
                    <Col md={6}><div>{x.title}</div></Col>
                    <Col md={6}><div className='fl-r'>{commas(x.totalParent)}</div></Col>
                </Row>
            )})}
            <Row className='row-btm-line fw-8'  style={{lineHeight:lineHeight}}>
                <Col md={6} className='px-4'><div>Total For Liabilities</div></Col>
                <Col md={6}><div className='fl-r'>{commas(liabilities[0].total)}</div></Col>
            </Row>
            <h4 className='mb-0 pb-0 mt-3'>Equity</h4>
            {capital[0].Parent_Accounts.map((x, i)=>{
            return(
                <Row key={i} className='row-btm-line'  style={{lineHeight:lineHeight}}>
                    <Col md={6}><div>{x.title}</div></Col>
                    <Col md={6}><div className='fl-r'>{commas(x.totalParent)}</div></Col>
                </Row>
            )})}
            <Row className='row-btm-line fw-8'  style={{lineHeight:lineHeight}}>
                <Col md={6} className='px-4'><div>Total For Capital</div></Col>
                <Col md={6}><div className='fl-r'>{commas(capital[0].total)}</div></Col>
            </Row>
            {drawings.length>0 &&
                <>
                {drawings[0].Parent_Accounts.map((x, i)=>{
                return(
                    <Row key={i} className='row-btm-line'  style={{lineHeight:lineHeight}}>
                        <Col md={6}><div>{x.title}</div></Col>
                        <Col md={6}><div className='fl-r'>{commas(x.totalParent)}</div></Col>
                    </Row>
                )})}
                <Row className='row-btm-line fw-8'  style={{lineHeight:lineHeight}}>
                    <Col md={6} className='px-4'><div>Total For Drawings</div></Col>
                    <Col md={6}><div className='fl-r '>{commas(drawings[0].total)}</div></Col>
                </Row>
                </>
                
            }
            <Row className='row-btm-line'  style={{lineHeight:lineHeight}}>
                <Col md={6} className=''><div>Profit & Loss Summary</div></Col>
                <Col md={6}><div className='fl-r '>{commas(earnings)}</div></Col>
            </Row>
            <Row className='row-btm-line fw-8'  style={{lineHeight:lineHeight}}>
                <Col md={6} className='px-4'><div>Total for Profit & Loss Summary</div></Col>
                <Col md={6}><div className='fl-r '>{commas(earnings)}</div></Col>
            </Row>
            <Row className='row-btm-line'  style={{lineHeight:lineHeight}}>
                <Col md={6} className=''><div>{effect>0?"Asset":"Liability"} Effect On Equity</div></Col>
                <Col md={6}><div className='fl-r '>{commas(effect)}</div></Col>
            </Row>
            <Row className='row-btm-line fw-8'  style={{lineHeight:lineHeight}}>
                <Col md={6} className='px-4'><div>Total for Equity & Liability</div></Col>
                <Col md={6}><div className='fl-r '>{commas(assets[0].total)} </div></Col>
            </Row>
        </div>
    </Modal>
    </div>
  )
}

export default BalanceSheet
