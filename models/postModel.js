const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')
const ValidationErrorException = require('../exceptions/ValidationErrorException')


const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

},{
    timestamps: true,
})


Post.prototype.editPost = async function (userId,content) {
    if (this.userId !== userId.id) {
        throw new ValidationErrorException("Você não tem permissão para editar esse post!")
    }
   return this.update({content})
}

module.exports = Post