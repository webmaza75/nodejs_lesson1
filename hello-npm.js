var	ansi = require('ansi');
var	cursor = ansi(process.stdout);
cursor
    .red()                 // Красный шрифт в консоли
    .bg.grey()             // Серый фон под текстом
    .write('Hello World!'); // Вывод сообщения в консоль
cursor.beep();
cursor.reset(); // сброс настроек курсора в консоли
