/**
 * Node Core Modules import
 */
import path from 'path';

/**
 * NPM import
 */
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

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

/**
 * Code
 */
// Environment variables
dotenv.config();

// Init express
const app = express();

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

// Access to the public directory path
app.use(express.static(path.join(__dirname, 'public')));

// Store the user in request
app.use((req, res, next) => {
  User.findById('5cd029b66b5435204cdeb87c')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.error(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 Error Page
app.use(getNotFound);

/**
 * Database connexion with Mongoose
 */
// Database password
const dbPassword = process.env.DB_PASSWORD;

mongoose
  .connect(
    `mongodb+srv://maclaude:${dbPassword}@node-js-qfuuy.mongodb.net/shop?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(result => {
    console.log('Connected');

    User.findOne()
      .then(user => {
        if (!user) {
          // Creation of a new user
          const newUser = new User({
            name: 'Marc-Antoine',
            email: 'test@test.com',
            cart: {
              items: [],
            },
          });
          newUser.save();
        }
        // Start the server
        app.listen(3000);
      })
      .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
