const router = require("express").Router()
const multer = require("../config/multer")
const UserController = require('../controller/userController')
const userValidations = require('../validations/userValidations')

router.get('/', UserController.showHomePage)
router.get('/users', UserController.showUsers)
router.get('/profile/user/:userId', UserController.showProfile)

router.get('/profile/edit', UserController.showEditProfile)
router.post(
    '/profile/edit',
    multer.single('profileImage'),
    userValidations.editProfile(),
    UserController.editProfile
)

router.post(
    '/profile/skills/create',
    userValidations.createSkill(),
    UserController.createSkillByProfile
)

router.get('/posts/create', UserController.showFormCreatePost)
router.post(
    '/posts/create',
    userValidations.createPost(),
    UserController.createPost
)

router.get('/posts/edit/:postId', UserController.showFormEditPost)
router.post(
    '/posts/edit/:postId',
    userValidations.editPost(),
    UserController.editPost
)

router.post('/posts/delete/:postId', UserController.deletePost)

module.exports = router