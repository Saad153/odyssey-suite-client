import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CSVReader from 'react-csv-reader';

const ParitesUploader = () => {

    // for invoices only
    const [finalList, setFinalList] = useState([])
    const [failedList, setFailedList] = useState([])
    const [invoiceIndex, setInvoiceIndex] = useState(0)

  const commas = (a) => a==0?'0':parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");

  const parserOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
  }

  const handleForce = (data) => {
    let clientList = [], vendorList = [], nonGlList = [], unKnownList = [];
    let clientVendor = [];
    data.forEach((x, i) => {
    if(i<data.length-1) {
      let records = {
        oldId:x.id,
        code:x.partycode,
        name:x.partyname,
        citycode:x.citycode,
        zip:x.postalcode,
        person1:x.contactperson,
        mobile1:x.mobile,
        telephone1:x.telephone1,
        telephone2:x.telephone2,
        address:null,//`${x.address1} ${x.address2==null?'':x.address2} ${x.address3==null?'':x.address3}`,
        website:x.website,
        infoMail:x.email,
        strn:x.strn,
        accountsMail:x.accountsemail,
        bankname:x.bankname,
        branchname:x.branchname,
        operations:"".concat(x.isairexport==1?'Air Export, ':'', x.isairimport==1?'Air Import, ':'', x.isseaexport==1?'Sea Export, ':'', x.isseaimport==1?'Sea Import, ':''),
        types:"".concat(
          x.isconsignee==1?'Consignee, ':''
          , x.isshipper==1?'Shipper, ':''
          , x.isnotify==1?'Notify, ':''
          , x.ispotentialcustomer==1?'Potential Customer, ':''
          , x.isnonoperationalparty==1?'Non operational Party, ':''

          , x.isforwarder==1?'Forwarder/Coloader, ':''
          , x.islocalagent==1?'Local Vendor, ':''
          , x.isoverseasagent==1?'Overseas Agent, ':''
          , x.iscommissionagent==1?'Commission Agent, ':''
          , x.isindentor==1?'Indentor, ':''
          , x.istransporter==1?'Transporter, ':''
          , x.ischachb==1?'CHA/CHB, ':''
          , x.isshippingline==1?'Shipping Line, ':''
          , x.isdeliveryagent==1?'Delivery Agent, ':''
          , x.iswarehouse==1?'Warehouse, ':''
          , x.isbuyinghouse==1?'Buying House, ':''
          , x.isairline==1?'Air Line, ':''
          , x.istrucking==1?'Trucking, ':''
          , x.isdrayman==1?'Drayman, ':''
          , x.iscartage==1?'Cartage, ':''
          , x.isstevedore==1?'Stevedore, ':''
          , x.isprincipal==1?'Principal, ':''
          , x.isdepo==1?'Depot, ':''
          , x.isterminalparty==1?'Terminal, ':''
          , x.isbuyer==1?'Buyer, ':''
          , x.isbillingparty==1?'Invoice Party, ':''
          , x.isslotoperator==1?'Slot Operator':''),
          partytypeid:x.partytypeid
        //partytype:x.partytypeid==1?'Client':x.partytypeid==2?'Vendor':x.partytypeid==2?'Customer/Vendor':'Non-Gl'
      }
      if(x.partytypeid==1) {
        clientList.push(records);
      } else if(x.partytypeid==2) {
        vendorList.push(records);
      } else if(x.partytypeid==3) {
        clientVendor.push(records);
      } else if(x.partytypeid==4) {
        nonGlList.push(records);
      } else {
        unKnownList.push(records);
      }
    }
    
    });
    clientVendor.forEach((x)=>{
      if(x.types.includes('Consignee') || x.types.includes('Shipper') || x.types.includes('Notify') || x.types.includes('Potential Customer') || x.types.includes('Non operational Party')){
        clientList.push(x);
      } else {
        vendorList.push(x);
      }
    })
    console.log({vendorList, clientList, unKnownList});
  }

  const handleForceTwo = (data) => {
    console.log(data)
    let clientList = [], vendorList = [], nonGlList = [], unKnownList = [];
    let clientVendor = [];
    data.forEach((x, i) => {
    if(i<data.length) {
      let records = {
        oldId:x.id,
        code:x.party_code,
        name:x.party_name,
        citycode:x.city_code,
        // zip:x.postalcode,
        // person1:x.contactperson,
        // mobile1:x.mobile,
        // telephone1:x.telephone1,
        // telephone2:x.telephone2,
        address:`${x.address_1} ${x.address_2==null?'':x.address_2} ${x.address_3==null?'':x.address_3}`,
        website:x.website,
        infoMail:x.email,
        strn:x.strn,
        // accountsMail:x.accountsemail,
        // bankname:x.bankname,
        // branchname:x.branchname,
        operations:"".concat(x.air_export=="Yes"?'Air Export, ':'', x.air_import=="Yes"?'Air Import, ':'', x.sea_export=="Yes"?'Sea Export, ':'', x.sea_import=="Yes"?'Sea Import, ':''),
        types:"".concat(
          x.consignee=="Yes"?'Consignee, ':''
          , x.shipper=="Yes"?'Shipper, ':''
          , x.notify=="Yes"?'Notify, ':''
          , x.potential_customer=="Yes"?'Potential Customer, ':''
          //x.isnonoperationalparty==1?'Non operational Party, ':''
          , x.forwarder_coloader=="Yes"?'Forwarder/Coloader, ':''
          , x.local_vendor=="Yes"?'Local Vendor, ':''
          , x.overseas_agent=="Yes"?'Overseas Agent, ':''
          , x.commission_agent=="Yes"?'Commission Agent, ':''
          , x.indentor=="Yes"?'Indentor, ':''
          , x.transporter=="Yes"?'Transporter, ':''
          , x.cha_chb=="Yes"?'CHA/CHB, ':''
          , x.shipping_line=="Yes"?'Shipping Line, ':''
          , x.delivery_agent=="Yes"?'Delivery Agent, ':''
          , x.warehouse_party=="Yes"?'Warehouse, ':''
          , x.buying_house=="Yes"?'Buying House, ':''
          , x.air_line=="Yes"?'Air Line, ':''
          , x.trucking=="Yes"?'Trucking, ':''
          , x.drayman=="Yes"?'Drayman, ':''
          , x.cartage=="Yes"?'Cartage, ':''
          , x.stevedore=="Yes"?'Stevedore, ':''
          , x.principal=="Yes"?'Principal, ':''
          , x.depoparty=="Yes"?'Depot, ':''
          , x.terminal_party=="Yes"?'Terminal, ':''
          , x.buyer=="Yes"?'Buyer, ':''
          , x.billing_party=="Yes"?'Invoice Party, ':''
          , x.slotoperator=="Yes"?'Slot Operator':''),
        //partytype:x.partytypeid==1?'Client':x.partytypeid==2?'Vendor':x.partytypeid==2?'Customer/Vendor':'Non-Gl'
      }
     clientVendor.push(records)
    //  vendorList.push(records)
    //  clientList.push(records)
    // nonGlList.push(records)

    //   if(x.partytypeid==1) {
    //     clientList.push(records);
    //   } else if(x.partytypeid==2) {
    //     vendorList.push(records);
    //   } else if(x.partytypeid==3) {
    //     clientVendor.push(records);
    //   } else if(x.partytypeid==4) {
    //     nonGlList.push(records);
    //   } else {
    //     unKnownList.push(records);
    //   }
    }
    });
    // console.log({vendorList, clientList, clientVendor, nonGlList, unKnownList});

    // clientVendor.forEach((x)=>{
    //   if(x.types.includes('Consignee') || x.types.includes('Shipper') || x.types.includes('Notify') || x.types.includes('Potential Customer') || x.types.includes('Non operational Party')){
    //     clientList.push(x);
    //   } else {
    //     vendorList.push(x);
    //   }
    // })

    console.log({vendorList, clientList, nonGlList, unKnownList, clientVendor});
  }

  const uploadParties = async() => {
    // let clientWithAc = [];
    // let clientWithNoAc = [];
    // let tempClients = [...parties.clientList];
    // await tempClients.forEach((x, i) => {
    //   let name = x.name;
    //   let accountsTempList = [...accountsList.Liability, ...accountsList.Assets]
    //   accountsTempList.forEach((y, j) => {
    //     y.childAccounts.forEach((z, k) => {
    //       if(z.account_title==name){
    //         delete tempClients[i]
    //         clientWithAc.push({...x, account:{...z, parent:y.account_title}})
    //       } else {
    //         // clientWithNoAc.push(x)
    //       }
    //     });
    //   });
    // });
    // // console.log(parties.clientList.length);
    // console.log('with accounts',clientWithAc);
    // console.log('no accounts',tempClients);
    // axios.post('http://localhost:8081/accounts/createClientInBulk', clientWithAc)
    // .then((x)=>{
    //     console.log(x.data)
    // })


    // let vendorWithAc = [];
    // let vendorWithNoAc = [];
    // let tempVendors = [...parties.vendorList];
    // await tempVendors.forEach((x, i) => {
    //   let name = x.name;
    //   let accountsTempList = [...accountsList.Liability, ...accountsList.Assets]
    //   accountsTempList.forEach((y, j) => {
    //         y.childAccounts.forEach((z, k) => {
    //             if(z.account_title==name){
    //                 delete tempVendors[i]
    //                 vendorWithAc.push({...x, account:{...z, parent:y.account_title}})
    //             } else {
    //                 vendorWithNoAc.push(x)
    //             }
    //         })
    //     })
    // });
    // console.log('with accounts', vendorWithAc)
    // console.log('No accounts', tempVendors)
    // axios.post('http://localhost:8081/accounts/createVendorInBulk', vendorWithAc)
    // .then((x)=>{
    //   console.log(x.data)
    // })

    // let nonGl = [];
    // let tempNonGl = [...parties.nonGlList];
    // await tempNonGl.forEach((x, i) => {
    //     x.nongl = '1'
    // });
    // console.log(tempNonGl)
    // axios.post('http://localhost:8081/accounts/nonGlInBulk', tempNonGl)
    // .then((x)=>{
    //   console.log(x.data)
    // })

  }

  return (
  <>
    <div>
      <b>Parties Loader</b>
    </div>
    <CSVReader cssClass="csv-reader-input" onFileLoaded={handleForceTwo} parserOptions={parserOptions} 
      inputId="ObiWan" inputName="ObiWan"
    />
    <button onClick={uploadParties} className='btn-custom mt-3'>Upload Parties With Account</button>
  </>
  )
}

export default ParitesUploader

let parties = {
  "vendorList":[],
  "clientList":[],
  "unknown":[],
  "nonGlList":[]
}

let accountsList = {
    "Assets": [],
    "Liability": [],
    "Expense": [],
    "income": [],
    "Capital": []
}

let clientsLeft = []