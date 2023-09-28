import express from "express";
import userRoute from "./user.route.js";
import postRoute from "./post.route.js";
import commentRoute from "./comment.route.js";
// import personRoute from "./person.route.js";
// import reviewRoute from "./review.route.js";

const router = express.Router();

router.use("/user", userRoute);
router.use("/post", postRoute);
router.use("/comment", commentRoute);
// router.use("/reviews", reviewRoute);

export default router;