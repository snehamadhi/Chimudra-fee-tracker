// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Adjust the path to your user model

// ✅ Change your MongoDB URL here
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;


// ✅ Change the password or email here anytime
const adminEmail = 'admin@gmail.com';
const adminPassword = 'admin123'; // CHANGE PASSWORD HERE
const adminName = 'Admin';

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // ✅ Upsert Admin User (Insert if not exists or Update if exists)
    const result = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin User Created/Updated:', result);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error connecting to MongoDB:', err);
  });
