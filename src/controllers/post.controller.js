import {
  getAllPostService,
  newPostService,
  postLikeService,
  userPostsService,
  postDislikeService,
  commentService,
  CommentsOfPostService,
  deletePostService,
  bookmarkService,
} from "../service/postService.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    // console.log(caption);
    const image = req.file;
    const authorId = req.id;
    // console.log("Image File ===>", req.file);

    const post = await newPostService(caption, image, authorId);
    res.status(201).json({
      success: true,
      post,
      message:"Post created"
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    console.log("Error in addNewPost:", error);
    res.status(500).json({
      success: false,
      message: "internal server error in addNewPost",
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await getAllPostService();
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error in getAllPost",
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const useId = req.id;
    // console.log(useId);
    const post = await userPostsService(useId);
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error in getAllPost",
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const newPost = await postLikeService(userId, postId);
    res.status(200).json({
      success: true,
      message: "post Liked",
      newPost,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    console.log("Error in addNewPost:", error);
    res.status(500).json({
      success: false,
      message: "internal server error in addNewPost",
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const Post = await postDislikeService(userId, postId);
    res.status(200).json({
      success: true,
      message: "post disliked",
      Post,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    console.log("Error in disLikePost:", error);
    res.status(500).json({
      success: false,
      message: "internal server error in disLikePost",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const { text,parentCommentId } = req.body;
    console.log(postId)
    const comment = await commentService(text, userId, postId,parentCommentId);
    res.status(200).json({
      success: true,
      message: "commented sucessfully",
      comment,
    });



  } catch (error) {
    // console.log(error)
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    console.log("Error in addComment:", error);
    res.status(500).json({
      success: false,
      message: "internal server error in addComment",
    });
  }
};

export const getCommentsOfPost = async (req,res) => {
  try {
    
    const postId = req.params.id
    const nestedComments = await CommentsOfPostService(postId)
    
    
    
    res.status(200).json({
      success: true,
      nestedComments,
    });


  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    console.log("Error in getCommentsOfPost:", error);
    res.status(500).json({
      success: false,
      message: "internal server error in getCommentsOfPost",
    });
  }
}

export const deletePost  = async (req,res) => {
  try {
        const postId = req.params.id
        const userId= req.id
    const deletedPost = await deletePostService(postId,userId)
    res.status(200).json({
      success: true,
      deletedPost,
      message:'Post Deleted'
    });
    
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    console.log("Error in getCommentsOfPost:", error);
    res.status(500).json({
      success: false,
      message: "internal server error in getCommentsOfPost",
    });
  }
}

export const bookmarkPost = async (req,res) => {
  try {
    const userId = req.id
  const postId = req.params.id
  const response = await bookmarkService(userId,postId)
  res.status(200).json({
    success: true,
    type:response.type,
    message:response.message
  });


  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    console.log("Error in bookmarkPost:", error);
    res.status(500).json({
      success: false,
      message: "internal server error in bookmarkPost",
    });
  }
  
}