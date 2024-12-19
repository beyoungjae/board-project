import { Container } from '@mui/material'
import PostForm from '../post/PostForm'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { createPostThunk } from '../features/postSlice'

const PostCreatePage = () => {
   const dispatch = useDispatch()

   const handleSubmit = useCallback(
      (postData) => {
         dispatch(createPostThunk(postData))
            .unwrap()
            .then(() => {
               window.location.href = '/'
            })
            .catch((error) => {
               console.error('게시물 등록 에러: ', error)
               alert('게시물 등록에 실패했습니다.', error)
            })
      },
      [dispatch]
   )

   return (
      <Container maxWidth="md">
         <h1>게시물 등록</h1>
         <PostForm onSubmit={handleSubmit} />
      </Container>
   )
}

export default PostCreatePage
