/**
 * Node Core Modules import
 */
const path = require('path');
const fs = require('fs');

/**
 * NPM import
 */
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const connectMongodbSession = require('connect-mongodb-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const uuidV4 = require('uuid/v4');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

/**
 * Local import
 */
// Models
const User = require('./models/user');
// Controllers middleware functions
const { get404, get500 } = require('./controllers/error');
// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

/**
 * Code
 */
// Environment variables
dotenv.config();

// Init express
const app = express();

// Database environment variables
const {
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_DEFAULT_DATABASE,
} = process.env;

// Database URI
const DB_URI = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@node-js-qfuuy.mongodb.net/${MONGO_DB_DEFAULT_DATABASE}?retryWrites=true`;

// MongoDB Session Storage
const MongodbSession = connectMongodbSession(session);

const store = new MongodbSession({
  uri: DB_URI,
  collections: 'sessions',
});

// CSRF protection
const csrfProtection = csrf();

// Multer file storage
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const fileName = `${uuidV4()}-${file.originalname}`;
    callback(null, fileName);
  },
});

// Multer file filter
const fileFilter = (req, file, callback) => {
  if (
    // Types
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    // Accept
    callback(null, true);
  } else {
    // Reject
    callback(null, false);
  }
};

// Set view engine configuration
app.set('view engine', 'ejs');
// Set views directory path
app.set('views', 'views');

// Create a write stream for morgan (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

// Helmet initilization (Secure http response header)
app.use(helmet());
// NodeJS assets compression middleware
app.use(compression());
// Morgan HTTP request logger middleware
app.use(morgan('combined', { stream: accessLogStream }));

/**
 * Middlewares
 */
// Parser (Parsing the incoming request body)
// ! This middleware should always be placed first
app.use(bodyParser.urlencoded({ extended: true }));
// Cookie parser
app.use(cookieParser());
// Initialize Multer File upload
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));

// Access to the public directory path
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

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

// Locals variables available in the rendered views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Initialize user
app.use((req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    const { _id } = req.session.user;

    User.findById(_id)
      .then(user => {
        if (!user) {
          return next();
        }
        req.user = user;
        return next();
      })
      .catch(err => {
        // Outside ASYNC, in SYNC you can throw an error
        // Inside ASYNC, need to call next to throw an error
        // Otherwise Express will not detect it
        next(new Error(err));
      });
  }
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// 500 Error Page
app.get('/500', get500);

// 404 Error Page
app.use(get404);

// Error Handling
app.use((error, req, res, next) => {
  res.status(500).render('error/500', {
    pageTitle: 'Error occured',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

/**
 * Database connexion with Mongoose
 */
mongoose
  .connect(DB_URI, { useNewUrlParser: true })
  .then(response => {
    console.log('Connected');
    // Start the server
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => console.error(err));
