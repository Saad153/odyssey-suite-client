import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value:{
    SE:"",
    SI:"",
    AE:"",
    AI:""
  }
}

export const persistValuesSlice = createSlice({
  name: 'persistValuesSlice',
  initialState,
  reducers: {
    addValues: (state, action) => {
      // console.log(action.payload)
      // console.log(state.value)
      state.value = action.payload
    },
  },
})

export const { addValues } = persistValuesSlice.actions

export default persistValuesSlice.reducer