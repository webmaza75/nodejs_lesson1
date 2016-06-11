// Пример модуля для обработки задач
var connect = require('./pool-server.js');

var todoList = {
    // Получение всех задач
    list: function (callback) {
        connect.getTasks(function(err, rows) {
            if (err)
                throw err;

            console.log('rows: ' , rows);
        });
    },

    // Добавить задачу
    add: function (text, callback) {
        connect.addTask(text, function(err, result) {
            if (err)
                throw err;
            console.log('inserted ' + result.insertId + ' id');
        });
    },

    // Изменить описание задачи
    change: function (id, newText, callback) {
        connect.changeTask(id, newText, function(err, result) {
            if (err)
                throw err;
            console.log('changed ' + result.changedRows + ' rows');
        });
    },

    // Отметить задачу как сделанную
    complete: function (id, callback) {
        connect.completeTask(id, function(err, result) {
            if (err)
                throw err;
            console.log('changed ' + result.changedRows + ' rows');
        });
    },

    // Удаление задачи
    delete: function (id, callback) {
        connect.deleteTask(id, function(err, result) {
            if (err)
                throw err;
            console.log('deleted ' + result.affectedRows + ' rows');
        });
    },
    setPriority: function (id, priority, callback) {
        connect.setPriorityTask(id, priority, function(err, result) {
            if (err)
                throw err;
            console.log('changed ' + result.changedRows + ' rows');
        });
    }
};


module.exports = todoList;
