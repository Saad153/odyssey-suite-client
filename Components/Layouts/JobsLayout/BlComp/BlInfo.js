import TextAreaComp from '/Components/Shared/Form/TextAreaComp';
import { fetchJobsData, convetAsHtml, setJob } from './states';
import SelectComp from '/Components/Shared/Form/SelectComp';
import InputComp from '/Components/Shared/Form/InputComp';
import DateComp from '/Components/Shared/Form/DateComp';
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { Modal, Select } from 'antd';
import JobSearch from './JobSearch';
import moment from 'moment';

const BlInfo = ({control, id, register, state, useWatch, dispatch, reset, type, currentJobValue}) => {

    const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b})
    const allValues = useWatch({control});

    useEffect(() => {
        const retrieveData = async() => {
            if(id=='new'){
                let jobValue = await fetchJobsData(set, dispatch, currentJobValue);
                setJob(set, jobValue[0], state, reset, allValues, dispatch, id);
            }
        }
        retrieveData();
    },[])

    const findNotifyParty = (id,content) => {
        state.partiesData.forEach((x)=>{
            if(id==x.id){
                set(content,convetAsHtml(x))
                set('updateContent',!state.updateContent)
            }
        })
    }

    const parseValues = (data) => {
        let tempVal = [];
        data.length>0?data.forEach((x) => {
            tempVal.push({
                value:x.id,
                label:x.name,
                code:x.code
            })
        }):null;
        return tempVal
    }

  return (
    <div style={{height:600, overflowY:'auto', overflowX:'hidden'}}>
    <Row>
        <Col md={3} className='fs-12'>
        <Row>
            <Col md={10}>
            <div className="" style={{lineHeight:1.35}}>Job No. *</div>
            <div className='dummy-input'>{allValues.jobNo}</div>
            </Col>
            <Col md={12}> 
                <div className='mt-2'></div>
                <InputComp register={register} name='hbl' control={control} width={150} 
                    label={(type=="SE"||type=="SI")?'HBL # *':"HAWB #*"}
                    // disabled={(type=="SI"||type=="AI"||type=="AE")?false:true} 
                />
            </Col>
            <Col md={12}>
                <div className='mt-2'></div>
                <InputComp register={register} name='mbl' control={control} width={150} 
                    label={(type=="SE"||type=="SI")?'MBL #*':"MAWB #*" }
                />
            </Col>
        </Row>
        </Col>
        <Col md={2} className='fs-12'>
        <Row>
            <Col md={12}>
                <SelectComp register={register} name='status' control={control} label='Status' width={120}
                    options={[ 
                        {id:'Final', name:'Final'}, 
                        {id:'Draft', name:'Draft'} 
                    ]}
                />
            </Col>
            <Col md={12}>
                <div className='mt-2'></div>
                <DateComp register={register} name='hblDate'control={control} label={(type=="SE"||type=="SI")?'HBL Date':"HAWB Date"} width={120} />
            </Col>
            <Col md={12}>
                <div className='mt-2'></div>
                <DateComp register={register} name='mblDate'control={control} label={(type=="SE"||type=="SI")?'MBL Date':"MAWB Date"} width={120} />
            </Col>
        </Row>
        </Col>
        {(type=="SE"||type=="SI") && <Col md={6}>
        <Row style={{border:'1px solid silver'}} className='pb-2 pt-1 mt-4'>
            <Col md={4}>
                <SelectComp register={register} name='blReleaseStatus' control={control} label='Release Status' width={'100%'}
                    options={[ 
                        {id:'Original'        , name:'Original'        }, 
                        {id:'Surrender'       , name:'Surrender'       },
                        {id:'Hold'            , name:'Hold'            },
                        {id:'Bank Guarantee'  , name:'Bank Guarantee'  },
                        {id:'Do Null'         , name:'Do Null'         },
                        {id:'Auction'         , name:'Auction'         },
                        {id:'Telex Release'   , name:'Telex Release'   },
                        {id:'SeaWay Bill'     , name:'SeaWay Bill'     },
                        {id:'Express Release' , name:'Express Release' },
                        {id:'Without Document', name:'Without Document'}
                    ]}
                />
            </Col>
            <Col md={4}>
                <SelectComp register={register} name='blhandoverType' control={control} label='Handover Type' width={'100%'}
                    options={[ 
                        {id:'By Hand', name:'By Hand'}, 
                        {id:'Courier', name:'Courier'},
                        {id:'Email'  , name:'Email'  },
                        {id:'Fax'    , name:'Fax'    },
                        {id:'Telex'  , name:'Telex'  },
                    ]}
                />
            </Col>
            <Col md={4}>
                <div></div>
                <SelectComp register={register} name='releaseInstruction' control={control} label='Instructions' width={'100%'}
                    options={[ 
                        {id:'Release', name:'Release'}, 
                        {id:'Stop', name:'Stop'}, 
                    ]}
                />
            </Col>
            <Col md={12}>
                <div className='mt-2'></div>
                <TextAreaComp register={register} rows={1} name='remarks' control={control} label='Remarks'/>
            </Col>
        </Row>
        </Col>}
        <Col md={12}><hr/></Col>
        <Col md={4} className='fs-12'>
        <Row className='pt-1'>
            <Col md={12}>
            <div className="" style={{lineHeight:1.35}}>Shipper *</div>
            <div className='dummy-input'>{allValues.shipper}</div>
            </Col>
            <Col md={12}>
            <div className="mt-2" style={{lineHeight:1.35}}>Consignee *</div>
            <div className='dummy-input'>{allValues.consignee}</div>
            </Col>
            <Col md={12}>
                <div className='mt-2'>Notify Party #1 *</div>
                <Select style={{minWidth:'100%'}}
                    onChange={(e)=>{
                        let tempState = {...allValues};
                        tempState.notifyPartyOneId = e;
                        reset(tempState);
                        findNotifyParty(tempState.notifyPartyOneId, 'notifyOneContent')
                    }} 
                    value={allValues.notifyPartyOneId} 
                    showSearch
                    optionFilterProp="children"
                    options={parseValues(state.partiesData)}
                    filterOption={(input, option) =>
                        ((option?.label) ?? '').toLowerCase().includes(input.toLowerCase())||
                        ((option?.code) ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
                <div className='mt-2'>Notify Party #2</div>
                <Select style={{minWidth:'100%'}}
                    onChange={(e)=>{
                        let tempState = {...allValues};
                        tempState.notifyPartyTwoId = e;
                        reset(tempState);
                        findNotifyParty(tempState.notifyPartyTwoId, 'notifyTwoContent')
                    }} 
                    value={allValues.notifyPartyTwoId} 
                    showSearch
                    optionFilterProp="children"
                    options={parseValues(state.partiesData)}
                    filterOption={(input, option) =>
                        ((option?.label) ?? '').toLowerCase().includes(input.toLowerCase())||
                        ((option?.code) ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
                <Row>
                    <Col md={(type=="SE"||type=="SI")?12:8}>
                        <div className="mt-2" style={{lineHeight:1.35}}>
                            {(type=="SE"||type=="SI")?"Vessel":"Airline"}
                        </div>
                        <div className='dummy-input'>
                            {(type=="SE"||type=="SI")? allValues.vessel:allValues.air_line}
                        </div>
                    </Col>
                    {(type=="AE"||type=="AI") &&
                    <Col md={4} style={{paddingLeft:0}}>
                        <div className='dummy-input' style={{marginTop:24}}>
                            {allValues.flightNo}
                        </div>
                    </Col>
                    }
                </Row>

                <div className="mt-2" style={{lineHeight:1.35}}>Shipment Date</div>
                <div className='dummy-input'>{moment(allValues.shipDate).format("DD-MM-YYYY")}</div>
            </Col>
        </Row>
        </Col>
        {!(type=="SI"||type=="SE") && <Col md={1}></Col>}
        <Col md={(type=="SI"||type=="SE")?7:5} className='fs-12'>
        <div className={`text-center`}>Booking Info</div> 
        <Row style={{border:'1px solid silver'}} className={` ${(type=="SI"||type=="SE")?"pb-3 pt-0 ":"p-4"}`}>
            <Col md={(type=="SI"||type=="SE")?5:12}>
            <Row>
                <Col md={12}>
                    <div className="mt-2" style={{lineHeight:1.35}}>{(type=="SI"||type=="SE")?"POL":"Airport of Loading"}</div>
                    <div className='dummy-input'>{allValues.pol}</div>
                </Col>
                <Col md={12}>
                    <div className="mt-2" style={{lineHeight:1.35}}>{(type=="SI"||type=="SE")?"POFD":"Airport of Discharge"}</div>
                    <div className='dummy-input'>{allValues.pofd}</div>
                </Col>
                <Col md={12}>
                    <div className="mt-2" style={{lineHeight:1.35}}>{(type=="SI"||type=="SE")?"Final Dest.":"Place of Delivery"}</div>
                    <div className='dummy-input'>{allValues.fd}</div>
                </Col>
                <Col md={12}>
                    <div className="mt-2" style={{lineHeight:1.35}}>Commodity</div>
                    <div className='dummy-input'>{allValues.commodity}</div>
                </Col>
                <Col md={12}>
                    <div className="mt-2" style={{lineHeight:1.35}}>
                        {(type=="SI"||type=="SE")?"S/Line Carrier":"Airline"}
                    </div>
                    <div className='dummy-input'>
                        {(type=="SI"||type=="SE")?allValues.shipping_line:allValues.air_line}
                    </div>
                </Col>
            </Row>
            </Col>
            {(type=="SI"||type=="SE")&&
            <Col md={7}>
            <Row>
                <Col md={12}>
                    <div className="mt-2" style={{lineHeight:1.35}}>Overseas Agent</div>
                    <div className='dummy-input'>{allValues.overseas_agent}</div>
                </Col>
                <Col md={12}>
                    <div className="mt-2" style={{lineHeight:1.35}}>
                        {"S/Line Carrier"}
                    </div>
                    <div className='dummy-input'>
                        {allValues.shipping_line}
                    </div>
                </Col>
                <Col md={12}>
                    <div className="mt-2" style={{lineHeight:1.35}}>Total Container</div>
                    <div className='dummy-input'>
                        {allValues.equip.map((x, i)=>{
                            return(<span key={i}>{x.qty} X {x.size}</span>)
                        })
                        }
                    </div>
                </Col>
                <Col md={12}>
                    <div className="mt-2" style={{lineHeight:1.35}}>Delivery</div>
                    <div className='dummy-input'>{allValues.delivery}</div>
                </Col>
            </Row>
            </Col>
            }
        </Row>
        </Col>
    </Row>
    <Modal open={state.partyVisible} maskClosable={false} width={800}
        onOk={()=>set('partyVisible', false)}
        onCancel={()=>set('partyVisible', false)}
        footer={false}
    ><JobSearch state={state} useWatch={useWatch} dispatch={dispatch} control={control} reset={reset} />    
    </Modal>
    </div>
  )
}

export default React.memo(BlInfo)