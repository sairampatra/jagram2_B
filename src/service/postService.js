import {
  createNewPost,
  findPostById,
  getAllPost,
  getUserPost,
  likePost,
  dislikePost,
  addComment,
  commentsOfPost,
  deletePost,
  bookmark,
} from "../repository/postRepo.js";
import { findUserById } from "../repository/userRepo.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";

export const newPostService = async (caption, image, authorId) => {
  try {
    if (!image) {
      throw {
        status: 400,
        message: "Image required",
      };
    }
    const fileType = await fileTypeFromBuffer(image.buffer); //so while posting this was giving error for some image so i usse it to over optimise
    if (!fileType || !fileType.mime.startsWith("image/")) {
      throw {
        status: 400,
        message: "Unsupported file type. Please upload a valid image.",
      };
    }
    let buffer;
    try {
      buffer = await sharp(image.buffer, { failOnError: false })
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();
    } catch (error) {
      console.warn(" Sharp failed, using original image buffer.");
      buffer = image.buffer; // fallback
    }

    const fileUri = `data:${fileType.mime};base64,${buffer.toString("base64")}`;
    const cloudeResponse = await cloudinary.uploader.upload(fileUri, {
      folder: "JagRam/Posts",
    });
    const post = await createNewPost(caption, cloudeResponse, authorId);
    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllPostService = async () => {
  try {
    const post = await getAllPost();
    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userPostsService = async (userId) => {
  try {
    const post = await getUserPost(userId);
    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const postLikeService = async (userId, postId) => {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw {
        status: 404,
        message: "post does'nt exists in DB",
      };
    }
    const newPost = likePost(userId, post);
    return newPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const postDislikeService = async (userId, postId) => {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw {
        status: 404,
        message: "post does'nt exists in DB",
      };
    }
    const result = dislikePost(userId, post);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const commentService = async (text, userId, postId, parentCommentId) => {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw {
        status: 404,
        message: "post does'nt exists in DB",
      };
    }
    if (!text) {
      throw {
        status: 400,
        message: "comment is empty",
      };
    }
    const comment = await addComment(
      text,
      userId,
      postId,
      post,
      parentCommentId
    );
    return comment;
    // await Post.updateOne({ _id: postId }, { $set: { comments: [] } });
  } catch (error) {
    throw error;
  }
};

export const CommentsOfPostService = async (postId) => {
  try {
    const comments = await commentsOfPost(postId);
     if (!comments) {
      throw {
        status: 404,
        message: "No comments found for this post",
      };
    }
    const commentMap = {};
    comments.forEach((comment) => {
      comment.children = [];
      commentMap[comment._id] = comment;
    });
    const nestedComments = [];
    comments.forEach((comment) => {
      if (comment.parentComment ) {
        console.log(comment?.parentComment?.length )
        commentMap[comment.parentComment]?.children.push(comment);
      } else {
        nestedComments.push(comment);
      }
    });
   
    return nestedComments;
  } catch (error) {
    throw error;
  }
};

export const deletePostService = async (postId, userId) => {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw {
        status: 404,
        message: "post does'nt exists in DB",
      };
    }
    const deletedPost = await deletePost(postId, userId);
    const parts = post.image.split("/");
    const filename = parts[parts.length - 1];
    const publicId = `JagRam/Posts/${filename.split(".")[0]}`;
    // console.log(publicId)
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result + "sairam");
    return deletedPost;
  } catch (error) {
    throw error;
  }
};

export const bookmarkService = async (userId, postId) => {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw {
        status: 404,
        message: "post does'nt exists in DB",
      };
    }

    const user = await findUserById(userId);
    if (!user) {
      throw {
        status: 404,
        message: "user does'nt exists in DB",
      };
    }
    const response = await bookmark(userId, postId);
    return { type: response.type, message: response.message };
  } catch (error) {
    throw error;
  }
};
