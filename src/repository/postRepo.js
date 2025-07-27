import { Comment } from "../schema/comment.model.js";
import { Post } from "../schema/post.model.js";
import { User } from "../schema/user.model.js";
import { findUserById } from "./userRepo.js";
export const createNewPost = async (caption, cloudeResponse, authorId) => {
  try {
    const post = await Post.create({
      caption,
      image: cloudeResponse.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllPost = async () => {
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username , profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username , profilePicture" },
      });
    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserPost = async (userId) => {
  try {
    const authorId = userId;
    const post = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username , profilePicture" },
      });
    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const likePost = async (userId, post) => {
  try {
    const newPost = await post.updateOne({ $addToSet: { likes: userId } });
    post.save();
    return newPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const dislikePost = async (userId, post) => {
  try {
    const result = await post.updateOne({ $pull: { likes: userId } });
    post.save();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const findPostById = async (postId) => {
  try {
    const post = await Post.findById(postId);
    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addComment = async (
  text,
  userId,
  postId,
  post,
  parentCommentId
) => {
  // console.log(parentCommentId);
  try {
    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
      parentComment: parentCommentId ? parentCommentId : null,
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "parentComment",
        populate: { path: "author", select: "username , profilePicture" },
      });
      await post.updateOne({ $push: { comments: comment._id } });
      // console.log(comment)

    return populatedComment;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const commentsOfPost = async (postId) => {
  try {
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username , profilePicture"
    ).lean();
    return comments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const likeDislikeComment = async (userId, commentId) => {
  try {
    const comment = await Comment.find(commentId);
    // const newPost = await post.updateOne({ $addToSet: { likes: userId } });

    const newComment = await comment.updateOne({
      $addToSet: { likes: userId },
    });
    return newComment;
  } catch (error) {}
};

export const deletePost = async (postId, userId) => {
  try {
    const user = await findUserById(userId);
    user.posts.pull(postId);
    user.save();
    await Comment.deleteMany({ post: postId });

    const deletedPost = await Post.findByIdAndDelete(postId);
    return deletedPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const bookmark = async (userId, postId) => {
  try {
    const user = await User.findById(userId);
    const isBookmarked = user.bookmarks.includes(postId);
    console.log(user.bookmarks)
    if (!isBookmarked) {
      await user.updateOne({ $addToSet: { bookmarks: postId } });
      user.save();
      return { type: "saved", message: "Post bookmarked" };
    } else {
      const newUser = await user.updateOne({ $pull: { bookmarks: postId } });
      user.save();
      return { type: "unsaved", message: "Post removed from bookmark" };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};



