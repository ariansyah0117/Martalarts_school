// routes/instructor.js

const express = require('express');
const router = express.Router();

// Middleware: cek user dan role
function ensureInstructor(req, res, next) {
  if (req.session.user && req.session.user.role === 'instructor') {
    return next();
  }
  res.redirect('/auth/login');
}

// Simulasi data kelas
const sampleClasses = [
  { id: 1, title: 'Karate Beginner', day: 'Monday', time: '6:00 PM' },
  { id: 2, title: 'Jiujitsu Intermediate', day: 'Wednesday', time: '7:30 PM' }
];

// Dashboard route
router.get('/dashboard', ensureInstructor, (req, res) => {
  res.render('dashboard', {
    title: 'Instructor Dashboard',
    user: req.session.user,
    classes: sampleClasses
  });
});

module.exports = router;
 