const {Router} = require('express');
const router = Router();
const Course = require('../models/course')
const auth = require('../middleware/auth')

router.post('/add',auth, async (req, res) => {
    const course = await Course.findById(req.body.id).catch(err => console.error(err))
    await req.user.addToCart(course)
    res.redirect('/cart')
})

router.delete('/remove/:id',auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id).catch(err => console.error(err))
    const user = await req.user.populate('cart.items.courseId').execPopulate().catch(err => console.error(err))
    const items = user.cart.items.map(item => ({...item.courseId._doc, id: item.courseId.id, count: item.count}))
    const price = items.reduce((total, item) => total += item.price * item.count, 0)
    res.json({items, price})
})

router.get('/',auth, async (req, res) => {
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const items = user.cart.items.map(item => ({...item.courseId._doc, id: item.courseId.id, count: item.count}))
    const price = items.reduce((total, item) => total += item.price * item.count, 0)
    res.render('cart', {
        title: 'Корзина',
        isCard: true,
        items,
        price
    })
})
module.exports = router
