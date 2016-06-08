var request = require('request'),
    fs = require('fs');

/**
 * Выбор всех категорий со страницы
 * @param res
 */
var getCategories = function (res) {
    var categories = {}; // объект списка категорий

    request('https://lenta.ru/rss/news', function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            var regex = /(?:<category>)(.+)(?=<\/category>)/mig,
                found = body.match(regex),
                val = '',
                path = 'categories.txt'; // файл с категориями

            try {
                fs.writeFileSync(path, '');
            } catch (err) {
                console.error(err);
            }

            found.forEach(function(v) { // убирается <category>
                val = v.substr('category'.length + 2);
                categories[val] = val; // В объект как его свойства (во избежание дублирования категорий)
            });

            for (var cat in categories) { // Запись в файл списка категорий
                try {
                    fs.appendFileSync(path, cat + '\n');
                } catch (err) {
                    console.log('Ошибка записи в файл ' + err);
                }
            }

            res.render('index', {
                categories: categories
            });
        }
    });
};

module.exports.getCategories = getCategories;

