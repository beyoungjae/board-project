import { Container, Typography, Button, IconButton, Pagination, Stack, Box, AppBar, Toolbar } from '@mui/material'
import CreateIcon from '@mui/icons-material/Create'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchPostsThunk } from '../features/postSlice'
import { logoutUserThunk } from '../features/authSlice'
import styled from 'styled-components'
import PostItem from '../post/PostItem'

const Header = styled(AppBar)`
   background-color: rgba(0, 0, 0, 0.8) !important;
   color: #eee;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
`

const HeaderToolbar = styled(Toolbar)`
   display: flex;
   justify-content: space-between;
   padding: 10px 20px;
   
   @media (max-width: 600px) {
      padding: 16px;
   }
`

const Logo = styled(Typography)`
   font-size: 3rem !important;
   font-weight: bold;
   color: #eee;
   cursor: pointer;
`

const ActionButton = styled(Button)`
   margin-left: 16px;
   padding: 8px 24px;
   border-radius: 50px;
   text-transform: none;
   font-size: 1rem;
   font-weight: 500;
   background-color: #f5f5f5 !important;
   color: #666 !important;
   transition: all 0.2s ease;
   
   &:hover {
      background-color: #eee !important;
   }
`

const UserInfo = styled(Box)`
   display: flex;
   align-items: center;
   gap: 8px;
   margin-right: 16px;
   color: #666;
`

const ActionButtons = styled(Box)`
   display: flex;
   gap: 16px;
   margin-top: 32px;
   margin-bottom: 48px;
`

const ActionIconButton = styled(Link)`
   display: flex;
   align-items: center;
   padding: 8px 16px;
   border-radius: 50px;
   text-decoration: none;
   color: #666 !important;
   background-color: #f5f5f5 !important;
   transition: all 0.2s ease;
   
   &:hover {
      background-color: #eee !important;
      transform: translateY(-2px);
   }
   
   .icon {
      margin-right: 8px;
   }
`

const HomePage = ({ isAuthenticated, user }) => {
   const [page, setPage] = useState(1)
   const dispatch = useDispatch()
   const { posts, pagination, loading, error } = useSelector((state) => state.posts)

   useEffect(() => {
      dispatch(fetchPostsThunk(page))
   }, [dispatch, page])

   const handleLogout = useCallback(() => {
      dispatch(logoutUserThunk())
         .unwrap()
         .then(() => {
            window.location.href = '/'
         })
         .catch((error) => {
            alert(error)
         })
   }, [dispatch])

   const handlePageChange = useCallback((event, value) => {
      setPage(value)
   }, [])

   return (
      <>
         <Header position="sticky">
            <HeaderToolbar>
               <Logo variant="h1" onClick={() => window.location.href = '/'}>
                  게시판
               </Logo>
               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isAuthenticated ? (
                     <>
                           <Link to="/my" style={{ textDecoration: 'none' }}>
                           <AccountCircleIcon sx={{ color: '#eee', mr: 1 }} />
                           </Link>
                        <UserInfo>
                           <Typography sx={{ color: '#eee' }}>{user?.name}님</Typography>
                        </UserInfo>
                        <ActionButton
                           className="logout"
                           onClick={handleLogout}
                        >
                           로그아웃
                        </ActionButton>
                     </>
                  ) : (
                     <Link to="/login" style={{ textDecoration: 'none' }}>
                        <ActionButton className="login">
                           로그인
                        </ActionButton>
                     </Link>
                  )}
               </Box>
            </HeaderToolbar>
         </Header>

         <Container maxWidth="md" sx={{ py: 4 }}>
            {isAuthenticated && (
               <ActionButtons>
                  <ActionIconButton to="/posts/create">
                     <CreateIcon className="icon" />
                     글쓰기
                  </ActionIconButton>
               </ActionButtons>
            )}

            {loading && (
               <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
                  로딩 중...
               </Typography>
            )}

            {posts.length > 0 ? (
               <>
                  <Box sx={{ display: 'grid', gap: 3 }}>
                     {posts.map((post) => (
                        <PostItem key={post.id} post={post} isAuthenticated={isAuthenticated} user={user} />
                     ))}
                  </Box>
                  <Stack spacing={2} sx={{ mt: 4, mb: 2, alignItems: 'center' }}>
                     <Pagination
                        count={pagination.totalPages}
                        page={page}
                        onChange={handlePageChange}
                        size="large"
                        sx={{
                           '& .MuiPaginationItem-root': {
                              fontSize: '1rem',
                           }
                        }}
                     />
                  </Stack>
               </>
            ) : (
               !loading && (
                  <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: '#666' }}>
                     게시물이 없습니다.
                  </Typography>
               )
            )}

            {error && (
               <Typography variant="body1" align="center" color="error" sx={{ mt: 4 }}>
                  에러 발생: {error}
               </Typography>
            )}
         </Container>
      </>
   )
}

export default HomePage
