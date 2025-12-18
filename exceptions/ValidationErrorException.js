module.exports = class ValidationErrorException extends Error{
    constructor(message){
        super(message)
    }
}
