import express from 'express';
import postController from '../controllers/post.controller.js';
import tokenMiddleware from '../middlewares/token.middleware.js';
import multer from 'multer';
import favoriteController from '../controllers/favorite.controller.js';
const router = express.Router({ mergeParams: true });
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    var filetype = '';
    if (file.mimetype === 'video/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'video/mp4') {
      filetype = 'mp4';
    }
    if (file.mimetype === 'video/ogg') {
      filetype = 'ogg';
    }
    if (file.mimetype === 'video/wmv') {
      filetype = 'wmv';
    }
    if (file.mimetype === 'video/x-flv') {
      //filetype = mime.getExtension('video/flv');
      filetype = 'flv';
    }
    if (file.mimetype === 'video/avi') {
      filetype = 'avi';
    }
    if (file.mimetype === 'video/webm') {
      filetype = 'webm';
    }
    if (file.mimetype === 'video/mkv') {
      filetype = 'mkv';
    }
    if (file.mimetype === 'video/avchd') {
      filetype = 'avchd';
    }
    if (file.mimetype === 'video/mov') {
      filetype = 'mov';
    }
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'video-' + uniqueSuffix + '.' + filetype);
  },
});

const upload = multer({ storage });
router.get('/search', postController.searchPost);
router.post(
  '/create',
  tokenMiddleware.auth,
  upload.single('video'),
  postController.createPost
);

router.get('/random', postController.getRandomPost);
router.get('/allPost', postController.getAllPostsAndUsers);
router.post(
  "/favorite",
  tokenMiddleware.auth,
  favoriteController.addFavorite
);
router.put(
  "/favorite",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

router.get('/:postId', postController.getDetailPost);
router.delete('/:postId',tokenMiddleware.auth, postController.deletePost);

export default router;
