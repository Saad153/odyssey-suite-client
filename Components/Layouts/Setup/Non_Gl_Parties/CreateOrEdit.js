import React, { useEffect } from 'react';
import { Tabs } from "antd";
import { useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputComp from '/Components/Shared/Form/InputComp';
import SelectComp from '/Components/Shared/Form/SelectComp';
import DateComp from '/Components/Shared/Form/DateComp';
import CheckGroupComp from '/Components/Shared/Form/CheckGroupComp';
import { Row, Col, Spinner } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import Cookies from 'js-cookie';
import openNotification from '/Components/Shared/Notification';
import { useSelector } from 'react-redux';
import Router from 'next/router';

const SignupSchema = yup.object().shape({
    name: yup.string().required('Required'),
    types: yup.array().required('Atleast 1 Type Required!').min(1, "Atleast 1 Type Required!"),
    operations: yup.array().required('Atleast 1 Operation Required!').min(1, "Atleast 1 Operation Required!"),
});

const CreateOrEdit = ({state, dispatch, baseValues, clientData, id}) => {
  
    const company = useSelector((state) => state.company.companies);
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(SignupSchema),
        defaultValues:state.values
    });

    useEffect(() => {
        if(id!="new"){
            let tempState = {...clientData};
            let tempCompanyList = [...state.editCompanyList];
            tempState.operations = tempState.operations.split(', ');
            tempState.types = tempState.types.split(', ');
            tempState.registerDate = moment(tempState.registerDate);
            tempState.bankAuthorizeDate = moment(tempState.bankAuthorizeDate);
            tempState.companies = [];
            // clientData.Client_Associations.forEach((x)=>{ tempState.companies.push(x.CompanyId) })
            // tempCompanyList.forEach((x, i)=>{
            //     for(let j=0; j<tempState.Client_Associations.length; j++){
            //         if(tempState.Client_Associations[j].CompanyId==x.value){
            //             tempCompanyList[i].disabled=true;
            //             break;
            //         }else{
            //             tempCompanyList[i].disabled=false;
            //         }
            //     }
            // })
            dispatch({type:'toggle', fieldName:'editCompanyList', payload:tempCompanyList});
            dispatch({type:'toggle', fieldName:'oldRecord', payload:tempState});
            reset(tempState);
        }
        if(id=="new"){ reset(baseValues) }
    }, [])

    const onSubmit = async(data) => {
        let Username = Cookies.get('username')
        data.createdBy = Username
        dispatch({type:'toggle', fieldName:'load', payload:true});
        setTimeout(async() => {
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_NON_PARTIES,{
                ...data
            }).then((x)=>{
                if(x.data.status=='success'){
                    openNotification('Success', `Non Gl ${x.data.result.name} Created!`, 'green');
                    // Router.push(`/setup/client/${x.data.result.id}`);
                }else{
                    openNotification('Error', `An Error occured Please Try Again!`, 'red')
                }
                dispatch({type:'toggle', fieldName:'load', payload:false});
            })
        }, 3000);
    };

    const onEdit = async(data) => {
        let EmployeeId = Cookies.get('loginId');
        let updateDate = moment().format('MMM Do YY, h:mm:ss a');
     
        dispatch({type:'toggle', fieldName:'load', payload:true});
        setTimeout(async() => {
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_EDIT_NON_PARTIES,{
                ...data,  EmployeeId, updateDate
            }).then((x)=>{
                if(x.data.status=='success'){
                    openNotification('Success', `Non Gl ${data.name} Updated!`, 'green')
                } else { openNotification('Error', `An Error occured Please Try Again!`, 'red') }
                dispatch({type:'toggle', fieldName:'load', payload:false});
            })
        }, 3000);
    };
    const onError = (errors) => console.log(errors);

 

    return (
    <div className='client-styles' style={{maxHeight:720, overflowY:'auto', overflowX:'hidden'}}>
      <form onSubmit={handleSubmit(id!="new" ? onEdit : onSubmit, onError)}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Basic Info" key="1">
        <Row>
            <Col md={12} className='py-1'>
                <Col md={3}>
                <InputComp disabled  register={register} name='code' control={control} label='Code' />
                {errors.code && <div className='error-line'>{errors.code.message}*</div>}
                </Col>
            </Col>
            <Col md={6} className='py-1'>
                <InputComp  register={register} name='name' control={control} label='Name*' />
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
     
      </Tabs>
      <hr/>
      <button type="submit" disabled={state.load?true:false} className='btn-custom'>
        {state.load?<Spinner animation="border" size='sm' className='mx-3' />:'Submit'}
      </button>
      </form>
      {/* <button className='btn-custom' onClick={()=>reset(
        {
            operations: ["Sea Import"],
            types: ["Shipper"],
            accountsMail: "Mehma@gmail.com",
            infoMail: "hareem@gmail.com",
            telephone2: "6635544",
            telephone1: "6625544",
            zip: "74800",
            city: "Karachi",
            address2: "Haseeb Flats Flats, no.15, Shah Faisal",
            address1: "Sana Avenue Flats, no.35, North Nazimabad Block-D",
            strn: "34572489932",
            ntn: "123-635218-5",
            mobile2: "03360222373",
            mobile1: "03332209125",
            person2: "Salik",
            person1: "Abdullah",
            bankAuthorizeDate: moment("Mon Dec 12 2022 14:44:19 GMT+0500"),
            registerDate: moment("Mon Dec 12 2022 14:43:42 GMT+0500"),
            name: "Changed Abdullah",
            website: "www.infosys.com",
            companies: [1, 2, 3 ],
            bank: "Meezan",
            branchName: "North Branch",
            branchCode: "00000",
            accountNo: "1234567890",
            iban: "09068671839",
            swiftCode: "BL-4123",
            routingNo: "BDC-4827100",
            ifscCode: "i73ddkaj",
            micrCode: "u891729h",
            authorizedById: "",//"60425aa7-cb85-4561-aec9-0fd426c7d2cb",
            accountRepresentatorId: "",//"60425aa7-cb85-4561-aec9-0fd426c7d2cb",
            docRepresentatorId: "",//"60425aa7-cb85-4561-aec9-0fd426c7d2cb",
            salesRepresentatorId: "",//"60425aa7-cb85-4561-aec9-0fd426c7d2cb",
            currency: "pkr"
        }
        )}>
        reset
      </button> */}
    </div>
    )
}

export default CreateOrEdit