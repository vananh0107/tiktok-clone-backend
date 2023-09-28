import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import postController from "../controllers/post.controller.js";
import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'D:/Code/Vuejs/tiktok-clone-api/uploads')
  },
  filename: function (req, file, cb) {
    var filetype = '';
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpg') {
      filetype = 'jpg';
    }
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'image-' + uniqueSuffix + '.' + filetype);
  },
});
const upload = multer({ storage });
const router = express.Router();
router.post(
  "/signup",
  body("displayName")
    .exists().withMessage("displayName is required")
    .isLength({ min: 6 }).withMessage("displayName minimum 1 characters")
    ,
  body("username")
    .exists().withMessage("username is required")
    .isLength({ min: 6 }).withMessage("username minimum 6 characters")
    .custom(async value => {
      const user = await userModel.findOne({ username: value });
      if (user) return Promise.reject("username already used");
    }),
  body("password")
    .exists().withMessage("password is required")
    .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
  body("confirmPassword")
    .exists().withMessage("confirmPassword is required")
    .isLength({ min: 8 }).withMessage("confirmPassword minimum 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("confirmPassword not match");
      return true;
    }),
  requestHandler.validate,
  userController.signup
);

router.post(
  "/signin",
  body("username")
    .exists().withMessage("username is required")
    .isLength({ min: 6 }).withMessage("username minimum 6 characters")
    ,
  body("password")
    .exists().withMessage("password is required")
    .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
  requestHandler.validate,
  userController.signin
);

router.put(
  "/update-password",
  tokenMiddleware.auth,
  body("password")
    .exists().withMessage("password is required")
    .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
  body("newPassword")
    .exists().withMessage("newPassword is required")
    .isLength({ min: 8 }).withMessage("newPassword minimum 8 characters"),
  body("confirmNewPassword")
    .exists().withMessage("confirmNewPassword is required")
    .isLength({ min: 8 }).withMessage("confirmNewPassword minimum 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error("confirmNewPassword not match");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);
router.put(
  "/update-profile",
  tokenMiddleware.auth,
  // body("displayName")
  //   .exists().withMessage("displayName is required")
  //   .isLength({ min: 1 }).withMessage("displayName minimum 1 characters")
  //   ,
  // requestHandler.validate,
  userController.updateInfo
);
router.put(
  "/update-image",
  tokenMiddleware.auth,
  upload.single('image'),
  userController.updateImage
);
router.get(
  "/info",
  tokenMiddleware.auth,
  userController.getInfo
);
router.get(
  "/logout",
  tokenMiddleware.auth,
  userController.logout
);
router.get(
  "/profile/:id",
  // tokenMiddleware.auth,
  userController.getProfile
);
router.get(
  "/favorites",
  tokenMiddleware.auth,
  favoriteController.getFavoritesOfUser
);
router.get(
  "/get-suggest-users",
  userController.getAllUser
);
router.get(
  "/get-follow-users",
  tokenMiddleware.auth,
  userController.getFollowOfUser
);
router.get(
  "/get-follower-users",
  tokenMiddleware.auth,
  userController.getFollowerOfUser
);
router.post(
  "/follow",
  tokenMiddleware.auth,
  userController.createFollow
);
router.put(
  "/unfollow",
  tokenMiddleware.auth,
  userController.unFollow
);
router.put(
  "/search",
  userController.searchUsers
);
router.delete(
  "/favorite/:postId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

export default router;