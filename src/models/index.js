const Blog = require('./blog');
const User = require('./user');
const UserReadinglists = require('./readinglist');
const TokenSession = require('./session');

Blog.belongsTo(User);
User.hasMany(Blog);

User.belongsToMany(Blog, { through: UserReadinglists, as: 'marked_blogs' });
Blog.belongsToMany(User, { through: UserReadinglists, as: 'users_marked' });

TokenSession.belongsTo(User);

module.exports = {
  Blog,
  User,
  UserReadinglists,
  TokenSession,
};
