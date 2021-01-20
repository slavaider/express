// express
const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
// express-handlebars
const exphbs = require('express-handlebars')
// Routes
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cartAddRoutes = require('./routes/cart_add_item')
const OrdersRoutes = require('./routes/orders')
const AuthRoutes = require('./routes/auth')
// fix for mongodb
const handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
// Libraries
const path = require('path')
const mongoose = require('mongoose')
const middleware = require('./middleware/vars')
const user_middleware = require('./middleware/user')
const csurf = require('csurf')
const hbs = exphbs.create({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess((handlebars)),
    extname: 'hbs'
})
const MONGODB_URI = 'mongodb+srv://slavaider:PYRtTyh2igwVOoIB@cluster0.tifvo.mongodb.net/Shop'

const store = new MongoStore({
    collections: 'sessions',
    uri: MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csurf)
app.use(middleware)
app.use(user_middleware)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))

// Routes
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartAddRoutes)
app.use('/orders', OrdersRoutes)
app.use('/auth', AuthRoutes)

const PORT = process.env.PORT || 3000

const start = async () => {
    await mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

start().catch(err => console.error(err))
