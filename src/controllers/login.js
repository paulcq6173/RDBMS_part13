const jwt = require('jsonwebtoken');
const router = require('express').Router();

const { SECRET } = require('../util/config');
const { User, TokenSession } = require('../models');

router.post('/', async (request, response, next) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = body.password === 'secret';

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin',
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET, { expiresIn: 1 * 60 });
  let session;

  try {
    [session] = await TokenSession.findCreateFind({
      where: { user_id: user.id },
    });
    session.token = token;
    session.expired = false;

    await session.save();
  } catch (error) {
    next(error);
  }

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
