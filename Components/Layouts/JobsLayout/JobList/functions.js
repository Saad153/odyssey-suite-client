const experimental = (result, index, groupBy) => {
  let sum = 0
  !groupBy ? 
  result[index].Charge_Heads
   .map((cur) => cur.type == "Recievable" && (sum += Number(cur.amount)))
   : 
   result[index].map((x) => x.Charge_Heads
   .map((cur) => cur.type == "Recievable" && (sum += Number(cur.amount))))
   return sum
}

const experimentalOne = (result, index, groupBy) => {
  let sum = 0
 !groupBy ? 
 result[index].Charge_Heads
  .map((cur) => cur.type == "Payble" && (sum += Number(cur.amount)))
  : 
  result[index].map((x) => x.Charge_Heads
  .map((cur) => cur.type == "Payble" && (sum += Number(cur.amount))))
  return sum
}

const chargableWt = (result, index, groupBy) => {
  let sum  = 0;
  !groupBy ? 
  result[index].Bl.Item_Details
  .map((cur) => sum += Number(cur.chargableWt))
   : 
   result[index].map((x) => x.Charge_Heads
   .map((cur) => sum += Number(cur.chargableWt)))
   return sum
}

const grossWt = (result, index, groupBy) => {
  let sum  = 0;
  !groupBy ? 
  result[index].Bl.Item_Details
  .map((cur) => sum += Number(cur.grossWt))
   : 
   result[index].map((x) => x.Charge_Heads
   .map((cur) => sum += Number(cur.grossWt)))
   return sum
}
const tactRate = (result, index, groupBy) => {
  let sum  = 0;
  !groupBy ? 
  result[index].Bl.Item_Details
  .map((cur) => sum += Number(cur.rate_charge))
   : 
   result[index].map((x) => x.Charge_Heads
   .map((cur) => sum += Number(cur.rate_charge)))
   return sum
}


export const calculatePershable = (groupBy, result, setCsvData) => {
    let tempData = [["S No", "AWB Number" ,"Line", "Date",  "Booking", "PCS", "Weight", "Dest", "Tact Rate", "Comm"]]
    for (let index = 0; index < result.length; index++) {
        let data = !groupBy ? [
          index + 1, 
          result[index].Bl?.hbl ? result[index].Bl.hbl : "",
          result[index].shipping_line?.name ? result[index].shipping_line?.name : "",
          result[index].createdAt ? result[index].createdAt.slice(0, 10) : "",
          result[index].jobNo ? result[index].jobNo : "",
          result[index].pcs ? result[index].pcs : "",
          result[index].Bl.Item_Details.length > 0 ? grossWt(result, index, groupBy) : "",
          result[index].fd ? result[index].fd : "",
          result[index].Bl.Item_Details.length > 0 ? tactRate(result, index, groupBy) : "",
          result[index].commodity?.name ? result[index].commodity?.name : ""
          ] : [index + 1,
          result[index].map((x) => x.Bl?.hbl) ? result[index].map((x) => x.Bl?.hbl) : "",
          result[index].map((x) => x.shipping_line?.name) ? result[index].map((x) => x.shipping_line?.name) : "",
          result[index].map((x) => x.createdAt) ? result[index].map((x) => x.createdAt.slice(0, 10)) : "",
          result[index].map((x) => x.jobNo) ? result[index].map((x) => x.jobNo) : "",
          result[index].map((x) => x.pcs) ? result[index].map((x) => x.pcs) : "",
          result[index].Bl.Item_Details.length > 0 ? grossWt(result, index, groupBy) : "",
          result[index].map((x) => x.fd) ? result[index].map((x) => x.fd) : "",
          result[index].Bl.Item_Details.length > 0 ? tactRate(result, index, groupBy) : "",
          result[index].map((x) =>  x.commodity?.name) ? result[index].map((x) =>  x.commodity?.name) : ""
           
        ] ;
        tempData.push(data);
    }
    setCsvData(tempData);
  }

