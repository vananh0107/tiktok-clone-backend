import cloudinary from 'cloudinary';
import fs from 'fs';
cloudinary.config({
  cloud_name: 'deotpvxdc',
  api_key: '829715483687593',
  api_secret: 'oTiEz8RQva5R6tcwEIU52QOZGs0',
});
const cloudinaryUploadVideo = async (file) => {
  const result = await cloudinary.v2.uploader.upload(file.path, {
    resource_type: 'video',
    chunk_size: 30000000,
  });
  return result;
};
const cloudinaryUploadImage = async (file) => {
  const result = await cloudinary.v2.uploader.upload(file.path, {
    resource_type: 'image',
    chunk_size: 20000000,
  });
  return result;
};
export {cloudinaryUploadVideo,cloudinaryUploadImage};
