const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { Post, Board, User } = require('../models')
const { isLoggedIn } = require('./middlewares')
const router = express.Router()

const uploadDir = 'uploads'

// uploads 폴더가 존재하는지 확인하고, 없으면 생성
if (!fs.existsSync(uploadDir)) {
   console.log('uploads 폴더가 없습니다.')
   fs.mkdirSync(uploadDir)
} else {
   console.log('uploads 폴더가 이미 존재합니다.')
}

const upload = multer({
   storage: multer.diskStorage({
      destination(req, file, cb) {
         cb(null, uploadDir)
      },
      filename(req, file, cb) {
         const ext = path.extname(file.originalname)
         cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
      },
   }),
   limits: {
      fileSize: 5 * 1024 * 1024,
   },
})

// 게시물 등록
router.post('/', isLoggedIn, upload.single('img'), async (req, res) => {
   try {
      // 파일 업로드 중 오류가 발생했을 때,
      if (!req.file) {
         return res.status(404).json({
            success: false,
            message: '파일 업로드 중 오류가 발생하였습니다.',
         })
      }
      // 정상적으로 등록하기
      const post = await Post.create({
         title: req.body.title,
         content: req.body.content,
         img: `/${req.file.filename}`,
         UserId: req.user.id,
      })

      res.json({
         success: true,
         post: {
            id: post.id,
            title: post.title,
            content: post.content,
            img: post.img,
            UserId: post.UserId,
         },
         message: '게시물이 성공적으로 등록되었습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 등록 중 오류가 발생했습니다.', error })
   }
})

// 게시물 수정
router.put('/:id', isLoggedIn, upload.single('img'), async (req, res) => {
   try {
      const post = await Post.findOne({ where: { id: req.params.id, UserId: req.user.id } })

      if (!post) {
         return res.status(404).json({
            success: false,
            message: '게시물을 찾을 수 없습니다.',
         })
      }

      await post.update({
         content: req.body.content,
         img: req.file ? `/${req.file.filename}` : post.img,
      })

      const updatedPost = await Post.findOne({
         where: { id: req.params.id },
         include: [
            {
               model: User,
               attributes: ['id', 'name'],
            },
            {
               model: Board,
               attributes: ['title'],
            },
         ],
      })

      res.json({
         success: true,
         post: updatedPost,
         message: '게시물이 성공적으로 수정 되었습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 수정 중 오류가 발생했습니다.', error })
   }
})

// 게시물 삭제
router.delete('/:id', isLoggedIn, async (req, res) => {
   try {
      const post = await Post.findOne({ where: { id: req.params.id, UserId: req.user.id } })

      if (!post) {
         return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' })
      }

      await post.destroy()

      res.json({
         success: true,
         message: '게시물이 성공적으로 삭제 되었습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 삭제 중 오류가 발생했습니다.', error })
   }
})

// 특정 게시물 불러오기
router.get('/:id', async (req, res) => {
   try {
      const post = await Post.findOne({
         where: {
            id: req.params.id,
         },
         include: [
            {
               model: User,
               attributes: ['id', 'name'],
            },
            {
               model: Board,
               attributes: ['title'],
            },
         ],
      })

      if (!post) {
         return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' })
      }

      res.json({
         success: true,
         post,
         message: '게시물을 성공적으로 불러왔습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물을 불러오는 중 오류 발생', error })
   }
})

// 전체 게시물 불러오기 페이징
router.get('/', async (req, res) => {
   try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 3
      const offset = (page - 1) * limit

      const count = await Post.count()

      const posts = await Post.findAll({
         limit,
         offset,
         order: [['createdAt', 'DESC']],
         include: [
            {
               model: User,
               attributes: ['id', 'name', 'email'],
            },
            {
               model: Board,
               attributes: ['title'],
            },
         ],
      })

      res.json({
         success: true,
         posts,
         pagination: {
            totalPosts: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            limit,
         },
         message: '전체 게시물 리스트를 성공적으로 불러왔습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '게시물 리스트를 불러오는 중 오류가 발생했습니다.', error })
   }
})

module.exports = router
