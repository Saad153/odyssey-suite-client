import { Row, Col } from 'react-bootstrap';
import React from "react";
import { Form, Input, Checkbox, Switch, Select, notification } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const CreateOrEdit = ({state, dispatch, getAccounts}) => {

    const companyId = useSelector((state) => state.company.value);

    const handleSubmit = async() => {
        if(state.isParent){
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_PARENT_ACCOUNT,{
                title:state.title,
                AccountId:state.selectedMainId,
                CompanyId:companyId
            }).then((x)=>{
                if(x.data.status=='success'){
                    getAccounts(x.data);
                    openNotification('Success', `Account ${state.title} Created!`, 'green')
                }else{
                    openNotification('Failure', `A Similar Account With Name ${state.title} Already Exists!`, 'red')
                }
            })
        }else{
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_CHILD_ACCOUNT,{
                title:state.title,
                AccountId:state.selectedMainId,
                ParentAccountId:state.selectedParentId,
                CompanyId:companyId
            }).then((x)=>{
                if(x.data.status=='success'){
                    getAccounts(x.data);
                    openNotification('Success', `Account ${state.title} Created!`, 'green')
                }else{
                    openNotification('Failure', `A Similar Account With Name ${state.title} Already Exists!`, 'red')
                }
            })
        }
    }
    const handleEdit = async() => {
        if(state.isParent){
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_EDIT_PARENT_ACCOUNT,{
                id: state.selectedRecord.id,
                title: state.selectedRecord.title,
                AccountId: state.selectedRecord.AccountId,
                CompanyId: companyId
            }).then((x)=>{
                console.log(x.data)
                if(x.data.status=='success'){
                    getAccounts(x.data);
                    openNotification('Success', `Account ${state.selectedRecord.title} Updated!`, 'green')
                }else{
                    openNotification('Failure', `A Similar Account With Name ${state.selectedRecord.title} Already Exists!`, 'red')
                }
            })
        }else{
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_EDIT_CHILD_ACCOUNT,{
                id: state.selectedRecord.id,
                title: state.selectedRecord.title,
                ParentAccountId: state.selectedRecord.ParentAccountId,
                CompanyId: companyId
            }).then((x)=>{
                console.log(x.data)
                if(x.data.status=='success'){
                    getAccounts(x.data);
                    openNotification('Success', `Account ${state.selectedRecord.title} Updated!`, 'green')
                }else{
                    openNotification('Failure', `A Similar Account With Name ${state.selectedRecord.title} Already Exists!`, 'red')
                }
            })
        }
    }

    const openNotification = (title, message, color) => {
        notification.open({
          message: title,
          description: message,
          icon: <ExclamationCircleOutlined style={{ color: color }} />,
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
      };

  return (
    <div className='employee-styles'>
    <Form name="basic" onFinish={state.edit?handleEdit:handleSubmit}>
        <h6>Create Account</h6>
        <hr/>
    <Row>
        <Col md={4}>
            <Form.Item>
            <span>Account Category</span>
            <Select placeholder="Select" value={state.selectedMainId} disabled={state.edit} onChange={(e)=>{
                dispatch({ type: 'toggle', fieldName: 'selectedMainId', payload: e })
            }}>
            {state.records.map((x, index)=>{
                return(<Select.Option key={index} value={x.id}>{x.title}</Select.Option>)
            })}
            </Select>
            </Form.Item>
        </Col>
        <Col md={4}>
            <Form.Item>
            <span>Sub Account</span>
            <Select placeholder="Select" disabled={state.isParent||state.edit} value={state.selectedParentId} onChange={(e)=>{
                dispatch({type:'toggle', fieldName:'selectedParentId', payload:e})
            }}>
                {state.parentRecords.filter((x)=>{
                    return x.AccountId==state.selectedMainId
                }).map((x, index)=>{
                    return(
                        <Select.Option key={index} value={x.id}>{x.title}</Select.Option>
                    )
                })}
            </Select>
            </Form.Item>
        </Col>
        <Col md={4}>
            <Form.Item>
            <span>Sub Category</span>
            <Select placeholder="Select Sub Category" disabled={state.isParent||state.edit} value={state.subCategory} onChange={(e)=>{
                dispatch({type:'toggle', fieldName:'subCategory', payload:e})
            }}>
                <Select.Option value={"General"}>General</Select.Option>
                <Select.Option value={"Cash"}>Cash</Select.Option>
                <Select.Option value={"Bank"}>Bank</Select.Option>
                <Select.Option value={"COGS"}>COGS</Select.Option>
                <Select.Option value={"Admin Expense"}>Admin Expense</Select.Option>
            </Select>
            </Form.Item>
        </Col>
        <Col md={4}>
         <Form.Item label='Parent'>
            <Switch  disabled={state.edit}
                checked={state.isParent}
                onChange={(e)=> dispatch({type:'toggle', fieldName:'isParent', payload:!state.isParent}) }
            />
        </Form.Item>
        <Form.Item>
            <span>Title</span>
            <Input type='text' required value={state.edit?state.selectedRecord.title:state.title} 
                onChange={(e)=> 
                    {
                        if(state.edit){
                            let tempState = {...state.selectedRecord}
                            tempState.title = e.target.value;
                            dispatch({type:'toggle', fieldName:'selectedRecord', payload:tempState})
                        }else{
                            dispatch({type:'toggle', fieldName:'title', payload:e.target.value})
                        }
                    }
                }
            />
        </Form.Item>
        </Col>
        <Col md={12}><hr/></Col>
        <Col md={12}>
            <button className='btn-custom' type="submit">Submit</button>
        </Col>
    </Row>
    </Form>
    </div>
  )
}

export default React.memo(CreateOrEdit);