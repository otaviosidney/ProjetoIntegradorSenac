const handleValidation = require("../middlewares/handleValidation");

function createValidation(getUrlRedirect, validations, safeFields = []) {
    return [
        ...validations,
        handleValidation(getUrlRedirect, safeFields)
    ]
}

module.exports = createValidation