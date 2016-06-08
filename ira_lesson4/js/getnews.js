var request = require('request'),
    fs = require('fs');

/**
 * Получение запрашиваемого количества новостей
 *
 * @param res
 * @param catName запрашиваемая категория
 * @param num запрашиваемое количество новостей
 */
var getNews = function (res, catName, num) {

    request('https://lenta.ru/rss/news', function (error, response, body) {

        if (error) {
            console.log(error)
        } else {

            var regex = /<item>\n.+\n.+<title>(.+)<\/title>\n(.+)\n.+<description>\n(.+)\n.+<\/description>\n.+<pubDate>(.+)<\/pubdate>\n.+\n.+<category>(.+)<\/category>/mig,
                items = body.match(regex),
                reg, // регулярное выражение для внутренних блоков новости (внутри <item>...</item>)
                category, // Текущее название категории рассматриваемой новости
                categories,// Массив категорий, читается из файла
                news = {}, // Одна новость
                arrNews = [], // Массив новостей
                date, // объект даты
                day, // день
                month, // месяц
                path = 'categories.txt'; //сохраненный файл категорий

            for (var iter = 0, count = 0; iter < items.length; iter++) {
                reg = /(?:<category>)(.+)(?=<\/category>)/mig;
                category = (items[iter].match(reg)[0]).substr('category'.length + 2); // Текущая категория

                if (count >= num) { // Набрано запрашиваемое количество новостей
                    break;
                }
                if (category == catName) { // Запрашиваемая категория
                    count++; // Подсчет отобранных новостей

                    // Получение и преобразование даты
                    reg = /(?:<pubdate>)(.+)(?=<\/pubdate>)/mig;
                    date = new Date((items[iter].match(reg))[0].substr('pubDate'.length + 2));
                    day = (+date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
                    month = (+date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
                    news.pubDate = day  + '/' + month + '/' + date.getFullYear();

                    reg = /(?:<title>)(.+)(?=<\/title>)/mig;
                    news.title = (items[iter].match(reg))[0].substr('title'.length + 2); // Получение заголовка новости

                    reg = /<!\[CDATA\[(.+)(?=]]>)/mig;
                    news.description = (items[iter].match(reg))[0].substr(9);

                    arrNews.push(news);
                    news = {};
                }
            }

            try {
                var data = fs.readFileSync(path);
                data = data.toString(); // Считываются категории новостей, сохраненные в файл
            } catch (err) {
                console.error('Ошибка чтения файла');
                //res.send('<a href=/getcategories>Обновить список категорий</a>');
                res.redirect('/getcategories');
            }


            categories = data.split('\n'); // создается массив
            categories.length -=1; // Убирается пустая строка (последний перенос строки)

            res.render('index', {
                news: arrNews, // массив новостей
                categories: categories, // массив категорий
                category: catName, // Выбранная категория
                num: num // Количество запрашиваемых новостей
            });

        }
    });
};

module.exports.getNews = getNews;
