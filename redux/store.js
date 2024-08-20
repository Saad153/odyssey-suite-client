import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter/counterSlice';
import tabsReducer from './tabs/tabSlice';
import companyReducer from './company/companySlice';
import blCreationReducer from './BlCreation/blCreationSlice';
import persistValuesReducer from './persistValues/persistValuesSlice';
import { seJobValues } from './apis/seJobValues';
import filterValuesReducer from './filters/filterSlice';
import ledgerReducer from './ledger/ledgerSlice';
import profitLossReducer from './profitLoss/profitLossSlice';
export const store = configureStore({
  reducer: {
    [seJobValues.reducerPath]: seJobValues.reducer,
    counter: counterReducer,
    filterValues:filterValuesReducer,
    company: companyReducer,
    ledger: ledgerReducer,
    profitloss:profitLossReducer,
    tabs: tabsReducer,
    blCreationValues: blCreationReducer,
    persistValues: persistValuesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(seJobValues.middleware),
})