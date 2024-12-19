import { Box, Typography, Avatar, Paper, Divider, Button } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfileThunk, getUserProfileByIdThunk } from '../../features/pageSlice'
import styled from 'styled-components'
import PostItem from '../../post/PostItem'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const ProfilePaper = styled(Paper)`
   padding: 32px;
   border-radius: 16px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
   background: white;
   margin-bottom: 32px;
`

const LargeAvatar = styled(Avatar)`
   width: 120px;
   height: 120px;
   margin-bottom: 16px;
   background-color: #1976d2;
   font-size: 3rem;
`

const StatsBox = styled(Box)`
   text-align: center;
   padding: 16px;
   
   .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1976d2;
   }
   
   .stat-label {
      color: #666;
      margin-top: 4px;
   }
`

const BackButton = styled(Button)`
   margin: 20px 0;
   color: #666;
   text-transform: none;
   font-size: 1rem;

   &:hover {
      background-color: rgba(0, 0, 0, 0.04);
   }
`

const MyProfile = ({ userId }) => {
   const dispatch = useDispatch()
   const { user, loading, error } = useSelector((state) => state.page)
   const { isAuthenticated, user: currentUser } = useSelector((state) => state.auth)
   const navigate = useNavigate()

   useEffect(() => {
      if (userId) {
         dispatch(getUserProfileByIdThunk(userId))
      } else {
         dispatch(getUserProfileThunk())
      }
   }, [dispatch, userId])

   if (loading) return <Typography sx={{ textAlign: 'center', my: 4 }}>로딩중...</Typography>
   if (error) return <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>{error}</Typography>
   if (!user) return <Typography sx={{ textAlign: 'center', my: 4 }}>프로필을 찾을 수 없습니다.</Typography>

   return (
      <Box>
         <BackButton startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
            메인으로 돌아가기
         </BackButton>
         <ProfilePaper elevation={0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
               <LargeAvatar>{user.name[0].toUpperCase()}</LargeAvatar>
               <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {user.name}
               </Typography>
               <Typography variant="body1" color="text.secondary">
                  @{user.email}
               </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <StatsBox>
               <Typography className="stat-value">{user.posts?.length || 0}</Typography>
               <Typography className="stat-label">게시물</Typography>
            </StatsBox>
         </ProfilePaper>

         <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            작성한 게시물
         </Typography>
         
         {user.posts && user.posts.length > 0 ? (
            <Box sx={{ display: 'grid', gap: 3 }}>
               {user.posts.map((post) => (
                  <PostItem
                     key={post.id}
                     post={post}
                     isAuthenticated={isAuthenticated}
                     user={currentUser}
                  />
               ))}
            </Box>
         ) : (
            <Typography sx={{ textAlign: 'center', color: '#666', my: 4 }}>
               작성한 게시물이 없습니다.
            </Typography>
         )}
      </Box>
   )
}

export default MyProfile