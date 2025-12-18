const User = require("./userModel")
const UserSkills = require('./userSkillsModel')
const Post = require('./postModel')

const models = {
  User,
  UserSkills,
  Post
}

User.hasMany(UserSkills, { foreignKey: 'userId' });
UserSkills.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  ...models
};