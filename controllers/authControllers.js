const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.redirect('/chinmudra/register?error=User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Only ONE admin allowed
        const adminExists = await User.findOne({ role: 'admin' });
        const role = adminExists ? 'user' : 'admin';

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        // Set session
        req.session.userId = newUser._id;
        req.session.email = newUser.email;
        req.session.role = newUser.role;

        // Redirect based on role
        if (newUser.role === 'admin') {
            return res.redirect('/chinmudra/admin/dashboard');
        } else {
            return res.redirect('/chinmudra/dashboard');
        }

    } catch (err) {
        console.error('Register Error:', err);
        return res.redirect('/chinmudra/register?error=Server Error');
    }
};


// ✅ Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.redirect('/chinmudra/login?error=Invalid email or password');
        }
         // If the user is an admin, force redirect with an alert
        if (user.role === 'admin') {
        return res.redirect('/chinmudra/login?adminRedirect=true');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.redirect('/chinmudra/login?error=Invalid email or password');
        }
  
        req.session.email = user.email;
        req.session.userId = user._id;
        req.session.role = user.role;
  
        if (user.role === 'admin') {
            res.redirect('admin/dashboard');
        } else {
            res.redirect('/chinmudra/dashboard');
        }
    } catch (err) {
        console.error(err);
        return res.redirect('/chinmudra/login?error=Server Error');
    }
  };
  
  

// Admin Login Controller

    exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.redirect('/chinmudra/admin/login?error=Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.redirect('/chinmudra/admin/login?error=Invalid email or password');
        }

        // ✅ ONLY check role, not env email
        if (user.role !== 'admin') {
            return res.redirect('/chinmudra/admin/login?error=You are not an admin');
        }

        // ✅ Set session properly
        req.session.userId = user._id;
        req.session.email = user.email;
        req.session.role = 'admin';

        return res.redirect('/chinmudra/admin/dashboard');

    } catch (err) {
        console.error("Admin Login Error:", err);
        return res.redirect('/chinmudra/admin/login?error=Server Error');
    }
};

    
//logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/chinmudra/dashboard'); // Optional fallback
        }
        res.render('pages/logout', { session: {} }); // Renders logout page
    });
};
