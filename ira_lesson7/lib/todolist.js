var connect = require('./pool-server.js');

var todoList = {
    // Num новостей категории category
    all: function (category, num, callback) {
        num = Number(num);
        connect.getNews(category, num, function(err, rows) {
            if (err)
                throw err;

            callback(rows);
        });
    },
    // Одна новость
    one: function (id, callback) {
        connect.getOneNews(id, function(err, rows) {
            if (err)
                throw err;

            callback(rows);
        });
    },
    // Все категории новостей
    allcats: function (callback) {

        connect.getCats(function (err, rows) {
            if (err)
                throw err;

            callback(rows);
        });
    },
    // Добавление новости
    add: function (data, callback) {
        connect.addNews(data, function(err, result) {
            if (err)
                throw err;
        });
    },

    // Изменение новости
    change: function (id, data, callback) {
        connect.changeNews(id, data, function(err, result) {
            if (err)
                throw err;
            callback(result.changedRows);
        });
    },

    // Удаление новости
    delete: function (id, callback) {
        connect.deleteNews(id, function(err, result) {
            if (err)
                throw err;
            //callback(result.affectedRows);
        });
    }
};


module.exports = todoList;
