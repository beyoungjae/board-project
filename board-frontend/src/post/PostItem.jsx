import { Card, CardContent, CardMedia, Typography, IconButton, Box, CardActions } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Link, useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { deletePostThunk } from '../features/postSlice'
import dayjs from 'dayjs'
import styled from 'styled-components'

const StyledCard = styled(Card)`
   margin: 20px 0;
   border-radius: 12px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
   transition: transform 0.2s ease;
   cursor: pointer;

   &:hover {
      transform: translateY(-4px);
   }
`

const UserName = styled.span`
   color: #666;
   font-weight: 500;
   &:hover {
      text-decoration: underline;
   }
`

const PostItem = ({ post, isAuthenticated, user }) => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const onClickDelete = useCallback(
      (e, postId) => {
         e.stopPropagation()
         const confirmDelete = window.confirm('정말로 이 게시물을 삭제하시겠습니까?')

         if (confirmDelete) {
            dispatch(deletePostThunk(postId))
               .unwrap()
               .then(() => {
                  window.location.reload()
               })
               .catch((error) => {
                  console.error('게시물 삭제 중 오류 발생: ', error)
                  alert('게시물 삭제에 실패했습니다.')
               })
         }
      },
      [dispatch]
   )

   const handleUserClick = (e, userId) => {
      e.stopPropagation()
      navigate(`/my/${userId}`)
   }

   const handlePostClick = () => {
      navigate(`/posts/${post.id}`)
   }

   return (
      <StyledCard onClick={handlePostClick}>
         <CardMedia
            component="img"
            sx={{ height: 'auto', maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            image={`${process.env.REACT_APP_API_URL}${post.img}`}
            title={post.content}
         />
         <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
               {post.title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Box>
                  <UserName onClick={(e) => handleUserClick(e, post.User.id)}>
                     @{post.User.name}
                  </UserName>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                     {dayjs(post.createdAt).format('YYYY년 MM월 DD일')}
                  </Typography>
               </Box>
               {isAuthenticated && post.User.id === user.id && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                     <IconButton
                        aria-label="edit"
                        onClick={(e) => {
                           e.stopPropagation()
                           navigate(`/posts/edit/${post.id}`)
                        }}
                     >
                        <EditIcon />
                     </IconButton>
                     <IconButton aria-label="delete" onClick={(e) => onClickDelete(e, post.id)}>
                        <DeleteIcon />
                     </IconButton>
                  </Box>
               )}
            </Box>
         </CardContent>
      </StyledCard>
   )
}

export default PostItem
