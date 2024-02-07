import React, { useEffect, useState } from "react";
import moment from "moment";
import MainTable from "./MainTable";

const LedgerReport = ({ voucherData, from, to, name, company, currency }) => {
  const [ledger, setLedger] = useState([]);
  const [opening, setOpening] = useState(0.0);
  const [closing, setClosing] = useState(0.0);
  
  useEffect(() => {
    if (voucherData.status == "success") {
      let openingBalance = 0.0, closingBalance = 0.0, tempArray = [], prevBalance = 0, isDone = false, finalClosing = 0;

      voucherData.result.forEach((y) => {
        // console.log("Transaction:", y);
        let exRate = parseFloat(y["Voucher.exRate"])>0?parseFloat(y["Voucher.exRate"]):1;
        const createdAtDate = moment(y.createdAt);
        if (
          createdAtDate.isBetween(moment(from), moment(to), "day", "[]") ||
          createdAtDate.isSame(moment(to), "day")
        ) {
          closingBalance =
            y.type === "debit"
              ? closingBalance +
                parseFloat(y.amount) / exRate
              : closingBalance -
                parseFloat(y.amount) / exRate

          if (y["Voucher.vType"] === "OP") {
            openingBalance =
              y.type === "debit"
                ? openingBalance +
                  parseFloat(y.amount) / exRate
                : openingBalance -
                  parseFloat(y.amount) / exRate
          } else {
            let tempBalance = parseFloat(closingBalance) + parseFloat(prevBalance)
            tempArray.push({
              date: y.createdAt,
              voucherType: y["Voucher.type"],
              voucherId: y["Voucher.id"],
              amount: parseFloat(y.amount) / exRate,
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