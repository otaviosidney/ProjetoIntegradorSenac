const { User, UserSkills, Post } = require("../models")
const { Op } = require("sequelize");
const ValidationErrorException = require("../exceptions/ValidationErrorException");


async function showHomePage(req, res, next) {
    try {
        const users = await User.findAll({
            where: {
                id: { [Op.ne]: req.user.id }
            },
            order: [['createdAt', 'DESC']],
            limit: 8
        })
        const userId = req.user.id
        res.render('PaginaInicial', { users, userId })
    } catch (error) {
        next(error)
    }
}

async function showUsers(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 12
        const searchQuery = req.query.q || ''
        const offset = (page - 1) * limit;

        let whereCondition = {}
        if (searchQuery) {
            whereCondition = {
                [Op.or]: [
                    { name: { [Op.like]: `%${searchQuery}%` } },
                    { username: { [Op.like]: `%${searchQuery}%` } },
                    { work: { [Op.like]: `%${searchQuery}%` } },
                    { email: { [Op.like]: `%${searchQuery}%` } }
                ]
            }
        }

        const { count, rows: users } = await User.findAndCountAll({
            where: whereCondition,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });


        const totalPages = Math.ceil(count / limit);
        res.render('Usuarios', {
            users: users,
            currentPage: page,
            totalPages: totalPages,
            totalUsers: count,
            searchQuery: searchQuery,
        })
    } catch (error) {
        next(error)
    }
}

async function showProfile(req, res, next) {
    try {
        const { userId } = req.params
        const user = await User.findByPk(userId)
        if(!user){
            return res.status(404).render('404')
        }
        const userSkills = await user.getUserSkills()
        const posts = await user.getPosts({ order: [['createdAt', 'DESC']] })
        const isMyUser = user.id === req.user.id
        res.render('Perfil', { user, isMyUser, userSkills, posts })
    } catch (error) {
        next(error)
    }
}

async function showEditProfile(req, res, next) {
    try {
        const userSkills = await req.user.getUserSkills()
        res.render('EditarPerfil', { userSkills, isMyUser: true })
    } catch (error) {
        next(error)
    }
}

async function editProfile(req, res, next) {
    try {
        const skills = req.body.skills ? JSON.parse(req.body.skills) : []
        const user = req.user
        const profileImage = req.file ? "/profiles/" + req.file.filename : null
        await user.editProfile({ ...req.body, profileImage })
        await UserSkills.updateUserSkills(user.id, skills)
        req.flash('success', 'Suas informações foram atualizadas com sucesso.')
        res.redirect('/profile/edit')
    } catch (error) {
        if (!(error instanceof ValidationErrorException)) {
            next(error)
        }
        req.flash('error', error.message)
        res.redirect('/profile/edit')
    }
}

async function createSkillByProfile(req, res,next) {
    try {
        const { skill } = req.body
        const userId = req.user.id
        const userSkills = await req.user.getUserSkills()
        if (userSkills.length >= 5){
            req.flash('error','Você pode adicionar no máximo 5 habilidades.')
            return res.redirect(`/profile/user/${userId}`)
        }
        await UserSkills.create({ skill, userId })
        res.redirect(`/profile/user/${userId}`)
    } catch (error) {
        next(error)
    }
}


function showFormCreatePost(req, res) {
    res.render("PostagemForm", { post: null, isMyUser: true })
}

async function createPost(req, res) {
    try {
        const { content } = req.body
        const userId = req.user.id
        await Post.create({ content, userId })
        res.redirect(`/profile/user/${userId}`)
    } catch (error) {
        next(error)
    }
}

async function showFormEditPost(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).render('404')
        }

        if (post.userId !== userId) {
            req.flash('error','Você não tem permissão para deletar esse post!')
            return res.redirect(`/profile/user/${userId}`);
        }

        res.render("PostagemForm", { post, isMyUser: true });
    } catch (error) {
        next(error)
    }
}

async function editPost(req, res) {
    try {
        const { content } = req.body
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await Post.findByPk(postId)
        if (!post) {
            return res.status(404).render('404')
        }

        if (post.userId !== userId) {
            req.flash('error','Você não tem permissão para deletar esse post!')
            return res.redirect(`/profile/user/${userId}`)
        }

        await post.update({ content })
        return res.redirect(`/profile/user/${userId}`)
    } catch (error) {
        next(error)
    }
}

async function deletePost(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).render('404')
        }

        if (post.userId !== userId) {
            req.flash('error','Você não tem permissão para deletar esse post!')
            return res.redirect(`/profile/user/${userId}`);
        }
        await post.destroy()
        req.flash('success','Post Deletado com Sucesso!')
        return res.redirect(`/profile/user/${userId}`);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    showHomePage,
    showUsers,
    showProfile,
    showEditProfile,
    editProfile,
    createSkillByProfile,
    showFormCreatePost,
    createPost,
    showFormEditPost,
    deletePost,
    editPost
}