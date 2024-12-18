import { Container, Typography, Button, IconButton, Pagination, Stack } from '@mui/material'
import CreateIcon from '@mui/icons-material/Create'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { fetchPostsThunk } from '../feauters/postSlice'
import { logoutUserThunk } from '../feauters/authSlice'
import styled from 'styled-components'
import PostItem from '../post/PostItem'

const ContainerWrapper = styled(Container)`
   background-color: #f9f9f9;
   padding: 2rem;
   border-radius: 12px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
`

const TitleText = styled(Typography)`
   font-weight: bold;
   color: #333;
   margin-bottom: 1.5rem;
   font-size: 1.8rem;
`

const ActionButton = styled(Button)`
   margin-top: 1rem;
   padding: 10px 20px;
   font-size: 1rem;
   font-weight: 500;
   background-color: #1976d2;
   color: white;
   border-radius: 50px;
   &:hover {
      background-color: #1565c0;
      transform: scale(1.05);
   }
   transition: transform 0.3s ease;
`

const LinkButton = styled(Link)`
   text-decoration: none;
   margin-right: 10px;
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 5px 5px;
   border-radius: 30px;
   width: 80px;
   text-align: center;
   transition: all 0.3s ease-in-out;
   &:hover {
      background-color: rgb(185, 185, 185);
      transform: scale(1.05);
   }

   p {
      margin-top: 8px;
      font-size: 0.9rem;
      color: rgb(46, 46, 46);
   }
`

const IconGroup = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
`

const IconButtonWrapper = styled(IconButton)`
   color: rgb(0, 0, 0);
`

const UserInfo = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   margin-top: 1rem;
   margin-bottom: 1rem;
   color: #444;
`

const HomePage = ({ isAuthenticated, user }) => {
   const [page, setPage] = useState(1) // 현재 페이지
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { posts, pagination, loading, error } = useSelector((state) => state.posts)

   useEffect(() => {
      dispatch(fetchPostsThunk(page))
   }, [dispatch, page])

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

   const handlePageChange = useCallback((event, value) => {
      setPage(value)
   }, [])

   return (
      <div>
         <ContainerWrapper maxWidth="xs">
            <TitleText variant="h4" align="center" gutterBottom>
               게시판
            </TitleText>
            {isAuthenticated ? (
               <>
                  <IconGroup>
                     <LinkButton to="/posts/create">
                        <IconButtonWrapper aria-label="글쓰기">
                           <CreateIcon />
                        </IconButtonWrapper>
                        <p>글쓰기</p>
                     </LinkButton>
                     <LinkButton to="/my">
                        <IconButtonWrapper aria-label="마이페이지">
                           <AccountCircleIcon />
                        </IconButtonWrapper>
                        <p>마이페이지</p>
                     </LinkButton>
                  </IconGroup>
                  <UserInfo>
                     <Typography variant="body1">{user?.name}님</Typography>
                  </UserInfo>
                  <ActionButton onClick={handleLogout} variant="outlined">
                     로그아웃
                  </ActionButton>
               </>
            ) : (
               <LinkButton to="/login">
                  <ActionButton variant="contained">로그인</ActionButton>
               </LinkButton>
            )}
         </ContainerWrapper>

         <Container maxWidth="xs" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
               Home Feed
            </Typography>

            {loading && (
               <Typography variant="body1" align="center">
                  로딩 중...
               </Typography>
            )}

            {posts.length > 0 ? (
               <>
                  {posts.map((post) => (
                     <PostItem key={post.id} post={post} isAuthenticated={isAuthenticated} user={user} />
                  ))}
                  <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                     <Pagination count={pagination.totalPages} page={page} onChange={handlePageChange} />
                  </Stack>
               </>
            ) : (
               !loading && (
                  <Typography variant="body1" align="center">
                     게시물이 없습니다.
                  </Typography>
               )
            )}

            {error && (
               <Typography variant="body1" align="center" color="error">
                  에러 발생: {error}
               </Typography>
            )}
         </Container>
      </div>
   )
}

export default HomePage
