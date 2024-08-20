import { Form, Input, DatePicker, Select, Checkbox } from "formik-antd";
import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { UnlockOutlined } from '@ant-design/icons';
import { Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie'
import Vouchers from "./Vouchers";
import { getJobValues } from '/apis/jobs';
import { useQuery } from '@tanstack/react-query';
// import { useFormikContext } from 'formik';

const SignupSchema = Yup.object().shape({
  empName: Yup.string().min(3, 'Too Short!').max(45, 'Too Long!').required('Required'),
  selectDesignation: Yup.string().required('Required'),
  selectDepart: Yup.string().min(1, 'Too Short!').max(30, 'Too Long!').required('Required'),
  //selectCompany: Yup.string().min(1, 'Required!').max(30, 'Too Long!').required('Required'),
  cnic: Yup.string().min(10, 'Too Short!').max(30, 'Too Long!').required('Required'),
  userName: Yup.string().min(3, 'Too Short!').max(30, 'Too Long!').required('Required'),
  pass: Yup.string().min(5, 'Too Short!').max(30, 'Too Long!').required('Required'),
  phone: Yup.string().min(11, 'Must be 11 Digits!').max(11, 'Must be 11 Digits!').required('Required'),
  code: Yup.string().min(1, 'Must be 11 Digits!').max(20, 'Must be 11 Digits!').required('Required'),
});

const MyField = () => {
  const [req, setReq] = useState(false);
  const [managers, setManagers] = useState([]);
  const { values: { selectDesignation }, touched, setFieldValue } = useFormikContext();

  console.log("selectDesignation",selectDesignation)
  useEffect(() => { getManagers() 
  },[])
  const getManagers = async() => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_MANAGERS).then((x)=>{
      if(x.data.status=='success'){ setManagers(x.data.result) }
    })
  }

  useEffect(() => {
    if((selectDesignation.trim() !== '' && touched.selectDesignation) &&(selectDesignation=="manager"||selectDesignation=="cfo"||selectDesignation=="ceo"||selectDesignation=="admin")){
      setReq(true) } else { setReq(false); }
  }, [selectDesignation, touched.selectDesignation]);

  return (
    <Select name="selectManager" style={{ width: "100%" }} placeholder="Select Manager" showSearch disabled={req}>
      <Select.OptGroup label="Managers">
        {managers.map((x, index)=>{
          return(<Select.Option value={x.name} key={index}>{x.name}</Select.Option>)
        })}
      </Select.OptGroup>
    </Select>
  );
};

