import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../feauters/authSlice'
import postReducer from '../feauters/postSlice'

const store = configureStore({
   reducer: {
      auth: authReducer,
      posts: postReducer,
   },
})

export default store
