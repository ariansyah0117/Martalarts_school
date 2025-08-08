const express = require('express');
const router = express.Router();
const connection = require('../dbConfig');

// Middleware: Cek login dan role admin
function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/auth/login');
}

// GET: Admin Dashboard - tampilkan semua booking lengkap dengan nama dan email user
router.get('/dashboard', ensureAdmin, (req, res) => {
  // Query gabung booking + users untuk info lengkap
  const query = `
    SELECT booking.*, users.name, users.email
    FROM booking
    JOIN users ON booking.user_id = users.id
    ORDER BY booking.class_date DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch bookings:', err);
      return res.status(500).send('Server Error');
    }

    res.render('admin', {
      title: 'Admin Dashboard',
      bookings: results
    });
  });
});

module.exports = router;