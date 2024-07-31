import axios from "axios";
import { delay } from '/functions/delay';
import openNotification from "/Components/Shared/Notification";
import moment from "moment";

function recordsReducer(state, action){
    switch (action.type) {

      case 'toggle': {
        return { ...state, [action.fieldName]: action.payload } 
      }
      case 'set': {
        return { ...state, ...action.payload }
      }
      default: return state 
    }
};

const initialState = {
  load:false,
  visible:false,
  reportType:'viewer',
  to:moment().format("YYYY-MM-DD"),
  from:moment("2023-07-01").format("YYYY-MM-DD"),
  client:'',
  records:[],
  subType:'',
  company:'1',
  operation:'',
  shipStatus:'',
  overseasagent:'',
  jobType:'Sea Export',
  salesrepresentative:'',
  csvData:[],

  totalRevenue:0.00,
  totalCost:0.00,
  totalPnl:0.00,
  totalActual:0.00,
  totalgainLoss:0.00,
  totalAfter:0.00
};

  const companies = [
    {
      value: '1',
      label: 'Seanet Shipping',
    },
    {
      value: '2',
      label: 'Cargo Linkers',
    },
    {
      value: '3',
      label: 'Air Cargo Services',
    }
  ]

  const fetchData = async(set, state) => {
    set({load:true});
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_JOB_PROFIT_LOSS,{
      headers:{ ...state }
    }).then(async(x) => {
      let result = x.data.result, totalRevenue=0.00, totalCost=0.00, totalPnl=0.00, totalActual=0.0, totalgainLoss=0.0, totalAfter=0.0;
      if(x.data.status!="success" || x.data.result.length<1){
        openNotification("Error", "No record found with current criteria", "orange");
      } else {
        
        await result.forEach((y) => {
          y.revenue = 0.0;
          y.cost = 0.0;
          y.actual = 0.0;
          y.load = true;
          y.gainLoss = 0.00;
          y.after = 0.00;
          y.Invoices.forEach((z) => {
            if(z.payType=="Recievable") {
              y.revenue = y.revenue + parseFloat(z.total);  //total will not be multiplied by Ex.Rate
              y.actual = y.actual + parseFloat(z.recieved);  //This will be multiplied by Ex.Rate
              if(z.Invoice_Transactions?.length>0) {
                z.Invoice_Transactions.forEach((i) => {
                  y.gainLoss = y.gainLoss + parseFloat(i.gainLoss)
                })
              }
            } else {
              y.cost = y.cost + parseFloat(z.total);  //total will not be multiplied by Ex.Rate
              y.actual = y.actual - parseFloat(z.paid)  //This will be multiplied by Ex.Rate
              if(z.Invoice_Transactions?.length>0){
                z.Invoice_Transactions.forEach((i)=>{
                  y.gainLoss = y.gainLoss + parseFloat(i.gainLoss)
                })
              }
            }
          })
          y.gainLoss = y.gainLoss*-1;
          
          y.pnl = y.revenue-y.cost
          totalRevenue  = totalRevenue + y.revenue;
          totalCost     = totalCost + y.cost;
          totalPnl      = totalPnl + y.pnl;
          totalActual   = totalActual - totalCost;
          totalgainLoss = totalgainLoss + y.gainLoss;
          y.after = y.revenue - y.cost + y.gainLoss
          y.actual = y.revenue - y.cost
          totalAfter = totalAfter + y.after
        })
        excelDataFormatter(result, set)
      }
      await set({
        visible:x.data.status=="success"?
          x.data.result.length>0?
            true:false:
          false,
        load:false,
        records:result,
        totalRevenue,
        totalCost,   
        totalPnl,    
        totalActual,
        totalgainLoss,
        totalAfter
      });
      await findGainLoss(result, set);
    })
  }

  const findGainLoss = async(data, set) => {
    let count = 0;
    while(count<data.length){
      await delay(300);
      let tempState = [...data];
      tempState[count].load = false;
      let invoices = [];
      invoices = tempState[count].Invoices.map((x)=>{
        return x.id
      });
      set({records:tempState});
      count++
    }
  }

  const plainOptions = [
    {label:'Sea Export', value:'SE'},
    {label:'Sea Import', value:"SI"},
    {label:'Air Export', value:"AE"},
    {label:'Air Import', value:"AI"},
  ];

  
  const typeOptions = [
    {label:'FCL', value:'FCL'},
    {label:'LCL', value:"LCL"},
    {label:'Air', value:"AIR"},
  ];

  const excelDataFormatter = (records, set) => {
    console.log("records", records)
    let tempData = [
      ["Sr","Job No","OperationType","VesselName", "Date", "HBL / HAWB", "MBL / MAWB", "Client",
        "SubType", "Shipper","Shipper/Consignee","Sales Rep","OverSeas Agent","Shipping Line", 
        "Local Agent" ,"F. Dest","Teu", "Weight", "Revenue", "Cost","P/L", "Gain/Loss", 
        "After Gain/Loss","CompanyName","Commodity","Packages","POL","Buying Rate","Selling Rate",
        "jobType","Cost Center","Nomination","Unit","Customer Ref","Sailing/Arrival Date","Sailing Date"

      ],
    ];
    for (let index = 0; index < records.length; index++) {
      let companyName = 
      records[index].companyId === "1" ? "Sea Net Shipping" :
      records[index].companyId === "2" ? "Cargo Linkers" :
      records[index].companyId === "3" ? "Air Cargo Service" :
      records[index].companyId;
      let data = [
        index+1,
        records[index].jobNo,
        records[index].operation,
        records[index].local_vendor?.name,
        records[index].createdAt ? records[index].createdAt.slice(0, 10) : "",
        records[index].Bl? records[index].Bl.hbl : "",
        records[index].Bl? records[index].Bl.mbl : "",
        records[index].Client.name ? records[index].Client.name : "",
        records[index].subType? records[index].subType: "" ,
        records[index].shipper?.name ?  records[index].shipper.name  :"",
        records[index].consignee?.name ?  records[index].consignee.name  :"",
        records[index].sales_representator?.name ?  records[index].sales_representator.name  :"",
        records[index].shipping_line?.name ?  records[index].shipping_line.name  :"",
        records[index].overseas_agent?.name ?  records[index].overseas_agent.name  :"",
        records[index].local_vendor?.name ?  records[index].local_vendor.name  :"",
        records[index].fd ? records[index].fd : "",
        records[index].SE_Equipments ?records[index].SE_Equipments.teu : "",
        records[index].weight ?records[index].weight : "",
        records[index].revenue ? records[index].revenue.toFixed(2) : "",
        records[index].cost ? records[index].cost.toFixed(2) : "",
        records[index].actual ? records[index].actual.toFixed(2) : "",
        records[index].gainLoss ? records[index].gainLoss.toFixed(2) : "",
        records[index].after ? records[index].after.toFixed(2) : "",
        companyName,
        records[index].commodity?.name?  records[index].commodity.name  :"",
        records[index].pcs? records[index].pcs :"",
        records[index].pol,
        records[index].exRate,
        records[index].exRate,
        records[index].jobType,
        records[index].costCenter,    
        records[index].nomination,
        records[index].pkgUnit,
        records[index].customerRef,  
        records[index].shipDate,          
        
        

            ];
      tempData.push(data);
    }
    set({
      csvData:tempData
    })
  };
  
export { recordsReducer, initialState, companies, fetchData, plainOptions, typeOptions, excelDataFormatter }