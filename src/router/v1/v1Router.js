import express from "express"
import userRouter from './user.js'
import postRouter from './post.js'

const router = express.Router()

router.use('/user',userRouter)
router.use('/post',postRouter)

export default router
