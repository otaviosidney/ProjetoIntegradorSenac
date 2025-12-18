const router = require("express").Router()
const multer = require("../config/multer")
const AuthController = require("../controller/authController")
const handleRegisterStep = require("../middlewares/handleRegisterStep")
const handleValidation = require("../middlewares/handleValidation")
const onlyAuth = require("../middlewares/onlyAuth")
const onlyGuest = require("../middlewares/onlyGuest")
const authValidations = require("../validations/authValidations")


router.get('/login', onlyGuest, AuthController.showlogin)
router.post(
    '/login',
    onlyGuest,
    authValidations.login(),
    AuthController.processLogin
)
router.get('/register', onlyGuest, AuthController.showRegisterForm)
router.post('/register', onlyGuest, authValidations.register(), AuthController.startRegistration)

router.get('/register/step/1', onlyGuest, handleRegisterStep, AuthController.showFormStep1)
router.post(
    '/register/step/1',
    onlyGuest,
    handleRegisterStep,
    authValidations.registerStep1(),
    AuthController.processFormStep1
)

router.get('/register/step/2', onlyGuest, handleRegisterStep, AuthController.showFormStep2)
router.post(
    '/register/step/2',
    onlyGuest,
    handleRegisterStep,
    authValidations.registerStep2(),
    AuthController.processFormStep2
)

router.get('/register/step/3', onlyGuest, handleRegisterStep, AuthController.showFormStep3)
router.post(
    '/register/step/3',
    onlyGuest,
    handleRegisterStep,
    multer.single('profileImage'),
    authValidations.registerStep3(),
    AuthController.processFormStep3
)
router.get(`/logout`, onlyAuth, AuthController.logout)

module.exports = router