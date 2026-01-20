const express = require('express');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const batchRoutes = require('./routes/batchRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const session = require('express-session');
const app = express();
const upload = multer();
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();


app.use(cors());
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(session({
    secret: process.env.SESSION_SECRET, // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  }));
// Configure multer for multipart/form-data


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// // API Routes
app.use('/api/auth', upload.none(), authRoutes);  // Apply multer middleware

// View Routes
app.use('/chinmudra',upload.none(), authRoutes); // ✅ Ensure the correct base path
app.use('/chinmudra', upload.none(),batchRoutes); // Apply multer middleware
app.use('/chinmudra/admin', adminRoutes); 
app.use('/chinmudra/payments', paymentRoutes);
// Test homepage
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));







