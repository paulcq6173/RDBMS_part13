const router = require('express').Router();
const { sequelize } = require('../util/db');

const { Blog } = require('../models');

router.get('/', async (_req, res) => {
  const users = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'articles'],
      [sequelize.fn('sum', sequelize.col('likes')), 'n_likes'],
    ],
    group: 'author',
    order: [['n_likes', 'DESC']],
  });
  res.json(users);
});

module.exports = router;
