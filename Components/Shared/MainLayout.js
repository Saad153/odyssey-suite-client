import { CloseOutlined } from '@ant-design/icons';
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { companySelect, addCompanies } from '/redux/company/companySlice';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Select } from 'antd';
import Router, { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { setAccesLevels } from '/functions/setAccesLevels';
import logout from '/functions/logout';
import { setTab } from '/redux/tabs/tabSlice';
import { SlLogout } from "react-icons/sl";
import { FaRegBell } from "react-icons/fa";
import { incrementTab } from '/redux/tabs/tabSlice';

const { Header, Content, Sider } = Layout;

const MainLayout = ({children}) => {

  const newRouter = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [load, setLoad] = useState(true);
  const [searchingList, setSearchingList] = useState([]);
  const [company, setCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const items = setAccesLevels(dispatch, collapsed);
  const tabs = useSelector((state) => state.tabs.value);
  const tabItems = useSelector((state) => state.tabs.tabs);

  useEffect(() => { 
    getCompanies(); 
  }, [])

  useEffect(()=>{
    if(items.length>0){
      let newTemp = [];
      items.forEach((x)=>{
        x.children.forEach((y)=>{
          if(y){
            newTemp.push(y)
          }
        })
      })
      setSearchingList(newTemp);
    }
  }, [])

  async function getCompanies(){
    let companyValue = await Cookies.get('companyId');
    let tempUser = await Cookies.get('username');
    if(companyValue){
      dispatch(companySelect(companyValue));
      setCompany(companyValue);
    }
    setUsername(tempUser)
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_COMPANIES)
    .then((x)=>{
      setLoad(false);
      dispatch(addCompanies(x.data.result))
      let tempState = [];
      x.data.result.forEach((x, index) => {
        tempState[index]={value:x.id, label:x.title}
      });
      setCompanies(tempState)
    });
  }

  const handleChange = (value) => {
    Cookies.set('companyId', value, { expires: 1000000000 });
    setCompany(value);
    dispatch(companySelect(value))
    Router.push('/')
  };

  useEffect(() => {
    // When visiting pages inside folders the initial path in url confilts, so to this is mandatory for resolving it
    if(newRouter.pathname.includes("/clearanceJobs/import/sea/[id]")){
      setToggleState('9-4');
    }
    if(newRouter.pathname.includes("/clearanceJobs/import/air/[id]")){
      setToggleState('9-2');
    }   
    if(newRouter.pathname.includes("/clearanceJobs/export/sea/[id]")){
      setToggleState('8-4');
    }
    if(newRouter.pathname.includes("/clearanceJobs/export/air/[id]")){
      setToggleState('8-2');
    }
    if(newRouter.pathname.includes("/reports/jobBalancing/[id]")){
      setToggleState('5-1-1');
    }
    if(newRouter.pathname.includes("/reports/invoiceBalancing/[id]")){
      setToggleState('5-8');
    }
    if(newRouter.pathname.includes("/reports/ledgerReport/[id]")){
      setToggleState('5-7');
    }
    if(newRouter.pathname.includes("/reports/invoice/[id]")){
      setToggleState('2-11');
    }
    if(newRouter.pathname.includes("/reports/jobPLReport/report")){
      setToggleState('5-4-1');
    }
    if(newRouter.pathname.includes("/airJobs/manifest/[id]")){
      setToggleState('7-8');
    }
    if(newRouter.pathname.includes("/airJobs/import/bl/[id]")){
      setToggleState('7-6');
    }
    if(newRouter.pathname.includes("/airJobs/import/[id]")){
      setToggleState('7-5');
    }
    if(newRouter.pathname.includes("/airJobs/export/[id]")){
      setToggleState('7-2');
    }
    if(newRouter.pathname.includes("/airJobs/export/bl/[id]")){
      setToggleState('7-3');
    }
    if(newRouter.pathname.includes("/seaJobs/import/[id]")){
      setToggleState('4-6');
    }
    if(newRouter.pathname.includes("seaJobs/import/bl/[id]")){
      setToggleState('4-7');
    }
    if(newRouter.pathname.includes("seaJobs/export/[id]")){
      setToggleState('4-3');
    }
    if(newRouter.pathname.includes("/accounts/openingInvoices/[id]") && !newRouter.pathname.includes("/accounts/openingInvoices/list")){
      setToggleState('3-12');
    }
    if(newRouter.pathname.includes("/seaJobs/export/bl/[id]")){
      setToggleState('4-4');
    }
    if(newRouter.pathname.includes("accounts/vouchers/")){
      setToggleState('3-5');
    }
    if(!newRouter.pathname.includes("/accounts/officeVouchers/list") && newRouter.pathname.includes("/accounts/officeVouchers/")){
      setToggleState('3-8');
    }
    if(newRouter.pathname.includes("setup/client") && !newRouter.pathname.includes("setup/clientList")){
      setToggleState('2-7');
    }
    if(newRouter.pathname.includes("setup/vendor") && !newRouter.pathname.includes("setup/vendorList")){
      setToggleState('2-8');
    }
    if(newRouter.pathname.includes("setup/voyage")){
      setToggleState('2-4');
    }
    if(newRouter.pathname.includes("tasks/riders/riderAssign/")){
      setToggleState('6-2');
    }
  }, [newRouter])

  const [toggleState, setToggleState] = useState(0);
  const [tabActive, setTabActive] = useState({
    home:false,
    requests:false,
    employee:false,
    clientList:false,
    client:false,
    accounts:false,
    history:false,
    vendorList:false,
    vendor:false,
    commodity:false,
    voyage:false,
    seJobList:false,
    siJobList:false,
    seJob:false,
    siJob:false,
    seBl:false,
    siBl:false,
    charges:false,
    invoiceBills:false,
    paymentReceipt:false,
    jobBalancing:false,
    jobBalancingReport:false,
    accountActivity:false,
    balanceSheet:false,
    voucherSys:false,
    voucherList:false,
    officeVoucherList:false,
    officeVoucher:false,
    openingBalanceList:false,
    openingBalance:false,
    openingInvoicesList:false,
    openingInvoice:false,
    jobPlReport:false,
    jobPlReportPage:false,
    riders:false,
    riderAssign:false,
    ledger:false,
    ledgerReport:false,
    invoiceBalancing:false,
    invoiceBalancingReport:false,
    nonGlParties:false,
    aeJobList:false,
    aeJob:false,
    aeBl:false,
    aiJobList:false,
    aiJob:false,
    aiBl:false,
    manifestList:false,
    manifest:false,

    aeClearanceJobList:false,
    aeClearanceJob:false,
    
    seClearanceJobList:false,
    seClearanceJob:false,
    
    aiClearanceJobList:false,
    aiClearanceJob:false,

    siClearanceJobList:false,
    siClearanceJob:false,
  });
  
  const memoizedAlterTabs = () => {
    if(Object.keys(tabs).length>0){
      let tempTabs = [...tabItems];
      let cancel = false;
      tempTabs.forEach((x,i) => {
        if(x.key==tabs.key){
          cancel = true;
        }
      })
      if(cancel==false){
        tempTabs.push(tabs);
        let tempTabActive = {...tabActive};
        if(tabs.key=='1-1'){ tempTabActive.home=true }
        else if(tabs.key=='1-2'){ tempTabActive.requests=true }
        else if(tabs.key=='2-1'){ tempTabActive.employee=true }
        else if(tabs.key=='2-2'){ tempTabActive.clientList=true }
        else if(tabs.key=='2-7'){ tempTabActive.client=true }
        else if(tabs.key=='2-3'){ tempTabActive.commodity=true }
        else if(tabs.key=='2-4'){ tempTabActive.voyage=true }
        else if(tabs.key=='2-5'){ tempTabActive.vendorList=true }
        else if(tabs.key=='2-8'){ tempTabActive.vendor=true }
        else if(tabs.key=='2-9'){ tempTabActive.nonGlParties=true }
        else if(tabs.key=='2-6'){ tempTabActive.charges=true }
        else if(tabs.key=='3-1'){ tempTabActive.accounts=true }
        else if(tabs.key=='3-3'){ tempTabActive.invoiceBills=true }
        else if(tabs.key=='3-4'){ tempTabActive.paymentReceipt=true }
        else if(tabs.key=='3-5'){ tempTabActive.voucherSys=true }
        else if(tabs.key=='3-6'){ tempTabActive.voucherList=true }
        else if(tabs.key=='3-7'){ tempTabActive.officeVoucherList=true }
        else if(tabs.key=='3-8'){ tempTabActive.officeVoucher=true }
        else if(tabs.key=='3-9'){ tempTabActive.openingBalanceList=true }
        else if(tabs.key=='3-10'){ tempTabActive.openingBalance=true }
        else if(tabs.key=='3-11'){ tempTabActive.openingInvoicesList=true }
        else if(tabs.key=='3-12'){ tempTabActive.openingInvoice=true }
        else if(tabs.key=='4-1'){ tempTabActive.seJobList=true }
        else if(tabs.key=='4-2'){ tempTabActive.seBl=true }
        else if(tabs.key=='4-3'){ tempTabActive.seJob=true }
        else if(tabs.key=='4-4'){ tempTabActive.seBl=true }
        else if(tabs.key=='4-5'){ tempTabActive.siJobList=true }
        else if(tabs.key=='4-6'){ tempTabActive.siJob=true }
        else if(tabs.key=='4-7'){ tempTabActive.siBl=true }
        else if(tabs.key=='5-1'){ tempTabActive.jobBalancing=true }
        else if(tabs.key=='5-1-1'){ tempTabActive.jobBalancingReport=true }
        else if(tabs.key=='5-2'){ tempTabActive.accountActivity=true }
        else if(tabs.key=='5-3'){ tempTabActive.balanceSheet=true }
        else if(tabs.key=='5-4'){ tempTabActive.jobPlReport=true }
        else if(tabs.key=='5-4-1'){ tempTabActive.jobPlReportPage=true }
        else if(tabs.key=='5-5'){ tempTabActive.ledger=true }
        else if(tabs.key=='5-6'){ tempTabActive.invoiceBalancing=true }
        else if(tabs.key=='5-8'){ tempTabActive.invoiceBalancingReport=true }
        else if(tabs.key=='5-7'){ tempTabActive.ledgerReport=true }
        else if(tabs.key=='6-1'){ tempTabActive.riders=true }
        else if(tabs.key=='6-1'){ tempTabActive.riderAssign=true }
        else if(tabs.key=='7-1'){ tempTabActive.aeJobList=true }
        else if(tabs.key=='7-2'){ tempTabActive.aeJob=true }
        else if(tabs.key=='7-3'){ tempTabActive.aeBl=true }
        else if(tabs.key=='7-4'){ tempTabActive.aiJobList=true }
        else if(tabs.key=='7-5'){ tempTabActive.aiJob=true }
        else if(tabs.key=='7-6'){ tempTabActive.aiBl=true }
        else if(tabs.key=='7-7'){ tempTabActive.manifestList=true }
        else if(tabs.key=='7-8'){ tempTabActive.manifest=true }

        else if(tabs.key=='8-1'){ tempTabActive.aeClearanceJobList=true }
        else if(tabs.key=='8-2'){ tempTabActive.aeClearanceJob=true }

        else if(tabs.key=='8-3'){ tempTabActive.seClearanceJobList=true }
        else if(tabs.key=='8-4'){ tempTabActive.seClearanceJob=true }

        else if(tabs.key=='9-1'){ tempTabActive.aiClearanceJobList=true }
        else if(tabs.key=='9-2'){ tempTabActive.aiClearanceJob=true }

        else if(tabs.key=='9-3'){ tempTabActive.siClearanceJobList=true }
        else if(tabs.key=='9-4'){ tempTabActive.siClearanceJob=true }
        // else if(tabs.key=='8-8'){ tempTabActive.aeClearanceJobList=true }
        // else if(tabs.key=='8-8'){ tempTabActive.siClearanceJobList=true }
        // else if(tabs.key=='8-8'){ tempTabActive.seClearanceJobList=true }
        
        dispatch(setTab(tempTabs))
        //setTabItems(tempTabs);
        setTabActive(tempTabActive);
      }
    }
  };

  useEffect(() => memoizedAlterTabs(), [tabs]);

  const setKey = (value) => {
    let result = "";
    let index = 0;
    if(tabs.id!=value.id && tabs.key==value.key){
      let tempTabes = [...tabItems];
      tempTabes.forEach((x, i)=>{
        if(x.key==value.key){
          index = i
        }
      })
      tempTabes = tempTabes.filter((x)=>{
        return x.key!=value.key;
      })
      tempTabes.splice(index,0,tabs);
      dispatch(setTab(tempTabes));
      result = tabs.id
    }else{
      result = value.id
    }
    return result
  }

  const toggleTab = (x) => {
    setToggleState(x.key);
    if(x.key=='1-1'){ Router.push('/dashboard/home') }
    else if(x.key=='1-2'){ Router.push('/dashboard/requests') }
    else if(x.key=='2-1'){ Router.push('/employees') }
    else if(x.key=='2-2'){ Router.push('/setup/clientList') }
    else if(x.key=='2-10'){ Router.push('/setup/ports') }
    else if(x.key=='2-7'){ Router.push(`/setup/client/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='2-3'){ Router.push('/commodity') }
    else if(x.key=='2-4'){ Router.push('/setup/voyage') }
    else if(x.key=='2-5'){ Router.push('/setup/vendorList') }
    else if(x.key=='2-8'){ Router.push(`/setup/vendor/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='2-9'){ Router.push('/setup/nonGlPartiesList') }
    else if(x.key=='2-6'){ Router.push('/charges') }
    else if(x.key=='3-1'){ Router.push('/accounts/chartOfAccount') }
    else if(x.key=='3-2'){ Router.push('/accounts/accountActivity') }
    else if(x.key=='3-3'){ Router.push('/accounts/invoiceAndBills') }
    else if(x.key=='3-4'){ Router.push(`/accounts/paymentReceipt/${setKey(x)}`) }
    else if(x.key=='3-5'){ 
      //console.log(x);
      if(x.id){
        Router.push(`/accounts/vouchers/${setKey(x)}`)
      } else {
        setKey({...x, id:'new'})
        Router.push(`/accounts/vouchers/new`)
      }
    } //these routes are also settled in 2nd useEffect
    else if(x.key=='3-6'){ Router.push('/accounts/voucherList') }
    else if(x.key=='3-7'){ Router.push('/accounts/officeVouchers/list') }
    else if(x.key=='3-8'){ Router.push(`/accounts/officeVouchers/${setKey(x)}`) }
    else if(x.key=='3-9'){ Router.push(`/accounts/openingBalance/list`) }
    else if(x.key=='3-10'){ Router.push(`/accounts/openingBalance/${setKey(x)}`) }
    else if(x.key=='3-11'){ Router.push(`/accounts/openingInvoices/list`) }
    else if(x.key=='3-12'){ Router.push(`/accounts/openingInvoices/${setKey(x)}`) }
    else if(x.key=='4-1'){ Router.push('/seaJobs/seJobList') }
    else if(x.key=='4-2'){ Router.push('/seaJobs/export/blList') }
    else if(x.key=='4-3'){ Router.push(`/seaJobs/export/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='4-4'){ Router.push(`/seaJobs/export/bl/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='4-5'){ Router.push('/seaJobs/siJobList') }
    else if(x.key=='4-6'){ Router.push(`/seaJobs/import/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='4-7'){ Router.push(`/seaJobs/import/bl/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='5-1'){ Router.push('/reports/jobBalancing') }
    else if(x.key=='5-1-1'){ Router.push(`/reports/jobBalancing/${setKey(x)}`) }
    else if(x.key=='5-2'){ Router.push('/reports/accountActivity') }
    else if(x.key=='5-3'){ Router.push('/reports/balanceSheet') }
    else if(x.key=='5-4'){ Router.push('/reports/jobPLReport') }
    else if(x.key=='5-4-1'){ Router.push(`/reports/jobPLReport/report${setKey(x)}`) }
    else if(x.key=='5-5'){ Router.push('/reports/ledger') }
    else if(x.key=='5-6'){ Router.push('/reports/invoiceBalancing') }
    else if(x.key=='5-8'){ Router.push(`/reports/invoiceBalancing/${setKey(x)}`) }
    else if(x.key=='5-7'){ Router.push(`/reports/ledgerReport/${setKey(x)}`) }
    else if(x.key=='2-11'){ Router.push(`/reports/invoice/${setKey(x)}`) }
    else if(x.key=='6-1'){ Router.push('/tasks/riders') }
    else if(x.key=='6-2'){ Router.push(`/tasks/riders/riderAssign/${setKey(x)}`) }
    else if(x.key=='7-1'){ Router.push('/airJobs/aeJobList') }
    else if(x.key=='7-2'){ Router.push(`/airJobs/export/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='7-3'){ Router.push(`/airJobs/export/bl/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='7-4'){ Router.push(`/airJobs/aiJobList`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='7-5'){ Router.push(`/airJobs/import/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='7-6'){ Router.push(`/airJobs/import/bl/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    else if(x.key=='7-7'){ Router.push(`/airJobs/manifestList/`) }
    else if(x.key=='7-8'){ Router.push(`/airJobs/manifest/${setKey(x)}`) } //these routes are also settled in 2nd useEffect
    
    else if(x.key=='8-1'){ Router.push('/clearanceJobs/export/air/list') }
    else if(x.key=='8-2'){ Router.push(`/clearanceJobs/export/air/${setKey(x)}`) } 
    
    else if(x.key=='8-3'){ Router.push('/clearanceJobs/export/sea/list') }
    else if(x.key=='8-4'){ Router.push(`/clearanceJobs/export/sea/${setKey(x)}`) } 
    
    else if(x.key=='9-1'){ Router.push('/clearanceJobs/import/air/list') }
    else if(x.key=='9-2'){ Router.push(`/clearanceJobs/import/air/${setKey(x)}`) } 

    else if(x.key=='9-3'){ Router.push('/clearanceJobs/import/sea/list') }
    else if(x.key=='9-4'){ Router.push(`/clearanceJobs/import/sea/${setKey(x)}`) } 
  };

  const removeTab = (index) => {
    
    let tempTabs = [...tabItems];
    tempTabs = tempTabs.filter((x)=>{
      return x.key!=index
    })
    dispatch(setTab(tempTabs))
    if(toggleState==index){
      setToggleState(0)
    }
    if(tempTabs.length==0){
      Router.push('/')
    }
  };

  const searchPages = (e) => {
    let item;
    searchingList.forEach((x)=>{
      if(x.key==e){
        item = x
      }
    })
    toggleTab(item);
  }

  return (
  <Layout className="main-dashboard-layout">
      {/* sidebar  */}
    {!load && 
    <Sider trigger={null} collapsible collapsed={collapsed} 
      className='side-menu-styles' 
      style={{maxHeight:'100vh',overflowY:'auto'}}>
      <div className={!collapsed ? 'big-logo' : 'small-logo'}>
        <span>
          <img src={company=='1'?'/seanet-logo.png':company=='3'?'/aircargo-logo.png':company=='2'?'/cargolinkers-logo.png':null}/>
          {!collapsed && <p className='wh-txt'>Dashboard</p>}
        </span>
      </div>
      {!collapsed && <div className='px-3'>
        <Select showSearch style={{  width: "101%" }} placeholder="Search to Select" optionFilterProp="children" onChange={searchPages}
          filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
          filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase()) }
          options={searchingList.map((x)=>{
            return { value:x?.key, label:x?.label }
          })}
        />
      </div>}
      <Menu mode="inline" theme='dark' defaultSelectedKeys={['1']} items={!collapsed?items:[]} />
    </Sider>
    }
    <Layout className="site-layout">
    <Header className="site-layout-background" style={{padding:0}}>
    {collapsed && <span className="menu-toggler" onClick={() => setCollapsed(!collapsed)}><AiOutlineRight /></span>}
    {!collapsed && <span className="menu-toggler" onClick={() => setCollapsed(!collapsed)} ><AiOutlineLeft /></span>}
    <Select style={{width: 155, opacity:0.9}} onChange={handleChange} options={companies} value={company} />
    {/* //admin links  */}
    {username=="Saad" &&<>
      <span className='mx-3'></span>
      <span className='mx-1 my-3 cur p-2' style={{border:'1px solid grey'}} onClick={()=>Router.push("/seaJobs/seJobList")}>SE</span>
      <span className='mx-1 my-3 cur p-2' style={{border:'1px solid grey'}} onClick={()=>Router.push("/seaJobs/siJobList")}>SI</span>
      <span className='mx-1 my-3 cur p-2' style={{border:'1px solid grey'}} onClick={()=>Router.push("/airJobs/aeJobList")}>AE</span>
      <span className='mx-1 my-3 cur p-2' style={{border:'1px solid grey'}} onClick={()=>Router.push("/airJobs/aiJobList")}>AI</span>
      <span className='mx-1 my-3 cur p-2' style={{border:'1px solid grey'}} onClick={()=>{
        dispatch(incrementTab({ "label": "Ports of Discharge", "key": "2-10" }))
        }}>Ports</span>
    </>}
      <span style={{color:'black'}} className='mx-3' ><b>Welcome, </b> {username} </span>
      <span style={{float:'right', color:'black'}} className='mx-5 cur' onClick={()=>logout()}> 
        <SlLogout className='mx-2' style={{position:'relative', bottom:2}} />Logout
      </span>
      <span style={{float:"right", color:'black'}} className='mx-5 cur' >
        <FaRegBell size={"20"} className='mx-2' style={{position:"relative", bottom:"2"}}/>
      </span>
    </Header>
    <Content style={{ margin:'24px 16px', padding:0, minHeight:280}}> 
    <div className='dashboard-styles'>
      <div className="bloc-tabs">
        {tabItems.map((x, index)=>{
          return(
          <div key={index} className={toggleState===x.key?"tabs active-tabs":"tabs"}>
            <button onClick={()=>toggleTab(x)}> {x.label} </button>
              <CloseOutlined onClick={()=>removeTab(x.key)} className='clos-btn'/>
          </div>
        )})}
      </div>
      <div className="content-tabs">
        {children}
      </div>
    </div>
    </Content>
    </Layout>
  </Layout>
)};

export default React.memo(MainLayout);
