import { Spinner, Table } from "react-bootstrap";
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import PrintTopHeader from '/Components/Shared/PrintTopHeader';
import { AiFillPrinter } from "react-icons/ai";
import ReactToPrint from 'react-to-print';
import Cookies from "js-cookie";
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react';
import { CSVLink } from "react-csv";
import { incrementTab } from '/redux/tabs/tabSlice';
import { useDispatch } from 'react-redux';
import Router from 'next/router';
import Pagination from "/Components/Shared/Pagination";
import exportExcelFile from "/functions/exportExcelFile";

const JobBalancingReport = ({ result, query }) => {

  let inputRef = useRef(null);
  const [load, setLoad] = useState(true);
  const [records, setRecords] = useState([]);
  const [username, setUserName] = useState("");
  const dispatch = useDispatch();
  const commas = (a) => a ? parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") : '0.0';

  const getTotal = (type, list) => {
    let values = 0.00;
    list.forEach((x) => {
      if (type == x.payType) {
        values = values + x.total
      }
    })
    return commas(values);
  }

  const paidReceivedTotal = (list) => {
    let paid = 0.00, Received = 0.00, total = 0.00;
    list.forEach((x) => {
        if (x.payType == "Payble") {
            paid = paid + parseFloat(x.paid)
        } else {
            Received = Received + parseFloat(x.recieved)
        }
    })
    total = Received - paid
    return total > 0 ? commas(total) : (`${commas(total * -1)}`);
  }

  const balanceTotal = (list) => {
    let balance = 0.00;
    list.forEach((x) => {
      if (x.payType == "Payble") {
        balance = balance - parseFloat(x.balance)
      } else {
        balance = balance + parseFloat(x.balance)
      }
    })
    return balance > 0 ? commas(balance) : (`${commas(balance * -1)}`);
  }

  const getAge = (date) => {
    let date1 = new Date(date);
    let date2 = new Date();
    let difference = date2.getTime() - date1.getTime();
    return parseInt(difference / 86400000)
  }

  useEffect(() => {
    getValues(result);
    getUserName();
    async function getUserName() {
      let name = await Cookies.get("username");
      setUserName(name)
    }
  }, [])

  async function getValues(value) {
    if (value.status == "success") {
    let newArray = [...value.result];
    await newArray.forEach((y, i) => {
      y.no = i + 1;
      y.balance = y.payType == "Recievable" ?
        (parseFloat(y.total) + parseFloat(y.roundOff) - parseFloat(y.recieved)) :
        (parseFloat(y.total) + parseFloat(y.roundOff) - parseFloat(y.paid));
      y.total = (parseFloat(y.total)) + parseFloat(y.roundOff)
      y.paid = (parseFloat(y.paid)) + parseFloat(y.roundOff)
      y.recieved = (parseFloat(y.recieved)) + parseFloat(y.roundOff)
      y.age = getAge(y.createdAt);
      y.freightType = y?.SE_Job?.freightType == "Prepaid" ? "PP" : "CC"
      y.fd = y?.SE_Job?.fd;
      y.createdAt = moment(y.createdAt).format("DD-MMM-YY")
      y.hbl = y?.SE_Job?.Bl?.hbl
      
      y.recievable = y.payType == "Recievable" ? commas(y.total) : "-";
      y.payble = y.payType != "Recievable" ? commas(y.total) : "-";
      y.balanced = parseFloat(y.payType == "Recievable" ? y.recieved : y.paid);
      y.finalBalance = y.payType != "Recievable" ? (`${commas(y.balance)}`) : commas(y.balance)

      // <td style={{ textAlign: 'right' }} >{x.payType == "Recievable" ? x.total : "-"}</td>
      // <td style={{ textAlign: 'right' }} >{x.payType != "Recievable" ? x.total : "-"}</td>
      // <td style={{ textAlign: 'right' }} >{x.payType == "Recievable" ? x.recieved : x.paid}</td>
      // <td style={{ textAlign: 'right' }} >{x.payType != "Recievable" ? (${x.balance}) : x.balance}</td>
    })
    if(query.options!="showall"){
      newArray = await newArray.filter((x)=>{
        return x.balance>10
      })
    }
    setRecords(newArray);
    } else {}
    setLoad(false)
  }

  // Pagination Variables
  const [currentPage,setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const indexOfLast = currentPage * recordsPerPage ;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = records ? records.slice(indexOfFirst,indexOfLast) : [];
  const noOfPages = records ? Math.ceil(records.length / recordsPerPage) : 0 ;
  // Pagination Variables

  const TableComponent = ({overflow}) => {
    return (
    <>
    {!load &&
      <>
      {records?.length > 0 &&
        <>
          <PrintTopHeader company={query.company} />
          <hr className='mb-2' />
          <div className='table-sm-1' style={{ maxHeight: overflow ? 530 : "50%", overflowY: 'auto' }}>
          <Table className='tableFixHead' bordered style={{ fontSize: 11 }}>
            <thead>
              <tr>
                <th className='text-center'>#</th>
                <th className='text-center' style={{ minWidth: 110 }}>Inv. No</th>
                <th className='text-center' style={{ minWidth: 50 }}>Job. No</th>
                <th className='text-center' style={{ minWidth: 90 }}>Job. Date</th>
                <th className='text-center' style={{ minWidth: 90 }}>Date</th>
                <th className='text-center' style={{ minWidth: 100 }}>HBL/HAWB</th>
                <th className='text-center' style={{ minWidth: 100 }}>MBL/MAWB</th>

                <th className='text-center' style={{ minWidth: 100 }}>Sailing Date</th>
                <th className='text-center'style={{ minWidth: 100 }}>Arrival Date</th>
                <th className='text-center'style={{ minWidth: 200 }}>Name</th>
                <th className='text-center'style={{ minWidth: 100 }}>Client Code</th>
                <th className='text-center'style={{ minWidth: 100 }}>Shipper</th>
                <th className='text-center' style={{ minWidth: 100 }}>Consignee</th>
                <th className='text-center'style={{ minWidth: 100 }}>Sales Representator</th>
                <th className='text-center'style={{ minWidth: 100 }}>Shipping Line</th>
                <th className='text-center' style={{ minWidth: 100 }}>Vessel</th>
                <th className='text-center'style={{ minWidth: 100 }}>F. Dest</th>
                <th className='text-center'>J/Tp</th>
                <th className='text-center'>F/Tp</th>
                <th className='text-center'>Weight</th>
                <th className='text-center'>Volume</th>
                <th className='text-center'>Currency</th>
                <th className='text-center' style={{ minWidth: 100 }}>Debit</th>
                <th className='text-center'style={{ minWidth: 100 }}>Credit</th>
                <th className='text-center'style={{ minWidth: 100 }}>Paid/Rcvd</th>
                <th className='text-center'style={{ minWidth: 100 }}>Balance</th>
                <th className='text-center'>Age</th>
              </tr>
            </thead>
            <tbody>
              {/* without print  */}
              {overflow ? currentRecords.map((x,i)=>{
                const date = x.SE_Job?.jobDate;
                const formattedDate = moment(date).format('DD-MMM-YYYY');
                const sailDate = x.SE_Job?.shipDate;
                const formattedSailDate = moment(sailDate).format('DD-MMM-YYYY');
                const arrivalDate = x.SE_Job?.arrivalDate;
                let formattedArrivalDate;
                if(arrivalDate)
                {
                 formattedArrivalDate = moment(arrivalDate).format('DD-MMM-YYYY');

                }

              return (
                <tr key={i}>
                  <td style={{ maxWidth: 10 }}>{i + 1}</td>
                  <td 
                    className="blue-txt"
                    style={{ width: 90, cursor:"pointer"}} 
                    onClick={async ()=>{
                      await Router.push(`/reports/invoice/${x.id}`)
                      dispatch(incrementTab({ "label": "Invoice Details", "key": "2-11", "id":`${x.id}`}))
                    }}
                  >{x.invoice_No}</td>
                  <td 
                    style={{ width: 90, cursor:"pointer"}} 
                    className="blue-txt"
                    onClick={()=>{
                      let type = x?.SE_Job?.operation;
                      if(x?.SE_Job?.jobNo){
                        dispatch(incrementTab({
                        "label":type=="SE"?"SE JOB":type=="SI"?"SI JOB":type=="AE"?"AE JOB":"AI JOB",
                        "key":type=="SE"?"4-3":type=="SI"?"4-6":type=="AE"?"7-2":"7-5",
                        "id":x.SE_Job.id
                        }))
                        Router.push(type=="SE"?`/seaJobs/export/${x.SE_Job.id}`:type=="SI"?`/seaJobs/import/${x.SE_Job.id}`:
                          type=="AE"?`/airJobs/export/${x.SE_Job.id}`:`/airJobs/import/${x.SE_Job.id}`
                        )
                      }
                    }
                  }>
                    {x?.SE_Job?.jobNo}
                  </td>
                  <td style={{width:150}}>{formattedDate}</td>
                  <td style={{}}>{x.createdAt}</td>
                  <td style={{width:50}}>{x.hbl}</td>
                  <td style={{width:50}}>{x.SE_Job?.Bl?.mbl}</td>
                  <td style={{width:50}}>{formattedSailDate}</td>
                  <td style={{width:50}}>{formattedArrivalDate}</td> 
                  <td style={{width:150}}><b>{x.party_Name}</b></td>
                  <td style={{width:150}}><b>{x.SE_Job?.Client?.code}</b></td>
                  <td style={{width:150}}><b>{x.SE_Job?.Client?.name}</b></td>
                  <td style={{width:150}}><b>{x.SE_Job?.consignee?.name}</b></td>
                  <td style={{width:150}}><b>{x.SE_Job?.sales_representator?.name}</b></td>
                  <td style={{ maxWidth: 70 }}>{x.SE_Job?.shipping_line?.name}</td>
                  <td style={{ maxWidth: 70 }}>{x.SE_Job?.Vessel?.name}</td>
                  <td style={{ maxWidth: 70 }}>{x.fd}</td>
                  <td style={{width:20}}>{x.SE_Job?.subType}</td>
                  <td style={{width:20}}>{x.freightType}</td>
                  <td style={{width:20}}>{x.SE_Job?.weight}</td>
                  <td style={{width:20}}>{x.SE_Job?.vol}</td>
                  <td style={{width:20}}>{x.currency}</td>
                  <td style={{ textAlign: 'right' }} >{x.recievable}</td>
                  <td style={{ textAlign: 'right' }} >{x.payble}</td>
                  <td style={{ textAlign: 'right' }} >{x.balanced}</td>
                  <td style={{ textAlign: 'right' }} >{x.finalBalance}</td>
                  <td style={{ width: 1 }}>{x.age}</td>
                </tr>
              )}) : 
              // print mode 
              records.map((x, i) => {
                  return (
                  <tr key={i}>
                    <td style={{ maxWidth: 30 }}>{i + 1}</td>
                    <td style={{ maxWidth: 90, paddingLeft: 3, paddingRight: 3, cursor:"pointer"}} className="blue-txt"
                      onClick={async ()=>{
                        await Router.push(`/reports/invoice/${x.id}`)
                        dispatch(incrementTab({ "label": "Invoice Details", "key": "2-11", "id":`${x.id}` }))
                      }}
                    >{x.invoice_No}</td>
                    <td style={{}}>{x.createdAt}</td>
                    <td style={{}}>{x.hbl}</td>
                    <td style={{}}>{x.party_Name}</td>
                    <td style={{ maxWidth: 90 }}>{x.fd}</td>
                    <td style={{}}>{x.freightType}</td>
                    <td style={{}}>{x.currency}</td>
                    <td style={{ textAlign: 'right' }} >{x.payType == "Recievable" ? x.total : "-"}</td>
                    <td style={{ textAlign: 'right' }} >{x.payType != "Recievable" ? x.total : "-"}</td>
                    <td style={{ textAlign: 'right' }} >{x.payType == "Recievable" ? x.recieved : x.paid}</td>
                    <td style={{ textAlign: 'right' }} >{x.payType != "Recievable" ? (`${x.balance}`) : x.balance}</td>
                    <td style={{ textAlign: 'center' }}>{x.age}</td>
                  </tr>
                  )
              })}
              {/* in print */}
              {!overflow && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'right' }}><b>Total</b></td>
                  <td style={{ textAlign: 'right' }}>{getTotal("Recievable", records)}</td>
                  <td style={{ textAlign: 'right' }}>{getTotal("Payble", records)}</td>
                  <td style={{ textAlign: 'right' }}>{paidReceivedTotal(records)}</td>
                  <td style={{ textAlign: 'right' }}>{balanceTotal(records)}</td>
                  <td style={{ textAlign: 'center' }}>-</td>
                </tr>
              )}
              {/* showing total in the last page  */}
              {overflow && currentPage === noOfPages && (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colSpan={8} style={{ textAlign: 'right' }}><b>Total</b></td>
                  <td style={{ textAlign: 'right' }}>{getTotal("Recievable", records)}</td>
                  <td style={{ textAlign: 'right' }}>{getTotal("Payble", records)}</td>
                  <td style={{ textAlign: 'right' }}>{paidReceivedTotal(records)}</td>
                  <td style={{ textAlign: 'right' }}>{balanceTotal(records)}</td>
                  <td style={{ textAlign: 'center' }}>-</td>
                </tr>
              )}
            </tbody>
          </Table>
          </div>
          {overflow && <div className="d-flex justify-content-end mt-4">
            <Pagination noOfPages={noOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
          </div>
          }
        </>
      }
      {records.length == 0 && <>No Similar Record</>}
      </>
    }
    {load && <div className='text-center py-5 my-5'> <Spinner /> </div>}
    </>
  )}

  function dateCellFormatter(params) {
    const date = moment(params.value);
    return date.isValid() ? date.format('DD-MMM-YYYY') : null;
}

  const gridRef = useRef();
  const [columnDefs, setColumnDefs] = useState([
    { headerName: '#', field: 'no', width: 50 },
    { headerName: 'Inv. No', field: 'invoice_No', filter: true,
          cellRenderer: params => {
              return <span style={{cursor:"pointer"}} onClick={ async()=>{
                  await Router.push(`/reports/invoice/${params.data.id}`)
                  dispatch(incrementTab({ "label": "Invoice Details", "key": "2-11", "id":`${params.data.id}` }))
              }}>{params.data.invoice_No}</span>;
          }
    },
    { headerName: 'Job. No', field: 'SE_Job.jobNo', filter: true},
    { headerName: 'Job Date', field: 'SE_Job.jobDate', filter: true,
      cellRenderer: dateCellFormatter
    },
    { headerName: 'Date', field: 'createdAt', filter: true },
    { headerName: 'HBL/HAWB', field: 'hbl', filter: true },
    { headerName: 'MBL/MAWB', field: 'SE_Job.Bl.mbl', filter: true },
    { headerName: 'Sailing Date', field: 'SE_Job.shipDate', filter: true ,
      cellRenderer: dateCellFormatter
    },
    { headerName: 'Arrival Date', field: 'SE_Job.arrivalDate', filter: true ,
      cellRenderer: dateCellFormatter
    },
    { headerName: 'Name', field: 'party_Name', width: 224, filter: true },
    { headerName: 'Client Code', field: 'SE_Job.Client.code', width: 224, filter: true },
    { headerName: 'Shipper', field: 'SE_Job.Client.name', width: 224, filter: true },
    { headerName: 'Consignee', field: 'SE_Job.consignee.name', width: 224, filter: true },
    { headerName: 'Sales Representator', field: 'SE_Job.sales_representator.name', width: 224, filter: true },
    { headerName: 'Shipping Line', field: 'SE_Job.shipping_line.name', width: 224, filter: true },
    { headerName: 'Vessel', field: 'SE_Job.Vessel.name', width: 224, filter: true },
    { headerName: 'F. Dest', field: 'fd', filter: true },
    { headerName: 'J/Tp', field: 'subType', filter: true },
    { headerName: 'F/Tp', field: 'ppcc', filter: true },
    { headerName: 'Weight', field: 'SE_Job.weight', filter: true },
    { headerName: 'Vol', field: 'SE_Job.vol', filter: true },
    { headerName: 'Curr', field: 'currency', filter: true },
    {headerName: 'Debit', field: 'total', filter: true,
      cellRenderer: params => {
        return <>{params.data.payType != "Payble" ? commas(params.value) : "-"}</>;
      }
    },
    {
      headerName: 'Credit', field: 'total', filter: true,
      cellRenderer: params => {
        return <>{params.data.payType == "Payble" ? commas(params.value) : "-"}</>;
      }
    },
    {
      headerName: 'Paid/Rcvd', field: 'paid', filter: true,
      cellRenderer: params => {
        return <>{commas(params.data.payType == "Payble" ? params.data.paid : params.data.recieved)}</>;
      }
    },
    {
      headerName: 'Balance', field: 'balance', filter: true,
      cellRenderer: params => {
        return <>{commas(params.value)}</>;
      }
    },
    { headerName: 'Age', field: 'age', filter: true },
  ]);
  
  const defaultColDef = useMemo(() => ({ 
    sortable: true,
    resizable: true,
    filter: "agTextColumnFilter",
    floatingFilter: true,
  }));
  const getRowHeight = 38;
  const exportData = () => {
  
    exportExcelFile(
      currentRecords,
      [
          { header: "Invoice No.", key: "invoice_No", width: 18, height:10 },
          { header: "Job No.", key: "jobNo", width: 18, height:10 },
          { header: "Date", key: "createdAt", width: 15, height:10 },
          { header: "HBL/MBL", key: "hbl", width: 32, height:10 },
          { header: "Party", key: "party_Name", width: 32, height:10 },
          { header: "F.Dest", key: "fd", width: 32, height:10 },
          { header: "J/Tp", key: "subType", width: 12, height:10 },
          { header: "F/Tp", key: "freightType", width: 12, height:10 },
          { header: "Weight", key: "weight", width: 12, height:10 },
          { header: "volume", key: "vol", width: 12, height:10 },
          { header: "Currency", key: "currency", width: 12, height:10 },
          { header: "Debit", key: "recievable", width: 32, height:10 },
          { header: "Credit", key: "payble", width: 32, height:10 },
          { header: "Paid/Rcvd", key: "balanced", width: 32, height:10 },
          { header: "Balance", key: "finalBalance", width: 32, height:10 },
          { header: "Age", key: "age", width: 12, height:10 },
      ]
    )
  }

  return (
  <div className='base-page-layout'>
    {query.report == "viewer" && (
      <>
        <ReactToPrint content={() => inputRef} trigger={() => <AiFillPrinter className="blue-txt cur fl-r" size={30} />} />
        {/* <---- Excel Download button ----> */}
        <div className="d-flex justify-content-end " >
          <button className="btn-custom mx-2 px-3 fs-11 text-center" onClick={exportData}>To Excel</button>
        </div>
      </>
    )}
    {/* <---- Reports View only ----> */}
    {query.report == "viewer" && <TableComponent overflow={true}/>}
    {/* <---- list View only with filteration ----> */}
    {query.report != "viewer" &&
    <div className="ag-theme-alpine" style={{ width: "100%", height: '72vh' }}>
      <AgGridReact
        ref={gridRef} // Ref for accessing Grid's API
        rowData={records} // Row Data for Rows
        columnDefs={columnDefs} // Column Defs for Columns
        defaultColDef={defaultColDef} // Default Column Properties
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        rowSelection='multiple' // Options - allows click selection of rows
        getRowHeight={getRowHeight}
        pagination={true}
        paginationPageSize={20}
      />
    </div>
    }
    {/* <---- Component that will be displaying in print mode  ----> */}
    <div style={{ display: 'none' }}>
      <div className="pt-5 px-3" ref={(response) => (inputRef = response)}>
        {/* <---- Setting overflow true while in printing ----> */}
        <TableComponent overflow={false}/>
        <div style={{ position: 'absolute', bottom: 10 }}>Printed On: {`${moment().format("YYYY-MM-DD")}`}</div>
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}>Printed By: {username}</div>
      </div>
    </div>
  </div>
  )
};

export default React.memo(JobBalancingReport)