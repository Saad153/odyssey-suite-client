 

export const landigFlagStatus = [
  { id: "AIRPORT / DOOR", value: "AIRPORT / DOOR" },
  { id: "CFS / CFS", value: "CFS / CFS" },
  { id: "CFS / CY", value: "CFS / CY" },
  { id: "CFS / DR", value: "CFS / DR" },
  { id: "CY / CY", value: "CY / CY" },
  { id: "CY / DR", value: "CY / DR" },
  { id: "CY / SD", value: "CY / SD" },
  { id: "DOOR / DOOR", value: "DOOR / DOOR" },
  { id: "DOOR / FCL", value: "DOOR / FCL" },
  { id: "DOOR / LCL", value: "DOOR / LCL" },
  { id: "DR / CFS", value: "DR / CFS" },
  { id: "DR / CY", value: "DR / CY" },
  { id: "DR / DR", value: "DR / DR" },
  { id: "FCL / DOOR", value: "FCL / DOOR" },
  { id: "FCL / FCL", value: "FCL / FCL" },
  { id: "FCL / LCL", value: "FCL / LCL" },
  { id: "LCL / DOOR", value: "LCL / DOOR" },
  { id: "LCL / FCL", value: "LCL / FCL" },
  { id: "LCL / LCL", value: "LCL / LCL" },
  { id: "PIER / PIER", value: "PIER / PIER" },
];

export const cargoStatus = [
  { id: "LCL / LCL", value: "LCL / LCL" },
  { id: "FCL / FCL", value: "FCL / FCL" },
  { id: "FCL / LCL", value: "FCL / LCL" },
  { id: "LCL / FCL", value: "LCL / FCL" },
  { id: "PART / FCL", value: "PART / FCL" },
  { id: "FCL / DOOR", value: "FCL / DOOR" },
  
];


export const costCenter = [
    {id: "KHI", value: "KHI" },
    {id: "SKT", value: "SKT" },
    {id: "LHR", value: "LHR" },
    {id: "FSD", value: "FSD" },


]

export const initialState = {
  values : {
    id:                "",
    localCustom:       "", 
    wharf:             "", 
    loadingTerminal:   "", 
    dischargeTerminal: "", 
    loadingDate:       "", 
    loadingTime:       "", 
    arrivalDate:       "", 
    croIssueDate:      "", 
    expiryDate:        "", 
    egm:               "", 
    etd:               "", 
    book:              "", 
    gatePass:          "", 
    gatePassDate:      "", 
    letter:            "", 
    cro:               "", 
    validityDate:      "", 
    berth:             "", 
    viaPort:           "", 
    containerInfo:     "", 
    portOfReciept:     "", 
    portOfReciept:     "", 
    instruction:       "", 
    loadingFlag:       "", 
    status:            "", 
    allocAvailable:    "", 
    contAvailable:     "", 
    sobDate:           "", 
    containerSplit:    "", 
    blRequired:        "", 
    containerWt:       "", 
    containerTemp:     "", 
    containerPickup:   "", 
    vent:              "", 
    loadingTerms:      "", 
  }
}