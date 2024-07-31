import Cookies from "js-cookie";
import { incrementTab } from '/redux/tabs/tabSlice';
import { AccountBookOutlined, HomeOutlined, SettingOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { IoMdArrowDropleft } from "react-icons/io";
import { RiShipLine } from "react-icons/ri";
import jwt_decode from 'jwt-decode';
import { Router } from "next/router";
import logout from '/functions/logout';
let firstCall = true;
let tempToken;

export const setTempToken = (token, call) => {
  tempToken = token;
  firstCall = call;
};


function setAccesLevels(dispatch, collapsed){
  let items = [];
  if(firstCall && Cookies.get('token') != null){
    tempToken = Cookies.get('token');
    firstCall = false;
  }

  
  //getting the token from cookies and decoding it to get the access level array.
  let token = null;
  if(Cookies.get("token") != null && Cookies.get("token") != "" && Cookies.get("token") != "undefined"){
    if(tempToken == Cookies.get('token')){
      token = jwt_decode(Cookies.get("token")); 
    }else{
      logout();
    }
  }else if(!firstCall){
    logout();
  }

  let levels = null;
  if(token != null){
    levels = token.access;
  }

//getParentItem only returns the section data as objects to store in items array.
  const dashboard = getParentItem('Dashboard', '1', <HomeOutlined />,[

    //getItem only returns the subsection data as objects to store in parents children array.
    getItem('Home', '1-1',<></>, null, {
      label: `Home`,
      key: '1-1',
      children: `Content of Tab Pane 2`,
    }),
    getItem('Requests', '1-2',<></>, null, {
      label: `Requests`,
      key: '1-2',
      children: `Content of Tab Pane 2`,
    }),
  ])
  const setup = getParentItem('Setup', '2', <SettingOutlined />,
  [
    //checks whether the given strings are part of the access level array or not, and includes the subsection into the children array of the parent section.
    (levels?.includes("Employees")||levels?.includes("admin"))?getItem('Employees', '2-1', <></>, null, {
      label: 'Employees',
      key: '2-1',
      children: 'Content of Tab Pane 2',
    }):null,
    (levels?.includes("VendorList")||levels?.includes("admin"))?getItem('Vendor List', '2-5',<></>, null, {
      label: `Vendor List`,
      key: '2-5',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("NonGLParties")||levels?.includes("admin"))?getItem('Non-GL Parties', '2-9',<></>, null, {
      label: `Non-GL Parties`,
      key: '2-9',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("Commodity")||levels?.includes("admin"))?getItem('Commodity', '2-3',<></>, null, {
      label: `Commodity`,
      key: '2-3',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("Voyage")||levels?.includes("admin"))?getItem('Voyage', '2-4',<></>, null, {
      label: `Voyage`,
      key: '2-4',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("Charges")||levels?.includes("admin"))?getItem('Charges', '2-6',<></>, null, {
      label: `Charges`,
      key: '2-6',
      children: `Content of Tab Pane 2`,
    }):null,
  ]
  )
  const accounts = getParentItem('Accounts', '3', <AccountBookOutlined />,
  [
    (levels?.includes("ChartOfAccount")||levels?.includes("admin"))?getItem('Chart Of Account', '3-1',<></>, null, {
      label: `Chart Of Account`,
      key: '3-1',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("Invoice/Bills")||levels?.includes("admin"))?getItem('Invoice / Bills', '3-3',<></>, null, {
      label: `Invoice / Bills`,
      key: '3-3',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("Payment/Reciept")||levels?.includes("admin"))?getItem('Payment / Receipt', '3-4',<></>, null, {
      label: `Payment / Receipt`,
      key: '3-4',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("Voucher")||levels?.includes("admin"))?getItem('Voucher', '3-5',<></>, null, {
      label: `Voucher`,
      key: '3-5',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("VoucherList")||levels?.includes("admin"))?getItem('Voucher List', '3-6',<></>, null, {
      label: `Voucher List`,
      key: '3-6',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("OfficeVoucherList")||levels?.includes("admin"))?getItem('Office Voucher List', '3-7',<></>, null, {
      label: `Office Voucher List`,
      key: '3-7',
      children: `Content of Tab Pane 3-7`,
    }):null,
    (levels?.includes("OpeningBalances")||levels?.includes("admin"))?getItem('Opening Balances', '3-9',<></>, null, {
      label: `Opening Balances`,
      key: '3-9',
      children: `Content of Tab Pane 3-7`,
    }):null,
    (levels?.includes("OpeningInvoises")||levels?.includes("admin"))?getItem('Opening Invoices', '3-11',<></>, null, {
      label: `Opening Invoices`,
      key: '3-11',
      children: `Content of Tab Pane 3-11`,
    }):null   
  ]
  )
  const reports = getParentItem('Reports', '5', <HiOutlineDocumentSearch/>,
  [
    (levels?.includes("JobBalancing")||levels?.includes("admin"))?getItem('Job Balancing', '5-1',<></>, null, {
      label: `Job Balancing`,
      key: '5-1',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("AccountActivity")||levels?.includes("admin"))?getItem('Account Activity', '5-2',<></>, null, {
      label: `Account Activity`,
      key: '5-2',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("BalanceSheet")||levels?.includes("admin"))?getItem('Balance Sheet', '5-3',<></>, null, {
      label: `Balance Sheet`,
      key: '5-3',
      children: `Content of Tab Pane 3`,
    }):null,
    (levels?.includes("JobProfit/Loss")||levels?.includes("admin"))?getItem('Job Profit/Loss', '5-4',<></>, null, {
      label: `Job Profit/Loss`,
      key: '5-4',
      children: `Content of Tab Pane 3`,
    }):null,
    (levels?.includes("Ledger")||levels?.includes("admin"))?getItem('Ledger', '5-5',<></>, null, {
      label: `Ledger`,
      key: '5-5',
      children: `Content of Tab Pane 3`,
    }):null,
    (levels?.includes("AgentInvBalance")||levels?.includes("admin"))?getItem('Agent Inv. Balance', '5-6',<></>, null, {
      label: `Agent Invoice Balancing`,
      key: '5-6',
      children: `Content of Tab Pane 3`,
    }):null,
    (levels?.includes("TrialBalance")||levels?.includes("admin"))?getItem('Trial Balance', '5-9',<></>, null, {
      label: `Trial Balance`,
      key: '5-9',
      children: `Content of Tab Pane 3`,
    }):null,
    (levels?.includes("IncomeStatement")||levels?.includes("admin"))?getItem('Income statement', '5-11',<></>, null, {
      label: `Income statement`,
      key: '5-11',
      children: `Content of Tab Pane 3`,
    }):null    
  ]
  )
  const tasks = getParentItem('Tasks', '6', <UnorderedListOutlined  />,
    [
      getItem('Riders List', '6-1',<></>, null, {
        label: `Riders List`,
        key: '6-1',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Task List', '6-3',<></>, null, {
        label: `Task List`,
        key: '6-3',
        children: `Content of Tab Pane 2`,
      }),
    ]
  )
  const SeaJobs = getParentItem('Sea Jobs', '4', <span className=''><RiShipLine /><IoMdArrowDropleft className='flip' /></span>,
    [
      (levels?.includes("ExSea")||levels?.includes("admin"))?getItem('Sea Export Jobs List', '8-1',<></>, null, {
        label: `Sea Export Jobs List`,
        key: '4-1',
        children: `Content of Tab Pane 2`,
      }):null, 
      (levels?.includes("ImSea")||levels?.includes("admin"))?getItem('Sea Import Jobs List', '8-3',<></>, null, {
        label: `Sea Import Jobs List`,
        key: '4-3',
        children: `Content of Tab Pane 2`,
      }):null
    ]
  )
  const importJobs = getParentItem('Air Jobs', '7', <span className=''><RiShipLine /><IoMdArrowDropleft className='flip' /></span>,
    [
      (levels?.includes("ExAir")||levels?.includes("admin"))?getItem('Air Export Jobs List', '9-1',<></>, null, {
        label: `Air Export Jobs List`,
        key: '7-1',
        children: `Content of Tab Pane 2`,
      }):null, 
      (levels?.includes("ImAir")||levels?.includes("admin"))?getItem('Air Import Jobs List', '9-3',<></>, null, {
        label: `Air Import Jobs List`,
        key: '7-4',
        children: `Content of Tab Pane 2`,
      }):null,
    ]
  )

  //functions to generate objects from the parent and children data and rearranging the data within the object.
  function getParentItem(label, key, icon, children) {
    return { key, icon, children, label}
  }
  function getItem(label, key, icon, children, tab) {
    return { key, icon, children, label,
    onClick:()=>{
      if(!collapsed){ dispatch(incrementTab(tab)); }
    }
  }}

  console.log(reports)

  //Adds the related parents into the items array by checking if the user has access to any of the children.
  if(levels){
    levels = levels.split(", ")
    console.log(levels)
    levels.forEach(x => {
      switch (x) {
        case "ExSea":
        case "ExAir":
          items.indexOf(SeaJobs) === -1 ? items.push(SeaJobs) : null;
          break;
        case "ImAir":
        case "ImSea":
          items.indexOf(importJobs) === -1 ? items.push(importJobs) : null;
          break;
        case "Employees":
        case "ClientList":
        case "VendorList":
        case "NonGLParties":
        case "Commodity":
        case "Voyage":
          items.indexOf(setup) === -1 ? items.push(setup) : null;
          break;
        case "Charges":
        case "ChartofAccount":
        case "Invoice/Bills":
        case "Payment/Reciept":
        case "Voucher":
        case "VoucherList":
        case "OfficeVoucherList":
        case "OpeningBalances":
        case "OpeningInvoises":
          items.indexOf(accounts) === -1 ? items.push(accounts) : null;
          break;
        case "JobBalancing":
        case "AccountActivity":
        case "BalanceSheet":
        case "JobProfit/Loss":
        case "Ledger":
        case "AgentInvBalance":
        case "TrialBalance":
        case "IncomeStatement":
          items.indexOf(reports) === -1 ? items.push(reports) : null;
          break;
        case "admin":
          items = [
            SeaJobs,
            importJobs,
            setup,
            accounts,
            reports
        ]
          break;
        default:
          break;
      }
    });
    
  }

  items.unshift(dashboard)
  items.push(tasks)
  console.log(items)
  return items
}

export { setAccesLevels }