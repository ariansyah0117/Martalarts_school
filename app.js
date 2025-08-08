const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express(); // Inisialisasi app harus di atas sebelum app.use()

// Database connection
const db = require('./dbConfig');

// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const instructorRoutes = require('./routes/instructor');
const adminRoutes = require('./routes/admin');
const bookingRoutes = require('./routes/booking');

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: 'your-session-secret-here', // Ubah ini di production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set true jika menggunakan HTTPS
}));

// Make session user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/instructor', instructorRoutes);
app.use('/admin', adminRoutes);
app.use('/booking', bookingRoutes); // Pastikan route booking dipasang terakhir jika penting

// Optional: Dashboard route (jika diperlukan)
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  res.render('dashboard', {
    title: 'Dashboard',
    user: req.session.user,
    classes: [] // Bisa fetch dari DB jika mau
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});