const express = require('express');
const router = express.Router();
const connection = require('../dbConfig'); // Make sure this path is correct

// GET Home Page
router.get('/', (req, res) => {
  res.render('home', { title: 'Welcome to Bushido Martial Arts' });
});

// GET Schedule Page
router.get('/schedule', (req, res) => {
  const classSchedule = [
    { day: 'Monday', className: 'Striking Class', time: '18:00' },
    { day: 'Wednesday', className: 'Grappling Class', time: '18:00' },
    { day: 'Friday', className: 'Mixed Martial Arts', time: '18:00' },
  ];
  res.render('schedule', { title: 'Class Schedule', schedule: classSchedule });
});

// GET Contact Page
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

// POST Contact Form
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const post = { name, email, message };

  connection.query('INSERT INTO contact SET ?', post, (error) => {
    if (error) {
      console.error('Database insert error:', error);
      return res.status(500).render('contact', {
        title: 'Contact Us',
        error: 'Sorry, failed to send your message. Please try again.',
      });
    }
    res.render('contact-message', { title: 'Contact Us' });
  });
});

// GET Booking Page (show booking form)
router.get('/booking', (req, res) => {
  res.render('booking', {
    title: 'Book a Class',
    success: false,
    error: null,
    formData: {},
  });
});



module.exports = router;