import React, { useEffect, useState } from 'react';
import moment from 'moment';
import PrintTopHeader from "/Components/Shared/PrintTopHeader";
import { Table } from "react-bootstrap";
import exportExcelFile from "/functions/exportExcelFile";
import Pagination from "/Components/Shared/Pagination";
import { Row, Col } from 'react-bootstrap';

const Report = ({query, result}) => {
  // console.log(query)
  // console.log(result)
const report = query.reportType;  
const accountlevel = query.accountLevel;
  const [ records, setRecords ] = useState([]);
  const [accLevelOneArray, setaAcLevelOneArray] = useState([]);
  const [ total, setTotal ] = useState({
    opDebit:0,
    opCredit:0,
    trDebit:0,
    trCredit:0,
    clDebit:0,
    clCredit:0,
  });
  const [ totalCogs, setTotalCogs ] = useState({
    opDebit:0,
    opCredit:0,
    trDebit:0,
    trCredit:0,
    clDebit:0,
    clCredit:0,
  });
 
  
  const [ totalAdminExp, setTotalAdminExp ] = useState({
    opDebit:0,
    opCredit:0,
    trDebit:0,
    trCredit:0,
    clDebit:0,
    clCredit:0,
  });

  const [filteredTempData, setfilteredTempData] = useState([]);
  const[AdminExpArray,setAdminExpArray] = useState([]);
  const[cogsArray,setCogsArray]= useState([]);

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
      transactions.credit = parseFloat(amount)*-1;
    return transactions

  }
  useEffect(() => {
    let temp = [];
    // let cogsArray=[];
    // let AdminExpArray=[];
  

    let tempArray = [result.result[1], result.result[0]]
    tempArray.forEach((x)=>{
      let i = 0
      if(query.expense != null && x.title == query.expense){
        temp.push({
          title:x.title, type:'parent'
        });
        x.Parent_Accounts.forEach((y)=>{
          if(y.Child_Accounts?.length>0){
            y.Child_Accounts.forEach((z)=>{
              i = i + 1
              if(query.expense != null){
                temp.push({
                title:z.title,
                index:i,
                type:'child',
                ...makeTransaction(z.Voucher_Heads)
                });
              }
            })
          }
        })
    
      }else if(query.revenue != null && x.title == query.revenue){
        temp.push({
          title:x.title, type:'parent'
        });
        x.Parent_Accounts.forEach((y)=>{
          if(y.Child_Accounts?.length>0){
            y.Child_Accounts.forEach((z)=>{
              i = i + 1
              if(query.revenue != null){
                temp.push({
                title:z.title,
                index:i,
                type:'child',
                ...makeTransaction(z.Voucher_Heads)
                });
              }
            })
          }
        })
      } else if (report == "pnl" && x.title == "Expense") {
        temp.push({
          title: x.title, type: 'parent'
        });
        // console.log("temp", temp)
        const idsToFilter = [
          "964741516944474113",
          "964741516946374657",
          "964741517343784961",
          "964741517425213441"
        ];
        x.Parent_Accounts.forEach((y) => {
          if (y.Child_Accounts?.length > 0) {

            // for "COGS/ Selling Exp"
            const filteredCogsAccounts = y.Child_Accounts.filter(c => idsToFilter.includes(c.id));
            // console.log("filteredChildAccounts",filteredCogsAccounts)
            filteredCogsAccounts.forEach(cogs => {
              i = i + 1;
              cogsArray.push({
                title: cogs.title,
                index: i,
                ...makeTransaction(cogs.Voucher_Heads)
              });
            });
            //For Admin Expense
            const filteredAdminExpAccounts = y.Child_Accounts.filter(c => !idsToFilter.includes(c.id));
            filteredAdminExpAccounts.forEach(exp => {
              i = i + 1;
              AdminExpArray.push({
                title: exp.title,
                index: i,
                ...makeTransaction(exp.Voucher_Heads)
              })

                console.log("AdminExpArray",AdminExpArray)
               

            })
      
          }
        })
      
      }    
      else{

        temp.push({
          title:x.title, type:'parent'
        });
        x.Parent_Accounts.forEach((y)=>{
          if(y.Child_Accounts?.length>0){
            y.Child_Accounts.forEach((z)=>{
              i = i + 1
              if(query.revenue != null){
                if(query.revenue == z.title){
                  temp.push({
                    title:z.title,
                    index: 1,
                    type:'child',
                    ...makeTransaction(z.Voucher_Heads)
                  })
                }
              }else if(query.expense != null){
                if(query.expense == z.title){
                  temp.push({
                    title:z.title,
                    index: 1,
                    type:'child',
                    ...makeTransaction(z.Voucher_Heads)
                  })
                }
              }
              else{
                temp.push({
                title:z.title,
                index:i,
                type:'child',
                ...makeTransaction(z.Voucher_Heads)
                });

                 let tempFilter =[];
                 tempFilter=  temp.filter(item => item.type !== 'parent');
                 setfilteredTempData(tempFilter)

             
             

              }
            })
          }
        })
      }
    })


    let listWithTotals = [];
    let parentCount = 0;
    let incomeTotal = {credit:0, debit:0};
    let expenseTotal = {credit:0, debit:0};
    temp.forEach((x, i)=>{
      
      if(x.type == "parent" & parentCount == 0){
        parentCount = parentCount + 1
        listWithTotals.push(x)
      } else if (x.type != "parent" && parentCount==1){
        incomeTotal.credit = incomeTotal.credit + x.credit  
        incomeTotal.debit = incomeTotal.debit + x.debit
        listWithTotals.push(x)
      } else if(x.type == "parent" & parentCount == 1){
        parentCount = parentCount + 1
        listWithTotals.push({
          type:'total',
          credit:incomeTotal.credit,
          debit:incomeTotal.debit,
        })
        listWithTotals.push(x)
      } else {
        expenseTotal.credit = expenseTotal.credit + x.credit  
        expenseTotal.debit = expenseTotal.debit + x.debit
        listWithTotals.push(x)
        if(i+1==temp.length){
          listWithTotals.push({
            type:'total',
            credit:expenseTotal.credit,
            debit:expenseTotal.debit,
          })
        }
      }
    })
    // console.log(expenseTotal)
    // console.log(incomeTotal)
    
    // monthWise(result)
    makeTotal(temp)
    makeCogsTotal(cogsArray)
    makeAdminExpTotal(AdminExpArray)
    setRecords(listWithTotals)
    // console.log("list with totals",listWithTotals)
    let accLevelOne = [
      listWithTotals.find(item => item.title === 'Expense' && item.type === 'parent'),
      listWithTotals.find(item => item.type === 'total'),
      listWithTotals.find(item => item.title === 'Income/Sales' && item.type === 'parent'),
      listWithTotals.filter(item => item.type === 'total')[1]
  ];

  setaAcLevelOneArray(accLevelOne)


  }, []);
  
