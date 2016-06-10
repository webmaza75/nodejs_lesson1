var express = require('express'),
    bodyParser = require('body-parser'),
    template = require('consolidate').handlebars,
    Handlebars = require('handlebars'),
    app = express(),
    PORT = 7777,
    parserNews = require('./lib/getnews'),
    cookieParser = require('cookie-parser');
    //parseXML = require('xml2js').parseString;

// Сравнение двух значений для указания selected выбранного элемента <option> списка категорий
Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 == v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

// Определяем обработчик шаблонов
app.engine('hbs', template);

// Устанавливаем переменные для обработки шаблонов
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


// Разбираем application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({extended: false}),
    cookieParser()
);

app.get('/', function (req, res) {
    parserNews.getNews(res, (req.cookies.category || 'Россия'), (req.cookies.num || 1));
});

// Обработка POST запроса
app.post('/', function (req, res) {
    parserNews.getNews(res, req.body.categories, req.body.num);

    // Создание COOKIE
    var now = new Date();
    now.setTime(now.getTime() + 2000000);

    // Запись COOKIE
    res.append('Set-Cookie', 'category=' + encodeURIComponent(req.body.categories) + '; Path=/; HttpOnly; expires=' + now.toGMTString());
    res.append('Set-Cookie', 'num=' + req.body.num + '; Path=/; HttpOnly; expires=' + now.toGMTString());
});

app.listen(PORT, function () {
    console.log('Server was running on: ', PORT);
});