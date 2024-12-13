const express = require('express')
const path = require('path')
const morgan = require('morgan')
require('dotenv').config()
const cors = require('cors')

const app = express()
app.set('port', process.env.PORT || 8002)

// 라우터 불러오기
const { sequelize } = require('./models')
const authRouter = require('./routes/auth')
const indexRouter = require('./routes/index')

// 데이터베이스 설정 되었는지 확인
sequelize
   .sync({ force: false })
   .then(() => {
      console.log('데이터베이스 연결 성공')
   })
   .catch((err) => {
      console.error(err)
   })

// 미들웨어 설정
app.use(
   cors({
      origin: 'http://localhost:3000',
      credentials: true,
   })
)
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 라우터 등록
app.use('/', indexRouter)
app.use('/auth', authRouter)

// 에러 처리
app.use((req, res, next) => {
   const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
   error.status = 404
   next(error)
})

app.use((err, req, res, next) => {
   const statusCode = err.status || 500
   const errorMessage = err.message || '서버 오류'

   res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: err,
   })
})

// cors 설정
app.options('*', cors())

app.listen(app.get('port'), () => {
   console.log(app.get('port'), '번 포트에서 대기중')
})
