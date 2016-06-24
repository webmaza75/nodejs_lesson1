todoList = require('./todolist.js');
// Показ новостей в разных шаблонах
var news = {
    showAllCats: function (data, callback1, callback2) { // список новостей

        // Показ всех категорий для select
        todoList.allcats(function (rows) {
            callback1(rows);
        });

        // Показ новостей по выбранной категории с лимитом = num
        todoList.all(data.category, data.num, function (news) {
            callback2(news);
        });
    },

    showArticle: function (id, callback1) { // одна новость
        // Показ новостей по выбранной категории с лимитом = num
        todoList.one(id, function(rows) {
            callback1(rows[0]);
        });
    },
    changeArticle: function(data, callback) { // новость для редактирования
        todoList.change(data, function(rows) {
            callback(rows);
        });
    }
};

module.exports = news;
