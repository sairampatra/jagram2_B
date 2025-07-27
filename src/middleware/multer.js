import multer from "multer"
const uploadFile = multer({
    storage:multer.memoryStorage()
})
export default uploadFile