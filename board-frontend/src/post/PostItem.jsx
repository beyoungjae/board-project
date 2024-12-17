import { Card, CardMedia, CardContent, Typography, Box, CardActions, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { useCallback } from 'react'

const PostItem = ({ board, isAuthenticated, user }) => {
   // 게시물 삭제 실행
   const onClickDelete = useCallback((id) => {}, [])

   return (
      <Card style={{ margin: '20px 0' }}>
         <CardMedia sx={{ height: 240 }} image={`${process.env.REACT_APP_API_URL}${board.img}`} title={board.content} />
         <CardContent>
            <Link to={`/my/${board.User.id}`} style={{ textDecoration: 'none' }}>
               <Typography sx={{ color: 'primary.main' }}>@{board.User.name} </Typography>
            </Link>
            <Typography>{dayjs(board.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            <Typography>{board.content}</Typography>
         </CardContent>
         <CardActions>
            <Button size="small" color="primary">
               <FavoriteBorderIcon fontSize="small" />
            </Button>
            {isAuthenticated && board.User.id === user.id && (
               <Box sx={{ p: 2 }}>
                  <Link to={`/boards/edit/${board.id}`}>
                     <IconButton aria-label="edit" size="small">
                        <EditIcon fontSize="small" />
                     </IconButton>
                  </Link>
                  <IconButton aria-label="delete" size="small" onClick={() => onClickDelete(board.id)}>
                     <DeleteIcon fontSize="small" />
                  </IconButton>
               </Box>
            )}
         </CardActions>
      </Card>
   )
}
export default PostItem
