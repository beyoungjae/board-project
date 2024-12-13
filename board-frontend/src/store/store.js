import { configureStore } from '@reduxjs/toolkit'
import boardReducer from '../feauters/boardSlice'

const store = configureStore({
   reducer: {
      auth: boardReducer,
   },
})

export default store
