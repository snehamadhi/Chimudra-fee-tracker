const Batch = require('../models/batch');
const User = require('../models/user');
const Payment = require('../models/payment');

// Admin Dashboard Overview
exports.getDashboard = async (req, res) => {
    res.render('pages/adminDashboard', { session: req.session }); 
};

// Get All Batches
exports.getBatches = async (req, res) => {
    try {
        const batches = await Batch.find();
        res.render('pages/adminBatches', { batches, session: req.session });
    } catch (err) {
        console.error(err);
        res.redirect('/chinmudra/admin/dashboard');
    }
};

// Get All Students
exports.getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'user' }); // only normal users
        res.render('pages/adminStudents', { students, session: req.session });
    } catch (err) {
        console.error(err);
        res.redirect('/chinmudra/admin/dashboard');
    }
};

// Get All Payments
// exports.getPayments = async (req, res) => {
//     try {
//         const payments = await Payment.find().populate('userId'); // if payments are linked to user
//         res.render('pages/adminPayments', { payments, session: req.session });
//     } catch (err) {
//         console.error(err);
//         res.redirect('/chinmudra/admin/dashboard');
//     }
// };

// Controller to fetch paid and unpaid students
exports.getPaymentStatus = async (req, res) => {
    try {
      const users = await User.find();
      const payments = await Payment.find({ status: 'Success' }).populate('user');
  
      const paidUserIds = payments.map(payment => payment.user._id.toString());
  
      const paidStudents = users.filter(user => paidUserIds.includes(user._id.toString()));
      const unpaidStudents = users.filter(user => !paidUserIds.includes(user._id.toString()));
  
      res.render('pages/adminPaymentStatus', { session: req.session ,paidStudents, unpaidStudents });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
//notification
exports.sendNotification = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) return res.status(404).send('User not found');
  
      // Future enhancement: Integrate nodemailer or SMS API here
      console.log(`Notification sent to ${user.email}`);
  
      // Optional: Flash message or alert for success
      res.redirect('/chinmudra/admin/paymentStatus');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error sending notification');
    }
  };

  
//   exports.getPaymentStatus = async (req, res) => {
//     try {
//       // Fetch all users
//       const users = await User.find();

//       // Fetch all payments
//       const payments = await Payment.find();

//       // Map user payment statuses
//       const userPaymentStatuses = users.map(user => {
//         const userPayments = payments.filter(payment => payment.user.toString() === user._id.toString());
//         const hasPaid = userPayments.some(payment => payment.status === 'Success');
//         return {
//           name: user.name,
//           email: user.email,
//           hasPaid
//         };
//       });

//       res.render('pages/adminPaymentStatus', { userPaymentStatuses });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Server Error');
//     }
//   };
  