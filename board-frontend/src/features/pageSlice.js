import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUserProfile, getUserProfileById } from '../api/boardApi'

// 내 프로필 정보 가져오기
export const getUserProfileThunk = createAsyncThunk('page/getUserProfile', async (_, { rejectWithValue }) => {
    try {
        const response = await getUserProfile()
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || '프로필 정보를 찾을 수 없습니다.')
    }
})

// 상대 프로필 정보 가져오기
export const getUserProfileByIdThunk = createAsyncThunk('page/getUserProfileById', async (id, { rejectWithValue }) => {
    try {
        const response = await getUserProfileById(id)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || '프로필 정보를 찾을 수 없습니다.')
    }
})


const pageSlice = createSlice({
    name: 'page',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    // 내 프로필 정보 가져오기
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfileThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getUserProfileThunk.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(getUserProfileThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
        // 상대 프로필 정보 가져오기
        builder
            .addCase(getUserProfileByIdThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getUserProfileByIdThunk.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(getUserProfileByIdThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export default pageSlice.reducer