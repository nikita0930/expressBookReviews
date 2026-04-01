const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session setup
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
  })
);

// 🔐 Authentication Middleware
app.use("/customer/auth/*", function auth(req, res, next) {
  try {
    // Get token from headers
    const token = req.headers.authorization;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    // Verify token
    jwt.verify(token, "fingerprint_customer", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      // Store user info in session
      req.session.authorization = {
        accessToken: token,
        username: user.username
      };

      // Continue to next route
      next();
    });

  } catch (error) {
    return res.status(500).json({ message: "Authentication error" });
  }
});

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});