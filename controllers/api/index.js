const router = require('express').Router();

const postRoutes = require('./postRoutes');

// const newPostRoutes = require('./postRoutes')

const userRoutes = require('./userRoutes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
// router.use('/newpost', newPostRoutes);

module.exports = router;