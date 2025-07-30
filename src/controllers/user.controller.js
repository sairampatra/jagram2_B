import {
  editProfileService,
  findUserByIdService,
  folloeOrUnfollowService,
  signinService,
  signupService,
  suggestionService,
} from "../service/userService.js";

export const register = async (req, res) => {
  //signup
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    const user = await signupService({ username, email, password });
    res.status(201).json({
      success: true,
      message: "user craeated",
      data: user,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const login = async (req, res) => {

  try {
    const { email, password } = req.body;
    // console.log(req.body);
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    const { userData, token } = await signinService({ email, password });
              console.log(userData)

    return res.cookie("token", token, {
        // httpOnly: true,
        // sameSite: "strict",
        // maxAge: 1 * 24 * 60 * 60 * 1000,

        httpOnly: true,
        secure: true,             // true = HTTPS only
        sameSite: "None",         // Required for cross-origin
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days

  //        httpOnly: true,
  // secure: process.env.NODE_ENV === "production", // false in dev
  // sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  // maxAge: 1 * 24 * 60 * 60 * 1000,

      })
      .json({
        success: true,
        message: "welcome back",
        user: userData,
        token,
      });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error in signin",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: " Logged out successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error in signin",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await findUserByIdService(userId);
    // console.log(user);
    res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error in getProfile",
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    const newUser = await editProfileService(
      userId,
      bio,
      gender,
      profilePicture
    );
    res.status(200).json({
      message: "Profile Updated",
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error in editProfile",
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.id;
    const suggestedUsers = await suggestionService(userId);
    res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    console.log("Error in getSuggestedUsers:", error);
    res.status(500).json({
      success: false,
      message: "internal server error in getSuggestedUsers",
    });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const userId = req.id;
    const targetId = req.params.id;
    // console.log({ userId: req.id, targetId: req.params.id });
    const result = await folloeOrUnfollowService(userId, targetId);
    res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    console.log("Error in getSuggestedUsers:", error);
    res.status(500).json({
      success: false,
      message: "internal server error in folloeOrUnfollow",
    });
  }
};
export const isTokenAvailable = async (req, res) => {
  try {
    const userId = req.id;
    if(userId){
       return res.status(200).json({
      message: "token Available",
      success: true,
      
    });
    }
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    console.log("Error in getSuggestedUsers:", error);
    res.status(500).json({
      success: false,
      message: "internal server error in folloeOrUnfollow",
    });
  }
};
