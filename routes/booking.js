const express = require('express');
const router = express.Router();
const connection = require('../dbConfig');

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
}

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('booking', {
    title: 'Book a Class',
    success: false,
    formData: {},
    error: null
  });
});

router.post('/', ensureAuthenticated, (req, res) => {
  console.log('Booking form submitted:');
  const { phone, class_day, class_date } = req.body;
  const user_id = req.session.user.id;

  console.log('Booking form submitted:', { user_id, phone, class_day, class_date });

  if (!phone || !class_day || !class_date) {
    console.warn('Validation failed: Missing fields');
    return res.status(400).render('booking', {
      title: 'Book a Class',
      success: false,
      formData: { phone, class_day, class_date },
      error: 'All fields are required.'
    });
  }

  const query = `
    INSERT INTO booking (user_id, phone, class_day, class_date)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(query, [user_id, phone, class_day, class_date], (err, results) => {
    if (err) {
      console.error('DB insert error:', err);
      return res.status(500).render('booking', {
        title: 'Book a Class',
        success: false,
        formData: { phone, class_day, class_date },
        error: 'Internal server error, please try again later.'
      });
    }

    console.log('Booking inserted with ID:', results.insertId);

    res.render('booking', {
      title: 'Book a Class',
      success: true,
      phone,
      class_date,
      class_day,
      formData: {phone,class_day, class_date},
      error: null
    });
  });
});

module.exports = router;