export const calculateDry = (groupBy, result, setCsvData) => {
    let tempData = [["S No", "AWB Number" ,"Air Line", "Party", "Issue Date", "Ship Date",  "Comm", "Dest", "G Weight", "C Weight", "CTNS", "TACT", "Book", "Sell Rate", "Buy Rate"]]
 
    for (let index = 0; index < result.length; index++) {
        let data = !groupBy ? [
          index + 1, 
          result[index].Bl?.hbl ? result[index].Bl.hbl : "",
          result[index].shipping_line?.name ? result[index].shipping_line?.name : "",
          result[index].Client?.name ? result[index].Client?.name : "",
          result[index].createdAt ? result[index].createdAt.slice(0, 10) : "",
          result[index].shipDate ? result[index].shipDate.slice(0, 10) : "",
          result[index].commodity?.name ? result[index].commodity?.name : "",
          result[index].fd ? result[index].fd : "",
          result[index].Bl.Item_Details.length > 0 ? grossWt(result, index, groupBy) : "",
          result[index].Bl.Item_Details.length > 0 ? chargableWt(result, index, groupBy) : "",
          result[index].Bl.Container_Infos[0]?.no ? result[index].Bl.Container_Infos[0].no : "",
          result[index].Bl.Item_Details.length > 0 ? tactRate(result, index, groupBy) : "",
          result[index].jobNo ? result[index].jobNo : "",
          result[index].Charge_Heads.length > 0 ? experimental(result, index, groupBy): "",
          result[index].Charge_Heads.length > 0 ? experimentalOne(result, index, groupBy): "",
        ] : [
            index + 1, 
            result[index].map((x) =>x.Bl?.hbl) ? result[index].map((x) =>x.Bl?.hbl) : "",
            result[index].map((x) => x.shipping_line?.name) ? result[index].map((x) => x.shipping_line?.name) : "",
            result[index].map((x) => x.Client?.name) ? result[index].map((x) => x.Client?.name) : "",
            result[index].map((x) => x.createdAt) ? result[index].map((x) => x.createdAt.slice(0, 10)) : "",
            result[index].map((x) => x.shipDate) ? result[index].map((x) => x.shipDate.slice(0, 10)) : "",
            result[index].map((x) => x.commodity?.name) ? result[index].map((x) => x.commodity?.name) : "",
            result[index].map((x) => x.fd) ? result[index].map((x) => x.fd) : "",
            result[index].Bl.Item_Details.length > 0 ? grossWt(result, index, groupBy) : "",
            result[index].Bl.Item_Details.length > 0 ? chargableWt(result, index, groupBy) : "",
            result[index].map((x) => x.Bl.Container_Infos[0]?.no) ? result[index].map((x) => x.Bl.Container_Infos[0]?.no) : "",
            result[index].Bl.Item_Details.length > 0 ? tactRate(result, index, groupBy) : "",
            result[index].map((x) => x.jobNo) ? result[index].map((x) => x.jobNo) : "",
            result[index].map((x) =>  x.Charge_Heads.length > 0) ? experimental(result, index, groupBy): "",
            result[index].map((x) =>  x.Charge_Heads.length > 0) ? experimentalOne(result, index, groupBy): "",           
        ] ;
        tempData.push(data);
    }
    setCsvData(tempData);
  }

export const weight = (groupBy, result) => {
    let sum = 0
    !groupBy ? result.map((x) => x.Bl.Container_Infos?.forEach((y) => sum += Number(y.gross))) :
    result.map((x) => x.map((y) => y.Bl.Container_Infos?.forEach((z) => sum += Number(z.gross))))
      return sum
  }
  
export const net = (groupBy, result) => {
    let sum = 0
    !groupBy ? result.map((x) => x.Bl.Container_Infos?.forEach((y) => sum += Number(y.net))) :
    result.map((x) => x.map((y) => y.Bl.Container_Infos?.forEach((z) => sum += Number(z.net))))
    return sum
  }
  
  
export const tare = (groupBy, result) => {
    let sum = 0
    !groupBy ? result.map((x) => x.Bl.Container_Infos?.forEach((y) => sum += Number(y.tare))) :
    result.map((x) => x.map((y) => y.Bl.Container_Infos?.forEach((z) => sum += Number(z.tare))))
    return sum
  }
  
  
export const total = (groupBy, result) => {
    let sum = tare(groupBy, result) + net(groupBy, result) + weight(groupBy, result)
    return sum
  }
