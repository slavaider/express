module.exports = {
    if_eq: function (a, b, options) {
        if (a.toString() === b.toString()) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    }
}
