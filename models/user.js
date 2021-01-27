const {Schema, model} = require('mongoose')
const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    avatarUrl: String,
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    expiredDate: Date,
    cart: {
        items: [{
            count: {
                type: Number,
                required: true,
                default: 1
            },
            courseId: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            }
        }]
    }
})
UserSchema.methods.addToCart = function (course) {
    const items = [...this.cart.items]
    const idx = items.findIndex(item => item.courseId.toString() === course._id.toString())
    idx >= 0 ? items[idx].count += 1 : items.push({courseId: course._id, count: 1})
    this.cart = {items}
    return this.save()
}
UserSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items]
    const idx = items.findIndex(item => item.courseId.toString() === id.toString())
    if (items[idx].count === 1) {
        items = items.filter(item => item.courseId.toString() !== id.toString())
    } else {
        items[idx].count -= 1
    }
    this.cart = {items}
    return this.save()
}
UserSchema.methods.ClearCart = function () {
    this.cart = {items: []}
    return this.save()
}
module.exports = model('User', UserSchema)
