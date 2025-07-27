import { addFollowers, addFollowing, createUser, findSuggesteionUsers, findUserByEmail, findUserById, removeFollowers, removeFollowing } from "../repository/userRepo.js";
import bcrypt from 'bcrypt';  // Import bcrypt
import { generateToken } from "../utils/jwt.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { findPostById } from "../repository/postRepo.js";

export const signupService = async (userCredentialsobj) => {
  return await createUser(userCredentialsobj);
};




export const signinService = async (userCredentialsobj) => {
  const  user = await findUserByEmail(userCredentialsobj.email);

  if (!user) {
    throw {
      status: 404,
      message: "User does'nt exists in DB"
    };
  }

  const isPassValid =  bcrypt.compareSync(userCredentialsobj.password,user.password)
  if (!isPassValid) {
    throw{
        status: 404,
      message: "invalid password"
    }
  }
  const populatedPost = await Promise.all(
    user.posts.map(async (postId) => {
      const post = await findPostById(postId)
      // console.log(post)
      if(post?.author?.equals(user._id)){
        return post

      }
      return null
    })
  )
 let userData= {
      _id:user._id,
      username:user.username,
      email:user.email,
      profilePicture:user.profilePicture,
      bio:user.bio,
      followers:user.followers,
      following:user.following,
      post:populatedPost,
      gender:user.gender,
      bookmarks:user.bookmarks

 }

  const token =  generateToken({userId:user._id})
  return {userData,token}  
};

export const findUserByIdService = async (userId) => {
  try {
    
    const user = await findUserById(userId)
    return user
  } catch (error) {
    throw error
  }
}

export const editProfileService = async (userId,bio,gender,profilePicture) => {
  try {
    const user = await findUserById(userId)
    let cloudeResponse

    if (profilePicture) {

      const  fileUri = getDataUri(profilePicture)
      cloudeResponse=await cloudinary.uploader.upload(fileUri,{folder: 'JagRam/ProfilePictures', })
     const parts = user?.profilePicture.split('/') 
     const filename = parts[parts.length-1] 
    const publicId = `JagRam/ProfilePictures/${filename.split(".")[0]}`;
    const result = await cloudinary.uploader.destroy(publicId);
console.log(result)
    }
    if (!user) {
      throw {
        status: 404,
        message: "User does'nt exists in DB"
      };
    }
    if(bio) user.bio = bio
    if(gender) user.gender = gender
    if(profilePicture) user.profilePicture = cloudeResponse.secure_url
    const newUser = await user.save()
    // console.log(newUser)
    return newUser
  } catch (error) {
    console.log(error)
    throw error
  }
 
}

export const suggestionService = async (userId) => {
  try {
    const suggestedUsers = await findSuggesteionUsers(userId)
    if (!suggestedUsers) {
      throw{
         status: 404,
        message: 'Currently do not have any users ' 
      }
    }
    return suggestedUsers
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const folloeOrUnfollowService = async (userId,targetId) => {
  try {
    if (userId == targetId) {
      throw {
        status: 400,
        message:'YOU cannot follow unfollow yourself' 
      }
    }
  
    const user = await findUserById(userId)
    const targetUser = await findUserById(targetId)
  
    if (!user || !targetUser) {
      throw{
        status:400,
        message:"User not found"
      }
    }
  
    const isFollowing = user.following.includes(targetId)
    if (isFollowing) {
      //unfollowing logic
      const response = await Promise.all([
        removeFollowing(userId,targetId),
        removeFollowers(userId,targetId)
      ])
      return { message: 'Unfollowed successfully', success: true ,response};      
    } else {
      //follow logic
      const response = await Promise.all([
        addFollowing(userId,targetId),
        addFollowers(userId,targetId)
      ])
      return { message: 'Followed successfully', success: true ,response};

    }
  } catch (error) {
    throw error
  }
  
}