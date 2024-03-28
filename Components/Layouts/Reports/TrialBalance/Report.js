import React, { useEffect, useState } from 'react';
import moment from 'moment';
import PrintTopHeader from "/Components/Shared/PrintTopHeader";
import { Table } from "react-bootstrap";

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
      result.result.forEach((x)=>{
        if(x.Child_Accounts.length>0){
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
      setTotal(temp)
    }

  const TableComponent = ({overFlow}) => {
    return (
      <div className="">
        <PrintTopHeader company={query.company} from={query.from} to={query.to} />
        {/* <hr className="" /> */}
        <div className="printDiv mt-2" style={{ maxHeight: overFlow ? "60vh" : "100%", overflowY: "auto", overflowX: "hidden" , height:"auto" }}>
          <div className="table-sm-1 mt-2">
            <Table className="tableFixHead" bordered>
              <thead>
                <tr className="custom-width">
                  <th className="class-1">Account Title</th>
                  <th className="class-1" colSpan={2}>Opening</th>
                  <th className="class-1" colSpan={2}>Transaction</th>
                  <th className="class-1" colSpan={2}>Closing</th>
                </tr>
                <tr className="custom-width">
                  <th className="class-1"></th>
                  <th className="class-1">Debit </th>
                  <th className="class-1">Credit</th>
                  <th className="class-1">Debit </th>
                  <th className="class-1">Credit</th>
                  <th className="class-1">Debit </th>
                  <th className="class-1">Credit</th>
                </tr>
              </thead>
              <tbody>
                {records.map((x, i) => {
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
                        <td className="fs-12">{commas(x.opDebit)}</td>
                        <td className="fs-12">{commas(x.opCredit)}</td>
                        <td className="fs-12">{commas(x.trDebit)}</td>
                        <td className="fs-12">{commas(x.trCredit)}</td>
                        <td className="fs-12">{commas(x.clDebit)}</td>
                        <td className="fs-12">{commas(x.clCredit)}</td>
                      </tr>
                    )
                }})}
                <tr>
                  <td className='text-end'><b>Grand Total:</b></td>
                  <td className='fs-12'>{commas(total.opDebit)}</td>
                  <td className='fs-12'>{commas(total.opCredit)}</td>
                  <td className='fs-12'>{commas(total.trDebit)}</td>
                  <td className='fs-12'>{commas(total.trCredit)}</td>
                  <td className='fs-12'>{commas(total.clDebit)}</td>
                  <td className='fs-12'>{commas(total.clCredit)}</td>
                </tr>
              </tbody>
            </Table>
          </div>
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