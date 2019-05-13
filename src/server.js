/**
 * Node Core Modules import
 */
import path from 'path';

/**
 * NPM import
 */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongodbSession from 'connect-mongodb-session';
import csrf from 'csurf';
import flash from 'connect-flash';

/**
 * Local import
 */
// Models
import User from './models/user';
// Controllers middleware functions
import getNotFound from './controllers/errors';
// Routes
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';

/**
 * Code
 */
// Environment variables
dotenv.config();

// Init express
const app = express();

// Database password
const { DB_PASSWORD } = process.env;

// Database URI
const DB_URI = `mongodb+srv://maclaude:${DB_PASSWORD}@node-js-qfuuy.mongodb.net/shop?retryWrites=true`;

// MongoDB Session Storage
const MongodbSession = connectMongodbSession(session);

const store = new MongodbSession({
  uri: DB_URI,
  collections: 'sessions',
});

// CSRF protection
const csrfProtection = csrf();

// Set view engine configuration
app.set('view engine', 'ejs');

// Set views directory path
app.set('views', 'src/views');

/**
 * Middlewares
 */
// Parser (Parsing the incoming request body)
// ! This middleware should always be placed first
app.use(bodyParser.urlencoded({ extended: true }));
// Cookie parser
app.use(cookieParser());

// Access to the public directory path
app.use(express.static(path.join(__dirname, 'public')));

// Configuration of the session setup
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// Initialize flash messages
app.use(flash());

// Initialize CSRF protection
app.use(csrfProtection);

// Initialize user
app.use((req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    const { _id } = req.session.user;

    User.findById(_id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.error(err));
  }
});

// Locals variables available in the rendered views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// 404 Error Page
app.use(getNotFound);

/**
 * Database connexion with Mongoose
 */
mongoose
  .connect(DB_URI, { useNewUrlParser: true })
  .then(response => {
    console.log('Connected');
    // Start the server
    app.listen(3000);
  })
  .catch(err => console.error(err));
