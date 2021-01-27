const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const keys = require('../keys')
const crypto = require('crypto');
// Validators
const {validationResult} = require('express-validator')
const {registerValidators, loginValidators} = require('../utils/validators')
// mail
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport')
const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.EMAIL_API}
}))

const reg_email = require('../emails/registration')
const reset_email = require('../emails/reset')
const {resetValidators} = require("../utils/validators");

router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Login Page',
        isLogin: true,
        Login_error: req.flash('Login_error'),
        Register_error: req.flash('Register_error')
    });
})

router.post('/login', loginValidators, async (req, res) => {
    try {
        const {email, password} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('Login_error', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#login')
        }
        const candidate = await User.findOne({email})
        if (candidate) {
            const isSame = await bcrypt.compare(password, candidate.password)
            if (isSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save((err) => {
                    if (err) throw err
                    res.redirect('/')
                })
            } else {
                req.flash('Login_error', 'Неверный пароль')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('Login_error', 'Такого пользователя не существует')
            res.redirect('/auth/login#login')
        }
    } catch (err) {
        console.log(err)
        if (err) throw err
    }

})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Reset Page',
        ResetError: req.flash('ResetError')
    });
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('ResetError', err.toString());
                return res.redirect('/auth/reset');
            }
            const token = buffer.toString('hex');
            const candidate = await User.findOne({email: req.body.email});
            if (candidate) {
                candidate.resetToken = token
                candidate.expiredDate = Date.now() + 60 * 60 * 1000
                await candidate.save();
                await transporter.sendMail(reset_email(candidate.email, token));
                return res.redirect('/');
            } else {
                req.flash('ResetError', 'Такого email нет')
                return res.redirect('/auth/reset');
            }
        })
    } catch (e) {
        if (e) req.flash('ResetError', e.toString())
        return res.redirect('/auth/reset');
    }
})

router.get('/password/:token', async (req, res) => {

    if (!req.params.token) {
        return res.redirect('/')
    }

    const user = await User.findOne({
        resetToken: req.params.token,
        expiredDate: {$gt: Date.now()}
    }).catch(e => console.log(e))

    if (!user) {
        return res.redirect('/')
    } else {
        res.render('auth/password', {
            title: 'Reset Password Page',
            ResetError: req.flash('ResetError'),
            userId: user._id.toString(),
            token: req.params.token,
        });
    }
})

router.post('/password', resetValidators, async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            expiredDate: {$gt: Date.now()}
        })
        if (user) {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                req.flash('ResetError', errors.array()[0].msg)
                return res.status(422).render('auth/password', {
                    title: 'Reset Password Page',
                    ResetError: req.flash('ResetError'),
                    userId: user._id.toString(),
                    token: req.params.token,
                })
            }
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.expiredDate = undefined
            user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Время жизни токена истекло')
            res.redirect("/auth/login")
        }
    } catch (err) {
        console.log(err)
    }
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, name} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('Register_error', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({email, name, password: hashPassword, cart: {items: []}})
        req.session.user = user
        req.session.isAuthenticated = true
        await user.save()
        res.redirect('/')
        await transporter.sendMail(reg_email(email))
    } catch
        (err) {
        console.log(err)
        throw err
    }
})


module.exports = router
