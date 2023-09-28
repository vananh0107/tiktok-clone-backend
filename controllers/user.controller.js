import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import responseHandler from '../handlers/respone.handler.js';
import postModel from '../models/post.model.js';
import { cloudinaryUploadImage } from '../utils/cloudinary.config.js';
import favoriteModel from '../models/favorite.model.js';
import mongoose from 'mongoose';
const signup = async (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    const checkUser = await userModel.findOne({ username });

    if (checkUser)
      return responseHandler.badrequest(res, 'username already used');
    let user = null;
    user = new userModel();
    user.displayName = displayName;
    user.username = username;
    user.image = 'https://i.ibb.co/FbqXpnn/user-placeholder.png';
    user.setPassword(password);
    const result = await userModel.create(user);
    responseHandler.created(res, {
      id: user.id,
    });
  } catch (err) {
    console.log(err);
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel
      .findOne({ username })
      .select('username password salt id displayName image bio follows');

    if (!user) return responseHandler.badrequest(res, 'User not exist');

    if (!user.validPassword(password))
      return responseHandler.badrequest(res, 'Wrong password');

    const token = jwt.sign({ data: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: '24h',
    });
    user.password = undefined;
    user.salt = undefined;
    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};
const getAllUser = async (req, res) => {
  try {
    const userList = await userModel
      .find({})
      .select('username id displayName image');
    responseHandler.created(res, {
      userList,
    });
  } catch {
    responseHandler.error(res);
  }
};
const createFollow = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    user.follows.push(req.body.userFollowId);
    await user.save();
    responseHandler.created(res, {
      user,
    });
  } catch (err) {
    console.log(err);
    responseHandler.error(res);
  }
};
const unFollow = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    user.follows = user.follows.filter((followedUserId) => {
      return !followedUserId.equals(req.body.userFollowId);
    });
    await user.save();
    responseHandler.created(res, {
      user,
    });
  } catch (err) {
    console.log(err);
    responseHandler.error(res);
  }
};
const getFollowOfUser = async (req, res) => {
  try {
    const followerList = await userModel
      .findById(req.user.id)
      .populate('follows', 'id username displayName image')
      .exec();
    responseHandler.created(res, {
      follows: followerList.follows,
    });
  } catch (err) {
    console.log(err);
    responseHandler.error(res);
  }
};
const getFollowerOfUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    const followersList = await userModel
      .find({ _id: { $in: user.follows } })
      .select('username id displayName image');
    responseHandler.created(res, {
      followers: followersList,
    });
  } catch (err) {
    console.log(err);
    responseHandler.error(res);
  }
};
const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel
      .findById(req.user.id)
      .select('password id salt');

    if (!user) return responseHandler.unauthorize(res);

    if (!user.validPassword(password))
      return responseHandler.badrequest(res, 'Wrong password');

    user.setPassword(newPassword);

    await user.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};
const updateImage = async (req, res) => {
  try {
    console.log(req.user)
    const result = await cloudinaryUploadImage(req.file);
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        image: result.url,
      },
      {
        new: true,
      }
    );
    responseHandler.ok(res, user);
  } catch(err) {
    console.log(err)
    responseHandler.error(res);
  }
};
const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return responseHandler.notfound(res);
    const posts = await postModel.find({ author: req.params.id });
    const followers = await userModel
      .find({ follows: req.params.id })
      .select('username id displayName image');
    const favoriteCount = await favoriteModel.countDocuments({
      user: req.params.id,
    });
    responseHandler.ok(res, {
      user,
      posts,
      followers,
      favoriteCount,
    });
  } catch (err) {
    console.log(err);
    responseHandler.error(res);
  }
};
const logout = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    if (!user) return responseHandler.notfound(res);
    userModel.token = '';

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};
const updateInfo = async (req, res) => {
  try {
    const updateUser = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    responseHandler.ok(res, updateUser);
  } catch (err) {
    console.log(err);
    responseHandler.error(res);
  }
};
const searchUsers = async (req, res) => {
  try {
    const respone = await userModel.find({
      $or: [
        { username: { $regex: req.body.query, $options: 'i' } },
        { displayName: { $regex: req.body.query, $options: 'i' } },
      ],
    },'username displayName image bio');
    responseHandler.ok(res, respone);
  } catch (err) {
    console.log(err);
    responseHandler.error(res);
  }
};
export default {
  signup,
  signin,
  getInfo,
  updatePassword,
  updateInfo,
  logout,
  getProfile,
  updateImage,
  getAllUser,
  getFollowOfUser,
  createFollow,
  unFollow,
  getFollowerOfUser,
  searchUsers
};