const revenue = accLevelOneArray?.[3]?.credit.toFixed(2);
// console.log(revenue)
  const checkMonth = (date) => {
    return moment(date).format("MMM, YYYY")
  }

  const monthWise = (data) => {
    // console.log(data.result)
    let dates = [];
    data.result.forEach((account)=>{
      account.Parent_Accounts.forEach((pAccount)=>{
        pAccount.Child_Accounts.forEach((cAccount)=>{
          cAccount.Voucher_Heads.forEach((voucher)=>{
            let tempDate = checkMonth(voucher.createdAt)
            dates.includes(tempDate)?
              null:
              dates.push(tempDate);
          })
        })
      })
    })
    // console.log(dates)
  }

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

  const makeCogsTotal =(data)=> {
    let temp = {
      debit:0,
      credit:0
    }
    data.forEach((x)=>{
      temp.debit = temp.debit + x.debit
      temp.credit = temp.credit + x.credit
    });
    setTotalCogs(temp)
  }

  const makeAdminExpTotal =(data)=> {
    let temp = {
      debit:0,
      credit:0
    }
    data?.forEach((x)=>{
      temp.debit = temp.debit + x.debit
      temp.credit = temp.credit + x.credit
    });
    setTotalAdminExp(temp)
    // console.log("total",totalAdminExp)
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

  const profitLoss = (revenue - (totalCogs?.debit || 0) - (totalAdminExp?.debit || 0)).toFixed(2);
  const formattedProfitLoss = profitLoss < 0 ? `(${Math.abs(profitLoss)})` : profitLoss;

  const ProfitLossReport = ({ accountLevel, report, overFlow }) => {
    if ((accountLevel === "6" || accountLevel === "1") && report === "pnl") {
      return (
        <div className="">
        <div className="d-flex justify-content-end">
        <button 
          //onClick={exportData}
          className="btn-custom mx-2 px-3 fs-11 text-center" 
        >
          To Excel
        </button>
      </div>
      <PrintTopHeader company={query.company} from={query.from} to={query.to} />
        <div className="printDiv mt-2" style={{ maxHeight: overFlow ? "60vh" : "100%", overflowY: "auto", overflowX: "hidden", height: "auto" }}>
          <div className="table-sm-1 mt-2">
          <hr/>
            <div className='text-center'> <b>Profit and Loss Income Statement </b> </div>
            <div className="table-sm-1 mt-2">
            <Row md={12}>
             <b>Revenue</b>
             </Row>
             <Row>
              {accountLevel === "1" && <>             
              <Col style={{lineHeight:1.75}} md={6} >
              Total for Revenue
              </Col>
       
              <Col style={{lineHeight:1.75}} md={6} className='text-end'>
               {revenue}
              </Col>
              </>
               }
            
            {accountLevel === "6" && <>      

              

              <Col style={{lineHeight:1.75}} md={6} >
               <div>
               {/* {filteredTempData.map((item) => (
                    <div key={item.index}>
                        {item.title}
                    </div>
                ))} */}
                  </div>
                          
              Total for Revenue
              </Col>
       
              <Col style={{lineHeight:1.75}} md={6} className='text-end'>
              {/* <div className='text-end'>
             
                {filteredTempData.map((item) => (
                    <div key={item.index}>
                        {item.credit}                      
                    </div>
                ))}
           
            
               </div> */}
              {revenue} 
              </Col>
              </>
               }
              <Row md={12}>
               <b>COGS / Selling Expense </b>
              </Row>
              <Col style={{lineHeight:1.75}} md={6}>
              Total for COGS / Selling Expense
              </Col>
              <Col style={{lineHeight:1.75}} md={6} className='text-end'>
           {totalCogs?.debit?.toFixed(2)} 
              </Col>

              <Col md={6}>
              <b>Gross Profit</b> 
              </Col>
              <Col style={{lineHeight:1.75}} md={6} className='text-end'>
          {(revenue - totalCogs?.debit ).toFixed(2)} 
              </Col>

              <Row md={12}>
               <b>Admin Expense</b>
              </Row>
              {accountLevel === "1" && <> 
              <Col md={6}>
               Total for Admin Expense
              </Col>
              <Col style={{lineHeight:1.75}} md={6} className='text-end'>
               {totalAdminExp?.debit?.toFixed(2)} 
              </Col>
              </> }


              {accountLevel === "6" && <> 
              <Col md={6}>
              {/* <div>
               {AdminExpArray.map((item) => (
                    <div key={item.index}>
                        {item.title}
                    </div>
                ))}
                  </div> */}


                <div> Total for Admin Expense </div> 
              </Col>
              <Col style={{lineHeight:1.75}} md={6} className='text-end'>
              {/* <div>
               {AdminExpArray.map((ele) => (
                    <div key={ele.index}>
                        {ele.debit}
                    </div>
                ))}
                  </div> */}


              <div> {totalAdminExp?.debit?.toFixed(2)} 
              </div>
              </Col>
              </> }

              <Col md={6}>
              <b>Profit/(Loss)
              </b> 
              </Col>
             <Col style={{lineHeight:1.75}} md={6} className='text-end'>
               {formattedProfitLoss}
              </Col>
             </Row>
          
            </div>



       
         
          </div>
        </div>

      </div>
      );
    } else {
      return null;
    }
  };
  

  const [currentPage,setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const indexOfLast = currentPage * recordsPerPage ;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = records ? records.slice(indexOfFirst,indexOfLast) : [];
  const noOfPages = records ? Math.ceil(records.length / recordsPerPage) : 0 ;



  const TableComponent = ({ overFlow }) => {
    // Determine if we should render the alternative content
    const shouldRenderAlternative = accountlevel && report && <ProfitLossReport accountLevel={accountlevel} report={report} overFlow={overFlow} />;
  
    if (shouldRenderAlternative) {
      return shouldRenderAlternative;
    }
  
    return (
      <div className="">
        <div className="d-flex justify-content-end">
          <button 
            //onClick={exportData}
            className="btn-custom mx-2 px-3 fs-11 text-center" 
          >
            To Excel
          </button>
        </div>
        <PrintTopHeader company={query.company} from={query.from} to={query.to} />
        
        {accountlevel === "6" ? (
          <div className="printDiv mt-2" style={{ maxHeight: overFlow ? "60vh" : "100%", overflowY: "auto", overflowX: "hidden", height: "auto" }}>
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
                    if (x.type === "parent") {
                      return (
                        <tr key={i}>
                          <td></td>
                          <td colSpan={7}><b>{x.title}</b></td>
                        </tr>
                      );
                    } else if (x.type === "total") {
                      return (
                        <tr key={i}>
                          <td></td>
                          <td colSpan={1} className='text-end'><b>Total</b></td>
                          <td className="fs-12"><b>{commas(x.debit)}</b></td>
                          <td className="fs-12"><b>{commas(x.credit)}</b></td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr key={i}>
                          <td className="fs-12 text-center">{x.index}</td>
                          <td className="blue-txt fs-12 px-5">{x.title}</td>
                          <td className="fs-12">{commas(x.debit)}</td>
                          <td className="fs-12">{commas(x.credit)}</td>
                        </tr>
                      );
                    }
                  })}
  
                  <tr>
                    <td></td>
                    <td className='text-end'><b>Profit & Loss {"( Total )"}:</b></td>
                    <td className='fs-12'><b>{commas(total.debit) || '0.00'}</b></td>
                    <td className='fs-12'><b>{commas(total.credit >= 0 ? total.credit : total.credit * -1) || '0.00'}</b></td>
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
        ) : (
          <div className="printDiv mt-2" style={{ maxHeight: overFlow ? "60vh" : "100%", overflowY: "auto", overflowX: "hidden", height: "auto" }}>
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
                  {accLevelOneArray.map((x, i) => {
                    if (x.type === "parent") {
                      return (
                        <tr key={i}>
                          <td></td>
                          <td colSpan={7}><b>{x.title}</b></td>
                        </tr>
                      );
                    } else if (x.type === "total") {
                      return (
                        <tr key={i}>
                          <td></td>
                          <td colSpan={1} className='text-end'><b>Total</b></td>
                          <td className="fs-12"><b>{commas(x.debit)}</b></td>
                          <td className="fs-12"><b>{commas(x.credit)}</b></td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr key={i}>
                          <td className="fs-12 text-center">{x.index}</td>
                          <td className="blue-txt fs-12 px-5">{x.title}</td>
                          <td className="fs-12">{commas(x.debit)}</td>
                          <td className="fs-12">{commas(x.credit)}</td>
                        </tr>
                      );
                    }
                  })}
  
                  <tr>
                    <td></td>
                    <td className='text-end'><b>Profit & Loss {"( Total )"}:</b></td>
                    <td className='fs-12'><b>{commas(total.debit) || '0.00'}</b></td>
                    <td className='fs-12'><b>{commas(total.credit >= 0 ? total.credit : total.credit * -1) || '0.00'}</b></td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </div>
    );
  };
  

  return (
  <div className='p-3'>
    <TableComponent overFlow={true}/>
  </div>
  )
}

export default React.memo(Report)