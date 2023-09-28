import responseHandler from '../handlers/respone.handler.js';
import userModel from '../models/user.model.js';
import favoriteModel from '../models/favorite.model.js';
import postModel from '../models/post.model.js';
import commentModel from '../models/comment.model.js';
import { cloudinaryUploadVideo } from '../utils/cloudinary.config.js';
const getRandomPost = async (req, res) => {
  try {
    const randomPost = await postModel.aggregate([{ $sample: { size: 1 } }]);
    const randomPostId = randomPost[0]._id;
    const comments = await commentModel.find({ post: randomPostId });
    const favorites = await favoriteModel.find({ post: randomPostId });
    const postData = {
      post: randomPost[0],
      comments: comments,
      favorites: favorites,
    };
    return responseHandler.ok(res, postData);
  } catch {
    responseHandler.error(res);
  }
};
const createPost = async (req, res) => {
  try {
    const post = new postModel();
    const result = await cloudinaryUploadVideo(req.file);
    post.video = result.url;
    post.caption = req.body.text;
    post.publicID = result['public_id'];
    post.author = req.user.id;
    await post.save();
    const allPost = await postModel.find({ author: req.user.id });
    responseHandler.ok(res, {
      allPost,
    });
  } catch (err) {
    console.log(err)
    responseHandler.error(res);
  }
};
const getAllPostOfUser = async (req, res) => {
  try {
    const posts = await postModel.find({ author: req.userId });
    return responseHandler.ok(res, posts);
  } catch {
    responseHandler.error(res);
  }
};

const getAllPostsAndUsers = async (req, res) => {
  try {
    const result = await postModel
      .aggregate([
        { $sample: { size: await postModel.countDocuments() } },
        {
          $lookup: {
            from: 'favorites', 
            localField: '_id',
            foreignField: 'post',
            as: 'favorites',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id', 
            foreignField: 'post',
            as: 'comments'
          }
        },
      ])
      .exec();
    return responseHandler.ok(res, result);
  } catch (err) {}
};

const searchPost = async (req, res) => {
  try {
    const { query } = req.query;
    const regexPattern = new RegExp(query, 'i');
    const posts = await postModel.find({ text: regexPattern });
    responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};

const getDetailPost = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.postId).populate('author');
    const comments = await commentModel
      .find({ post: req.params.postId })
      .populate('author', ['username', 'displayName', 'image', 'id']);
    const favorites = await favoriteModel.find({ post: req.params.postId });
    const ids = await postModel
      .find({ author: post.author.id })
      .select('_id') 
      .exec();
    responseHandler.ok(res, {
      postData: {
        post,
        comments,
        favorites,
      },
      ids,
    });
  } catch (e) {
    console.log(e);
    responseHandler.error(res);
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await postModel.findByIdAndDelete(req.params.postId)
    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};
export default {
  createPost,
  deletePost,
  getRandomPost,
  getAllPostOfUser,
  searchPost,
  getDetailPost,
  getAllPostsAndUsers,
};
