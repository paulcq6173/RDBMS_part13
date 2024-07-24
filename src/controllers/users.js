const router = require('express').Router();
const { User, Blog } = require('../models');
const { tokenExtractor } = require('../util/middleware');
const { Op } = require('sequelize');

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' });
  }
  next();
};

router.get('/', async (_req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
    ],
  });
  res.json(users);
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  let user = {};
  let where = {};
  const read = req.query.read;

  if (read) {
    where = { read };
  }

  try {
    user = await User.findByPk(req.params.id, {
      attributes: { exclude: [''] },
      include: [
        {
          model: Blog,
          attributes: { exclude: ['userId'] },
        },
        {
          model: Blog,
          as: 'marked_blogs',
          attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
          through: {
            attributes: ['id', 'read'],
            where,
          },
        },
      ],
    });
  } catch (error) {
    next(error);
  }

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });

  if (user) {
    user.username = req.body.username ?? user.username;
    user.disabled = req.body.disabled ?? user.disabled;

    try {
      await user.save();
    } catch (error) {
      return res.status(400).json({ error });
    }

    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
