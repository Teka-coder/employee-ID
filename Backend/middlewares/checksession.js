function checkSession(req, res, next) {
    if (req.session.logged) {
        next();
    } else {
        res.status(401).json({"message":  "unauthorized"})
    }
}

module.exports = checkSession