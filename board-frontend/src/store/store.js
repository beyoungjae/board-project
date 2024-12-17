import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../feauters/authSlice'
import boardReducer from '../feauters/boardSlice'

const store = configureStore({
   reducer: {
      auth: authReducer,
      board: boardReducer,
   },
})

export default store
