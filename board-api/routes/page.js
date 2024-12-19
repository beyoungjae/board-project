const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('./middlewares')
const { User, Post } = require('../models')

// 내 프로필 정보 가져오기
router.get('/profile', isLoggedIn, async (req, res, next) => {
   try {
      const user = await User.findOne({
         where: { id: req.user.id },
         include: [{
            model: Post,
            attributes: ['id', 'title', 'content', 'img', 'createdAt'],
            include: [{
               model: User,
               attributes: ['id', 'name', 'email']
            }]
         }],
         attributes: ['id', 'email', 'name']
      })

      if (!user) {
         return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' })
      }

      res.json(user)
   } catch (error) {
      console.error(error)
      next(error)
   }
})

// 다른 사용자의 프로필 정보 가져오기
router.get('/profile/:id', async (req, res, next) => {
   try {
      const user = await User.findOne({
         where: { id: req.params.id },
         include: [{
            model: Post,
            attributes: ['id', 'title', 'content', 'img', 'createdAt'],
            include: [{
               model: User,
               attributes: ['id', 'name', 'email']
            }]
         }],
         attributes: ['id', 'email', 'name']
      })

      if (!user) {
         return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' })
      }

      res.json(user)
   } catch (error) {
      console.error(error)
      next(error)
   }
})

module.exports = router