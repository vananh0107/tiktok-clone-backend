import mongoose from "mongoose";
import modelOptions from "./model.options.js";

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
  },
  video:{
    type: String,
    required: true,
  },
  publicID:{
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},modelOptions);

const postModel = mongoose.models.Post || mongoose.model("Post", postSchema);

export default postModel;
