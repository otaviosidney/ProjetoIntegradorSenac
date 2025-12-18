const { validationResult } = require('express-validator')


function handleValidation(getUrlRedirect,safeFields = []) {
    return (req, res, next) => {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            req.flash('errors',result.mapped())
            const old = {}
            safeFields.forEach(field => old[field] = req.body[field])
            req.flash('old', old)
            return res.redirect(getUrlRedirect(req,res,next))
        }
        next()
    }
}

module.exports = handleValidation