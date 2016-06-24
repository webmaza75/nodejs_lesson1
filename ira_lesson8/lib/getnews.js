var request = require('request'),
    todoList = require('./todolist.js');

/**
 * Получение запрашиваемого количества новостей
 */
var getNews = function (callback) {

    request('https://lenta.ru/rss/news', function (error, response, body) {

        if (error) {
            throw error;
        } else {

            var regex = /<item>\n.+\n.+<title>(.+)<\/title>\n.+<link>(.+)<\/link>\n.+<description>\n(.+)\n.+<\/description>\n.+<pubDate>(.+)<\/pubdate>\n.+\n.+<category>(.+)<\/category>/mig,
                items = body.match(regex),
                reg, // регулярное выражение для внутренних блоков новости (внутри <item>...</item>)
                category, // Текущее название категории рассматриваемой новости
                categories = {},
                news = {}; // Одна новость

            for (var iter = 0; iter < items.length; iter++) {
                reg = /(?:<category>)(.+)(?=<\/category>)/mig;
                category = (items[iter].match(reg)[0]).substr('category'.length + 2); // Текущая категория
                news.category = category;
                //categories[category] = category;

                // Получение даты
                reg = /(?:<pubdate>)(.+)(?=<\/pubdate>)/mig;
                news.pub_date = new Date((items[iter].match(reg))[0].substr('pubDate'.length + 2));

                reg = /(?:<title>)(.+)(?=<\/title>)/mig;
                news.title = (items[iter].match(reg))[0].substr('title'.length + 2); // Получение заголовка новости

                reg = /<!\[CDATA\[(.+)(?=]]>)/mig;
                news.description = (items[iter].match(reg))[0].substr(9);

                //reg = /(?:<link>)(.+)(?=<\/link>)/mig;
                //news.title = (items[iter].match(reg))[0].substr('link'.length + 2);

                todoList.add(news);
                news = {};
            }
            callback('/admin/news');
        }
    });
};

module.exports.getNews = getNews;