const CreateOrEdit = ({appendClient, edit, setVisible, setEdit, selectedEmployee, updateUser, company}) => {

  // console.log("selectedEmployee",selectedEmployee.Access_Levels[0].access_name)
  const formikRef = useRef(null);
  const { refetch } = useQuery({
    queryKey:['values'],
    queryFn:getJobValues
  });
  const [selectedAccessLevels, setSelectedAccessLevels] = useState([]);
  const [isAdminSelected, setIsAdminSelected] = useState(false);
// New state to manage disabled status

  const [values, setValues] = useState({
    selectDesignation:'', selectManager: '', //selectCompany:'',
    accessLevels:[], selectDepart:'', fatherName: '',
    accountNo: '', userName: '', address: '',
    empName: '', phone: '',  email: '',
    pass: '', cnic: '', bank: '',
    code: '', date:'', id:'', represent:[""]
  });

  const [load, setLoad] = useState(false);
  const [vouchers, setVouchers] = useState(false);
  const [voucherList, setVoucherList] = useState([]);

  useEffect(() => {
    if(edit){
      let tempState = {...values};
      let arr  = [];
      selectedEmployee.Access_Levels.forEach(x => {
        arr.push(x.access_name)
      });
      tempState={
        selectDesignation: selectedEmployee.designation,
        selectManager: selectedEmployee.manager,
        //selectCompany: selectedEmployee.CompanyId,
        selectDepart: selectedEmployee.department,
        fatherName: selectedEmployee.fatherName,
        accountNo: selectedEmployee.account_no,
        userName: selectedEmployee.username,
        address: selectedEmployee.address,
        accessLevels:arr,
        empName: selectedEmployee.name,
        phone: selectedEmployee.contact,
        email: selectedEmployee.email,
        pass: selectedEmployee.password,
        cnic: selectedEmployee.cnic,
        bank: selectedEmployee.bank,
        code: selectedEmployee.code,
        date: selectedEmployee.date,
        id: selectedEmployee.id,
      }
      if(typeof selectedEmployee.represent=='string'){
        tempState.represent=selectedEmployee.represent.split(",")
      } else {
        tempState.represent=selectedEmployee.represent
      }
      setValues(tempState);
    }
    return () => { }
  }, [edit, selectedEmployee])

  const loadVouchers = async() => {
    setLoad(true);
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VOUCHERS_BY_EPMLOYEE,{
      headers:{'id':`${selectedEmployee.id}`}
    })
    .then((x) => {
      setVoucherList(x.data.result)
      setVouchers(true);
      setLoad(false);
    })
  }
  useEffect(() => {
    console.log(selectedEmployee.Access_Levels)
    if(edit){
      const accessLevels = selectedEmployee.Access_Levels[0].access_name;
      if (accessLevels == "admin") {
          setIsAdminSelected(true)
          setSelectedAccessLevels(['admin'])
  
  
      }
    }

  }, []);


  const handleAccessLevelChange = (value) => {
    const admin = value.includes("admin")
    if(admin){
      setSelectedAccessLevels([]);
      console.log("admin",admin)
      console.log("selected level",selectedAccessLevels)
      setSelectedAccessLevels(admin)
      console.log("selected level21",selectedAccessLevels)
    }

     if(value == "admin"){
      setIsAdminSelected(true)
    }else{
      setIsAdminSelected(false)

    }
  };

  // console.log(isAdminSelected)
