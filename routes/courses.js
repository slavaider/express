const {Router} = require('express')
const router = Router()
const Course = require('../models/course')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
    const courses = await Course.find()
        .populate('userId', 'email name')
        .select('price title image')
        .catch(e => console.error(e))
    res.render('courses', {
        courses,
        title: 'Курсы',
        isCourses: true,
        userId: req.user ? req.user._id : null
    })
})
router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id).catch(err => console.error(err))
    res.render('course', {
        layout: 'empty',
        title: 'Курсы',
        course
    })
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const course = await Course.findById(req.params.id).catch(err => console.error(err))
    if (course.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/courses')
    }
    res.render('course-edit', {
        title: 'Редактировать Курс',
        course
    })
})

router.post('/:id/edit', auth, async (req, res) => {
    const course = await Course.findById(req.params.id)
    if (course.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/courses')
    }
    await Course.findByIdAndUpdate(req.params.id, req.body).catch(err => console.error(err))
    res.redirect('/courses')
})

router.post('/:id/remove', auth, async (req, res) => {
    const course = await Course.findById(req.params.id)
    if (course.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/courses')
    }
    await Course.findByIdAndDelete(req.params.id).catch(err => console.error(err))
    res.redirect('/courses')
})
module.exports = router
