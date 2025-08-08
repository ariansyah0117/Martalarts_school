const express = require('express');
const router = express.Router();
const connection = require('../dbConfig');

// GET Register Page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// POST Register Form
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('All fields (name, email, password) are required.');
  }

  const post = {
    name,
    email,
    password,
    role: role || 'student'
  };

  connection.query('INSERT INTO users SET ?', post, (error) => {
    if (error) {
      console.error('Register error:', error);
      return res.status(500).send('Registration failed. Please try again.');
    }
    console.log('✅ User registered:', email); // ✅ LOG
    res.redirect('/auth/login');
  });
});

// GET Login Page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// POST Login Form
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).send('Internal server error');
    }

    if (results.length > 0) {
      const user = results[0];

      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      console.log('✅ Login success:', req.session.user); // ✅ LOG

      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else if (user.role === 'instructor') {
        return res.redirect('/instructor/dashboard');
      } else {
        return res.redirect('/dashboard');
      }
    } else {
      console.warn('❌ Login failed for email:', email); // ✅ LOG
      res.status(401).send('Invalid email or password');
    }
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    console.log('🚪 User logged out'); // ✅ LOG
    res.redirect('/');
  });
});

module.exports = router;