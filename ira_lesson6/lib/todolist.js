var connect = require('./pool-server.js');

var todoList = {
    // Num новостей категории category
    all: function (category, num, callback) {
        connect.getNews(category, num, function(err, rows) {
            if (err)
                throw err;

            //console.log('rows: ' , rows);
            callback(rows);
        });
    },

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
    change: function (id, newTitle, newDescription,  callback) {
        connect.changeNews(id, newTitle, newDescription, function(err, result) {
            if (err)
                throw err;
        });
    },

    // Удаление новости
    delete: function (id, callback) {
        connect.deleteNews(id, function(err, result) {
            if (err)
                throw err;
        });
    }
};


module.exports = todoList;
