import { User } from "../schema/user.model.js"

export const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({email}) 
        return user
        
    } catch (error) {
        console.log(`THIS ERROR CAME FROM REPO findUserByEmail ${error}`)
    }
}

export const createUser = async (userCredentialsobj) => {
    try {
        const user = await User.create(userCredentialsobj)
        return user
    } catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000 ) {
            throw{
                status:400,
                message:"User with the same email or username already exists"
            }
        }
   throw error 
    }
   
}

export const findUserById = async(userId)=>{
    try {
        const user = await User.findById(userId).populate({path:'posts', createdAt:"-1"}).populate('bookmarks')
        return user
        
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const findSuggesteionUsers = async (userId) => {
    try {
        const getSuggestedUsers = await User.find({_id:{$ne:userId}}).populate({path:'posts' , createdAt:-1}).populate('bookmarks')
    return getSuggestedUsers
        
    } catch (error) {
        console.log(error)
    }
}


export const removeFollowers = async (userId,targetId) => {
    try {
       return  User.updateOne({_id:targetId},{$pull:{followers:userId}})
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const removeFollowing = async (userId,targetId)  => {
    try {
        return  User.updateOne({_id:userId},{$pull:{following:targetId}})

    } catch (error) {
        console.log(error)
        throw error
    }
}
export const addFollowers = async (userId,targetId) => {
    try {
        return  User.updateOne({_id:targetId},{$push:{followers:userId}})

    } catch (error) {
        console.log(error)
        throw error
    }
}


export const addFollowing = async (userId,targetId) => {
    try {
        return  User.updateOne({_id:userId},{$push:{following:targetId}})

    } catch (error) {
        console.log(error)
        throw error
    }
}


