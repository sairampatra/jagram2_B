import express from "express"
import { isAuthenticated } from "../../middleware/isAuthenticated.js"
import uploadFile from "../../middleware/multer.js"
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from "../../controllers/post.controller.js"

const router = express.Router()
router.post('/post',isAuthenticated,uploadFile.single("image"),addNewPost)   
router.get('/getAllPost',getAllPost)   
router.get('/getUserPosts',isAuthenticated,getUserPost)   
router.post('/likePost/:id',isAuthenticated,likePost)   
router.post('/dislikePost/:id',isAuthenticated,dislikePost)   
router.post('/comment/:id',isAuthenticated,addComment)   
router.get('/getCommentsOfPost/:id',getCommentsOfPost)   
router.post('/deletePost/:id',isAuthenticated,deletePost)   
router.get('/bookmark/:id',isAuthenticated,bookmarkPost)   


export default router
