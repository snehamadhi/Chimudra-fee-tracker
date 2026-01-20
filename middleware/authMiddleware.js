// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (!token) return res.status(401).json({ message: "Access Denied" });

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ message: "Invalid Token" });
//   }
// };

// module.exports = authMiddleware;
// middleware/authMiddleware.js
function ensureAuthenticated(req, res, next) {
    console.log('Checking authentication:', req.session.userId);
    if (req.session && req.session.userId) {
        console.log(`Authenticated user: ${req.session.userId}`); // Debugging log
        return next();
    }
    console.log("User not authenticated"); // Debugging log
    res.redirect('/chinmudra/login'); // ✅ Ensure correct redirect
}

function ensureAdmin(req, res, next) {
    const ADMIN_EMAIL = 'admin@gmail.com';
    if (req.session && req.session.role === 'admin' && req.session.email === ADMIN_EMAIL) {
        return next();
    }
    res.redirect('/chinmudra/login');
}
module.exports = { ensureAuthenticated, ensureAdmin };
