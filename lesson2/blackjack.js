/**
 * Консольная игра Blackjack. В качестве аргумента
 * программа может принимать имя файла для логирования результатов каждой партии.
 *
 * use node blackjack.js --path scorebj.txt
 */
var fs = require('fs'),
    readline = require('readline'),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    start = false, // Новая игра не началась
    argv = require('minimist')(process.argv.slice(2)),
    // Колода карт
    arr = ['2Ч', '2Т', '2Б', '2П',
        '3Ч', '3Т', '3Б', '3П',
        '4Ч', '4Т', '4Б', '4П',
        '5Ч', '5Т', '5Б', '5П',
        '6Ч', '6Т', '6Б', '6П',
        '7Ч', '7Т', '7Б', '7П',
        '8Ч', '8Т', '8Б', '8П',
        '9Ч', '9Т', '9Б', '9П',
        '10Ч', '10Т', '10Б', '10П',
        'ВлЧ', 'ВлТ', 'ВлБ', 'ВлП',
        'ДамаЧ', 'ДамаТ', 'ДамаБ', 'ДамаП',
        'КрЧ', 'КрТ', 'КрБ', 'КрП',
        'ТузЧ', 'ТузТ', 'ТузБ', 'ТузП'],
    Player = {
        card: [], // карты игрока
        totalSum: 0, // сумма набранных очков
        win: 0, // 1 - победа, 1 - поражение
        addCard: function(el) { // игрок берет карту
            this.card.push(el);
            if ((/^[вдк]/i).test(el)) { // валет, дама, король
                el = 10;
            } else if ((/^[т]/i).test(el)) { // туз
                if (this.totalSum + 11 <= 21) {
                    el = 11;
                } else {
                    el = 1;
                }
            } else {
                el = parseInt(el); // 2-10
            }
            this.totalSum += el; // подсчет суммы очков
        },
        getCards: function() { // вывод
            return this.card.join(', ') + ' (' + this.totalSum + ' очков)';
        }
    },
    Diler = {
        card: [], // карты дилера
        win: 0, // 1 - победа, 1 - поражение
        totalSum: 0 // сумма набранных очков
    };

/**
 * Игровой процесс
 */
try {
    if (!argv.path || argv.path == '') {
        throw ('Путь к файлу логов указан неверно (--path scorebj.txt)');
    }

// Перемешивание колоды
    arr.sort(function (a, b) {
        return Math.random() - 0.5;
    });

    console.log('Карту? (y, n)');
    rl.on('line', function (answer) {
        if ('y' == answer || 'Y' == answer) {
            Player.addCard(arr.pop());
            console.log(Player.getCards());
            start = true;
        } else {
            if (start == false) {
                console.log('Game over');
                rl.close();
            } else {
                var winner;

                while (Diler.totalSum < 15) {
                    Player.addCard.call(Diler, arr.pop());
                }

                if (Player.totalSum > Diler.totalSum && Player.totalSum <= 21) {
                    Player.win++;
                    winner = '1:0 You won!';
                } else if (Player.totalSum < Diler.totalSum && Diler.totalSum <= 21) {
                    winner = '0:1 You lost!';
                    Diler.win++;
                } else if (Player.totalSum > 21) {
                    Diler.win++;
                    winner = '0:1 You lost!';
                } else if (Player.totalSum == Diler.totalSum) {
                    winner = '0:0 Drawn game!';
                } else {
                    Player.win++;
                    winner = '1:0 You won!';
                }
                console.log('Ваши карты: ' + Player.getCards());
                console.log('Карты дилера: ' + Player.getCards.call(Diler));
                console.log(winner + ' Общий счет: ' + Player.win + '(вы) : ' + Diler.win + ' (дилер)');

                /* Не понимаю, как бросить исключение при синхронном варианте записи в файл, т.к. ф-ция всегда возвращает undefined
                if (!fs.appendFileSync(argv['path'], winner + '\n')) {
                    throw ('Ошибка записи в файл');
                }
                */
                // Запись в файл итога игры
                fs.appendFile(argv['path'], winner + '\n', function (err) {
                    if (err) { throw ('Ошибка записи в файл ' + err);}

                });

                // Обнуление карт и суммы очков у игрока и дилера
                Player.card = [];
                Player.totalSum = 0;
                Diler.card = [];
                Diler.totalSum = 0;
                start = false; // Партия окончена
                console.log('Карту? (y, n)');
            }
        }
    });
} catch (err) {
    console.error(err);
}
