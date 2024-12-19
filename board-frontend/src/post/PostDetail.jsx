import { Card, CardMedia, CardContent, Typography, Box, CardActions, Button, IconButton, Container } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { useCallback, useEffect } from 'react'
import { deletePostThunk, fetchPostByIdThunk } from '../features/postSlice'
import styled from 'styled-components'

const StyledCard = styled(Card)`
   margin: 40px 0;
   border-radius: 16px;
   box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
   background: #ffffff;
   overflow: hidden;
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

const PostDetail = () => {
   const { id } = useParams()
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { post, loading, error } = useSelector((state) => state.posts)
   const { isAuthenticated, user } = useSelector((state) => state.auth)

   // 게시물 데이터 불러오기
   useEffect(() => {
      dispatch(fetchPostByIdThunk(id))
   }, [dispatch, id])

   // 게시물 삭제 실행
   const onClickDelete = useCallback(
      (postId) => {
         const confirmDelete = window.confirm('정말로 이 게시물을 삭제하시겠습니까?')

         if (confirmDelete) {
            dispatch(deletePostThunk(postId))
               .unwrap()
               .then(() => {
                  navigate('/')
               })
               .catch((error) => {
                  console.error('게시물 삭제 중 오류 발생: ', error)
                  alert('게시물 삭제에 실패했습니다.')
               })
         }
      },
      [dispatch, navigate]
   )

   if (loading) return <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>로딩중...</Typography>
   if (error) return <Typography variant="h6" color="error" sx={{ textAlign: 'center', my: 4 }}>에러 발생: {error}</Typography>
   if (!post) return <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>게시물을 찾을 수 없습니다.</Typography>

   return (
      <Container maxWidth="md">
         <BackButton startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
            메인으로 돌아가기
         </BackButton>
         <StyledCard>
            <CardMedia
               component="img"
               sx={{
                  height: 'auto',
                  maxHeight: '600px',
                  width: '100%',
                  objectFit: 'cover',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
               }}
               image={`${process.env.REACT_APP_API_URL}${post.img}`}
               title={post.content}
            />
            <CardContent sx={{ padding: '32px' }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                     {post.title}
                  </Typography>
                  {isAuthenticated && post.User.id === user.id && (
                     <Box sx={{ display: 'flex', gap: 1 }}>
                        <Link to={`/posts/edit/${post.id}`}>
                           <IconButton aria-label="edit">
                              <EditIcon />
                           </IconButton>
                        </Link>
                        <IconButton aria-label="delete" onClick={() => onClickDelete(post.id)}>
                           <DeleteIcon />
                        </IconButton>
                     </Box>
                  )}
               </Box>
               <Box sx={{ mb: 3 }}>
                  <Link to={`/my/${post.User.id}`} style={{ textDecoration: 'none' }}>
                     <Typography sx={{ color: 'primary.main', fontSize: '1.2rem', fontWeight: 500, mb: 1 }}>
                        @{post.User.name}
                     </Typography>
                  </Link>
                  <Typography sx={{ fontSize: '0.9rem', color: '#777' }}>
                     {dayjs(post.createdAt).format('YYYY년 MM월 DD일 HH:mm')}
                  </Typography>
               </Box>
               <Typography
                  sx={{
                     fontSize: '1.1rem',
                     color: '#444',
                     lineHeight: 1.8,
                     whiteSpace: 'pre-wrap',
                     letterSpacing: '0.3px'
                  }}
               >
                  {post.content}
               </Typography>
            </CardContent>
            <CardActions sx={{ padding: '16px 32px', borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
               <Button
                  size="large"
                  color="primary"
                  startIcon={<FavoriteBorderIcon />}
                  sx={{ fontSize: '1rem' }}
               >
                  좋아요
               </Button>
            </CardActions>
         </StyledCard>
      </Container>
   )
}

export default PostDetail
