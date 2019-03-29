const appRoot = require('app-root-path');
const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    combine,
    timestamp,
    label,
    prettyPrint
} = format;

/**
 * Define the configuration settings for the file and console transports in the winston
 */
const options = {

    default: {
        level: 'info',
        format: format.json(),
        defaultMeta: {
            service: 'user-service'
        }
    },

    combinedFile: {
        level: 'info',
        filename: `${appRoot}/logs/combined.log`,
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },

    errorFile: {
        level: 'error',
        filename: `${appRoot}/logs/error.log`,
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },

    console: {
        level: 'debug',
        handleExceptions: true,
        format: format.combine(
            format.colorize(),
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
        colorize: true,
    },
};

/**
 *  Instantiate a new winston logger with file and console transports
 *  using the properties defined in the options variable:
 */
const logger = createLogger({
    level: options.default.level,
    defaultMeta: options.default.defaultMeta,
    format: options.default.simple,
    transports: [
        new transports.File(options.combinedFile),
        new transports.File(options.errorFile)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console(options.console));
}

/**
 * By default, morgan outputs to the console only, so let's define a stream function that will be able to get morgan-generated output into the winston log files. 
 * We will use the info level so the output will be picked up by both transports (file and console):
 */
logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;