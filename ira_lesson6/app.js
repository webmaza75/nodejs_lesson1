/**
 * Отображение в отдельном окне новости и возможность ее редактирования,
 * а также переход на несуществующую страницу пока не реализованы
 */

var app = require('express')(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('cookie-session'),
    passport = require('passport'),
    VKontakteStrategy = require('passport-vkontakte').Strategy,
    parserNews = require('./lib/getnews'), // новости из файла rss автоматически добавляются в БД
    twig = require('twig'), // шаблонизатор
    PORT = 3000,
    isLogged = require('connect-ensure-login').ensureLoggedIn(), // авторизованный пользователь
    todoList = require('./lib/todolist.js');


passport.use(new VKontakteStrategy({
        clientID:     '5506996', // VK.com docs call it 'API ID'
        clientSecret: 'tyOvJpQzJTy3FsVAGPyO',
        callbackURL:  'http://localhost:3000/auth/vkontakte/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

app.use(cookieParser()); // req.cookies
app.use(session({keys: ['key']})); // req.session
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'twig');
app.set('view options', { layout: false });
app.set('views', __dirname + '/views');

// This section is optional and used to configure twig.
app.set('twig options', {
    strict_variables: false
});

// Разбираем application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({extended: false}),
    cookieParser()
);

app.get('/auth/vkontakte',
    passport.authenticate('vkontakte'),
    function(req, res){
    });

app.get('/auth/vkontakte/callback',
    passport.authenticate('vkontakte', { failureRedirect: '/login'}),
    function(req, res) {
        res.redirect('/');
    });

// Метод сохранения данных пользователя в сессии
passport.serializeUser(function (profile, done) {
    done(null, profile);
});

// Метод извлечения данных пользователя из сессии
passport.deserializeUser(function (profile, done) {
    done(null, profile);
});

// Главная страница для авторизованного пользователя
app.get('/', isLogged, function (req, res) {
    req.session.category = req.session.category || req.body.categories;
    req.session.num = req.session.num || req.body.num;
    showNews(res, req, 'index');
});

// Показ новостей в разных шаблонах
function showNews(res, req, templateName) {
    function tryRender() {
        if (typeof res.categories != 'undefined' && typeof res.news != 'undefined') {

            res.render(templateName, {
                news: res.news,
                category: (req.session.category || 'Россия'),
                num: (req.session.num || 2),
                username: req.user.displayName,
                categories: res.categories
            });
        }
    }

    // Показ всех категорий для select
    todoList.allcats(function(rows) {
        res.categories = rows;
        tryRender();
    });

    // Показ новостей по выбранной категории с лимитом = num
    todoList.all((req.session.category || 'Россия'), (req.session.num || 2), function(rows) {
        res.news = rows;
        tryRender();
    });
}

// Обработка POST запроса для главной страницы
app.post('/', isLogged, function (req, res) {
    req.session.category = req.body.categories;
    req.session.num = req.body.num;
    req.sessionOptions.maxAge = 10 * 24 * 60 * 60;

    showNews(res, req, 'index');
});

// Админ-панель, показ списка новостей
app.get('/admin/all', isLogged, function (req, res) {
    req.session.category = req.session.category || req.body.categories;
    req.session.num = req.session.num || req.body.num;
    showNews(res, req, 'all');
});

// Выбор категории и количества новостей в Админ-панели
app.post('/admin/all', isLogged, function (req, res) {
    req.session.category = req.body.categories;
    req.session.num = req.body.num;
    showNews(res, req, 'all');
});

// Страница авторизации через соц.сеть VK
app.get('/login', function (req, res) {
    req.sessionOptions.maxAge = 10 * 24 * 60 * 60;

    res
        .status(200)
        .send(
        '<h1>Авторизация через VKontakte</h1>' +
        '<form action="/auth/vkontakte" method="get">' +
        '<br />' +
        '<input type="submit" value="Авторизоваться"/>' +
        '</form>');
});

// Очищаем данные о пользователе и переходим на страницу с логином
app.get('/logout', isLogged, function (req, res) {
    req.logout();
    //req.session = null;
    res.redirect('/login');
});

// Автоматическое добавление новостей из rss файла в БД
app.get('/admin/add', isLogged, function (req, res) {
    parserNews.getNews(res);
});

// Удаление новости из БД (Админ-панель)
app.get('/admin/delete/:id', isLogged, function (req, res) {
    todoList.delete(req.params.id);
    res.redirect('/admin/all');
});

app.listen(PORT, function () {
    console.log('The application was launched on ' + PORT);
});