import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Row, Col, Spinner } from 'react-bootstrap';
import MediumModal from '/Components/Shared/Modals/MediumModal';
import CreateOrEdit from './CreateOrEdit';
import { useSelector } from 'react-redux';
import { Input } from 'antd';

const Employees = ({}) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [query,setQuery] = useState("");
  const [originalEmployeeList, setOriginalEmployeeList] = useState([]);
  const keys = ["name"]

  const company = useSelector((state) => state.company.companies);

  const search = (data) => {
    return data.filter((item)=>{
      return keys.some(key=>item[key].toLowerCase().includes(query.toLowerCase()));
    })
  }

  useEffect(() => {
    getEmployees();
    return () => { }
  }, [])

  const getEmployees = async() => {
    console.log("Function Hit")
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_EMPLOYEES).then((x)=>{
      if(x.data.status=='success'){
        setEmployeeList(x.data.result);
        setOriginalEmployeeList(x.data.result)
      }
    })
  }

  useEffect(()=>{
    const filteredData = search(originalEmployeeList);
    setEmployeeList(filteredData)
  },[query,originalEmployeeList])

  const updateUser = (x) => {
    let tempState = [...employeeList];
    let i = tempState.findIndex((y=>x.id==y.id));
    tempState[i] = x;
    setEmployeeList(tempState);
  }

  const appendClient = (x, levels) => {
    let tempState = [...employeeList];
    console.log(x)
    x.Access_Levels=levels
    tempState.unshift(x);
    setEmployeeList(tempState);
  }

  const getCompanyName = (id) => {
    let name = '';
    company.forEach(x => {
      if(id==x.id){
        name=x.title
      }
    });
    return name
  }

  return (
  <div className='dashboard-styles'>
    <div className='base-page-layout'>
      <Row>
      <Col md={12}>
        <Row>
        <Col md="6"><h5>Employees</h5></Col>
        <Col md="4">
            <Input type="text" placeholder="Enter Name" size='sm' onChange={e => setQuery(e.target.value)} />
        </Col>
        <Col md="2"><button className='btn-custom' onClick={()=>setVisible(true)} style={{float:'left'}}>Create</button></Col>
        </Row>
        <div className='my-2' style={{backgroundColor:'silver', height:1}}></div>
        <MediumModal visible={visible} setVisible={setVisible} setEdit={setEdit} width={800}>
          <CreateOrEdit appendClient={appendClient} edit={edit} setVisible={setVisible} setEdit={setEdit} selectedEmployee={selectedEmployee} updateUser={updateUser} company={company} />
        </MediumModal>
      </Col>
      {employeeList.length>0 && <Col md={12}>
      <div className='' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead'>
        <thead><tr><th>Sr.</th><th>Code</th><th>Basic Info</th><th>Company Info</th><th>Bank Info</th><th>History</th></tr></thead>
        <tbody>
        {employeeList.map((x, index) => {
        return (
        <tr key={index} className='f row-hov'
          onClick={()=>{
            setSelectedEmployee(x)
            setEdit(true);
            setVisible(true);
        }}>
          <td>{index + 1}</td>
          <td><span className='blue-txt fw-5'>{x.code}</span></td>
          <td>Name: <span className='blue-txt fw-5'>{x.name}</span><br/>Contact: {x.contact}<br/>CNIC: {x.cnic}</td>
          <td>Dpt: {x.department}<br/>Designation: {x.designation}<br/>Manager: {x.manager}</td>
          <td>Name: {x.bank}<br/>No: {x.account_no}<br/></td>
          <td>
            Creator: <span className='blue-txt fw-5'>{x.createdBy}</span>
            <br/>
            Modifier: <span className='grey-txt fw-5'>{x.updatedBy==null?'( )':x.updatedBy}</span>
          </td>
        </tr>
        )})}
        </tbody>
        </Table>
        </div>
      </Col>}
      {employeeList.length==0 && <div className='p-5 text-center'><Spinner/></div>}
      </Row>
    </div>
  </div>
  )
}

export default Employees