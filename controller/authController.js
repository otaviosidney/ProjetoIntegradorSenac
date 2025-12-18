const { User } = require('../models')
const { matchedData } = require('express-validator')

function showRegisterForm(req, res) {
     res.render('PaginaCadastro')
}


async function startRegistration(req, res, next) {
     try {
          const { username, password } = matchedData(req)
          const userFound = await User.findOne({ where: { username } })
          if (userFound) {
               req.flash('error', 'Já existe um usuário cadastrado com esse nome de usuário.');
               return res.redirect('/auth/register')
          }
          const user = await User.create({ username, password })
          req.session.tempUserId = user.id
          res.redirect(`/auth/register/step/1`)
     } catch (error) {
          next(error)
     }
}


function showlogin(req, res) {
     res.render('MercadoBusiness')
}


async function processLogin(req, res, next) {
     try {
          const { username, password } = matchedData(req)
          const user = await User.authenticate(username, password)
          if (!user) {
               req.flash('error', 'Credenciais inválidas. Verifique seu usuário e senha.');
               return res.redirect('/auth/login')
          }

          const stepRoutes = {
               0: '/auth/register/step/1',
               1: '/auth/register/step/2',
               2: '/auth/register/step/3'
          }

          // handle register
          if (stepRoutes[user.registrationStep]) {
               req.session.tempUserId = user.id
               return res.redirect(stepRoutes[user.registrationStep]);
          }

          req.session.tempUserId = null
          req.session.userId = user.id
          return res.redirect('/');
     } catch (error) {
          next(error)
     }
}


function showFormStep1(req, res) {
     res.render('ConfigurarPerfil')
}

async function processFormStep1(req, res, next) {
     try {
          const registrationStep = 1
          const { name, dateOfBirth, address } = matchedData(req)
          const tempUser = await User.findByPk(req.session.tempUserId)
          await tempUser.update({ name, dateOfBirth, address, registrationStep })
          res.redirect('/auth/register/step/2')
     } catch (error) {
          next(error)
     }
}

function showFormStep2(req, res) {
     res.render('Configurar2')
}

async function processFormStep2(req, res, next) {
     try {
          const registrationStep = 2
          const { work } = matchedData(req)
          const tempUser = await User.findByPk(req.session.tempUserId)
          await tempUser.update({ work, registrationStep })
          res.redirect('/auth/register/step/3')
     } catch (error) {
          next(error)
     }
}

function showFormStep3(req, res) {
     res.render('Configurar3')
}

async function processFormStep3(req, res, next) {
     try {
          const registrationStep = 3
          const { phone, email } = matchedData(req)
          const userFound = await User.findOne({ where: { email } })
          if (userFound) {
               req.flash('error', "Já existe uma conta registrada com este e-mail.");
               return res.redirect('/auth/register/step/3')
          }
          const profileImage = req.file ? "/profiles/" + req.file.filename : null
          const tempUser = await User.findByPk(req.session.tempUserId)
          await tempUser.update({ phone, email, profileImage, registrationStep })
          res.redirect('/auth/login')
     } catch (error) {
          next(error)
     }
}

function logout(req, res) {
     req.session.destroy(err => {
          if (err) {
               console.error("Erro ao destruir sessão:", err);
               return res.redirect('/');
          }
          res.clearCookie('connect.sid');
          return res.redirect('/auth/login');
     });
}


module.exports = {
     showRegisterForm,
     startRegistration,
     showFormStep1,
     processFormStep1,
     showFormStep2,
     processFormStep2,
     showFormStep3,
     processFormStep3,
     showlogin,
     processLogin,
     logout
}