import axios from 'axios';
import * as yup from "yup";
import { Tabs } from "antd";
import moment from 'moment';
import Cookies from 'js-cookie';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getJobValues } from '/apis/jobs';
import { useQuery } from '@tanstack/react-query';
import { createHistory } from './historyCreation';
import { Row, Col, Spinner } from 'react-bootstrap';
import { yupResolver } from "@hookform/resolvers/yup";
import DateComp from '/Components/Shared/Form/DateComp';
import InputComp from '/Components/Shared/Form/InputComp';
import SelectComp from '/Components/Shared/Form/SelectComp';
import { useForm } from "react-hook-form";
import CheckGroupComp from '/Components/Shared/Form/CheckGroupComp';
import openNotification from '/Components/Shared/Notification';
import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';

const SignupSchema = yup.object().shape({
    // code: yup.string().required('Required'),
    name: yup.string().required('Required'),
    //registerDate: yup.string().required('Required'),
    //bankAuthorizeDate: yup.string(),
    //person1: yup.string().required('Required'),
    //person2: yup.string().required('Required'),
    //mobile1:yup.string().min(11, 'Must be 11 Digits!').max(11, 'Must be 11 Digits!').required('Required'),
    //mobile2:yup.string().min(11, 'Must be 11 Digits!').max(11, 'Must be 11 Digits!').required('Required'),
    //ntn: yup.string().required('Required'),
    //strn: yup.string().required('Required'),
    //address1: yup.string().required('Required'),
    //address2: yup.string().required('Required'),
    //city: yup.string().required('Required'),
    //zip: yup.string().required('Required'),
    //telephone1: yup.string().required('Required'),
    //telephone2: yup.string().required('Required'),
    //infoMail: yup.string().email('Must be an E-mail!').required('Required'),
    //accountsMail: yup.string().email('Must be an E-mail!').required('Required'),
    types: yup.array().required('Atleast 1 Type Required!').min(1, "Atleast 1 Type Required!"),
    operations: yup.array().required('Atleast 1 Operation Required!').min(1, "Atleast 1 Operation Required!"),
});

