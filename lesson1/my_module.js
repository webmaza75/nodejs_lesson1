function colored() {
    var colors = require('ansi-colors');
    return colors.bggreen('Мне') + '  ' + colors.bgyellow('нравится') + '  ' + colors.magenta('JavaScript');
}

module.exports.colored = colored;