import express from "express";
import commentController from "../controllers/comment.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
const router = express.Router({ mergeParams: true });

router.post("/create",tokenMiddleware.auth, commentController.create);

router.get("/all-comments/:id",commentController.getAllComment);
router.delete("/:id",commentController.deleteComment);

export default router;