const router = require('express').Router();
const { Blog, User } = require('../models');
const { blogFinder, tokenExtractor } = require('../util/middleware');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  // The WHERE conditions are used only if necessary.
  let where = {};
  // The operater is used to check if a value matches a pattern.
  // Using Op.iLike to perform case-insensitive matches.
  const keyword = {
    [Op.iLike]: `%${req.query.search}%`,
  };
  if (req.query.search) {
    where = {
      [Op.or]: [{ title: keyword }, { author: keyword }],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  });
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.get('/:id', blogFinder, async (req, res) => {
  const blog = req.blog;

  if (blog) {
    console.log(blog.toJSON());
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    });

    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    const { likes } = req.body;

    //req.blog.title = title ?? req.blog.title;
    req.blog.likes = likes ?? req.blog.likes;

    try {
      await req.blog.save();
    } catch (error) {
      next(error);
    }

    res.json({ likes });
  } else {
    res.status(404).end();
  }
});

router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
  const blog = req.blog;

  if (blog) {
    try {
      const user = await User.findByPk(req.decodedToken.id);

      if (!user) {
        res
          .status(401)
          .json({ message: 'Unauthorized operation, please log in first.' });
      }

      if (blog.user && user.name === blog.user?.name) {
        await blog.destroy();
      } else {
        res.status(401).json({
          message: 'premission denied, this order is for author only.',
        });
      }
    } catch (error) {
      next(error);
    }

    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

module.exports = router;
