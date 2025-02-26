import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { appApi } from '../commons/api/appApi'

export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      appApi.middleware,
    ),
})

setupListeners(store.dispatch)