import React, { useEffect, useState } from 'react';
import moment from 'moment';
import PrintTopHeader from "/Components/Shared/PrintTopHeader";
import { Table } from "react-bootstrap";
import exportExcelFile from "/functions/exportExcelFile";
import Pagination from "/Components/Shared/Pagination";

const Report = ({query, result}) => {
  // console.log("query",query)
  const reportView = query.reportType;
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
        opDebit:0,
        opCredit:0,
        trDebit:0,
        trCredit:0,
        clDebit:0,
        clCredit:0,
      }
      data.forEach((x)=>{
        const createdAtDate = moment(x.createdAt);
        if (createdAtDate.isBetween(moment(query.from), moment(query.to), "day", "[]") || createdAtDate.isSame(moment(query.to), "day") ){
          // transaction
          // console.log('transaction--->', moment(x.createdAt).format("DD?MMMM?YYYY"))
          x.type=="debit"?
            transactions.trDebit = parseFloat(x.amount):
            transactions.trCredit = parseFloat(x.amount)
        } else {
          // opening
          // console.log('opening--->', moment(x.createdAt).format("DD?MMMM?YYYY"))
          x.type=="debit"?
            transactions.opDebit = parseFloat(x.amount):
            transactions.opCredit = parseFloat(x.amount)
        }
      });

      let amount = transactions.trDebit + transactions.opDebit - transactions.opCredit - transactions.trCredit
      amount>0?
        transactions.clDebit = parseFloat(amount):
        transactions.clCredit = parseFloat(amount)*-1

      return transactions
    }

    useEffect(() => {
      let temp = [];
      result?.result?.forEach((x)=>{
        if(x?.Child_Accounts?.length>0){
          temp.push({
            title:x.title, type:'parent'
          });
          x.Child_Accounts.forEach((y)=>{
            temp.push({
              title:y.title,
              type:'child',
              ...makeTransaction(y.Voucher_Heads)
            });
          })
        }
      })
      makeTotal(temp)
      setRecords(temp)
    }, []);

    const makeTotal = (data) => {
      let temp = {
        opDebit:0,
        opCredit:0,
        trDebit:0,
        trCredit:0,
        clDebit:0,
        clCredit:0,
      }
      data.forEach((x)=>{
        if(x.type=="child"){
          temp.opDebit = temp.opDebit + x.opDebit
          temp.opCredit = temp.opCredit + x.opCredit
          temp.trDebit = temp.trDebit + x.trDebit
          temp.trCredit = temp.trCredit + x.trCredit
          temp.clDebit = temp.clDebit + x.clDebit
          temp.clCredit = temp.clCredit + x.clCredit
        }
      });
      setTotal(temp);
    }

    const exportData = () => {
      let temp = [...records];
      temp.push({title:'', ...total})
      exportExcelFile(
        temp,
        [
          { header: "Account", key: "title", width: 25, height:10 },
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
            <button className="btn-custom mx-2 px-3 fs-11 text-center" onClick={exportData}>To Excel</button>
        </div>
        <PrintTopHeader company={query.company} from={query.from} to={query.to} />
        {/* <hr className="" /> */}
        <div className="printDiv mt-2" style={{ maxHeight: overFlow ? "60vh" : "100%", overflowY: "auto", overflowX: "hidden" , height:"auto" }}>
          <div className="table-sm-1 mt-2">
            <Table className="tableFixHead" bordered>
              <thead>
                <tr className="custom-width">
                  <th className="class-1"></th>
                 {reportView =="6- Columns Simplified View"? <th className="class-1" colSpan={2}>Opening</th> :null} 
                 {reportView =="6- Columns Simplified View"? <th className="class-1" colSpan={2}>Transaction</th>:null}
                  <th className="class-1" colSpan={2}>Closing</th>
                </tr>
                <tr className="custom-width">
                  <th className="class-1">Account Title</th>
           
                  {reportView =="6- Columns Simplified View"? <th className="class-1">Debit </th> :null}
                      {reportView =="6- Columns Simplified View"?  <th className="class-1">Credit</th> :null}
                      {reportView =="6- Columns Simplified View"?  <th className="class-1">Debit </th>:null}
                      {reportView =="6- Columns Simplified View"?  <th className="class-1">Credit</th>:null}
                  <th className="class-1">Debit </th>
                  <th className="class-1">Credit</th>
                </tr>
              </thead>
              <tbody>
              {reportView =="6- Columns Simplified View" || reportView =="2- Columns Simplified View" && <>
                {                 
                currentRecords.map((x, i) => {
             
                  if(x.type=="parent"){
                    return(
                    <tr key={i}>
                      <td colSpan={7}><b>{x.title}</b></td>
                    </tr>
                    )
                  } else {
                    return (
                      <tr key={i}>
                        <td className="blue-txt fs-12 px-5">{x.title}</td>
                        {reportView =="6- Columns Simplified View"?   <td className="fs-12">{commas(x.opDebit)}</td> :null}
                        {reportView =="6- Columns Simplified View"?  <td className="fs-12">{commas(x.opCredit)}</td>:null}
                        {reportView =="6- Columns Simplified View"?  <td className="fs-12">{commas(x.trDebit)}</td>:null}
                        {reportView =="6- Columns Simplified View"?  <td className="fs-12">{commas(x.trCredit)}</td>:null}
                        <td className="fs-12">{commas(x.clDebit)}</td>
                        <td className="fs-12">{commas(x.clCredit)}</td>
                      </tr>
                    )
                }})}
                </>
              }
                {
                  reportView =="Debitors List" && <>
                   {currentRecords.filter(x => x.clDebit !== 0).map((x, i) => {
                    console.log("x",x)
    if (x.type === "parent") {
        return (
            <tr key={i}>
                <td colSpan={7}><b>{x.title}</b></td>
            </tr>
        );
    } else {
        return (
            <tr key={i}>
              <td className="blue-txt fs-12 px-5">{x.title}</td> 
                {reportView === "6- Columns Simplified View" ? <td className="fs-12">{commas(x.opDebit)}</td> : null}
                {reportView === "6- Columns Simplified View" ? <td className="fs-12">{commas(x.opCredit)}</td> : null}
                {reportView === "6- Columns Simplified View" ? <td className="fs-12">{commas(x.trDebit)}</td> : null}
                {reportView === "6- Columns Simplified View" ? <td className="fs-12">{commas(x.trCredit)}</td> : null}
                <td className="fs-12">{commas(x.clDebit)}</td>
                <td className="fs-12">{commas(x.clCredit)}</td> 
            </tr>
        );
    }
})}
                  
                  </>
                }
                               {
                  reportView =="Creditors List" && <>
                   {currentRecords.filter(x => x.clCredit !== 0).map((x, i) => {
                   
    if (x.type === "parent") {
        return (
            <tr key={i}>
                <td colSpan={7}><b>{x.title}</b></td>
            </tr>
        );
    } else {
        return (
            <tr key={i}>
              <td className="blue-txt fs-12 px-5">{x.title}</td> 
                {reportView === "6- Columns Simplified View" ? <td className="fs-12">{commas(x.opDebit)}</td> : null}
                {reportView === "6- Columns Simplified View" ? <td className="fs-12">{commas(x.opCredit)}</td> : null}
                {reportView === "6- Columns Simplified View" ? <td className="fs-12">{commas(x.trDebit)}</td> : null}
                {reportView === "6- Columns Simplified View" ? <td className="fs-12">{commas(x.trCredit)}</td> : null}
                <td className="fs-12">{commas(x.clDebit)}</td>
                <td className="fs-12">{commas(x.clCredit)}</td> 
            </tr>
        );
    }
})}
                  
                  </>
                }
                { reportView =="Debitors List" && <> 
                  <tr>
                      <td className='text-end'><b>Grand Total:</b></td>
                      {reportView =="6- Columns Simplified View"?     <td className='fs-12'>{commas(total.opDebit)}</td>:null}
                      {reportView =="6- Columns Simplified View"?    <td className='fs-12'>{commas(total.opCredit)}</td>:null}
                      {reportView =="6- Columns Simplified View"?   <td className='fs-12'>{commas(total.trDebit)}</td>:null}
                      {reportView =="6- Columns Simplified View"?   <td className='fs-12'>{commas(total.trCredit)}</td>:null}
                      <td className='fs-12'>{commas(total.clDebit)}</td>
                      <td className='fs-12'>{commas(total.clCredit)}</td>
                    </tr>
                </>
                     
                }
                 { reportView =="Creditors List" && <> 
                  <tr>
                      <td className='text-end'><b>Grand Total:</b></td>
                      {reportView =="6- Columns Simplified View"?     <td className='fs-12'>{commas(total.opDebit)}</td>:null}
                      {reportView =="6- Columns Simplified View"?    <td className='fs-12'>{commas(total.opCredit)}</td>:null}
                      {reportView =="6- Columns Simplified View"?   <td className='fs-12'>{commas(total.trDebit)}</td>:null}
                      {reportView =="6- Columns Simplified View"?   <td className='fs-12'>{commas(total.trCredit)}</td>:null}
                      <td className='fs-12'>{commas(total.clDebit)}</td>
                      <td className='fs-12'>{commas(total.clCredit)}</td>
                    </tr>
                </>
                     
                }
              
              { reportView == "6- Columns Simplified View" || reportView == "2- Columns Simplified View" &&
              <>
                <tr>
                    <td className='text-end'><b>Grand Total:</b></td>
                    {reportView == "6- Columns Simplified View" ? <td className='fs-12'>{commas(total.opDebit)}</td> : null}
                    {reportView == "6- Columns Simplified View" ? <td className='fs-12'>{commas(total.opCredit)}</td> : null}
                    {reportView == "6- Columns Simplified View" ? <td className='fs-12'>{commas(total.trDebit)}</td> : null}
                    {reportView == "6- Columns Simplified View" ? <td className='fs-12'>{commas(total.trCredit)}</td> : null}
                    <td className='fs-12'>{commas(total.clDebit)}</td>
                    <td className='fs-12'>{commas(total.clCredit)}</td>
              </tr> 
              </>
              }
                  
               
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