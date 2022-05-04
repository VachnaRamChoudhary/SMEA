const express = require('express');

const router = express.Router();
const passport = require('passport');
const postsApi = require("../../../controllers/api/v1/posts_api");



router.delete('/:id', passport.authenticate('jwt', { session: false }), postsApi.destroy);

router.delete('/:id', postsApi.destroy);


module.exports = router;