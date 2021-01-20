module.exports = function (req, res, next) {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    next()
}
