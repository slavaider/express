const {Router} = require('express')
const router = Router()
const Course = require('../models/course')

router.get('/', async (req, res) => {
    const courses = await Course.find()
        .populate('userId', 'email name')
        .select('price title image')
    res.render('courses', {
        courses,
        title: 'Курсы',
        isCourses: true
    })
})
router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: 'Курсы',
        course
    })
})
router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const course = await Course.findById(req.params.id)
    res.render('course-edit', {
        title: 'Редактировать Курс',
        course
    })
})

router.post('/:id/edit', async (req, res) => {
    await Course.findByIdAndUpdate(req.params.id, req.body)
    res.redirect('/courses')
})
router.post('/:id/remove', async (req, res) => {
    await Course.findByIdAndDelete(req.params.id)
    res.redirect('/courses')
})
module.exports = router
