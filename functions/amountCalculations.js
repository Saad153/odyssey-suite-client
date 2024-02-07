const getNetInvoicesAmount = (data) => {
  let netAmount = 0.0;
  let localAmount = 0.0;
  data.forEach((x)=>{
    netAmount = netAmount + parseFloat(x.net_amount)
    localAmount = localAmount + parseFloat(x.local_amount)
  });
  return { netAmount:netAmount.toFixed(2), localAmount:localAmount.toFixed(2)}
}

const getCurrency = (data) => {
  let netAmount = 0.0;
  let localAmount = 0.0;
  data.forEach((x)=>{
    netAmount = netAmount + parseFloat(x.net_amount)
    localAmount = localAmount + parseFloat(x.local_amount)
  });
  return { netAmount:netAmount.toFixed(2), localAmount:localAmount.toFixed(2)}
}

export { getNetInvoicesAmount, getCurrency }