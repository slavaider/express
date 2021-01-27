const {Router} = require('express')
const router = Router()
const Course = require('../models/course')
const auth = require('../middleware/auth')
const {courseValidators} = require('../utils/validators')
const {validationResult} = require('express-validator')
router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    })
})

router.post('/', auth, courseValidators, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Добавить курс',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                image: req.body.image,
            }
        })
    }
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        image: req.body.image,
        userId: req.user._id
    })
    course.save().catch(err => console.error(err))
    res.redirect('/')
})

module.exports = router
