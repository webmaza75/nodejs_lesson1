/**
 * Сделать программу-анализатор игровых логов. В качестве
 * аргумента программа получает путь к файлу. Выведите игровую
 * статистику: общее количество партий, количество выигранных / проигранных партий и их соотношение,
 * максимальное число побед / проигрышей подряд.
 *
 * use node loganalyser.js --path scorebj.txt
 */
try {
    var fs = require('fs'),
        argv = require('minimist')(process.argv.slice(2));

        if (!argv.path || argv.path == '') {
            throw ('Путь к файлу логов указан неверно (--path scorebj.txt)');
        }

    var result = {
            winPlayer: 0, // общее число побед
            winDiler: 0, // общее число проигрышей
            win: 0,  // временный счетчик побед
            lost: 0, // временный счетчик поражений (т.к. возможна и ничья)
            totalGames: 0, // всего партий
            maxWinInline: 0, // max побед подряд
            maxLostInline: 0, // max поражений подряд
            ratio: function() { // соотношение побед / проигрышей
                if (this.winDiler == 0) { // исключение деления на 0
                    return 1;
                }
                return this.winPlayer / this.winDiler;
            }
        },
        data = fs.readFileSync(argv.path), // чтение содержимого файла
        regex = /[0-1]:[0-1]/g, // регулярное выражение поиска вариантов: 0:1 0:0 1:0
        matches; // массив всех найденных совпадений


    if (!data) {
        throw('Ошибка чтения файла');
    }

    matches = data.toString().match(regex); // пойманы все совпадения

    matches.forEach(function (v) {
        result.totalGames++; // общее число игр независимо от результата

        if (v[0] == 0 && v[2] == 1) { // явный проигрыш (исключается ничья)
            ++result.winDiler;
            result.lost++;
            result.win = 0;
            result.maxLostInline = (result.lost > result.maxLostInline) ? result.lost : result.maxLostInline;
        } else if (v[0] == 1 && v[2] == 0) { // явная победа (исключается ничья)
            ++result.winPlayer;
            result.win++;
            result.lost = 0;
            result.maxWinInline = (result.win > result.maxWinInline) ? result.win : result.maxWinInline;
        }
    });
} catch (err) {
    console.log(err);
}
console.log('Количество партий: ' + result.totalGames);
console.log('Всего выиграно/проиграно: ' + result.winPlayer + ' / ' + result.winDiler);
console.log('Соотношение победы/проигрыши: ' + result.ratio().toFixed(2));
console.log('Максимальное число побед/проигрышей подряд: ' + + result.maxWinInline + ' / ' + result.maxLostInline);


