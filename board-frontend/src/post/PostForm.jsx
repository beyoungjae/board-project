import React, { useState, useCallback, useMemo } from 'react'
import { TextField, Button, Box } from '@mui/material'

// 등록, 수정 폼 컴포넌트
const PostForm = ({ onSubmit, initialValues = {} }) => {
   const [imgUrl, setImgUrl] = useState(initialValues.img ? process.env.REACT_APP_API_URL + initialValues.img : '')
   const [imgFile, setImgFile] = useState(null)
   const [title, setTitle] = useState(initialValues.title || '')
   const [content, setContent] = useState(initialValues.content || '')

   // 이미지 파일 미리보기
   const handleImageChange = useCallback((e) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return

      setImgFile(file)

      const reader = new FileReader()

      reader.readAsDataURL(file)

      reader.onload = (event) => {
         setImgUrl(event.target.result)
      }
   }, [])

   // 작성한 내용 전송
   const handleSubmit = useCallback(
      (e) => {
         e.preventDefault()

         if (!title.trim()) {
            alert('제목을 입력하세요.')
            return
         }

         if (!content.trim()) {
            alert('내용을 입력하세요.')
            return
         }

         if (!imgFile && !initialValues.id) {
            alert('이미지 파일을 추가하세요.')
            return
         }

         const formData = new FormData()
         formData.append('title', title)
         formData.append('content', content)

         if (imgFile) {
            const encodedFile = new File([imgFile], encodeURIComponent(imgFile.name), { type: imgFile.type })
            formData.append('img', encodedFile)
         }

         onSubmit(formData)
      },
      [title, content, imgFile, onSubmit, initialValues.id]
   )

   const submitButtonLabel = useMemo(() => (initialValues.id ? '수정' : '등록'), [initialValues.id])

   return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} encType="multipart/form-data">
         {/* 이미지 업로드 필드 */}
         <Button variant="contained" component="label">
            이미지 업로드
            <input type="file" name="img" accept="image/*" hidden onChange={handleImageChange} />
         </Button>

         {imgUrl && (
            <Box mt={2}>
               <img src={imgUrl} alt="업로드 이미지 미리보기" style={{ width: '400px' }} />
            </Box>
         )}

         {/* 제목 입력 필드 */}
         <TextField
            label="제목"
            variant="outlined"
            fullWidth
            multiline
            rows={1}
            value={title}
            onChange={(e) => {
               setTitle(e.target.value)
            }}
            sx={{ mt: 2 }}
         />

         {/* 게시물 내용 입력 필드 */}
         <TextField label="게시물 내용" variant="outlined" fullWidth multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} sx={{ mt: 2 }} />

         {/* 등록 / 수정 버튼 */}
         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            {submitButtonLabel}
         </Button>
      </Box>
   )
}

export default PostForm
