import moment from 'moment';
import ReactToPrint from 'react-to-print';
import { Spinner, Table } from "react-bootstrap";
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import PrintTopHeader from '../../../Shared/PrintTopHeader';
import Cookies from "js-cookie";
import { AiFillPrinter } from "react-icons/ai";
import { AgGridReact } from 'ag-grid-react';
import { CSVLink } from "react-csv";

const InvoiceBalancingReport = ({ result, query }) => {
    console.log(result.result);
    let inputRef = useRef(null);
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
                paid = paid + parseFloat(x.paid)
            } else {
                Received = Received + parseFloat(x.recieved)
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

    // async function getValues(value){
    //     if(value.status=="success") {
    //         console.log(value.result)
    //         let newArray = [...value.result];
    //         await newArray.forEach((y, i)=>{
    //             y.no = i+1;

    //             y.createdAt = moment(y.createdAt).format("DD-MMM-YYYY");
    //             y.blHbl = y?.SE_Job?.Bl?.hbl||'';
    //             y.fd = y?.SE_Job?.fd||'';
    //             y.ppcc = y?.SE_Job?.freightType=="Prepaid"?"PP":"CC"||'';

    //             y.debit =  y.payType=="Recievable"?commas(y.total/y.ex_rate):"-";
    //             y.credit = y.payType!="Recievable"?commas(y.total/y.ex_rate):"-";

    //             y.paidRec = commas(y.payType=="Recievable"?y.recieved:y.paid)

    //             y.balance = y.payType=="Recievable"?
    //                 (parseFloat(y.total) + parseFloat(y.roundOff) - parseFloat(y.recieved))/ parseFloat(y.ex_rate):
    //                 (parseFloat(y.total)+parseFloat(y.roundOff) - parseFloat(y.paid)) / parseFloat(y.ex_rate);
    //             y.total = (parseFloat(y.total) )+parseFloat(y.roundOff)
    //             y.paid = (parseFloat(y.paid) )+parseFloat(y.roundOff)
    //             y.recieved = (parseFloat(y.recieved) )+parseFloat(y.roundOff)
    //             y.age = getAge(y.createdAt);
    //             y.balance = y.payType!="Recievable"?`(${commas(y.balance)})`:commas(y.balance)
    //         })
    //         setRecords(newArray);
    //     } else {

    //     }
    //     setLoad(false)
    // }
    async function getValues(value) {
        if (value.status == "success") {
            let newArray = [...value.result];
            newArray.forEach((x) => {
                let invAmount = 0;
                invAmount = parseFloat(x.total) / parseFloat(x.ex_rate);
                x.total = invAmount;
                x.createdAt = moment(x.createdAt).format("DD-MMM-YYYY")
                x.debit = x.payType == "Recievable" ? invAmount : 0
                x.credit = x.payType != "Recievable" ? invAmount : 0
                x.paidRec = x.payType == "Recievable" ? parseFloat(x.recieved) : parseFloat(x.paid)
                x.balance = invAmount - x.paidRec
                x.age = getAge(x.createdAt);
            })
            //let newArray = [...value.result];
            // await newArray.forEach((y, i)=>{
            //     y.no = i+1;

            //     y.createdAt = moment(y.createdAt).format("DD-MMM-YYYY");
            //     y.blHbl = y?.SE_Job?.Bl?.hbl||'';
            //     y.fd = y?.SE_Job?.fd||'';
            //     y.ppcc = y?.SE_Job?.freightType=="Prepaid"?"PP":"CC"||'';

            //     y.debit =  y.payType=="Recievable"?commas(y.total/y.ex_rate):"-";
            //     y.credit = y.payType!="Recievable"?commas(y.total/y.ex_rate):"-";

            //     y.paidRec = commas(y.payType=="Recievable"?y.recieved:y.paid)

            //     y.balance = y.payType=="Recievable"?
            //         (parseFloat(y.total) + parseFloat(y.roundOff) - parseFloat(y.recieved))/ parseFloat(y.ex_rate):
            //         (parseFloat(y.total)+parseFloat(y.roundOff) - parseFloat(y.paid)) / parseFloat(y.ex_rate);
            //     y.total = (parseFloat(y.total) )+parseFloat(y.roundOff)
            //     y.paid = (parseFloat(y.paid) )+parseFloat(y.roundOff)
            //     y.recieved = (parseFloat(y.recieved) )+parseFloat(y.roundOff)
            //     y.age = getAge(y.createdAt);
            //     y.balance = y.payType!="Recievable"?`(${commas(y.balance)})`:commas(y.balance)
            // })
            setRecords(newArray);
        } else {

        }
        setLoad(false)
    }

    const TableComponent = ({overflow}) => {
        return (
            <>
                {!load &&
                    <div>
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
                                            {records.map((x, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td style={{}}>{i + 1}</td>
                                                        <td style={{}}>{x.invoice_No}</td>
                                                        <td style={{}}>{x.createdAt}</td>
                                                        <td style={{}}>{x.blHbl}</td>
                                                        <td style={{}}>{x.party_Name}</td>
                                                        <td style={{}}>{x.fd}</td>
                                                        <td style={{}}>{x.ppcc}</td>
                                                        <td style={{}}>{x.currency}</td>
                                                        <td style={{}}>{commas(x.debit)}</td>
                                                        <td style={{}}>{commas(x.credit)}</td>
                                                        <td style={{}}>{commas(x.paidRec)}</td>
                                                        <td style={{}}>{commas(x.balance)}</td>
                                                        <td style={{}}>{x.age}</td>
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td colSpan={8} style={{ textAlign: 'right' }}><b>Total</b></td>
                                                <td style={{ textAlign: 'right' }}>{getTotal("Recievable", records)}</td>
                                                <td style={{ textAlign: 'right' }}>{getTotal("Payble", records)}</td>
                                                <td style={{ textAlign: 'right' }}>{paidReceivedTotal(records)}</td>
                                                <td style={{ textAlign: 'right' }}>{balanceTotal(records)}</td>
                                                <td style={{ textAlign: 'center' }}>-</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                        }{records.length == 0 && <>No Similar Record</>}
                    </div>} {load && <div className='text-center py-5 my-5'> <Spinner /> </div>}
            </>
        )
    }
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