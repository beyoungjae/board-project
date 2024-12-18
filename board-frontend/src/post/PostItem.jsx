import { Card, CardMedia, CardContent, Typography, Box, CardActions, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import { useCallback } from 'react'
import { deletePostThunk } from '../feauters/postSlice'

const PostItem = ({ post, isAuthenticated, user }) => {
   const dispatch = useDispatch()

   // 게시물 삭제 실행
   const onClickDelete = useCallback(
      (id) => {
         const confirmDelete = window.confirm('정말로 이 게시물을 삭제하시겠습니까?')

         if (confirmDelete) {
            dispatch(deletePostThunk(id))
               .unwrap()
               .then(() => {
                  window.location.href = '/'
               })
               .catch((error) => {
                  console.error('게시물 삭제 중 오류 발생: ', error)
                  alert('게시물 삭제에 실패했습니다.')
               })
         } else {
            alert('삭제가 취소되었습니다.')
         }
      },
      [dispatch]
   )

   return (
      <Card style={{ margin: '20px 0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
         <CardMedia sx={{ height: 240 }} image={`${process.env.REACT_APP_API_URL}${post.img}`} title={post.content} />
         <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
               {post.title}
            </Typography>
            <Link to={`/my/${post.User.id}`} style={{ textDecoration: 'none' }}>
               <Typography sx={{ color: 'primary.main', fontSize: '1rem', fontWeight: 500 }}>@{post.User.name}</Typography>
            </Link>
            <Typography sx={{ fontSize: '0.875rem', color: '#777' }}>{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            <Typography sx={{ fontSize: '1rem', color: '#555' }}>{post.content}</Typography>
         </CardContent>
         <CardActions>
            <Button size="small" color="primary" sx={{ fontSize: '0.875rem' }}>
               <FavoriteBorderIcon fontSize="small" />
            </Button>
            {isAuthenticated && post.User.id === user.id && (
               <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Link to={`/posts/edit/${post.id}`}>
                     <IconButton aria-label="edit" size="small">
                        <EditIcon fontSize="small" />
                     </IconButton>
                  </Link>
                  <IconButton aria-label="delete" size="small" onClick={() => onClickDelete(post.id)}>
                     <DeleteIcon fontSize="small" />
                  </IconButton>
               </Box>
            )}
         </CardActions>
      </Card>
   )
}

export default PostItem
