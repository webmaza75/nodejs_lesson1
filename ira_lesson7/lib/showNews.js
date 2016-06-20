todoList = require('./todolist.js');
// Показ новостей в разных шаблонах
var news = {
    showAllCats: function (req, res, templateName) { // список новостей
        function tryRender() {
            if (typeof res.categories != 'undefined' && typeof res.news != 'undefined') {
                var username = req.user ? req.user.displayName : '';
                res.render(templateName, {
                    news: res.news,
                    category: (req.session.category || 'Россия'),
                    num: (req.session.num || 2),
                    username: username,
                    categories: res.categories
                });
            }
        }

        // Показ всех категорий для select
        todoList.allcats(function (rows) {
            res.categories = rows;
            tryRender();
        });

        // Показ новостей по выбранной категории с лимитом = num
        todoList.all((req.session.category || 'Россия'), (req.session.num || 2), function (rows) {
            res.news = rows;
            tryRender();
        });
    },

    showArticle: function (req, res, templateName) { // одна новость
        function tryRenderOne() {
            if (typeof res.article != 'undefined') {

                res.render(templateName, {
                    article: res.article,
                    username: req.user.displayName
                });
            }
        }

        // Показ новостей по выбранной категории с лимитом = num
        todoList.one((req.params.id), function(rows) {
            res.article = rows[0];
            tryRenderOne();
        });
    },
    changeArticle: function(id, data) { // новость для редактирования
        todoList.change(id, data, function(rows) {
            return rows;
        });
    }
};

module.exports = news;
