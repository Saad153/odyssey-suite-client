import React, { useEffect, useReducer } from 'react';
import { Row, Col } from 'react-bootstrap';
import CreateOrEdit from './CreateOrEdit';

import { PlusCircleOutlined, MinusCircleOutlined, RightOutlined, EditOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

function recordsReducer(state, action){
    switch (action.type) {
      case 'toggle': { return { ...state, [action.fieldName]: action.payload } }
      case 'create': {
        return {
            ...state,
            create: true,
            visible: true,
        }
      }
      case 'edit': {
        return {
            ...state,
            edit: true,
            visible: true,
        }
      }
      case 'modalOff': {
        return {
            ...state,
            visible: false,
            create: false,
            edit: false
        }
      }
      default: return state 
    }
}

const initialState = {
    records: [],
    load:true,
    visible:false,
    create:false,
    edit:false,
    
    // Createing Records
    selectedMainId:'',
    selectedParentId:'',
    title:'',
    isParent:false,
    subCategory:"General",
    parentRecords: [],
    
    // Editing Records
    selectedRecordId:'',
    selectedRecord:{}
};

const ChartOFAccount = ({accountsData}) => {

    const [ state, dispatch ] = useReducer(recordsReducer, initialState);
    const { records, visible } = state;
    useEffect(() => { getAccounts(accountsData) }, []);

    async function getAccounts(data){
        let tempState = [];
        let tempStateTwo = [];
        data.result.forEach((x, index) => {
            tempState[index]={
                ...x,
                check:false
            }
            x.Parent_Accounts.forEach((y, indexTwo) => {
                tempState[index].Parent_Accounts[indexTwo]={
                    ...y,
                    check:false
                }
                tempStateTwo.push(y)
            })
        });
        dispatch({ type: 'toggle', fieldName: 'records', payload: tempState })
        dispatch({ type: 'toggle', fieldName: 'parentRecords', payload: tempStateTwo })
    }

return (
    <div className='dashboard-styles'>
    <div className='base-page-layout'>
    <div className='account-styles'>
        <Row>
            <Col><h5>Accounts</h5></Col>
            <Col>
                <button className='btn-custom right' onClick={()=>{ dispatch({ type: 'create'}) }}>
                    Create
                </button>
            </Col>
        </Row>
        <hr className='my-2' />
        <Row style={{maxHeight:'69vh',overflowY:'auto', overflowX:'hidden'}}>
        {
        records.map((x, index)=>{
        return(
            <div key={x.id} className='parent'>
            <div className='child icon' onClick={()=>{
                let tempState = [...records];
                tempState.forEach((i)=>{
                    if(i.id==x.id){
                        i.check=!i.check
                    }
                })
                dispatch({ type: 'toggle', fieldName: 'records', payload: tempState })
            }}>
                {x.check?<MinusCircleOutlined />:<PlusCircleOutlined />}
            </div>
            <div className='child title'>{x.title}</div>
            {x.check &&
            <>{x.Parent_Accounts.map((y, indexTwo)=>{
                return(
                <div key={y.id} className='mx-4 parent'>
                <div className='child icon' onClick={()=>{
                    let tempState = [...records];
                    console.log(y.title)
                    tempState[index].Parent_Accounts.forEach((j)=>{
                        if(j.id==y.id){
                            j.check=!j.check
                        }
                    })
                    dispatch({ type: 'toggle', fieldName: 'records', payload: tempState })
                }}>
                    {y.check?<MinusCircleOutlined />:<PlusCircleOutlined />}
                </div>
                    <div className='child title'>{y.title}</div>

                    {y.editable==1&&<div className='child edit-icon' onClick={()=>{
                        dispatch({ type: 'toggle', fieldName: 'selectedRecord', payload: y })
                        dispatch({ type: 'toggle', fieldName: 'isParent', payload: true })
                        dispatch({ type: 'edit'})
                    }}
                    ><EditOutlined />
                    </div>}
                    {y.check && <>
                    {
                    y.Child_Accounts.map((z)=>{
                        return(
                        <div key={z.id} className='mx-4 parent'>
                            <div className='child icon'><RightOutlined /></div>
                            <div className='child title'>{z.title}</div>
                            {z.editable==1&&<div className='child edit-icon' onClick={()=>{
                                dispatch({ type: 'toggle', fieldName: 'selectedRecord', payload: z })
                                dispatch({ type: 'toggle', fieldName: 'isParent', payload: false })
                                dispatch({ type: 'edit'})
                                }}><EditOutlined /></div>}
                        </div>
                        )
                    })
                    }
                    </>}
                </div>
                )
                })
            }</>
            }
            </div>
        )
        })}
        </Row>
        <Modal open={visible} 
            onOk={() => dispatch({ type: 'modalOff' })} 
            onCancel={() => dispatch({ type: 'modalOff' })}
            width={600}
            footer={false}
            centered={false}
        >
            <CreateOrEdit state={state} dispatch={dispatch} getAccounts={getAccounts} />
        </Modal>
    </div>
    </div>
    </div>
  )
}
export default React.memo(ChartOFAccount)