const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs');
router.get('/login', async (req, res) => {
    res.render('auth/login', {title: 'Login Page', isLogin: true})
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
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
                res.redirect('/auth/login#login')
            }
        } else {
            res.redirect('/auth/login#login')
        }
    } catch (err) {
        console.log(err)
        if (err) throw err
    }

})

router.post('/register', async (req, res) => {
    try {
        const {email, password, confirm, name} = req.body
        const candidate = await User.findOne({email})
        if (password !== confirm || candidate) {
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({email, name, password: hashPassword, cart: {items: []}})
            req.session.user = user
            req.session.isAuthenticated = true
            await user.save()
            res.redirect('/')
        }
    } catch (err) {
        console.log(err)
        throw err
    }
})

module.exports = router
