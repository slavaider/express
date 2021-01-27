const multer = require('multer')
const uuid = require('uuid')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + '.' + file.originalname.split('.')[1])
    }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage, fileFilter
})
