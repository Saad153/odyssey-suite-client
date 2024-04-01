import React, { useEffect, useState } from 'react';
import moment from 'moment';
import PrintTopHeader from "/Components/Shared/PrintTopHeader";
import { Table } from "react-bootstrap";
import exportExcelFile from "/functions/exportExcelFile";
import Pagination from "/Components/Shared/Pagination";

const Report = ({query, result}) => {

  const [ records, setRecords ] = useState([]);
  const [ total, setTotal ] = useState({
    opDebit:0,
    opCredit:0,
    trDebit:0,
    trCredit:0,
    clDebit:0,
    clCredit:0,
  });
  const commas = (a) => { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") };

  const makeTransaction = (data) => {
    let transactions  = {
      debit:0,
      credit:0,
    }
    data.forEach((x)=>{
      x.type=="debit"?
        transactions.debit = parseFloat(x.amount):
        transactions.credit = parseFloat(x.amount)
    });

    let amount = transactions.debit - transactions.credit
    amount>0?
      transactions.debit = parseFloat(amount):
      transactions.credit = parseFloat(amount)*-1

    return transactions
  }

  useEffect(() => {
    let temp = [];
    let tempArray = [result.result[1], result.result[0]]
    tempArray.forEach((x)=>{
      let i = 0
      temp.push({
        title:x.title, type:'parent'
      });
      x.Parent_Accounts.forEach((y)=>{
        if(y.Child_Accounts?.length>0){
          // i = i + 1
          y.Child_Accounts.forEach((z)=>{
            i = i + 1
            temp.push({
              title:z.title,
              index:i,
              type:'child',
              ...makeTransaction(z.Voucher_Heads)
            });
          })
        }
      })
    })
    makeTotal(temp)
    setRecords(temp)
  }, []);

  const makeTotal = (data) => {
    let temp = {
      debit:0,
      credit:0
    }
    data.forEach((x)=>{
      if(x.type=="child"){
        temp.debit = temp.debit + x.debit
        temp.credit = temp.credit + x.credit
      }
    });
    setTotal(temp)
  }

  const exportData = () => {
    // console.log(records[0])
    // console.log(records[1])
    let temp = [...records];
    temp.push({title:'', ...total})
    exportExcelFile(
      temp,
      [
        { header: "Account", key: "title", width: 30, height:10 },
        { header: "Opening Dr.", key: "opDebit", width: 25, height:10 },
        { header: "Opening Cr.", key: "opCredit", width: 25, height:10 },
        { header: "Transaction Dr.", key: "trDebit", width: 25, height:10 },
        { header: "Transaction Cr.p", key: "trCredit", width: 25, height:10 },
        { header: "Closing Dr.", key: "clDebit", width: 25, height:10 },
        { header: "Closing Cr.", key: "clCredit", width: 25, height:10 },
      ]
    )
  }

  const [currentPage,setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const indexOfLast = currentPage * recordsPerPage ;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = records ? records.slice(indexOfFirst,indexOfLast) : [];
  const noOfPages = records ? Math.ceil(records.length / recordsPerPage) : 0 ;

  const TableComponent = ({overFlow}) => {
    return (
      <div className="">
        <div className="d-flex justify-content-end " >
            <button 
              //onClick={exportData}
              className="btn-custom mx-2 px-3 fs-11 text-center" 
            >
              To Excel
            </button>
        </div>
        <PrintTopHeader company={query.company} from={query.from} to={query.to} />
        {/* <hr className="" /> */}
        <div className="printDiv mt-2" style={{ maxHeight: overFlow ? "60vh" : "100%", overflowY: "auto", overflowX: "hidden" , height:"auto" }}>
          <div className="table-sm-1 mt-2">
            <Table className="tableFixHead" bordered>
              <thead>
                <tr className="custom-width">
                  <th className='text-center'>#</th>
                  <th>Account Title</th>
                  <th>Debit </th>
                  <th>Credit</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((x, i) => {
                  if(x.type=="parent"){
                    return(
                    <tr key={i}>
                      <td></td>
                      <td colSpan={7}><b>{x.title}</b></td>
                    </tr>
                    )
                  } else {
                    return (
                      <tr key={i}>
                        <td className="fs-12 text-center">{x.index}</td>
                        <td className="blue-txt fs-12 px-5">{x.title}</td>
                        <td className="fs-12">{commas(x.debit)}</td>
                        <td className="fs-12">{commas(x.credit)}</td>
                      </tr>
                    )
                }})}
                <tr>
                  <td></td>
                  <td className='text-end'><b>Profit & Loss {"( Total )"}:</b></td>
                  <td className='fs-12'>{total.debit-total.credit>0?commas(total.debit-total.credit):'0.00'}</td>
                  <td className='fs-12'>{total.debit-total.credit<0?commas(total.debit-total.credit*-1):'0.00'}</td>
                </tr>
              </tbody>
            </Table>
          </div>
          {overFlow && 
          <div className="d-flex justify-content-end mt-4">
            <Pagination noOfPages={noOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
          </div>
          }
        </div>
      </div>
    )
  }
    
  return (
    <div className='p-3'>
      <TableComponent overFlow={true}/>
    </div>
  )
}

export default Report