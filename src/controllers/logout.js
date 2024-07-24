const router = require('express').Router();

const { TokenSession } = require('../models');
const { tokenExtractor } = require('../util/middleware');

router.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    const session = await TokenSession.findOne({
      where: { userId: req.decodedToken.id },
    });

    if (session && session.token) {
      session.token = '';
      session.expired = true;
      await session.save();
    } else {
      return res.status(404).json({
        message:
          'Error occured when user log out. Session of the user had been deleted.',
      });
    }
  } catch (error) {
    next(error);
  }

  return res.status(200).json({ message: 'Logout successfully.' });
});

module.exports = router;
