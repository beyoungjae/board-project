import React, { useState, useMemo, useCallback } from 'react'
import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUserThunk } from '../../feauters/authSlice'

const Login = () => {
   const [name, setName] = useState('') // 이름 상태
   const [password, setPassword] = useState('') // 비밀번호 상태
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error } = useSelector((state) => state.auth)

   const handleLogin = useCallback(
      (e) => {
         e.preventDefault()
         if (name.trim() && password.trim()) {
            dispatch(loginUserThunk({ name, password }))
               .unwrap()
               .then(() => navigate('/'))
               .catch((error) => console.error('로그인 실패:', error))
         }
      },
      [dispatch, name, password, navigate]
   )

   const loginButtonContent = useMemo(
      () =>
         loading ? (
            <CircularProgress
               size={24}
               sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
               }}
            />
         ) : (
            '로그인'
         ),
      [loading]
   ) // 로딩 상태가 변경될 때만 버튼 내용이 다시 렌더링됨.

   return (
      <Container maxWidth="sm">
         <Typography variant="h4" gutterBottom>
            로그인
         </Typography>

         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <form onSubmit={handleLogin}>
            <TextField label="사용자 이름" name="name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="비밀번호" type="password" name="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading} sx={{ position: 'relative', marginTop: '20px' }}>
               {loginButtonContent}
            </Button>
         </form>

         <p>
            계정이 없으신가요? <Link to="/signup">회원가입</Link>
         </p>
      </Container>
   )
}

export default Login
