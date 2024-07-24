const router = require('express').Router();
const { User, UserReadinglists } = require('../models');
const { tokenExtractor } = require('../util/middleware');

router.get('/', async (_req, res) => {
  const users = await UserReadinglists.findAll();
  res.json(users);
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const readingBlog = await UserReadinglists.create({
      ...req.body,
    });

    res.json(readingBlog);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', tokenExtractor, async (req, res, next) => {
  let readingBlog;
  let user;

  try {
    user = await User.findByPk(req.decodedToken.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized operation, please log-in first.' });
    }

    readingBlog = await UserReadinglists.findByPk(req.params.id);
  } catch (error) {
    next(error);
  }

  if (!readingBlog) {
    return res.status(404).end;
  }

  if (readingBlog.userId !== user.id) {
    return res.status(401).json({
      message: "Premission denied, you are not this readinglist's owner.",
    });
  }

  readingBlog.read = req.body.read;
  await readingBlog.save();

  res.json(readingBlog);
});

module.exports = router;
