const {body} = require("express-validator");
const User = require('../models/user')
exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Введите корректный email')
        .custom(async (value, {req}) => {
            const candidate = await User.findOne({email: req.body.email});
            if (candidate) {
                throw new Error('Пользователь с таким email уже существует')
            }
            return true
        })
        .normalizeEmail(),
    body('password', 'Пароль должен быть минимум 6 символов')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Пароли должны совпадать')
            }
            return true
        })
        .trim(),
    body('name')
        .isLength({min: 3})
        .withMessage('Имя должено быть минимум 3 символа')
]
exports.loginValidators = [
    body('email')
        .isEmail()
        .withMessage('Введите корректный email'),
    body('password', 'Пароль должен быть минимум 6 символов')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim()
]
