const {Router} = require('express')
const router = Router()
const Course = require('../models/course')
router.get('/', (req, res) => {
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    })
})

router.post('/', (req, res) => {
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
