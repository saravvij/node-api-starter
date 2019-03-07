const mongoose = require('mongoose');
const logger = require('morgan');
const config = require('../config');


// Initialize mongoose connection
const mongoUrl = `mongodb://${config.get('db.host')}:${config.get('db.port')}/${config.get('db.name')}`;
console.log('Connecting to mongdbUrl = ', mongoUrl);

// Connect to DB
mongoose.connect(mongoUrl,{
    useNewUrlParser: true,
    useCreateIndia: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Successfully connected to mongodb'));