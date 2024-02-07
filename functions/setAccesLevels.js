import Cookies from "js-cookie";
import { incrementTab } from '/redux/tabs/tabSlice';
import { AccountBookOutlined, HomeOutlined, SettingOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { IoMdArrowDropleft } from "react-icons/io";
import { RiShipLine } from "react-icons/ri";

function setAccesLevels(dispatch, collapsed){
    let items = [];
    let obj = { seaJobs:false, ae:false, setup:false, accounts:false, admin:false }
    let levels = Cookies.get("access");
    let company = Cookies.get("companyId");

    const dashboard = getParentItem('Dashboard', '1', <HomeOutlined />,[
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
      getItem('Employees', '2-1',<></>, null, {
        label: `Employees`,
        key: '2-1',
        children: `Content of Tab Pane 2`,
      }),
      (levels?.includes("accounts")||levels?.includes("admin"))?getItem('Client List', '2-2',<></>, null, {
        label: `Client List`,
        key: '2-2',
        children: `Content of Tab Pane 2`,
      }):null,
      (levels?.includes("accounts")||levels?.includes("admin"))?getItem('Vendor List', '2-5',<></>, null, {
        label: `Vendor List`,
        key: '2-5',
        children: `Content of Tab Pane 2`,
      }):null,
      getItem('Non-GL Parties', '2-9',<></>, null, {
        label: `Non-GL Parties`,
        key: '2-9',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Commodity', '2-3',<></>, null, {
        label: `Commodity`,
        key: '2-3',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Voyage', '2-4',<></>, null, {
        label: `Voyage`,
        key: '2-4',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Charges', '2-6',<></>, null, {
        label: `Charges`,
        key: '2-6',
        children: `Content of Tab Pane 2`,
      }),
    ]
    )
    const accounts = getParentItem('Accounts', '3', <AccountBookOutlined />,
    [
      getItem('Chart Of Account', '3-1',<></>, null, {
        label: `Chart Of Account`,
        key: '3-1',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Invoice / Bills', '3-3',<></>, null, {
        label: `Invoice / Bills`,
        key: '3-3',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Payment / Receipt', '3-4',<></>, null, {
        label: `Payment / Receipt`,
        key: '3-4',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Voucher', '3-5',<></>, null, {
        label: `Voucher`,
        key: '3-5',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Voucher List', '3-6',<></>, null, {
        label: `Voucher List`,
        key: '3-6',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Office Voucher List', '3-7',<></>, null, {
        label: `Office Voucher List`,
        key: '3-7',
        children: `Content of Tab Pane 3-7`,
      }),
      getItem('Opening Balances', '3-9',<></>, null, {
        label: `Opening Balances`,
        key: '3-9',
        children: `Content of Tab Pane 3-7`,
      }),
      getItem('Opening Invoices', '3-11',<></>, null, {
        label: `Opening Invoices`,
        key: '3-11',
        children: `Content of Tab Pane 3-11`,
      }),
    ]
    )
    const reports = getParentItem('Reports', '5', <HiOutlineDocumentSearch/>,
    [
      getItem('Job Balancing', '5-1',<></>, null, {
        label: `Job Balancing`,
        key: '5-1',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Account Activity', '5-2',<></>, null, {
        label: `Account Activity`,
        key: '5-2',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Balance Sheet', '5-3',<></>, null, {
        label: `Balance Sheet`,
        key: '5-3',
        children: `Content of Tab Pane 3`,
      }),
      getItem('Job Profit/Loss', '5-4',<></>, null, {
        label: `Job Profit/Loss`,
        key: '5-4',
        children: `Content of Tab Pane 3`,
      }),
      getItem('Ledger', '5-5',<></>, null, {
        label: `Ledger`,
        key: '5-5',
        children: `Content of Tab Pane 3`,
      }),
      getItem('Agent Inv. Balance', '5-6',<></>, null, {
        label: `Agent Invoice Balancing`,
        key: '5-6',
        children: `Content of Tab Pane 3`,
      }),
    ]
    )
    const seaJobs = getParentItem('Sea Jobs', '4', <span className=''><RiShipLine /><IoMdArrowDropleft className='flip' /></span>,
    [
      getItem('Export Job List', '4-1',<></>, null, {
        label: `Export Jobs`,
        key: '4-1',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Import Job List', '4-5',<></>, null, {
        label: `Import Jobs`,
        key: '4-5',
        children: `Content of Tab Pane 2`,
      }),
    ]
    )
    const airJobs = getParentItem('Air Jobs', '7', <span className=''><RiShipLine /><IoMdArrowDropleft className='flip' /></span>,
    [
      getItem('Export Job List', '7-1',<></>, null, {
        label: `Air Export Jobs`,
        key: '7-1',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Import Job List', '7-4',<></>, null, {
        label: `Air Import Jobs`,
        key: '7-4',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Manifest List', '7-7',<></>, null, {
        label: `Manifest List`,
        key: '7-7',
        children: `Content of Tab Pane 2`,
      }),
      // getItem('AWB List', '7-2',<></>, null, {
      //   label: `Air AWBs`,
      //   key: '7-2',
      //   children: `Content of Tab Pane 2`,
      // }),
    ]
    )
    const tasks = getParentItem('Tasks', '6', <UnorderedListOutlined  />,
    [
      getItem('Riders List', '6-1',<></>, null, {
        label: `Riders List`,
        key: '6-1',
        children: `Content of Tab Pane 2`,
      }),
    ]
    )
    const exportJobs = getParentItem('Export Jobs', '8', <span className=''><RiShipLine /><IoMdArrowDropleft className='flip' /></span>,
    [
      getItem('Air Export Jobs List', '8-1',<></>, null, {
        label: `Air Export Jobs List`,
        key: '8-1',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Sea Export Jobs List', '8-3',<></>, null, {
        label: `Sea Export Jobs List`,
        key: '8-3',
        children: `Content of Tab Pane 2`,
      }),
    ]
    )
    const importJobs = getParentItem('Import Jobs', '9', <span className=''><RiShipLine /><IoMdArrowDropleft className='flip' /></span>,
      [
        getItem('Air Import', '9-1',<></>, null, {
          label: `Air Import`,
          key: '9-1',
          children: `Content of Tab Pane 2`,
        }),
        getItem('Sea Import', '9-3',<></>, null, {
          label: `Sea Import`,
          key: '9-3',
          children: `Content of Tab Pane 2`,
        }),
      ]
    )

    function getParentItem(label, key, icon, children) {
      return { key, icon, children, label}
    }
    function getItem(label, key, icon, children, tab) {
      return { key, icon, children, label,
      onClick:()=>{
        if(!collapsed){ dispatch(incrementTab(tab)); }
      }
    }}


    if(levels){
      levels = levels.slice(0, -1)
      levels = levels.substring(1);
      levels = levels.split(", ")
      levels.forEach(x => {
      switch (x) {
        case "se":
            obj.seaJobs = true;
            break;
        case "ae":
            obj.airJobs = true;
            break;
        case "setup":
            obj.setup = true;
            break;
        case "accounts":
            obj.accounts = true;
            break;
        case "admin":
            obj.admin = true;
            break;
        default:
            break;
        }
      });
    }
    if(company!='2'){
      obj.seaJobs?
      items.push(seaJobs):null;
      obj.airJobs?
      items.push(airJobs):null;
    }else {
      obj.seaJobs?
      items.push(exportJobs):null;
      obj.airJobs?
      items.push(importJobs):null;

    }
    obj.setup?
    items.push(setup):null
    
    obj.accounts?
    items = [
      seaJobs,
      airJobs,
      accounts,
      reports
    ]:null
    obj.admin?
      items = [
        //dashboard,
        exportJobs,
        importJobs,
        setup,
        accounts,
        seaJobs,
        airJobs,
        reports
    ]:null
    Cookies.set("permissions", JSON.stringify(obj));
    items.unshift(dashboard)
    items.push(tasks)
    return items
}

export { setAccesLevels }