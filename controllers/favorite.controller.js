import responseHandler from "../handlers/respone.handler.js";
import favoriteModel from "../models/favorite.model.js";
import postModel from "../models/post.model.js";
const addFavorite = async (req, res) => {
  try {
    const isFavorite = await favoriteModel.findOne({
      user: req.user.id,
      post: req.body.postId
    });
    if(!isFavorite){
      const favorite = new favoriteModel({
        post:req.body.postId,
        user: req.user.id
      });
      await favorite.save();
      responseHandler.created(res, favorite);
    }
  } catch(err) {
    console.log(err);
    responseHandler.error(res);
  }
};

const removeFavorite = async (req, res) => {
  try {
    const favorite = await favoriteModel.findOneAndDelete({
      user: req.user.id,
      post: req.body.postId
    });
    if (!favorite) return responseHandler.notfound(res);
    responseHandler.created(res, favorite);
  } catch {
    responseHandler.error(res);
  }
};

const getFavoritesOfUser = async (req, res) => {
  try {
    const favorite = await postModel.findById(req.postId)
    .populate('favorites') 
    .exec().sort("-createdAt");
    responseHandler.ok(res, favorite);
  } catch {
    responseHandler.error(res);
  }
};
const getAllFavoriteOfPost = async (req, res) => {
  try {
    const favorite = await postModel.findById(req.postId)
    .populate('favorites') 
    .exec().sort("-createdAt");
    responseHandler.ok(res, favorite);
  } catch {
    responseHandler.error(res);
  }
};
export default { addFavorite, removeFavorite, getFavoritesOfUser };