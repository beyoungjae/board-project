import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@mui/material'
import PostForm from '../post/PostForm'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostByIdThunk, updatePostThunk } from '../features/postSlice'

const PostEditPage = () => {
   const { id } = useParams()
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { post, loading, error } = useSelector((state) => state.posts)

   // 게시물 데이터 불러오기
   useEffect(() => {
      dispatch(fetchPostByIdThunk(id))
   }, [dispatch, id])

   // 게시물 수정
   const handleSubmit = useCallback(
      (postData) => {
         dispatch(updatePostThunk({ id, postData }))
            .unwrap()
            .then(() => {
               navigate('/')
            })
            .catch((error) => {
               console.error('게시물 수정 중 오류 발생: ', error)
               alert('게시물 수정에 실패했습니다.', error)
            })
      },
      [dispatch, navigate, id]
   )

   if (loading) return <p>로딩중 ...</p>
   if (error) return <p>에러 발생: {error}</p>

   return (
      <Container maxWidth="md">
         <h1>게시물 수정</h1>
         {post && <PostForm onSubmit={handleSubmit} initialValues={post} />}
      </Container>
   )
}

export default PostEditPage
