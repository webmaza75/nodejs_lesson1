// Использование пула соединений
var mysql = require('mysql'),
    config = require('./config.js'),
    pool = mysql.createPool(config.connect());

var action = {

    getTasks: function (callback) {
    pool.getConnection(function (err, connection) {
            if (err)
                throw err;

            connection.query('select * from todos;', callback);
            connection.release();
        });
    },

    addTask: function (text, callback) {
        pool.getConnection(function (err, connection) {
            if (err)
                throw err;

            connection.query('insert into todos set ?;', {text: text}, callback);
            connection.release();
        });
    },

    changeTask: function (id, newText, callback) {
        pool.getConnection(function (err, connection) {
            if (err)
                throw err;

            connection.query('update todos set text = ? where id = ?;', [newText, id], callback);
            connection.release();
        });
    },

    completeTask: function (id, callback) {
        pool.getConnection(function (err, connection) {
            if (err)
                throw err;


            connection.query('update todos set completed = 1 where id = ?;', [id], callback);
            connection.release();
        });
    },

    deleteTask: function (id, callback) {
        pool.getConnection(function (err, connection) {
            if (err)
                throw err;

            connection.query('delete from todos where ?;', {id: id}, callback);
            connection.release();
        });
    },

    setPriorityTask: function (id, priority, callback) {
        pool.getConnection(function (err, connection) {
            if (err)
                throw err;

            connection.query('update todos set priority = ? where id = ?;', [priority, id], callback);
            connection.release();
        });

    }
};


module.exports = action;
