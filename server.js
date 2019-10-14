const Sequelize = require('sequelize');

const connection = new Sequelize('nodeassignment', 'root', 'root', {
    dialect: 'mysql'
})

const User = connection.define('User', {
    Name: Sequelize.STRING,
    Email: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    Company: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    DOB: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    Password: Sequelize.STRING
}, {
    timestamps: false
});

const band = connection.define('bands', {
    Title: Sequelize.STRING,
    Description: Sequelize.STRING
});

connection.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


connection.sync({
        logging: console.log,
        // force: true
    })
    .then(() => {
        console.log('Connection to database established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

User.hasMany(band); //1 :1 relationship Between
module.exports = {
    connection,
    User,
    band
}