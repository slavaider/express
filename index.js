// express
const express = require('express')
const app = express()
// express-handlebars
const exphbs = require('express-handlebars')
// Routes
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cardAddRoutes = require('./routes/card_add')
// Libraries
const path = require('path')
const mongoose = require('mongoose')
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardAddRoutes)

const PORT = process.env.PORT || 3000

const start = async () => {
    const url = 'mongodb+srv://slavaider:PYRtTyh2igwVOoIB@cluster0.tifvo.mongodb.net/Cluster0?retryWrites=true&w=majority'
    await mongoose.connect(url, {useNewUrlParser: true,useUnifiedTopology:true})
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

start().catch(err => console.error(err))
