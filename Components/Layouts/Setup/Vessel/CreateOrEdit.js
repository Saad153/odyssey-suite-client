import { useForm } from "react-hook-form";
import openNotification from '/Components/Shared/Notification';
import SelectComp from '/Components/Shared/Form/SelectComp';
import { yupResolver } from "@hookform/resolvers/yup";
import InputComp from '/Components/Shared/Form/InputComp';
import { Row, Col, Spinner } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { Input } from 'antd';
import * as yup from "yup";
import axios from 'axios';
import RadioComp from "/Components/Shared/Form/RadioComp";
import { CloseCircleOutlined } from '@ant-design/icons';
import { getJobValues } from '/apis/jobs';
import { useQuery } from '@tanstack/react-query';

const CreateOrEdit = ({state, dispatch, baseValues}) => {

    const SignupSchema = yup.object().shape({
        name: yup.string().required('Required'),
        // code: yup.string().required('Required'),
        //carrier: yup.string().required('Required'),
        type: yup.string().required('Atleast Check 1'),
        // loading: yup.string().required('Atleast Check 1'),
    });
    const { refetch } = useQuery({
        queryKey:['values'],
        queryFn:getJobValues
    });

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(SignupSchema),
        defaultValues:state.values
    });

    useEffect(() => {
        if(state.edit){
            console.log(state.selectedRecord)
            let tempRecord = {...state.selectedRecord};
            delete tempRecord.destinations;
            state.destinations = state.selectedRecord.destinations?state.selectedRecord.destinations.split(", "):[];
            console.log(tempRecord);
            reset(tempRecord);
        }else{
            reset(baseValues)
        }
    }, [state.selectedRecord]);

    const carriers = [
        {id:'Emirates', name:'Emirates'},
        {id:'Cape Negro', name:'Cape Negro'},
        {id:'Elton', name:'Elton'},
        {id:'Ravager', name:'Ravager'},
    ]

    const onSubmit = async(data) => {
        // if(state.destinations.length>0){
    // }
        data.destinations = state.destinations.join(', ')
        dispatch({type:'toggle', fieldName:'load', payload:true});
        setTimeout(async() => {             
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_VESSEL,{
                data
            }).then((x)=>{
                let tempRecord = [];
                if(x.data.status=='exists'){
                    openNotification('Error', `Vessel With Same Name Already Exists!`, 'red')
                }else if(x.data.status=='success'){
                    openNotification('Success', `Vessel Created!`, 'green');
                    tempRecord = [...state.records];
                    tempRecord.unshift(x.data.result);
                    refetch();
                }else{
                    openNotification('Error', `An Error Occured Please Try Again`, 'red')
                }
                dispatch({
                    type:'set', 
                    payload:{ selectedRecord:{}, load:false, destinations:[], records:tempRecord }
                });
            })
         }, 2000);
        
    };
    
    const onEdit = async(data) => {
        if(state.destinations?.length>0){
        data.destinations = state.destinations.join(', ')
    }
        dispatch({type:'toggle', fieldName:'load', payload:true});
        setTimeout(async() => {             
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_EDIT_VESSEL,{
                data
            }).then((x)=>{
                let tempRecords;
                if(x.data.status=='exists'){
                    openNotification('Error', `Another Vessel With Same Name or Code Already Exists!`, 'red')
                }else{
                    refetch();
                    openNotification('Success', `Vessel Updated!`, 'green');
                    tempRecords = [...state.records];
                    let i = tempRecords.findIndex((y=>data.id==y.id));
                    tempRecords[i] = x.data.result;
                    dispatch({ type: 'modalOff' });
                    reset(baseValues);
                }
                dispatch({
                    type:'set', 
                    payload:{ selectedRecord:{}, load:false, destinations:[], records:tempRecords }
                });
            })
         }, 3000);
       
    };
    const onError = (errors) => console.log(errors);

  return (
    <div className='' style={{maxHeight:720, overflowY:'auto', overflowX:'hidden'}}>
      <h6>{state.edit?'Edit':'Create'}</h6>
      <form onSubmit={handleSubmit(state.edit?onEdit:onSubmit, onError)}>
        <Row>
            <Col md={6} className='py-1'>
                <InputComp  register={register} name='name' control={control} label='Name' />
                {errors.name && <div className='error-line'>{errors.name.message}*</div>}
            </Col>
            <Col md={3} className='py-1'>
                <InputComp  register={register} disabled name='code' control={control} label='Code' />
                {errors.code && <div className='error-line'>{errors.code.message}</div>}
            </Col>
            {/* <Col md={7}>
                <SelectComp register={register} name='carrier' control={control} label='Carriers' width={300}
                    options = {carriers}/>
            </Col> */}
            <Col md={7} className='py-1'>
                <RadioComp register={register} name='type' control={control} label='Types'
                    options = {[
                        { label: 'Import', value: 'Import' },
                        { label: 'Export', value: 'Export' },
                        { label: 'Both', value: 'Both'}
                    ]}/>
                    {errors.type && <div className='error-line'>{errors.type.message}*</div>}
            </Col>
            <Col md={3}></Col>
            <Col md={4} className='py-1'>
                <InputComp  register={register} name='loading' control={control} label='Port Of Loading' />
                {errors.loading && <div className='error-line'>{errors.loading.message}*</div>}
            </Col>
            <Col md={6}></Col>
            <Col md={6}>
                <div className="mt-2">Destinations {"("} {state.destinations?.length} {")"} </div>
                <Row>
                    <Col>
                        <Input placeholder="Enter Destination" value={state.destination} 
                          onChange={(e)=>dispatch({type:'toggle', fieldName:'destination', payload:e.target.value})}
                        />
                    </Col>
                    <Col>
                        <button type="reset" className='btn-custom' onClick={()=>{
                            if(state.destination!=""){
                                let tempState = [...state.destinations];
                                tempState.push(state.destination)
                                dispatch({type:'set', payload:{
                                    destinations:tempState,
                                    destination:''
                                }});
                                //dispatch({type:'toggle', fieldName:'destination', payload:''});
                            }
                        }}>Add</button>
                    </Col>
                </Row>
            </Col>
            <Col md={6}></Col>
            <Col md={4} className='mt-2' style={{maxHeight:200, overflowY:'auto'}}>
                {state.destinations?.map((x, i)=>{
                    return(
                    <div key={i} className="dest-con">{i+1}:{" "}
                        <span className="destination"><strong>{x}</strong></span>
                        <span style={{float:'right'}} className='cross-icon'
                        onClick={()=>{
                            let tempState = [...state.destinations];
                            tempState.splice(i, 1);
                            dispatch({type:'toggle', fieldName:'destinations', payload:tempState});
                        }}
                        ><CloseCircleOutlined /></span>
                    </div>
                    )
                })}
            </Col>
        </Row>
        <button type="submit" disabled={state.load?true:false} className='btn-custom mt-4'>
            {state.load?<Spinner animation="border" size='sm' className='mx-3' />:'Submit'}
        </button>
      </form>
    </div>
  )
}

export default CreateOrEdit