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


const passwordValidation = (type) => {
    const validations =
        body('password')
            .isString()
            .withMessage("A senha deve ser texto.")
            .notEmpty()
            .withMessage("A senha é obrigatória.")
            .isLength({ min: 8 })
            .withMessage("A senha deve ter no mínimo 8 caracteres.")

    if (type !== 'register') {
        return validations
    }
    return validations.matches(/[a-z]/)
        .withMessage("A senha deve conter ao menos uma letra minúscula.")
        .matches(/[A-Z]/).
        withMessage("A senha deve conter ao menos uma letra maiúscula.")
        .matches(/[0-9]/)
        .withMessage("A senha deve conter ao menos um número.")
        .matches(/[^a-zA-Z0-9]/)
        .withMessage("A senha deve conter ao menos um caractere especial.")
}


const repeatPasswordValidation = () =>
    body('repeatpassword')
        .notEmpty().withMessage("O campo de confirmação da senha é obrigatório.")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
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

module.exports = {
    login: () => createValidation(() => '/auth/login',
        [
            usernameValidation('login'),
            passwordValidation('login')
        ],
        ['username']
    ),

    register: () => createValidation(() => '/auth/register', [
        usernameValidation('register'),
        passwordValidation('register'),
        repeatPasswordValidation()
    ]),

    registerStep1: () => createValidation(
        () => "/auth/register/step/1",
        [
            nameValidation(),
            dateOfBirthValidation(),
            addressValidation()
        ],
        ['name', 'dateOfBirth', 'address']
    ),

    registerStep2: () => createValidation(
        () => "/auth/register/step/2",
        [workValidation()],
        ['work'],
    ),

    registerStep3: () => createValidation(
        () => "/auth/register/step/3",
        [
            phoneValidation(),
            emailValidation(),
            profileImageValidation()
        ],
        ["phone", "email"]
    ),
}