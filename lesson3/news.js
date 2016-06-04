/**
 * 1. Создать программу для получения информации о последних новостях
 * с выбранного вами сайта в структурированном виде
 *
 * use localhost:7777 // for url
 */
var request = require('request'),
    cheerio = require('cheerio'),
    http = require('http'),
    PORT = 7777;

request('https://news.yandex.ru/', function (error, response, html) {
    if(error) {
        return console.error('error is: ', error);
    }

    if (response.statusCode != 200) {
        return console.log('incorrect statusCode', response.statusCode);
    }

    var $ = cheerio.load(html),
        str = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Все новости</title></head><body>',
        doNumber = (function() {var count = 0; return function() {return ++count;}})(); // счетчик новостей


    /**
     * Только заголовок и краткий контент новостей для консоли (упрощенный вариант)
     */
    //$('.rubric .story__content').each(function (i, el) { // Главная рубрика новостей
    //    var title = $(el).find('a').text().trim(),
    //        text = $(el).find('.story__text').text().trim();
    //    if ('' != text) {
    //        console.log((i + 1) + '). ' + title); // Заголовок
    //        console.log(text + '\n'); // Краткий текст новости
    //
    //        doPage(title, text);
    //    }
    //});

    /**
     * Попытка выводить Названия рубрик + сопутствующие новостям картинки
     */
    $('.rubric').each(function (i, el) { // Главная рубрика новостей
        var rubric = $(el).find('.title > a').text().trim(),
            img,
            title,
            text;

        $(el).find('.story').each(function (j, elem) {
            rubric = (!rubric) ? 'Главные новости' : rubric;
            img = $(elem).find('img');
            title = $(elem).find('.story__content a').text().trim();
            text = $(elem).find('.story__text').text().trim();

            if ('' != text) {

                console.log(doNumber() + '). ' + title); // Заголовок
                console.log(text + '\n'); // Краткий текст новости

                doPage(rubric, title, text, img); // для страницы в формате html (localhost:7777)
            }
        });
    });

    str += '</body></html>';

    // Формирование html-страницы
    function doPage(rubric, title, text, img) {
         return str += '<h3>' + title + ' (' + rubric + ')</h3>' + img + '<p>' + text + '</p>';
    }

    var serv = function (req, res) {
        req = '/news.js';

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(str);
        res.end();
    };
    http.createServer(serv).listen(PORT, function(){
        console.log(PORT);
    });
});
