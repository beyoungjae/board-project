import { Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const HomePage = () => {
   return (
      <Container maxWidth="xs">
         <Typography variant="h4" align="center" gutterBottom>
            회원가입 및 로그인 구현 완료
         </Typography>
         <Link to="/login">이동하기</Link>
      </Container>
   )
}

export default HomePage
