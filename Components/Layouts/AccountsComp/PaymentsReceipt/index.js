import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Input, List, Radio, Modal, Select } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from 'axios';
import BillComp from './BillComp';
import AgentBillComp from './AgentBillComp';
import { useSelector } from 'react-redux';
import { BackwardOutlined, FastBackwardFilled, FastForwardFilled, ForwardFilled } from '@ant-design/icons';
import History from './History';

const PaymentsReceipt = () => {

    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState("");
    const [partytype, setPartyType] = useState("client");
    const [payType, setPayType] = useState("Recievable");
    const [invoiceCurrency, setInvoiceCurrency] = useState("USD");
    const [partyOptions, setPartyOptions] = useState([]);
    const [selectedParty, setSelectedParty] = useState({id:'', name:''});
    const companyId = useSelector((state) => state.company.value);

    const [history, setHistory] = useState(false);
    const [offset, setOffset] = useState(0);
    const [count, setCount] = useState(0);
    const [transaction, setTransaction] = useState({});
    const [oldOnvoices, setOldInvoices] = useState([]);

    useEffect(() => { searchParties() }, [search]);

    const searchParties = async() => {
        if(search.length>2){
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_BY_SEARCH, { search, type:partytype })
            .then((x)=> {
                if(x.data.status=="success"){
                    setPartyOptions(x.data.result)
                }else{
                    setPartyOptions([])
                }
            })
        }
    }

    const ListComp = ({data}) => {
        return(
            <List size="small" bordered
                dataSource={data}
                renderItem={(item)=>
                    <List.Item key={item.id} 
                        className='searched-item' 
                        onClick={()=>{
                            setSelectedParty({id:"", name:""});
                            setSelectedParty({id:item.id, name:item.name});
                            setVisible(true);
                        }}
                    >
                        {item.name}
                    </List.Item>
                }
            />
        )
    }

    const onHandleClick = (type) => {
        let tempOffest=0, tempType=type, tempHistory=history, go=false;
        if(history){
            if(type=="first"){
                tempOffest = 0;
                go=true
            } else if(type=="back"&&offset!=0){
                tempOffest = parseInt(offset)-1
                go=true
            } else if(type=="front" && (parseInt(offset)+1<count)){
                tempOffest = parseInt(offset) + 1
                go=true
            } else if(type=="last"){
                tempOffest = count - 1
                go=true
            }
        } else {
            go=true
        }
        go?axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_TRANSACTION_HISTORY, {
            headers:{
                offset:tempOffest,
                type:tempType,
                history:`${tempHistory}`
            }
        }).then((x)=>{
            if(x.data.status=="success"){
                console.log(x.data)
                setOldInvoices(x.data.result.invoices)
                setTransaction(x.data.result.result)
                setOffset(x.data.result.offset)
                if(!history){
                    setCount(x.data.result.count);
                    setHistory(true);
                }else{
                    
                }
            }
        }):null
    }

    const basestyle = {borderBottom:'1px solid silver', paddingBottom:5, marginBottom:10}
    const Header = () => {
        return(
            <Row className='p-0 m-0'>
                <Col style={{maxWidth:30}} className='p-0 m-0'>
                    <div className='round-icon-cont' onClick={()=>onHandleClick('first')}>
                        <FastBackwardFilled />
                    </div>
                </Col>
                <Col style={{maxWidth:30}} className='p-0 m-0'>
                    <div className='round-icon-cont' onClick={()=>onHandleClick('back')}>
                        <BackwardOutlined />
                    </div>
                </Col>
                <Col style={{maxWidth:30}} className='p-0 m-0'>
                    <div className='round-icon-cont' onClick={()=>onHandleClick('front')}>
                        <ForwardFilled />
                    </div>
                </Col>
                <Col style={{maxWidth:30}} className='p-0 m-0'>
                    <div className='round-icon-cont' onClick={()=>onHandleClick('last')}>
                        <FastForwardFilled />
                    </div>
                </Col>
                <Col>
                {!history?`${selectedParty.name} Invoices/Bills`:transaction.partyName}
                </Col>
            </Row>
        )
    }
  return (
    <div className='base-page-layout'>
        <Row>
            <Col md={12} xs={12}><h4 className='fw-7'>Payments / Receipts</h4></Col>
            <Col md={2}>
                <div><b>Select Party Type</b></div>
                <Radio.Group className='mt-1' 
                    value={partytype}
                    onChange={(e)=>{
                        setPartyType(e.target.value);
                        if(e.target.value=="vendor"){
                            setPayType("Payble");
                        }else if(e.target.value=="client"){
                            setPayType("Recievable");
                        }else if(e.target.value=="agent"){
                            setPayType("Payble");
                        }
                        setSearch("");
                    }} 
                >
                    <Radio value={"client"}>Client</Radio>
                    <Radio value={"vendor"}>Vendor</Radio>
                    <Radio value={"agent"}>Agent</Radio>
                </Radio.Group>
            </Col>

        </Row>
        <Row className='mt-3'>
            <Col md={2}>
                <b>Payment</b>
                <Radio.Group className='mt-1' 
                    value={payType}
                    onChange={(e)=>{
                        setPayType(e.target.value);
                        setSearch("");
                    }} 
                >
                    <Radio value={"Payble"}>Payble</Radio>
                    <Radio value={"Recievable"}>Receivable</Radio>
                </Radio.Group>
            </Col>
            <Col md={2}>
            <b>Currency</b>
                <Select size='small'
                    disabled={partytype!="agent"?true:false}
                    defaultValue={invoiceCurrency}
                    onChange={(e)=> setInvoiceCurrency(e)}
                    style={{ width:'100%' }}
                    options={[
                        { value:'PKR', label:'PKR' },
                        { value:'USD', label:'USD' },
                        { value:'GBP', label:'GBP' },
                        { value:'EUR', label:'EUR' },
                        { value:'Multi', label:'Multi' },
                    ]}
                />
            </Col>
        </Row>
        <Row>
            <Col style={{maxWidth:400}} className='mt-3'>
                <b>Search</b>
                <Input style={{ width: 500 }} placeholder="Search" 
                    suffix={search.length>2?<CloseCircleOutlined onClick={()=>setSearch("")} />:<SearchOutlined/>} 
                    value={search} onChange={(e)=>setSearch(e.target.value)}
                />
                {search.length>2 &&
                    <div style={{position:"absolute", zIndex:10}}>
                        <ListComp data={partyOptions} />
                    </div>
                }
            </Col>
            <Col md={12}><hr/></Col>
        </Row>
        <Modal 
            open={visible} 
            width={'100%'}
            onOk={()=>{setVisible(false); setHistory(false)}} 
            onCancel={()=>{ setVisible(false); setSelectedParty({id:'', name:''}); setHistory(false)}}
            footer={false} maskClosable={false}
            title={ <Header/> }
        >   
        {!history &&<>
            {(selectedParty.id!=''&& partytype!="agent") && <BillComp      selectedParty={selectedParty} payType={payType} partytype={partytype} companyId={companyId} invoiceCurrency={"PKR"} />}
            {(selectedParty.id!=''&& partytype=="agent") && <AgentBillComp selectedParty={selectedParty} payType={payType} partytype={partytype} companyId={companyId} invoiceCurrency={invoiceCurrency} />}
        </>}
        {
            history &&
            <>
                <History transaction={transaction} oldOnvoices={oldOnvoices} payType={payType} />
            </>
        }
        </Modal>
    </div>
  )
}

export default React.memo(PaymentsReceipt)