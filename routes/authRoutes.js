const express = require("express");
const { register, login, adminLogin ,logout} = require("../controllers/authControllers"); // ✅ Import only required functions
const router = express.Router();
const { validateRegistration } = require('../middleware/validator');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');
const user = require('../models/user');
const Batch = require('../models/batch');
// ✅ Register API
router.post("/register",validateRegistration, register);
router.get("/register", (req, res) => {
    res.render("pages/register", { session: req.session });  
});

// ✅ Login API
router.post('/login',login);
router.get("/login", (req, res) => {
    res.render("pages/login", { session: req.session });  
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render("pages/userDashboard", { session: req.session,user: req.session.userId, userId: req.session.userId });
});
router.get('/admin/dashboard', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const batches = await Batch.find(); // ✅ Fetch batches
        res.render("pages/adminDashboard", {session: req.session, user: req.session.user, batches }); // ✅ Pass batches to EJS
    } catch (err) {
        console.error("Error fetching batches:", err);
        res.redirect('/chinmudra/login');
    }
});

// ✅ Admin Login Page (renders the admin login form)
router.get('/admin/login', (req, res) => {
    res.render('pages/adminLogin', { session: req.session }); // Renders your EJS Admin Login Form
});

// ✅ Admin Login POST Route
router.post('/admin/login', adminLogin);
//logout
router.get('/logout', logout);
module.exports = router;



