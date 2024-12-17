import { Container, Typography, Button, IconButton } from '@mui/material'
import CreateIcon from '@mui/icons-material/Create'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUserThunk } from '../feauters/authSlice'
import styled from 'styled-components'

const StyledContainer = styled(Container)`
   background-color: #f9f9f9;
   padding: 2rem;
   border-radius: 8px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
`

const StyledTypography = styled(Typography)`
   font-weight: bold;
   color: #333;
   margin-bottom: 1rem;
`

const StyledButton = styled(Button)`
   margin-top: 1rem;
`

const StyledLink = styled(Link)`
   text-decoration: none;
   color: inherit;
   margin-right: 20px;
`

const IconWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   margin-bottom: 1rem;
`

const StyledIconButton = styled(IconButton)`
   color: #1976d2;
   margin-right: 10px;
   &:hover {
      color: #1565c0;
   }
`

const UserInfoWrapper = styled.div`
   display: flex;
   align-items: center;
   margin-top: 1rem;
   justify-content: center;
   margin-bottom: 1rem;
`

const HomePage = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleLogout = useCallback(() => {
      dispatch(logoutUserThunk())
         .unwrap()
         .then(() => {
            navigate('/')
         })
         .catch((error) => {
            alert(error)
         })
   }, [dispatch, navigate])

   return (
      <StyledContainer maxWidth="xs">
         <StyledTypography variant="h4" align="center" gutterBottom>
            게시판
         </StyledTypography>
         {isAuthenticated ? (
            <>
               <IconWrapper>
                  <StyledLink to="/posts/create">
                     <StyledIconButton aria-label="글쓰기">
                        <CreateIcon />
                     </StyledIconButton>
                  </StyledLink>
                  <StyledLink to="/my">
                     <StyledIconButton aria-label="마이페이지">
                        <AccountCircleIcon />
                     </StyledIconButton>
                  </StyledLink>
               </IconWrapper>
               <UserInfoWrapper>
                  <Typography variant="body1">{user?.name}님</Typography>
               </UserInfoWrapper>
               <StyledButton onClick={handleLogout} variant="outlined">
                  로그아웃
               </StyledButton>
            </>
         ) : (
            <StyledLink to="/login">
               <StyledButton variant="contained">로그인</StyledButton>
            </StyledLink>
         )}
      </StyledContainer>
   )
}

export default HomePage
