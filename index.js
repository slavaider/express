// express
const express = require('express')
const app = express()
// express-handlebars
const exphbs = require('express-handlebars')
// Routes
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cartAddRoutes = require('./routes/cart_add_item')
const OrdersRoutes = require('./routes/orders')
// fix for mongodb
const handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
// Libraries
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user')

const hbs = exphbs.create({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess((handlebars)),
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))
app.use(async (req, res, next) => {
    try {
        req.user = await User.findById('6006d955cac056531c46be7a')
        next()
    } catch (err) {
        console.log(err)
        throw err
    }
})
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartAddRoutes)
app.use('/orders', OrdersRoutes)

const PORT = process.env.PORT || 3000

const start = async () => {
    const url = 'mongodb+srv://slavaider:PYRtTyh2igwVOoIB@cluster0.tifvo.mongodb.net/Shop'
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    const candidate = await User.findOne()
    if (!candidate) {
        const user = new User({email: 'lol1@mail.ru', name: 'LOL', cart: {items: []}})
        await user.save()
    }
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

start().catch(err => console.error(err))
