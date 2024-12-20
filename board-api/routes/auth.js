const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/user')
const { isNotLoggedIn, isLoggedIn } = require('./middlewares')

// 회원가입 : localhost:8000/auth/join
router.post('/join', async (req, res, next) => {
   const { name, password, email } = req.body
   try {
      // 이름으로 사용자 검색
      const exUser = await User.findOne({ where: { name } })
      if (exUser) {
         // 이미 사용자가 존재할 경우
         // 409 상태코드와 메세지를 json 객체로 응답 하면서 함수를 끝냄
         return res.status(409).json({
            success: false,
            message: '이미 존재하는 사용자입니다.',
         })
      }

      // 이메일 중복 확인을 통과 시 새로운 사용자 계정 생성

      // 비밀번호 암호화
      const hash = await bcrypt.hash(password, 12)
      // 12: salt(해시 암호화를 진행시 추가되는 임의의 데이터로 10 ~ 12 정도의 값이 권장)

      // 새로운 사용자 생성
      const newUser = await User.create({
         name,
         password: hash,
         email,
      })

      // 성공 응답 반환
      res.status(201).json({
         success: true,
         message: '사용자가 성공적으로 등록되었습니다.',
         user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
         },
      })
   } catch (error) {
      // try문 어딘가에서 에러가 발생하면 500상태 코드와 json 객체 응답
      console.error(error)
      res.status(500).json({
         success: false,
         message: '회원가입 중 오류가 발생했습니다.',
         error,
      })
   }
})

// 로그인 : localhost:8000/auth/login
router.post('/login', isNotLoggedIn, async (req, res, next) => {
   passport.authenticate('local', (authError, user, info) => {
      if (authError) {
         return res.status(500).json({ success: false, message: '인증 중 오류 발생', error: authError })
      }
      if (!user) {
         return res.status(401).json({ success: false, message: info.message || '로그인 실패' })
      }
      req.login(user, (loginError) => {
         if (loginError) {
            return res.status(500).json({ success: false, message: '로그인 중 오류 발생', error: loginError })
         }
         res.json({
            success: true,
            message: '로그인 성공',
            user: {
               id: user.id,
               name: user.name,
            },
         })
      })
   })(req, res, next)
})

// 로그아웃 : localhost:8000/auth/logout
router.get('/logout', isLoggedIn, async (req, res, next) => {
   req.logout((err) => {
      if (err) {
         return res.status(500).json({ success: false, message: '로그아웃 중 오류 발생', error: err })
      }
      res.json({
         success: true,
         message: '로그아웃이 성공적으로 완료되었습니다.',
      })
   })
})

// 로그인 상태 확인 : localhost:8000/auth/status
router.get('/status', isLoggedIn, async (req, res, next) => {
   if (req.isAuthenticated()) {
      res.json({
         isAuthenticated: true,
         user: {
            id: req.user.id,
            name: req.user.name,
         },
      })
   } else {
      res.json({
         isAuthenticated: false,
      })
   }
})

module.exports = router
