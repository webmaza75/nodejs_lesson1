/**
 * Задание 2 находится в файле console_translate.js
 *
 * Вариант 2: Реализация через web-интерфейс
 *
 * node html_translate.js
 */

var req = require('request'),
    http = require('http'),
    url = require('url'),
    querystring = require('querystring'),
    PORT = 3333,
    lang = ['en-ru', 'ru-en']; // массив направлений перевода для select

// Страница с формой для клиента
function doPage(lang, textBefore, textAfter) {
    str = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Yandex переводчик</title></head><body>' +
        '<h3>Перевод: ' + (textBefore || '') + ' = ' + (textAfter || '') + '</h3>' +
        '<form method="get" action="/post">';

    return str += '<select name="lang">' +
        '<option value="'+ lang[0] +'">с английского на русский</option>' +
        '<option value="'+ lang[1] +'">с русского на английский</option>' +
    '</select><br><br>' +
        '<input name="text" type="text"><br><br>' +
        '<input type="submit" value="Перевести"></form></body></html>';
}

// Разбор url (строка параметров)
var qry = function(requrl){
    return url.parse(requrl, true).query;
};

// Формирование и отправка запроса на сторонний сервер для перевода
function sendReq(lg, text, response) {
    var fullUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?' + querystring.stringify({
            key: 'trnsl.1.1.20160603T145147Z.c67f521741d3dba0.f271c5f156819d8f7397d34b31ee8189c95f7229',
            lang: lg, // Направление перевода
            text: text // Текст перевода
        });
    req(fullUrl,
        function (error, res, html) {
            if (error) {
                console.log(error);
            } else {
                response.writeHead(200, {'Content-Type': 'text/html'}); // Ответ пользователю
                response.write(doPage(lang, text, JSON.parse(html).text.toString())); // Форма с результатом ответа
                response.end();
            }
        }
    );
}

// Создание сервера
var serv = function (req, res) {
    // Разбор url (у формы /post)
    switch (req.url.substring(1,5)) {
        case 'post' :
            var text = qry(req.url).text;
            if (text) {
                sendReq(qry(req.url).lang, text, res); // Отправка запроса на сервер переводчика
            } else { // если не введена фраза для перевода
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(doPage(lang, '', 'Введите слово для перевода'));
                res.end();
            }
            break;
        default: // отображение пустой формы
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(doPage(lang, '', ''));
            res.end();
    }
};
http.createServer(serv).listen(PORT, function(){
    console.log(PORT);
});
