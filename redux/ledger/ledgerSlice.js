import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment';

  const initialState = {
    from: "2023-07-01",
    to: moment().format("YYYY-MM-DD"),
    company: 1,
    currency: "PKR",
    records: [],
    account:"",
    name: "",
  };

  export const ledgerSlice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {
    setFrom(state, action) {
      state.from = action.payload;
    },
    setTo(state, action) {
      state.to = action.payload;
    },
    setCompany(state, action) {
      state.company = action.payload;
    },
    setCurrency(state, action) {
      state.currency = action.payload;
    },
    setRecords(state, action) {
      state.records = action.payload;
    },
    setAccount(state, action) {
      state.account = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
  },
})

export const { setFrom, setTo, setCompany, setCurrency, setRecords, setAccount,setName } = ledgerSlice.actions

export default ledgerSlice.reducer