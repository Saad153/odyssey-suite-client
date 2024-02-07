import { recordsReducer, initialState, companies, fetchData, plainOptions, excelDataFormatter } from './states';
import React, { useReducer, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Sheet from './Sheet';
import PrintTopHeader from '../../../Shared/PrintTopHeader';
import Cookies from "js-cookie";
import ReactToPrint from 'react-to-print';
import { AiFillPrinter } from "react-icons/ai";
import moment from 'moment';
import { Spinner } from "react-bootstrap";
import { AgGridReact } from 'ag-grid-react';
import { CSVLink } from "react-csv";

const Report = ({ query }) => {

  let inputRef = useRef(null);
  const [username, setUserName] = useState("");

  const setCommas = (val) => val? val.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", "):'0'
  
  const set = (obj) => dispatch({ type: 'set', payload: obj });
  const [state, dispatch] = useReducer(recordsReducer, initialState);

  useEffect(() => {
    getValues();
  }, []);

  async function getValues() {
    await set({
      from:query.from,
      to:query.to
    });
    let name = await Cookies.get("username");
    setUserName(name);
    await fetchData(set, query)
  }
  
  const TableComponent = ({ overflow, fontSize }) => {
    return (
      <>
        <PrintTopHeader company={query.company} />
        <hr className='mb-2' />
        <Sheet state={state} overflow={overflow} fontSize={fontSize} />
      </>
    )
  }

  const gridRef = useRef();
  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Job No', field: 'jobNo', width: 120, filter: true },
    {
      headerName: 'Date', field: 'createdAt', width: 70, filter: true,
      cellRenderer: params => {
        return <>
          {moment(params.value).format("MM/DD/YY")}
        </>;
      }
    },
    {
      headerName: 'Client', field: 'hbl', filter: true,
      cellRenderer: params => {
        return <>
          {params.data.Client.name}
        </>;
      }
    },
    { headerName: 'F. Dest', field: 'fd', width: 100, filter: true },
    { headerName: 'Weight', field: 'fd', width: 10, filter: true },
    { headerName: 'Volume', field: 'ppcc', width: 0, filter: true },
    {
      headerName: 'Revenue', field: 'revenue', filter: true,
      cellRenderer: params => {
        return <>
          {setCommas(params.value)}
        </>;
      }
    },
    {
      headerName: 'Cost', field: 'cost', filter: true,
      cellRenderer: params => {
        return <>
          {setCommas(params.value)}
        </>;
      }
    },
    {
      headerName: 'P/L', field: 'actual', filter: true,
      cellRenderer: params => {
        return <span>
          {setCommas(params.value)}
        </span>;
      }
    },
    {
      headerName: 'Gain/Loss', field: 'gainLoss', filter: true,
      cellRenderer: params => {
        return <span style={{ color: params.data.gainLoss < 0 ? 'crimson' : 'green' }}>
          {setCommas(params.value < 0 ? params.value * -1 : params.value)}
        </span>;
      }
    },
    {
      headerName: 'After Gain/Loss', field: 'after', filter: true,
      cellRenderer: params => {
        return <span>
          {setCommas(params.value)}
        </span>;
      }
    }

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
      {/* <---- Reports View only , setting overflow to true ----> */}
      {query.report == "viewer" && <>
        <ReactToPrint content={() => inputRef} trigger={() => <AiFillPrinter className="blue-txt cur fl-r" size={30} />} />
        {state.csvData.length > 0 && <div className="d-flex justify-content-end " >
          <CSVLink data={state.csvData}  className="btn-custom mx-2 fs-11 text-center" style={{ width: "110px", float: 'left' }}>
            Excel
          </CSVLink>
        </div>}
        {!state.load &&
          <>
            <PrintTopHeader company={query.company} />
            <hr className='mb-2' />
            <Sheet state={state} overflow={true} />
          </>
        }
        {state.load && <Spinner />}
      </>
      }
      {/* <---- list View only with filteration ----> */}
      {query.report != "viewer" &&
        <div className="ag-theme-alpine" style={{ width: "100%", height: '72vh' }}>
          <AgGridReact
            ref={gridRef} // Ref for accessing Grid's API
            rowData={state.records} // Row Data for Rows
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
          <TableComponent overflow={false} fontSize={10} />
          {/* <---- footer ----> */}
          <div style={{ position: 'absolute', bottom: 10 }}>Printed On: {`${moment().format("YYYY-MM-DD")}`}</div>
          <div style={{ position: 'absolute', bottom: 10, right: 10 }}>Printed By: {username}</div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Report)