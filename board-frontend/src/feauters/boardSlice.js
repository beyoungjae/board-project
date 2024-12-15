import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { registerUser, loginUser, logoutUser } from '../api/boardApi'

// 회원가입 thunk
export const registerUserThunk = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
   try {
      const response = await registerUser(userData)
      return response.data.user
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '회원가입 실패')
   }
})

// 로그인 thunk
export const loginUserThunk = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
   try {
      const response = await loginUser(userData)
      return response.data.user
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그인 실패')
   }
})

// 로그아웃 thunk
export const logoutUserThunk = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
   try {
      await logoutUser()
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그아웃 실패')
   }
})

const authSlice = createSlice({
   name: 'auth',
   initialState: {
      // 서버에서 가져오는 데이터가 배열 일 때만 []로 초기값을 주고 나머지는 null로 준다.
      // null은 주로 문자열 혹은 json 객체 데이터일 때 사용
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 회원가입
      builder.addCase(registerUserThunk.pending, (state) => {
         state.loading = true
         state.error = null
      })
      builder.addCase(registerUserThunk.fulfilled, (state, action) => {
         state.loading = false
         state.user = action.payload
      })
      builder.addCase(registerUserThunk.rejected, (state, action) => {
         state.loading = true
         state.error = action.payload
      })
      // 로그인
      builder.addCase(loginUserThunk.pending, (state) => {
         state.loading = true
         state.error = null
      })
      builder.addCase(loginUserThunk.fulfilled, (state, action) => {
         state.loading = false
         state.user = action.payload
         state.isAuthenticated = true
      })
      builder.addCase(loginUserThunk.rejected, (state, action) => {
         state.loading = false
         state.error = action.payload
      })
      // 로그아웃
      builder.addCase(logoutUserThunk.pending, (state) => {
         state.loading = true
         state.error = null
      })
      builder.addCase(logoutUserThunk.fulfilled, (state) => {
         state.loading = false
         state.user = null
         state.isAuthenticated = false
      })
      builder.addCase(logoutUserThunk.rejected, (state, action) => {
         state.loading = false
         state.error = action.payload
      })
   },
})

export default authSlice.reducer
