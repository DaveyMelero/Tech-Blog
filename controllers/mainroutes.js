const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  // Gets all posts and joins with user data by name.
  try {
    const postData = await Post.findAll({
      include: [
        {
        model: User,
        attributes: ['name'],
      },
      ],
    });
    // Serializationnn 
    const posts = postData.map((post) => post.get({ plain: true }));

    // passing serialized data and session flag into template
    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    const post = postData.get({ plain: true });

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });

  } catch (err) {
    res.status(500).json(err)
  }
});


router.post('/post/:id', withAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const postData = await Post.update(
      { title, content },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );

    if (!postData[0]) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get('/profile', withAuth, async (req, res) => {
  try {
    //finds profile based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });
    const user = userData.get({ plain: true });
    
    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/newpost', withAuth, async (req, res) => {
  try {
    //find our logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post}],
    });

    const user = userData.get({ plain: true });

    res.render('newpost', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// if user is already logged in, redirects the request to another dimension
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  res.render('login');
});

module.exports = router;


