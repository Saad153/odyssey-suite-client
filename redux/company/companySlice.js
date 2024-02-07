import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: '',
  companies:[]
}

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    companySelect: (state, action) => {
      state.value = action.payload
    },
    addCompanies: (state, action) => {
      state.companies = action.payload
    },
  },
})

export const { companySelect, addCompanies } = companySlice.actions

export default companySlice.reducer