const jwt = require('jsonwebtoken');
const { SECRET } = require('./config.js');
const { User, Blog, TokenSession } = require('../models');

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);

    try {
      req.decodedToken = jwt.verify(token, SECRET);
    } catch {
      const session = await TokenSession.findOne({ where: { token } });

      if (session) {
        session.expired = true;
        await session.save();
      }
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = { blogFinder, tokenExtractor };
