// middleware/auth.js

function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
}

function ensureInstructor(req, res, next) {
  if (req.session.user && req.session.user.role === 'instructor') {
    return next();
  }
  res.redirect('/auth/login');
}

function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/auth/login');
}

module.exports = {
  ensureAuthenticated,
  ensureInstructor,
  ensureAdmin,
};