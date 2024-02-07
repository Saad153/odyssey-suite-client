import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: ''
}

export const blCreationSlice = createSlice({
  name: 'blCreationSlice',
  initialState,
  reducers: {
    addBlCreationId: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { addBlCreationId } = blCreationSlice.actions

export default blCreationSlice.reducer