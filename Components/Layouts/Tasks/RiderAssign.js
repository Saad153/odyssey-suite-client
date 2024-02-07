//import { useRouter } from 'next/router';
import axios from "axios";
import { Table, Row, Col, Spinner } from 'react-bootstrap';
import InputComp from '../../Shared/Form/InputComp'
import { useForm } from 'react-hook-form';
import cookies from 'js-cookie';
import openNotification from '../../Shared/Notification';
import { useEffect, useReducer } from "react";
import { Modal } from 'antd';
import SelectSearchComp from '../../Shared/Form/SelectSearchComp';
import Router from "next/router";

const initialState = {
  visible: false,
  EmployeeId:"",
  load : false,
  approvedInvoices : [],
  tasks : []
}

const reducers = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

const RiderID = ({riderData, tasks, id}) => {

  const [state, dispatch] = useReducer(reducers, initialState)
  const { register, control, handleSubmit, reset } = useForm({});

  const getApprovedInvoices = async() => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_APPROVED_INVOICE_RIDERS).then((x)=>{
      if(x.data.status=='success'){
        dispatch({type : "SET_DATA" , payload:  {approvedInvoices: x.data.result}});
      }
    })
  }

  useEffect(() => { getApprovedInvoices() }, [])

  const onSubmit = async(data) => {
    const assignedById = await cookies.get("loginId")

    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_TASK, {...data, assignedById:assignedById, EmployeeId:id}).then((x) => {
      dispatch({type:"SET_DATA", payload:{load:true}})
      if(x.data.status=='success'){
        openNotification('Success', `Task Assigned Successfully!`, 'green')
        Router.push(`/tasks/riders/riderAssign/${id}`)
      } else {
        openNotification('Failure', `Something Went Wrong. Please Try Again`, 'red')
      }
    })
  };

    return (
    <div className='dashboard-styles'>
    <div className='base-page-layout'>
    <Row>
    <Col md={12}>
      <Row>
      <Col md={10}><h5>Tasks</h5></Col>
      <Col md={2}><button className="btn-custom" onClick={() => dispatch({type:"SET_DATA", payload:{visible:true}})}>Create New Task</button></Col>
      </Row>
      <div className='my-2' style={{backgroundColor:'silver', height:1}}></div>
    </Col>
    {tasks.length>0 && <Col md={12}>
    <div className='' style={{maxHeight:500, overflowY:'auto'}}>
      <Table className='tableFixHead'>
      <thead><tr><th>Sr.</th><th>Title</th><th>Details</th><th>Assigned By</th>
      <th>Assigned On</th>
      </tr></thead>
      <tbody>
      {tasks.map((x, index) => {
      return (
      <tr key={index} className='f row-hov'>
        <td>{index + 1}</td>
        <td><span className='blue-txt fw-5'>{x.title}</span></td>
        <td>{x.details}</td>
        <td>{x.assignedBy.name}</td>
        <td>{ x.createdAt.slice(0, 10 )}</td>
      </tr>
      )})}
      </tbody>
      </Table>
      </div>
    </Col>}
    {tasks.length == 0 && <div className='p-5 text-center'><Spinner/></div>}
    </Row>
    <Modal open={state.visible} 
      onOk={() => dispatch({type:"SET_DATA", payload:{ visible:true}})} 
      onCancel={() => dispatch({type:"SET_DATA", payload: { visible :false}})}
      width={"50%"}
      footer={false}
      centered={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col md={12}>
        <InputComp register={register} name='title' control={control} label='Title' />
        </Col>
        <Col md={12} className='py-1'>
          <InputComp  register={register} name='details' control={control} label='Details' />
        </Col>
        <Col md={12}>
            <SelectSearchComp label="Invoice List" name="invoice_no" register={register} control={control} width={"100%"}
              options={state.approvedInvoices.map((x) => {
               return ({id: x.invoice_No , name: `${x.invoice_No} (${x.party_Name})`})
              })}
            /></Col>
      </Row>
      <hr/>
      <button type="submit"  className='btn-custom'>
        { !state.load ? `Assign Task` : <Spinner/> }
      </button>
      </form>
    </Modal>
  </div>
  </div>
  )
}

export default RiderID


