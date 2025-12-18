const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')


const UserSkills = sequelize.define('UserSkills', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    skill: {
        type: DataTypes.STRING,
        allowNull: false,
    },

},{
    timestamps: true,
})

UserSkills.updateUserSkills = async function(userId,skills) {
    await UserSkills.destroy({ where: { userId } });
    await UserSkills.bulkCreate(
        skills.map(skill => ({
            userId,
            skill
        }))
    );
}


module.exports = UserSkills