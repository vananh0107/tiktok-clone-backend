import mongoose from 'mongoose'
import modelOptions from "./model.options.js";
const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
},modelOptions);

const favoriteModel = mongoose.model('Favorite', favoriteSchema);

export default favoriteModel;