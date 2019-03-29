const mongoose = require('mongoose');
const logger = require('../config/logger');
const config = require('../config');


// Initialize mongoose connection
const mongoUrl = `mongodb://${config.get('db.host')}:${config.get('db.port')}/${config.get('db.name')}`;
logger.info(`Connecting to mongodb Url = ${mongoUrl}`);

// Connect to DB
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
});

var db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => logger.info('Successfully connected to mongodb'));