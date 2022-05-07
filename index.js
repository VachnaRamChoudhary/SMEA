const express = require('express');
const env = require('./config/environment');
const cors = require('cors')
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 8000;

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');

const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
// const MongoStore = require('connect-mongodb-session')(session);

const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');

const customMware = require('./config/middleware')


// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
//chatServer.listen();
console.log('chat server is listening on port 5000');



app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));


app.use(cors())
app.use(express.urlencoded());
//setting cookie parser
app.use(cookieParser());

app.use(express.static('./assets'));

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// extract style and scripts from sub pages into the layouts

app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




//set up our view engine
app.set('view engine', 'ejs');
app.set('views', './views');


//mongo Store used to store the session cookie
app.use(session({
    name: 'SMEA',
    //TO DO change the secret
    secret: 'blansomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
            mongoUrl: 'mongodb://127.0.0.1:27017/SMEA',
            //mongoUrl: 'mongodb+srv://vachnaram:ejkCz467C8X15ZaX@cluster0.rvepl.mongodb.net/SMEA?retryWrites=true&w=majority',
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err) {
            console.log(err || 'connect-mongoodb setup-ok');
        })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes/index'));

app.listen(port, function(err) {
    if (err)
        console.log(`Error is in running the server: ${err}`);
    else
        console.log(`Server is running on port:${port}`);
    return;
});