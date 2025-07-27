import { verifyToken } from "../utils/jwt.js"

export const isAuthenticated = async (req,res,next)=>{
    
    const token = req.cookies.token
    console.log(token)
    if (!token) {

        return res.status(400).json({
            success:false,
            message:'Token is required'
        })
    }  
    
    try {
        const response=verifyToken(token)
        if (!response) {
            return res.status(400).json({
                success:false,
                message:'invalid token'
            })
        }

        req.id = response.userId
        next()
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'invalid token'
        })
    }
    

}