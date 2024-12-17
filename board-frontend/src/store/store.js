import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../feauters/authSlice'

const store = configureStore({
   reducer: {
      auth: authReducer,
   },
})

export default store
