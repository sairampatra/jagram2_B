import express from "express";
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
  isTokenAvailable
} from "../../controllers/user.controller.js";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";
import uploadFile from "../../middleware/multer.js";

const router = express.Router();

router.post("/signup", register);
router.post("/signin", login);
router.get("/logout", logout);
router.get("/:userId/profile", isAuthenticated, getProfile);
router.post("/profile/edit",isAuthenticated,uploadFile.single("profilePicture"),editProfile);
router.get("/suggested", isAuthenticated, getSuggestedUsers);
router.post("/followOrUnfollow/:id", isAuthenticated, followOrUnfollow);
router.get("/isToken", isAuthenticated,isTokenAvailable);
export default router;
