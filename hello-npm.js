var	ansi = require('ansi'),
    cursor = ansi(process.stdout);
cursor
    .red()                 // Красный шрифт в консоли
    .bg.grey()             // Серый фон под текстом
    .write('Hello World!'); // Вывод сообщения в консоль
cursor.beep();
