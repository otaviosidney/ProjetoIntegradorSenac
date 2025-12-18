const { body } = require("express-validator")
const createValidation = require("../helpers/createValidation")

const usernameValidation = (type) => {
    const validations = body('username')
        .trim()
        .isString().withMessage("O username deve ser um texto.")
        .notEmpty().withMessage("O username é obrigatório.")
        .isLength({ min: 3, max: 20 }).withMessage("O username deve ter entre 3 e 20 caracteres.")

    if (type !== 'register') {
        return validations
    }

    return validations.matches(/^[a-zA-Z][a-zA-Z0-9._]*$/)
        .withMessage("O username deve começar com letra e conter apenas letras, números, ponto ou underline.");
}

const passwordGroupValidation = () => {
    return body().custom((value, { req }) => {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const providedCount = [currentPassword, newPassword, confirmPassword].filter(field => field && field.trim() !== '').length;
        if (providedCount > 0 && providedCount < 3) {
            throw new Error('Para alterar a senha, forneça todos os três campos: senha atual, nova senha e confirmação.');
        }
        return true;
    })
}
    
const currentPasswordValidation = () => {
    return body('currentPassword')
        .optional({ checkFalsy: true })
        .isString()
        .withMessage("A senha deve ser texto.")
        .notEmpty()
        .withMessage("A senha é obrigatória.")
        .isLength({ min: 8 })
        .withMessage("A senha deve ter no mínimo 8 caracteres.")

}

const newPasswordValidation = () => {
    return body('newPassword')
        .optional({ checkFalsy: true })
        .isString()
        .withMessage("A senha deve ser texto.")
        .notEmpty()
        .withMessage("A senha é obrigatória.")
        .isLength({ min: 8 })
        .withMessage("A senha deve ter no mínimo 8 caracteres.")
        .matches(/[a-z]/)
        .withMessage("A senha deve conter ao menos uma letra minúscula.")
        .matches(/[A-Z]/).
        withMessage("A senha deve conter ao menos uma letra maiúscula.")
        .matches(/[0-9]/)
        .withMessage("A senha deve conter ao menos um número.")
        .matches(/[^a-zA-Z0-9]/)
        .withMessage("A senha deve conter ao menos um caractere especial.")
}


const confirmPasswordValidation = () =>
    body('confirmPassword')
        .optional({ checkFalsy: true })
        .notEmpty().withMessage("O campo de confirmação da senha é obrigatório.")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("As senhas não coincidem.");
            }
            return true;
        })



const nameValidation = () =>
    body('name')
        .trim()
        .notEmpty().withMessage("O nome é obrigatório.")
        .isString().withMessage("O nome deve ser texto.")
        .isLength({ min: 3, max: 60 }).withMessage("O nome deve ter entre 3 e 60 caracteres.")
        .matches(/^[A-Za-zÀ-ÿ\s']+$/)
        .withMessage("O nome deve conter apenas letras e espaços.");


const dateOfBirthValidation = () =>
    body('dateOfBirth')
        .notEmpty().withMessage("A data de nascimento é obrigatória.")
        .isISO8601().withMessage("A data de nascimento deve ser uma data válida.")
        .custom((value) => {
            const today = new Date();
            const dob = new Date(value);

            if (dob >= today) {
                throw new Error("A data de nascimento deve ser no passado.");
            }

            const age = today.getFullYear() - dob.getFullYear();
            if (age < 12) {
                throw new Error("Você deve ter pelo menos 12 anos.");
            }

            return true;
        });

const addressValidation = () =>
    body('address')
        .trim()
        .notEmpty().withMessage("O endereço é obrigatório.")
        .isString().withMessage("O endereço deve ser texto.")
        .isLength({ min: 5, max: 100 })
        .withMessage("O endereço deve ter entre 5 e 100 caracteres.");

const workValidation = () =>
    body('work')
        .notEmpty().withMessage('Selecione uma área de atuação.')
        .isIn(['contabilidade', 'marketing_digital', 'coaching', 'reformas'])
        .withMessage('Área de atuação inválida.')


const phoneValidation = () =>
    body("phone")
        .trim()
        .notEmpty().withMessage("O telefone é obrigatório.")
        .matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)
        .withMessage("Informe um telefone válido. Ex: (11) 98765-4321.")


const emailValidation = () =>
    body("email")
        .trim()
        .notEmpty().withMessage("O email é obrigatório.")
        .isEmail().withMessage("Informe um email válido.")
        .normalizeEmail()


const profileImageValidation = () =>
    body("profileImage")
        .custom((value, { req }) => {
            if (!req.file) return true

            const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

            if (!allowedTypes.includes(req.file.mimetype)) {
                throw new Error("A imagem deve ser JPG, PNG ou WEBP.")
            }

            return true
        })

const skillsValidation = () =>
    body('skills')
        .optional()
        .custom((value) => {
            if (!value) return true;

            let skills;
            try {
                skills = JSON.parse(value);
            } catch (error) {
                throw new Error('Skills deve ser um JSON válido.');
            }

            if (!Array.isArray(skills)) {
                throw new Error('Skills deve ser um array.');
            }

            if (skills.length > 5) {
                throw new Error('Você pode adicionar no máximo 5 habilidades.');
            }

            for (const skill of skills) {
                if (typeof skill !== 'string' || skill.trim() === '') {
                    throw new Error('Cada habilidade deve ser uma string não vazia.');
                }
                const trimmed = skill.trim();
                if (trimmed.length < 3 || trimmed.length > 50) {
                    throw new Error('Cada habilidade deve ter entre 3 e 50 caracteres.');
                }
            }

            return true;
        })

const skillValidation = () => {
    return body('skill').notEmpty().isString().trim().isLength({ min: 3, max: 50 })
}

const contentValidation = () => {
    return body('content')
        .trim()
        .notEmpty().withMessage("O conteúdo é obrigatório.")
        .isString().withMessage("O conteúdo deve ser texto.")
        .isLength({ min: 3 }).withMessage("O conteúdo deve ter no mínimo 3 caracteres.");
};

module.exports = {
    editProfile: () => createValidation(
        () => '/profile/edit',
        [
            usernameValidation('register'),
            nameValidation(),
            emailValidation(),
            phoneValidation(),
            dateOfBirthValidation(),
            addressValidation(),
            profileImageValidation(),
            workValidation(),
            skillsValidation(),
            passwordGroupValidation(),
            currentPasswordValidation(),
            newPasswordValidation(),
            confirmPasswordValidation()
        ],
    ),
    createSkill: () => createValidation(
        (req) =>  `/profile/user/${req.user.id}`,
        [skillValidation()],
    ),
    createPost: () => createValidation(
        (req) => '/posts/create',
        [contentValidation()],
        ['content']
    ),
    editPost: () => createValidation(
        (req) => `/posts/edit/${req.params.postId}`,
        [contentValidation()],
        ['content']
    ),
}