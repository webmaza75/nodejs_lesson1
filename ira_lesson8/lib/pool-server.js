// Использование пула соединений
var mysql = require('mysql'),
    config = require('./config.js'),
    pool = mysql.createPool(config.connect()),
    result;

var action = {

    getNews: function (category, num, callback) {
    pool.getConnection(function (err, connection) {
        if (err)
            throw err;
        connection.query('select * from news where category = ? order by pub_date desc limit ?;', [category, num = parseInt(num)], callback);
        connection.release();
        });
    },

    getOneNews: function (id, callback) {
        pool.getConnection(function (err, connection) {
            if (err)
                throw err;

            connection.query('select * from news where id = ? ;', [id], callback);
            connection.release();
        });
    },

    getCats: function (callback) {
        pool.getConnection(function (err, connection) {
            if (err)
                throw err;

            connection.query('select distinct category from news;', callback);
            connection.release();
        });
    },

    addNews: function (data, callback) {
        pool.getConnection(function (err, connection) {
            if (err)
                throw err;

            connection.query('insert into news set ?;', data, callback);
            connection.release();
        });
    },

    changeNews: function (data, callback) {
        var id = data.id;
        delete data.id;
        pool.getConnection(function (err, connection) {
            if (err)
                throw err;

            connection.query('update news set ? where id = ?;', [data, id], callback);
            connection.release();
        });
    },

    deleteNews: function (id, callback) {
        pool.getConnection(function (err, connection) {
            if (err)
                throw err;

            connection.query('delete from news where ?;', {id: id}, callback);
            connection.release();
        });
    }
};

module.exports = action;
