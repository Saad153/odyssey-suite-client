import React, { useEffect, useState } from "react";
import moment from "moment";
import MainTable from "./MainTable";
import Router from 'next/router';
import { removeTab } from '/redux/tabs/tabSlice';
import { useDispatch, useSelector } from 'react-redux';


const LedgerReport = ({ voucherData, account, from, to, name, company, currency }) => {
  const [ledger, setLedger] = useState([]);
  const [opening, setOpening] = useState(0.0);
  const [closing, setClosing] = useState(0.0);
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log(voucherData)
    console.log(voucherData.result.length)
    if(voucherData.result.length==0){
      // dispatch(removeTab('2'))
      // Router.push('/reports/ledger')
    }
    if (name && voucherData.status == "success") {
      let openingBalance = 0.0, closingBalance = 0.0, tempArray = [], prevBalance = 0, isDone = false, finalClosing = 0;
      voucherData.result.forEach((y) => {
        let exRate = parseFloat(y["Voucher.exRate"])>0?parseFloat(y["Voucher.exRate"]):1;
        const createdAtDate = moment(y.createdAt);
        if (
          createdAtDate.isBetween(moment(from),moment(to),"day","[]") ||
          createdAtDate.isSame(moment(to),"day")
        ) {
          closingBalance =
            y.type === "debit" ? 
              closingBalance + (currency=="PKR"? parseFloat(y.amount):parseFloat(y.amount) / exRate): 
              closingBalance - (currency=="PKR"? parseFloat(y.amount):parseFloat(y.amount) / exRate)
          if (y["Voucher.vType"] === "OP") {
            openingBalance =
              y.type === "debit" ? 
                openingBalance + (currency=="PKR"? parseFloat(y.amount):parseFloat(y.amount) / exRate): 
                openingBalance - (currency=="PKR"? parseFloat(y.amount):parseFloat(y.amount) / exRate)
          } else {
            let tempBalance = parseFloat(closingBalance) + parseFloat(prevBalance)
            tempArray.push({
              date: y.createdAt,
              voucherType: y["Voucher.type"],
              voucherId: y["Voucher.id"],
              amount: currency=="PKR"? parseFloat(y.amount) :parseFloat(y.amount) / exRate,
              balance: tempBalance,
              voucher: y["Voucher.voucher_Id"],
              type: y.type,
              narration: y.narration,
            });
            finalClosing = tempBalance
            isDone = true;
          }
          
        } else {
          openingBalance = y.type === "debit" ? openingBalance + parseFloat(y.amount) / exRate : openingBalance - parseFloat(y.amount) / exRate;
          prevBalance = isDone?prevBalance:openingBalance;
        }
      });
      setOpening(openingBalance);
      setClosing(finalClosing);
      setLedger(tempArray);
    }
  }, []);

  return (
    <div className="base-page-layout">
      <MainTable
        ledger={ledger}
        closing={closing}
        opening={opening}
        name={name}
        company={company}
        currency={currency}
        from={from}
        to={to}
      />
    </div>
  );
};
export default React.memo(LedgerReport)