const CreateOrEdit = ({state, dispatch, baseValues, vendorData, id}) => {

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(SignupSchema),
        defaultValues:state.values
    });

    const { refetch } = useQuery({
        queryKey:['values'],
        queryFn:getJobValues
    });

    useEffect(() => {
        if(id!=="new"){
            let tempState = {...vendorData};
            tempState.operations = tempState.operations?.split(', ');
            tempState.types = tempState.types?.split(', ');
            tempState.registerDate = moment(tempState.registerDate);
            tempState.bankAuthorizeDate = moment(tempState.bankAuthorizeDate);
            tempState.companies = [1,2,3];
            //dispatch({type:'toggle', fieldName:'oldRecord', payload:tempState});
            reset({...tempState, parentAccount:state.parentAccount});
        }
        if(id==="new"){ 
            reset({...baseValues, parentAccount:state.parentAccount}) 
        }
    }, [state.parentAccount])

    const onSubmit = async(data) => {
        let Username = Cookies.get('username')
        data.createdBy = Username;
        let pAccountName = '';
        dispatch({type:'toggle', fieldName:'load', payload:true});
        state.accountList.forEach((x)=>{
            if(x.id==data.parentAccount){
                pAccountName =x.title
            }
        });
        setTimeout(async() => {
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_VENDOR, {
                ...data, pAccountName
            }).then((x)=>{
                if(x.data.status=='success'){
                    openNotification('Success', `Vendor ${x.data.result.name} Created!`, 'green');
                    refetch();
                    Router.push(`/setup/vendor/${x.data.result.id}`);
                }else{
                    openNotification('Error', `An Error occured Please Try Again!`, 'red')
                }
                dispatch({type:'toggle', fieldName:'load', payload:false});
            })
        }, 3000);
    };

    const onEdit = async(data) => {
        let history = "";
        let pAccountName = ''
        let EmployeeId = Cookies.get('loginId');
        let updateDate = moment().format('MMM Do YY, h:mm:ss a');
        //history = await createHistory(Representatives, oldRecord, data, company);
        dispatch({type:'toggle', fieldName:'load', payload:true});
        state.accountList.forEach((x)=>{
            if(x.id==data.parentAccount){
                pAccountName =x.title
            }
        });
        setTimeout(async() => {
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_EDIT_VENDOR, {
                data, history, EmployeeId, updateDate, pAccountName
            }).then((x)=>{
                if(x.data.status=='success'){
                    openNotification('Success', `Vendor ${data.name} Updated!`, 'green');
                    refetch();
                } else { 
                    openNotification('Error', `An Error occured Please Try Again!`, 'red');
                }
                dispatch({type:'toggle', fieldName:'load', payload:false});
            })
        }, 3000);
    };

    const onError = (errors) => console.log(errors);

    return (
    <div className='client-styles' style={{maxHeight:720, overflowY:'auto', overflowX:'hidden'}}>
      <form onSubmit={handleSubmit(id!=="new"?onEdit:onSubmit, onError)}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Basic Info" key="1">
        <Row>
            <Col md={12} className='py-1'>
                <Col md={3}>
                <InputComp disabled register={register} name='code' control={control} label='Code' />
                {errors.code && <div className='error-line'>{errors.code.message}*</div>}
                </Col>
            </Col>
            <Col md={6} className='py-1'>
                <InputComp  register={register} name='name' control={control} label='Name' />
                {errors.name && <div className='error-line'>{errors.name.message}*</div>}
            </Col>
            <Col className='py-1'>     
                <DateComp register={register} name='registerDate' control={control} label='Register Date' />
                {errors.registerDate && <div className='error-line'>Required*</div>}
            </Col>
            <Col md={2} className='py-1'>
                <InputComp register={register} name='city' control={control} label='City' />
                {errors.city && <div className='error-line'>{errors.city.message}*</div>}
            </Col>
            <Col md={2} className='py-1'>
                <InputComp register={register} name='zip' control={control} label='ZIP' />
                {errors.zip && <div className='error-line'>{errors.zip.message}*</div>}
            </Col>
            <Col md={6} className='py-1'>
                <InputComp register={register} name='address1' control={control} label='Address 1' />
                {errors.address1 && <div className='error-line'>{errors.address1.message}*</div>}
            </Col>
            <Col md={6} className='py-1'>
                <InputComp register={register} name='address2' control={control} label='Address 2' />
                {errors.address2 && <div className='error-line'>{errors.address2.message}*</div>}
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='person1' control={control} label='Person 1' />
                {errors.person1 && <div className='error-line'>{errors.person1.message}*</div>}
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='mobile1' control={control} label='Mobile 1' />
                {errors.mobile1 && <div className='error-line'>{errors.mobile1.message}*</div>}
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='person2' control={control} label='Person 2' />
                {errors.person2 && <div className='error-line'>{errors.person2.message}*</div>}
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='mobile2' control={control} label='Mobile 2' />
                {errors.mobile2 && <div className='error-line'>{errors.mobile2.message}*</div>}
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='telephone1' control={control} label='Telephone 1' />
                {errors.telephone1 && <div className='error-line'>{errors.telephone1.message}*</div>}
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='telephone2' control={control} label='Telephone 2' />
                {errors.telephone2 && <div className='error-line'>{errors.telephone2.message}*</div>}
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='website' control={control} label='Website' />
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='infoMail' control={control} label='Info Mail' />
                {errors.infoMail && <div className='error-line'>{errors.infoMail.message}*</div>}
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='accountsMail' control={control} label='Accounts Mail' />
                {errors.accountsMail && <div className='error-line'>{errors.accountsMail.message}*</div>}
            </Col>
            <Col md={4} className='py-1'>
                <InputComp register={register} name='ntn' control={control} label='NTN No.' />
                {errors.ntn && <div className='error-line'>{errors.ntn.message}*</div>}
            </Col>
            <Col md={4} className='py-1'>
                <InputComp register={register} name='strn' control={control} label='STRN No.' />
                {errors.strn && <div className='error-line'>{errors.strn.message}*</div>}
            </Col>
            <Col md={12} className='py-1'>
                <CheckGroupComp register={register} name='operations' control={control} label='Operations'
                options={state.Operations}/>
                {errors.operations && <div className='error-line'>{errors.operations.message}*</div>}
            </Col>
            <Col md={12} className='py-1'>
                <CheckGroupComp register={register} name='types' control={control} label='Type'
                    options={state.Types}/>
                {errors.types && <div className='error-line'>{errors.types.message}*</div>}
            </Col>
        </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Bank Info" key="2">
        <Row>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='bank' control={control} label='Bank' />
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='branchName' control={control} label='Branch Name' />
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='branchCode' control={control} label='Branch Code' />
            </Col>
            <Col md={6} className='py-1'>
                <InputComp register={register} name='accountNo' control={control} label='Account No.' />
            </Col>
            <Col md={6} className='py-1'>
                <InputComp register={register} name='iban' control={control} label='IBAN' />
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='routingNo' control={control} label='Routing No.' />
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='swiftCode' control={control} label='Swift Code' />
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='ifscCode' control={control} label='IFSC Code' />
            </Col>
            <Col md={3} className='py-1'>
                <InputComp register={register} name='micrCode' control={control} label='MICR Code' />
            </Col>
            <Col md={3} className='py-1'>
                <DateComp register={register} name='bankAuthorizeDate' control={control} label='Bank Authorize Date' />
            </Col>
            <Col md={3} className='py-1'>     
                <SelectComp register={register} name='authorizedById' control={control} label='Authorized By:' width={200} 
                    options={state.Representatives[0].records} />
            </Col>
            <div style={{height:246}}></div>
        </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Account Info" key="3">
        <Row>
            <Col md={6}>
             <SelectSearchComp width={"100%"} register={register} name='parentAccount' 
                control={control} label='Parent Account:' //disabled={id=="new"?false:true}
                options={state?.accountList.map((x)=>{
                    return {id:x.id, name:x.title}
                })} 
            />
            </Col>
            <Col></Col>
            <Col md={6} className='pt-2'>
                <InputComp register={register} name='name' control={control} label='Account Name' 
                    width={"100%"} disabled={true} 
                />
            </Col>
            <hr className='mt-4' />

            <Col md={12} className='py-1'>     
                <SelectComp register={register} name='accountRepresentatorId' control={control} label='Account Representative:'
                    options={state.Representatives[0].records} width={200} />
            </Col>
            <Col md={12} className='py-1'>     
                <SelectComp register={register} name='currency' control={control} label='Currency' width={200} 
                    options={[  
                        {id:'USD', name:'USD'},
                        {id:'PKR', name:'PKR'},
                        {id:'INR', name:'INR'},
                        {id:'AED', name:'AED'},
                        {id:'AUD', name:'AUD'}
                ]}/>
            </Col><div style={{height:370}}></div>
        </Row>
        </Tabs.TabPane>
      </Tabs>
      <hr/>
      <button type="submit" disabled={state.load?true:false} className='btn-custom'>
        {state.load?<Spinner animation="border" size='sm' className='mx-3' />:'Submit'}
      </button>
      </form>
    </div>
    )
}

export default React.memo(CreateOrEdit)