//require the library
const mongoose = require('mongoose');

//import { connect, connection } from 'mongoose';

//if faild to connect


//connect to databas
//mongoose.connect('mongodb://localhost/user_db');
mongoose.connect('mongodb://127.0.0.1:27017/user_db', { useNewUrlParser: true })


const db = mongoose.connection;
//console.log(db);

db.on('error', console.error.bind(console, 'error connecting to db'));

db.once('open', function() {
    console.log('sucessfully connected to the databases');
});
module.exports = db;

// exports.user_db = function(req, res) {
//     res.render('user_db');
// };