const {Router} = require('express')
const router = Router()
const Course = require('../models/course')

router.get('/', async (req, res) => {
    const courses = await Course.getAll()
    res.render('courses', {
        courses,
        title: 'Курсы',
        isCourses: true
    })
})
router.get('/:id', async (req, res) => {
    const course = await Course.getById(req.params.id)
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
    const course = await Course.getById(req.params.id)
    res.render('course-edit', {
        title: 'Редактировать Курс',
        course
    })
})

router.post('/:id/edit', async (req, res) => {
    await Course.update(req.body, req.params.id)
    res.redirect('/courses')
})

module.exports = router
