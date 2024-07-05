import moment from 'moment';
import ReactToPrint from 'react-to-print';
import { Spinner, Table } from "react-bootstrap";
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import PrintTopHeader from '/Components/Shared/PrintTopHeader';
import Cookies from "js-cookie";
import { AiFillPrinter } from "react-icons/ai";
import { useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';
import { AgGridReact } from 'ag-grid-react';
import { CSVLink } from "react-csv";
import Pagination from "/Components/Shared/Pagination";

const InvoiceBalancingReport = ({ result, query }) => {
    
  let inputRef = useRef(null);
  const dispatch = useDispatch();

  const [load, setLoad] = useState(true);
  const [records, setRecords] = useState([]);
  const [username, setUserName] = useState("");
  const commas = (a) => a ? parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") : '0.0';

  const getTotal = (type, list) => {
    let result = 0.00;
    list.forEach((x) => {
      if (type == x.payType) {
        result = result + parseFloat(x.total)
      }
    })
    return commas(result);
  }

  const paidReceivedTotal = (list) => {
    let paid = 0.00, Received = 0.00, total = 0.00;
    list.forEach((x) => {
      if (x.payType == "Payble") {
        paid = paid + parseFloat(x.paid)/parseFloat(x.ex_rate)
      } else {
        Received = Received + parseFloat(x.recieved)/parseFloat(x.ex_rate)
      }
    })
    total = Received - paid
    return total > 0 ? commas(total) : `(${commas(total * -1)})`;
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
    return balance > 0 ? commas(balance) : `(${commas(balance * -1)})`;
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
      newArray.forEach((x) => {
        console.log(x)
        let invAmount = 0;
        invAmount = parseFloat(x.total) / parseFloat(x.ex_rate);
        x.total = invAmount;
        x.createdAt = moment(x.createdAt).format("DD-MMM-YYYY")
        x.debit = x.payType == "Recievable" ? invAmount : 0
        x.credit = x.payType != "Recievable" ? invAmount : 0
        x.paidRec = x.payType == "Recievable" ? parseFloat(x.recieved)/parseFloat(x.ex_rate) : parseFloat(x.paid)/parseFloat(x.ex_rate);
        console.log(x.payType == "Recievable" ? (x.recieved):parseFloat(x.paid))
        x.balance = invAmount - x.paidRec
        x.age = getAge(x.createdAt);
      })
      setRecords(newArray);
    }
    setLoad(false)
  };

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
          {records.length > 0 &&
            <>
              <PrintTopHeader company={query.company} />
              <hr className='mb-2' />
              <div className='table-sm-1' style={{ maxHeight: overflow ? 600 : "100%", overflowY: 'auto' }}>
                <Table className='tableFixHead' bordered style={{ fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th className='text-center'>#</th>
                      <th className='text-center'>Inv. No</th>
                      <th className='text-center'>Job. No</th>
                      <th className='text-center'>Date</th>
                      <th className='text-center'>HBL/HAWB</th>
                      <th className='text-center'>Name</th>
                      <th className='text-center'>F. Dest</th>
                      <th className='text-center'>F/Tp</th>
                      <th className='text-center'>Curr</th>
                      <th className='text-center'>Debit</th>
                      <th className='text-center'>Credit</th>
                      <th className='text-center'>Paid/Rcvd</th>
                      <th className='text-center'>Balance</th>
                      <th className='text-center'>Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.filter((x)=>{
                      return query.balance=="exclude0"?Math.floor(x.balance)!=0:x
                    }).map((x, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td
                          className="blue-txt"
                          style={{ width: 90, cursor:"pointer"}} 
                          onClick={async ()=>{
                            
                            await Router.push(`/reports/invoice/${x.id}`)
                            dispatch(incrementTab({ "label": "Invoice Details", "key": "2-11", "id":`${x.id}`}))
                          }}
                        >{x.invoice_No}</td>
                        <td
                          className="blue-txt"
                          style={{ width: 90, cursor:"pointer"}} 
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
                        }
                        >{x.SE_Job?.jobNo}</td>
                        <td>{x.createdAt}</td>
                        <td>{x?.SE_Job?.Bl?.hbl}</td>
                        <td>{x.party_Name}</td>
                        <td>{x.fd}</td>
                        <td>{x.ppcc}</td>
                        <td>{x.currency}</td>
                        <td>{commas(x.debit)}</td>
                        <td>{commas(x.credit)}</td>
                        <td>{commas(x.paidRec)}</td>
                        <td>{commas(x.balance)}</td>
                        <td>{x.age}</td>
                      </tr>
                    )})}
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'right' }}><b>Total</b></td>
                      <td style={{ textAlign: 'right' }}>{getTotal("Recievable", records)}</td>
                      <td style={{ textAlign: 'right' }}>{getTotal("Payble", records)}</td>
                      <td style={{ textAlign: 'right' }}>{paidReceivedTotal(records)}</td>
                      <td style={{ textAlign: 'right' }}>{balanceTotal(records)}</td>
                      <td style={{ textAlign: 'center' }}>-</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              {overflow && 
                <div className="d-flex justify-content-end mt-4">
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
    )
  };
  const gridRef = useRef();
  const [columnDefs, setColumnDefs] = useState([
    { headerName: '#', field: 'no', width: 50 },
    { headerName: 'Inv. No', field: 'invoice_No', filter: true },
    { headerName: 'Date', field: 'createdAt', filter: true },
    { headerName: 'HBL/HAWB', field: 'blHbl', filter: true },
    { headerName: 'Name', field: 'party_Name', width: 224, filter: true },
    { headerName: 'F. Dest', field: 'fd', filter: true },
    { headerName: 'F/Tp', field: 'ppcc', filter: true },
    { headerName: 'Curr', field: 'currency', filter: true },
    { headerName: 'Debit', field: 'debit', filter: true },
    { headerName: 'Credit', field: 'credit', filter: true },
    { headerName: 'Paid/Rcvd', field: 'paidRec', filter: true },
    { headerName: 'Balance', field: 'balance', filter: true },
    { headerName: 'Age', field: 'age', filter: true },
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
  }));

  const getRowHeight = useCallback(() => {
    return 38;
  }, []);

  return (
  <div className='base-page-layout'>
    {query.report == "viewer" && (
      <>
        <ReactToPrint content={() => inputRef} trigger={() => <AiFillPrinter className="blue-txt cur fl-r" size={30} />} />
        {/* <---- Excel Download button ----> */}
        <div className="d-flex justify-content-end items-end" >
          <CSVLink data={result.result} className="btn-custom mx-2 fs-11 text-center" style={{ width: "110px", float: 'left' }}>
            Excel
          </CSVLink>
        </div>
      </>
    )}
    {/* <---- Reports View only  ----> */}
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
}

export default React.memo(InvoiceBalancingReport)