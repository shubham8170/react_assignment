// disabling the unwanted eslint errors for this file :-

// importing packages, libraries & functions :-
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const {connectSocket} = require('./controllers/chat/socket');

const app = express();
const cors = require('cors');
const mongoDb = require('./db/dbConfig');
const routes = require('./routers/index');
const { responseMessages, sendResponse } = require('./utils/response');

// using cors :-
const corsOptions = {
    origin: '*',
    exposedHeaders: 'Authorization',
};
app.use(session({
    secret: 'xxyyagfaas',
    resave: true,
    saveUninitialized: true
}));
console.log({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
});
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
        },
        (accessToken, refreshToken, profile, done) => {
            // This callback function is called when the user is authenticated.
            // You can add your custom logic here to save the user's profile or perform other actions.
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// using cors and also allowing some types of requests to the server :-
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'),
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'),
        res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// home route :-
app.get('/', (req, res) => sendResponse(responseMessages.HOME_PAGE, 200, res));
// using all the routes :-
app.use('/api', routes);
app.get('/api/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// defining port :-
const port = process.env.PORT || 8080;
// app.listen(port, () => console.log(`Listing on port ${port}..`));
// const server = app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });



const startServer = async () => {
    try {

        // Create an instance of the Express app
        const server = app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });

        // Start socket connection
        // await connectSocket(server);
    } catch (err) {
        console.error('Failed to start the server:', err);
    }
};

// Start the server :-
startServer();

