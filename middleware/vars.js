module.exports = function(req, res, next) {
    res.locals.isAuthenticated = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken()
    next()
}
