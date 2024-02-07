import { createSlice } from '@reduxjs/toolkit';

export const filterValuesSlice = createSlice({
    name: "filterValues",
    initialState: [],
    reducers: {
        setFilterValues(state, action) {
            const { pageName, values } = action.payload;
            const existingFilterIdx = state.findIndex(page => page.pageName === pageName);

            if (existingFilterIdx !== -1) {
                // Update existing filter values
                state[existingFilterIdx].values = values;
            } else {
                // Add new filter values
                state.push({ pageName, values });
            }
        },
        removerFilterValue(state,action){
            const {pageName} = action.payload;
            const removePage = state.filter(page=>page.pageName !== pageName)
            return removePage
        }
    }
});

export const { setFilterValues} = filterValuesSlice.actions;
export default filterValuesSlice.reducer;