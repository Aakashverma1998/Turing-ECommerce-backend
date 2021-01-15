module.exports = require('knex')({
    client: 'mysql',
    connection: {
        host : 'localhost',
        user : 'root',
        password : 'banner',
        database : 'turing'
    }
},console.log('database connected.......'));