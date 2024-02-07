import { Spinner, Table } from "react-bootstrap";
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import PrintTopHeader from '/Components/Shared/PrintTopHeader';
import { AiFillPrinter } from "react-icons/ai";
import ReactToPrint from 'react-to-print';
import Cookies from "js-cookie";
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react';
import { CSVLink } from "react-csv";

const JobBalancingReport = ({ result, query }) => {

    let inputRef = useRef(null);
    const [load, setLoad] = useState(true);
    const [records, setRecords] = useState([]);
    const [username, setUserName] = useState("");

    const commas = (a) => a ? parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") : '0.0';

    const getTotal = (type, list) => {
        let result = 0.00;
        list.forEach((x) => {
            if (type == x.payType) {
                result = result + x.total
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
        console.log(query)
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
                y.age = getAge(y.createdAt)
                // y.total =    commas(y.total)
                // y.paid =     commas(y.paid)
                // y.recieved = commas(y.recieved)
                // y.balance =  commas(y.balance)
                y.freightType = y?.SE_Job?.freightType == "Prepaid" ? "PP" : "CC"
                y.fd = y?.SE_Job?.fd;
                y.createdAt = moment(y.createdAt).format("DD-MMM-YYYY")
                y.hbl = y?.SE_Job?.Bl?.hbl
            })
            setRecords(newArray);
        } else {

        }
        setLoad(false)
    }

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
                                            <td style={{ maxWidth: 30 }}>{i + 1}</td>
                                            <td style={{ maxWidth: 90, paddingLeft: 3, paddingRight: 3 }}>{x.invoice_No}</td>
                                            <td style={{}}>{x.createdAt}</td>
                                            <td style={{}}>{x.hbl}</td>
                                            <td style={{}}>{x.party_Name}</td>
                                            <td style={{ maxWidth: 90 }}>{x.fd}</td>
                                            <td style={{}}>{x.freightType}</td>
                                            <td style={{}}>{x.currency}</td>
                                            <td style={{ textAlign: 'right' }} >{x.payType == "Recievable" ? x.total : "-"}</td>
                                            <td style={{ textAlign: 'right' }} >{x.payType != "Recievable" ? x.total : "-"}</td>
                                            <td style={{ textAlign: 'right' }} >{x.payType == "Recievable" ? x.recieved : x.paid}</td>
                                            <td style={{ textAlign: 'right' }} >{x.payType != "Recievable" ? `(${x.balance})` : x.balance}</td>
                                            <td style={{ textAlign: 'center' }}>{x.age}</td>
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
            }
            {records.length == 0 && <>No Similar Record</>}
        </>
        }
        {load && <div className='text-center py-5 my-5'> <Spinner /> </div>}
        </>
        )
    }

    const gridRef = useRef();
    const [columnDefs, setColumnDefs] = useState([
        { headerName: '#', field: 'no', width: 50 },
        { headerName: 'Inv. No', field: 'invoice_No', filter: true },
        { headerName: 'Date', field: 'createdAt', filter: true },
        { headerName: 'HBL/HAWB', field: 'hbl', filter: true },
        { headerName: 'Name', field: 'party_Name', width: 224, filter: true },
        { headerName: 'F. Dest', field: 'fd', filter: true },
        { headerName: 'F/Tp', field: 'ppcc', filter: true },
        { headerName: 'Curr', field: 'currency', filter: true },
        {
            headerName: 'Debit', field: 'total', filter: true,
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
                    <div className="d-flex justify-content-end " >
                        <CSVLink data={result.result} className="btn-custom mx-2 fs-11 text-center" style={{ width: "110px", float: 'left' }}>
                            Excel
                        </CSVLink>
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

export default React.memo(JobBalancingReport)