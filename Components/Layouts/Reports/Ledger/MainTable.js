import React, { useRef, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from "next/router";
import { AiFillPrinter } from "react-icons/ai";
import ReactToPrint from 'react-to-print';
import moment from "moment";
import Cookies from "js-cookie";
import PrintTopHeader from "/Components/Shared/PrintTopHeader";
import { CSVLink } from "react-csv";

const MainTable = ({ ledger, closing, opening, name, company, currency, from, to }) => {
  
  let inputRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const dispatch = useDispatch();
  const [username, setUserName] = useState("");
  const commas = (a) => { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") };

  const TableComponent = ({overFlow}) => {
    return (
      <div className="">
        <PrintTopHeader company={company} from={from} to={to} />
        <div className="d-flex justify-content-between mt-4">
          <h6 className="blue-txt"><b>{name}</b></h6>
          <span>
            <span className="mx-1">Opening Balance:</span>
            <b>
              {opening > 0 ?
                <span className="blue-txt">
                  {opening.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") + " Dr"}
                </span> :
                <span className="grey-txt">
                  {Math.abs(opening).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") + " Cr"}
                </span>
              }
            </b>
          </span>
        </div>

        <hr className="m-0" />
        <div className="printDiv" style={{ maxHeight: overFlow ? "60vh" : "100%", overflowY: "auto", overflowX: "hidden" , height:"auto" }}>

          <div className="table-sm-1 mt-2">
            <Table className="tableFixHead" bordered>
              <thead>
                <tr className="custom-width">
                  <th className="text-center class-1">#</th>
                  <th className="text-center class-1">Voucher #</th>
                  <th className="text-center class-1">Date</th>
                  <th className="text-center class-2" style={{ minWidth: 300 }}>Particular</th>
                  <th className="text-center class-1" style={{ width: 100 }}>Debit</th>
                  <th className="text-center class-1" style={{ width: 100 }}>Credit</th>
                  <th className="text-center class-1" style={{ width: 120 }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((x, i) => {
                  return (
                    <tr key={i}>
                      <td>{i+1}</td>
                      <td className="row-hov blue-txt text-center fs-12"
                        onClick={async () => {
                          if (x.voucherType == 'Job Reciept' || x.voucherType == 'Job Payment') {
                            Router.push({ pathname: `/accounts/paymentReceipt/${x.voucherId}` });
                            dispatch(incrementTab({
                              "label": "Payment / Receipt",
                              "key": "3-4",
                              "id": `${x.voucherId}`
                            }));
                          } else {
                            dispatch(incrementTab({ "label": "Voucher", "key": "3-5", "id": `${x.voucherId}` }));
                            Router.push(`/accounts/vouchers/${x.voucherId}`);
                          }
                        }}
                      >{x.voucher}</td>
                      <td className="text-center fs-12 grey-txt">{x.date.slice(0, 10)}</td>
                      <td className="fs-12" style={{ minWidth: 70, maxWidth: 70 }}>{x.narration}</td>
                      <td className="text-end fs-12">{x.type == "debit" && commas(x.amount)}</td>
                      <td className="text-end fs-12">{x.type == "credit" && commas(x.amount)}</td>
                      <td className="text-end fs-12">{x.balance > 0 ? <span className="blue-txt">{`${commas(x.balance)} dr`}</span> : <span className="grey-txt">{`${commas(x.balance * -1)} cr`}</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </div>
        <hr className="mt-0" />
        <div className="d-flex justify-content-end">
          <span className="mx-1">Closing Balance:</span><b>
            {closing > 0 ?
              <span className="blue-txt">{closing.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") + " Dr"}</span> :
              <span className="grey-txt">{Math.abs(closing).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") + " Cr"}</span>
            }
          </b>
        </div>
      </div>
    )
  }


  useEffect(() => {
    getUserName();
    async function getUserName() {
      let name = await Cookies.get("username");
      setUserName(name)
    }
  }, [])

  return (
    <div>
      <ReactToPrint content={() => inputRef} onBeforePrint={() => setIsPrinting(false)} onAfterPrint={() => setIsPrinting(true)}
        trigger={() => <AiFillPrinter className="blue-txt cur fl-r" size={30} />}
      />
      <div className="d-flex justify-content-end items-end">
        <CSVLink data={ledger} className="btn-custom mx-2 fs-11 text-center" style={{ width: "110px", float: 'left' }}>
          Excel
        </CSVLink>
      </div>
      <TableComponent overFlow={true}/>
      <div style={{ display: "none" }}>
        <div className="pt-5 px-3" ref={(response) => (inputRef = response)}>
          <TableComponent overFlow={false}/>
          <div style={{ position: 'absolute', bottom: 10 }}>Printed On: {`${moment().format("YYYY-MM-DD")}`}</div>
          <div style={{ position: 'absolute', bottom: 10, right: 10 }}>Printed By: {username}</div>
        </div>
      </div>
    </div>
  )
};

export default React.memo(MainTable);

