import responseHandler from '../handlers/respone.handler.js';
import commentModel from "../models/comment.model.js";
import postModel from "../models/post.model.js";
const create = async (req, res) => {
  try {
    const { post_id,comment } = req.body;
    const commentNew = new commentModel({
      author: req.user.id,
      post:post_id,
      text:comment
    });
    const user={
      image:req.user.image,
      displayName:req.user.displayName,
      username:req.user.username,
      id:req.user.id
    }
    await commentNew.save();
    responseHandler.created(res, {
      ...commentNew._doc,
      id: commentNew.id,
      user: user
    });
  } catch(err) {
    console.error(err);
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const comment = await commentModel.findOne({
      _id: reviewId,
      user: req.user.id
    });

    if (!comment) return responseHandler.notfound(res);

    await comment.remove();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getAllComment = async (req, res) => {
  try {
    const comments = await commentModel.find({ post:req.params.id}).populate('author', ['username', 'displayName', 'image','id']);
    responseHandler.ok(res, comments);
  } catch {
    responseHandler.error(res);
  }
};
const deleteComment = async (req, res) => {
  try {
    const comments = await commentModel.findByIdAndDelete(req.params.id)
    console.log(comments)
    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

export default { create, remove, getAllComment,deleteComment };