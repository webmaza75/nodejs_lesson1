/**
 * Создать переводчик слов с английского на русский, который будет
 * обрабатывать входящие GET запросы и возвращать ответы,
 * полученные через API Яндекс.Переводчика.
 * Ссылка для получения ключа API Яндекс. Переводчика:
 * http://api.yandex.ru/key/form.xml?service=trnsl
 * Документация API Переводчика:
 * http://api.yandex.ru/translate/doc/dg/reference/translate.xml
 * Пример GET запроса к API:
 * https://translate.yandex.net/api/v1.5/tr.json/translate?key={сюда-подставить-ключ}&lang=ru-en
 *
 * Вариант 1: реализация через команду консоли
 * use node console_translate.js --lang ru-en --text привет
 * use node console_translate.js --lang en-ru --text peace
 */


var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160603T145147Z.c67f521741d3dba0.f271c5f156819d8f7397d34b31ee8189c95f7229',
    argv = require('minimist')(process.argv.slice(2)),
    urlFull,
    request = require('request');

try {
    if (!argv.lang || argv.lang == '') {
        throw ('Язык перевода указан неверно (--lang en-ru --text word) или (--lang ru-en --text слово)');
    }

    if(!argv.text || argv.text == '') {
        throw ('Не указано слово для перевода (--lang en-ru --text word) или (--lang ru-en --text слово)');
    }
} catch (err) {
    console.error(err);
}

urlFull = url + '&lang=' + argv.lang + '&text=' + encodeURIComponent(argv.text); // запрос к серверу

request(urlFull, function (error, response, body) {
    if (error) {
        return console.error('error is: ', error);
    }

    if (response.statusCode != 200) {
        return console.log('incorrect statusCode', response.statusCode);
    }

    console.log(JSON.parse(body).text.toString());
});
