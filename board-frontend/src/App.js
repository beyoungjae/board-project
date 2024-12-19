import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuthStatusThunk } from './features/authSlice'
import PostCreatePage from './pages/PostCreatePage'
import PostEditPage from './pages/PostEditPage'
import PostDetailPage from './pages/PostDetailPage'
import MyPage from './pages/MyPage'

function App() {
   const dispatch = useDispatch()
   const { isAuthenticated, user } = useSelector((state) => state.auth)

   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])

   return (
      <Routes>
         <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} user={user} />} />
         <Route path="/login" element={<LoginPage />} />
         <Route path="/posts/create" element={<PostCreatePage />} />
         <Route path="/posts/edit/:id" element={<PostEditPage />} />
         <Route path="/posts/:id" element={<PostDetailPage />} />
         <Route path="/my" element={<MyPage />} />
         <Route path="/my/:id" element={<MyPage />} />
      </Routes>
   )
}

export default App