return( 
  <div className='employee-styles'>
  <Formik innerRef={formikRef} validateOnChange={false} initialValues={values} validationSchema={SignupSchema} enableReinitialize
    onSubmit={(values, { setSubmitting, resetForm }) => {
      setLoad(true);
      setTimeout(() => {
        setSubmitting(false);
        let tempValues = values
        tempValues.represent = tempValues.represent.toString();
        let Username = Cookies.get('username')
        if(edit){
          axios.post(process.env.NEXT_PUBLIC_CLIMAX_EDIT_EMPLOYEE,{ values:tempValues, updatedBy:Username }).then((x)=>{
            let arr  = [];
            x.data.resultTwo.forEach(y => {
              arr.push({access_name:y.access_name})
            });
            let obj = {
                id: values.id,
                name: values.empName,
                fatherName:values.fatherName,
                email: values.email,
                Access_Levels:arr,
                username: values.userName,
                password: values.pass,
                contact: values.phone,
                address: values.address,
                cnic: values.cnic,
                designation: values.selectDesignation,
                department: values.selectDepart,
                manager: values.selectManager,
                represent:values.represent,
                date: values.date,
                bank: values.bank,
                account_no: values.accountNo,
                code: values.code,
                active: 1,
                status: 1
            }
            updateUser(obj);
            setEdit(false);
            setVisible(false);
            setLoad(false);
            refetch();
          })
        } else {
          axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_EMPLOYEE,{
            values:values, createdBy:Username
          }).then((x)=>{
            if(x.data.status=='exists'){
              alert("User Code or Username Already Exists!");
            }else if(x.data.status=='success'){
              appendClient(x.data.result, x.data.resultTwo);
              setVisible(false);
              refetch();
            }
            setLoad(false);
          })
        }
        //resetForm()
      }, 3000);
  }}>
  {({ errors, touched, isSubmitting }) => ( 
    <Form>
      <h6>Employee Form</h6>
      <hr/>
      <Row>
        <Col>
        <Form.Item name="empName" hasFeedback={true} showValidateSuccess={true}>
          <span>Name</span><Input name="empName" placeholder="Employee Name" />
        </Form.Item>
        <Form.Item name="fatherName" hasFeedback={true} showValidateSuccess={true}>
          <span>Father Name</span><Input name="fatherName" placeholder="Father Name" />
        </Form.Item>
        <Form.Item name="selectDepart" hasFeedback={true} showValidateSuccess={true} style={{width:200}}>
          <div>Department</div>
          <Select name="selectDepart" style={{ width: "100%" }} placeholder="Select Department" showSearch>
            <Select.OptGroup label="Departments">
              <Select.Option value='accounts'>Accounts</Select.Option>
              <Select.Option value='operations'>Operations</Select.Option>
              <Select.Option value='export'>Export</Select.Option>
              <Select.Option value='import'>Import</Select.Option>
              <Select.Option value='outdoor'>Outdoor</Select.Option>
              <Select.Option value='port'>Port</Select.Option>
              <Select.Option value='peon'>Peon</Select.Option>
            </Select.OptGroup>
          </Select>
        </Form.Item>
        <Form.Item name="selectDesignation" hasFeedback={true} showValidateSuccess={true} style={{width:200}}>
        <div>Designation</div>
        <Select name="selectDesignation" style={{ width: "100%" }} placeholder="Select Designation" showSearch>
          <Select.OptGroup label="Designations">
            <Select.Option value='manager'>Manager</Select.Option>
            <Select.Option value='gd operator'>GD Operator</Select.Option>
            <Select.Option value='date operator'>Date Operator</Select.Option>
            <Select.Option value='accountant'>Accountant</Select.Option>
            <Select.Option value='cfo'>CEO</Select.Option>
            <Select.Option value='ceo'>CFO</Select.Option>
            <Select.Option value='admin'>Admin</Select.Option>
            <Select.Option value='rider'>Rider</Select.Option>
            <Select.Option value='hr'>HR</Select.Option>
          </Select.OptGroup>
        </Select>
        </Form.Item>
        <Form.Item name="selectManager" hasFeedback={true} showValidateSuccess={true} style={{width:200}}>
          <div>Manager</div><MyField name="selectManager" selectedEmployee={selectedEmployee}  />
        </Form.Item>

        <Form.Item name="date" >
          <div>Date</div><DatePicker name="date" placeholder="Select Date" />
        </Form.Item>
        </Col>
        <Col>

        <Form.Item name="cnic" hasFeedback={true} showValidateSuccess={true}>
          <div>CNIC</div><Input name="cnic" placeholder="CNIC" style={{width:200}} />
        </Form.Item>

        <Form.Item name="phone" hasFeedback={true} showValidateSuccess={true}>
          <div>Phone No.</div><Input  name="phone" placeholder="Phone Number" style={{width:200}} />
        </Form.Item>

        <Form.Item name="address" hasFeedback={true} showValidateSuccess={true}>
          <span>Address</span><Input name="address" placeholder="Address" />
        </Form.Item>

        <Form.Item name="userName" hasFeedback={true} showValidateSuccess={true}>
          <div>User Name</div><Input name="userName" placeholder="Username" style={{width:200}} />
        </Form.Item>

        <Form.Item name="pass" hasFeedback={true} showValidateSuccess={true} style={{width:200}}>
          <span>Password</span><Input name="pass" placeholder="Password" />
        </Form.Item>
        </Col>
        <Col>
        <Form.Item name="code" hasFeedback={true} showValidateSuccess={true} style={{width:200}}>
          <span>Employee Code</span><Input name="code" placeholder="Employee Code" />
        </Form.Item>

        <Form.Item name="bank" hasFeedback={true} showValidateSuccess={true} style={{width:200}}>
          <span>Bank</span><Input name="bank" placeholder="Bank" />
        </Form.Item>
        
        <Form.Item name="accountNo" hasFeedback={true} showValidateSuccess={true}>
          <span>Account No.</span><Input name="accountNo" placeholder="Account No." />
        </Form.Item>

        <h5 className="mt-3">Define Access <UnlockOutlined style={{position:'relative', bottom:5}} /></h5>
        <Form.Item name="accessLevels" hasFeedback={true} showValidateSuccess={true}>
          <span>Provide Access.</span>
          <Select 
  name="accessLevels" 
  style={{ width: "100%" }} 
  placeholder="Provide Access" 
  mode="multiple" 
  onChange={handleAccessLevelChange}
>
  <Select.Option value={'ExSea'} disabled={isAdminSelected}>EX Sea Operations</Select.Option>
  <Select.Option value={'ImSea'} disabled={isAdminSelected}>IM Sea Operations</Select.Option>
  <Select.Option value={'ExAir'} disabled={isAdminSelected}>EX AIR Operations</Select.Option>
  <Select.Option value={'ImAir'} disabled={isAdminSelected}>IM AIR Operations</Select.Option>
  <Select.Option value={'Employees'} disabled={isAdminSelected}>Employees</Select.Option>
  <Select.Option value={'ClientList'} disabled={isAdminSelected}>Client List</Select.Option>
  <Select.Option value={'VendorList'} disabled={isAdminSelected}>Vendor List</Select.Option>
  <Select.Option value={'NonGLParties'} disabled={isAdminSelected}>Non-GL Parties</Select.Option>
  <Select.Option value={'Commodity'} disabled={isAdminSelected}>Commodity</Select.Option>
  <Select.Option value={'Voyage'} disabled={isAdminSelected}>Voyage</Select.Option>
  <Select.Option value={'Charges'} disabled={isAdminSelected}>Charges</Select.Option>
  <Select.Option value={'ChartOfAccount'} disabled={isAdminSelected}>Chart of Account</Select.Option>
  <Select.Option value={'Invoice/Bills'} disabled={isAdminSelected}>Invoice</Select.Option>
  <Select.Option value={'Payment/Reciept'} disabled={isAdminSelected}>Payment/Reciept</Select.Option>
  <Select.Option value={'Voucher'} disabled={isAdminSelected}>Voucher</Select.Option>
  <Select.Option value={'VoucherList'} disabled={isAdminSelected}>Voucher List</Select.Option>
  <Select.Option value={'OfficeVoucherList'} disabled={isAdminSelected}>Office Voucher List</Select.Option>
  <Select.Option value={'OpeningBalances'} disabled={isAdminSelected}>Opening Balances</Select.Option>
  <Select.Option value={'OpeningInvoises'} disabled={isAdminSelected}>Opening Invoices</Select.Option>
  <Select.Option value={'JobBalancing'} disabled={isAdminSelected}>Job Balancing</Select.Option>
  <Select.Option value={'AccountActivity'} disabled={isAdminSelected}>Account Activity</Select.Option>
  <Select.Option value={'BalanceSheet'} disabled={isAdminSelected}>Balance Sheet</Select.Option>
  <Select.Option value={'JobProfit/Loss'} disabled={isAdminSelected}>Job Profit/Loss</Select.Option>
  <Select.Option value={'Ledger'} disabled={isAdminSelected}>Ledger</Select.Option>
  <Select.Option value={'AgentInvBalance'} disabled={isAdminSelected}>Agent Inv Balance</Select.Option>
  <Select.Option value={'TrialBalance'} disabled={isAdminSelected}>Trial Balance</Select.Option>
  <Select.Option value={'IncomeStatement'} disabled={isAdminSelected}>Income Statement</Select.Option>
  <Select.Option value={'Delete'} disabled={isAdminSelected}>Delete</Select.Option>
  <Select.Option value={'admin'}>Admin</Select.Option>
</Select>
        </Form.Item>
        </Col>
        <div className='my-2' style={{backgroundColor:'silver', height:1}}></div>
        <Col md={4}>
        <Form.Item name="represent" hasFeedback={true} showValidateSuccess={true}>
          <Checkbox.Group
            name="represent"
            options={[
              { label: "Sales Representative", value: "sr" },
              { label: "Doc Representative", value: "dr" },
              { label: "Acc Representative", value: "ar" },
            ]}
          />
        </Form.Item>
        </Col>
      </Row>
      <button className="btn-custom my-3" style={{border:'none'}} type="submit" disabled={isSubmitting}>
        {load?<Spinner animation="border" role="status" size="sm" className="mx-3" />:'Submit'}
      </button> 
      <button className="btn-custom my-3 mx-3" type="button" style={{border:'none'}} onClick={loadVouchers}>
        {load?<Spinner animation="border" role="status" size="sm" className="mx-3" />:'Show Vouchers'}
      </button> 
    </Form> 
  )} 
  </Formik>
    {vouchers && <Vouchers vouchers={vouchers} setVouchers={setVouchers} voucherList={voucherList} />}
  </div> 
)}

export default CreateOrEdit