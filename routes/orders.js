const {Router} = require('express')
const router = new Router()
const Order = require('../models/order')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({'user.userId': req.user._id})
            .populate('user.userId')
        res.render('orders', {
            isOrder: true,
            title: 'Заказы',
            orders: orders.map(item => ({
                ...item._doc,
                price: item.courses.reduce((total, item) => total += item.count * item.course.price, 0)
            }))
        })
    } catch (e) {
        console.log(e)
        throw e
    }
})

router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId').execPopulate()
        const courses = user.cart.items.map(item => ({count: item.count, course: {...item.courseId._doc}}))
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            courses
        })
        await order.save()
        await req.user.ClearCart()
        res.redirect('/orders')
    } catch (e) {
        console.log(e)
        throw e
    }
})

module.exports = router
