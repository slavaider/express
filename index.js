// Express
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
// Extension libs
const path = require('path')
const helmet = require('helmet')
const compression = require('compression')
// Routes
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/cart_add_item')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const authRoutes = require('./routes/auth')
const ProfileRoutes = require('./routes/profile')
// Middleware
const flash = require('connect-flash')
const csrf = require('csurf')
const varMiddleware = require('./middleware/vars')
const userMiddleware = require('./middleware/user')
const errorMiddleware = require('./middleware/error')
const fileMiddleware = require('./middleware/file')
// fix for mongodb
const handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
// URI
const keys = require('./keys')
// Init app
const app = express()
//view engine
const hbs = exphbs.create({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess((handlebars)),
    extname: 'hbs',
    helpers: require('./utils/helpers')
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

// Session Store
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})
// Configure express
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
// Using middleware
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(helmet({
    contentSecurityPolicy: false
}))
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

// Routes
app.use('/', homeRoutes)
app.use('/profile', ProfileRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use(errorMiddleware)
// Port
const PORT = process.env.PORT || 3000
// Start App
const start = async () => {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()


