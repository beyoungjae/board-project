import { Container } from '@mui/material'
import PostForm from '../post/PostForm'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { createBoardThunk } from '../feauters/boardSlice'

const PostCreatePage = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const handleSubmit = useCallback(
      (boardData) => {
         dispatch(createBoardThunk(boardData))
            .unwrap()
            .then(() => {
               navigate('/')
            })
            .catch((error) => {
               console.error('게시물 등록 에러: ', error)
               alert('게시물 등록에 실패했습니다.', error)
            })
      },
      [dispatch, navigate]
   )

   return (
      <Container maxWidth="md">
         <h1>게시물 등록</h1>
         <PostForm onSubmit={handleSubmit} />
      </Container>
   )
}

export default PostCreatePage
