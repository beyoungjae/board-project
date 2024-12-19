import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import MyProfile from '../components/page/Myprofile'

const MyPage = () => {
   const { id } = useParams()

   return (
      <Container maxWidth="md" sx={{ py: 4 }}>
         <MyProfile userId={id} />
      </Container>
   )
}

export default MyPage