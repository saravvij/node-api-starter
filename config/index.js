const convict = require('convict');

// Schema definition
const config = convict({
    env: {
        doc: "The application environment.",
        format: ["production", "test", "development", "local"],
        default: "local",
        env: "NODE_ENV"
    },
    ip: {
        doc: "The IP address to bind.",
        format: "ipaddress",
        default: "127.0.0.1",
        env: "IP_ADDRESS",
    },
    port: {
        doc: "The port to bind.",
        format: "port",
        default: 3000,
        env: "PORT",
        arg: "port"
    },
    db: {
        host: {
            doc: "Database host name/IP",
            format: 'ipaddress',
            default: '127.0.0.1',
            env: "DB_HOST",
            arg: "dbhost"
        },
        port: {
            doc: "Database port number to bind",
            format: "port",
            default: "27017",
            env: "DB_PORT",
            arg: "dbport"
        },
        name: {
            doc: "Database name",
            format: String,
            default: 'starterdb',
            env: "DB_NAME",
            arg: "dbname"
        },
        user: {
            doc: "Database user name",
            format: String,
            sensitive: true,
            default: "",
            env: "DB_USER",
            arg: "dbuser"
        },
        password: {
            doc: "Database password",
            format: String,
            sensitive: true,
            default: "",
            env: "DB_PASSWORD",
            arg: "dbpassword"
        }
    }
});

// Load environment dependent configuration
const env = config.get('env');
config.loadFile('./config/' + env + '.json');

// Perform validation
config.validate({
    allowed: 'strict'
});
module.exports = config;