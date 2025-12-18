const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')
const bcrypt = require("bcrypt")
const ValidationErrorException = require("../exceptions/ValidationErrorException")


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    work: {
        type: DataTypes.ENUM,
        values: ['contabilidade', 'marketing_digital', 'coaching', 'reformas'],
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    registrationStep: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 3,
        }
    },
    isRegistrationComplete: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.registrationStep >= 3
        }
    }
}, {
    timestamps: true,
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
})

User.prototype.verifyPassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

User.authenticate = async function (username, password) {
    const userFound = await User.findOne({ where: { username } })
    if (!userFound) {
        return null
    }
    const result = await userFound.verifyPassword(password)
    return result ? userFound : null
}

User.existsUsername = async function (username) {
    const userFound = await User.findOne({ where: { username } })
    return Boolean(userFound)
}

User.existsEmail = async function (email) {
    const userFound = await User.findOne({ where: { email } })
    return Boolean(userFound)
}


User.prototype.validateUsername = async function (username) {
    if (this.username !== username && await User.existsUsername(username)) {
        return false
    }
    return true
}

User.prototype.validateEmail = async function (email) {
    if (this.email !== email && await User.existsEmail(email)) {
        return false
    }
    return true
}


User.prototype.editProfile = async function (data) {
    const { username, email, currentPassword, newPassword } = data;
    const { name, dateOfBirth, address, work, phone, profileImage } = data

    if (username && !(await this.validateUsername(username))) {
        throw new ValidationErrorException("Esse nome de usuário já existe");
    }
    if (email && !(await this.validateEmail(email))) {
        throw new ValidationErrorException("Esse email já está em uso");
    }
    if (currentPassword && !(await this.verifyPassword(currentPassword))) {
        throw new ValidationErrorException("Senha Incorreta")
    }


    if (username) this.username = username
    if (email) this.email = email
    if (currentPassword && newPassword) this.password = newPassword

    if (name) this.name = name
    if (dateOfBirth) this.dateOfBirth = dateOfBirth
    if (address) this.address = address
    if (work) this.work = work
    if (phone) this.phone = phone
    if (profileImage) this.profileImage = profileImage

    return this.save()
};

module.exports = User