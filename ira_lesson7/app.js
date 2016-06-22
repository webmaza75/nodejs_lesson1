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
    todoList = require('./lib/todolist.js'),
    news = require('./lib/showNews.js');


passport.use(new VKontakteStrategy(
    {
        clientID:     '5511847', // VK.com docs call it 'API ID'
        clientSecret: 'aLvWjPOUPYi29ewoYWw0',
        callbackURL:  'http://localhost:3000/auth/vkontakte/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

// Метод сохранения данных пользователя в сессии
passport.serializeUser(function (profile, done) {
    done(null, profile);
});

// Метод извлечения данных пользователя из сессии
passport.deserializeUser(function (profile, done) {
    done(null, profile);
});

app.use(cookieParser())
    .use(session({keys: ['key']}))
    .use(passport.initialize())
    .use(passport.session())
    .use( // Разбираем application/x-www-form-urlencoded
    bodyParser.urlencoded({extended: false}),
    cookieParser()
);

app.set('view engine', 'twig')
    .set('view options', { layout: false })
    .set('views', __dirname + '/views')
    .set('twig options', { strict_variables: false });

app.get('/auth/vkontakte',
    passport.authenticate('vkontakte'),
    function(req, res){
    })
    .get('/auth/vkontakte/callback',
    passport.authenticate('vkontakte', { failureRedirect: '/login'}),
    function(req, res) {
        res.redirect('/');
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
    res.redirect('/login');
});

app.get('/admin/news/:id', isLogged, function (req, res) {
    req.session.category = req.body.category || req.session.category;
    req.session.num = req.body.num || req.session.num;

    news.showArticle(req.params.id, function(result) {
        res.render('one', {
            article: result,
            username: req.user.displayName
        });
    });
});

// Редактирование новости
app.put('/admin/news/:id', isLogged, function (req, res) {

    var data = {
            title: req.body.title,
            pub_date: req.body.pub_date,
            description: req.body.description
        },
        id = req.params.id;

    news.changeArticle(id, data);
    res.status(200).send('Новость успешно изменена.');
});

// Автоматическое добавление новостей из rss файла в БД
app.get('/admin/add', isLogged, function (req, res) {
    parserNews.getNews(function(url) {
        res.redirect(url);
    });
});

// Удаление новости из БД (Админ-панель)
app.delete('/admin/news/:id', isLogged, function (req, res) {
    todoList.delete(req.params.id);
});

// Выбор категории и количества новостей в Админ-панели
app.use('/admin/news', isLogged, function (req, res) {
    req.session.category = req.body.categories ? req.body.categories : (req.session.category ? req.session.category : 'Россия');
    req.session.num = req.body.num ? req.body.num : (req.session.num ? req.session.num : 2);
    req.sessionOptions.maxAge = 10 * 24 * 60 * 60;

    var data = {
        category: req.session.category,
        num: req.session.num
    };

    news.showAllCats(data, function(categories) {res.categories = categories; }, function(news) {
        var username = req.user ? req.user.displayName : '';
        if (res.categories) {
            res.render('all', {
                news: news,
                category: req.session.category,
                num: req.session.num,
                username: username,
                categories: res.categories
            });
        }
    });
});

// Обработка запроса для главной страницы
app.use('/', function (req, res) {
    req.session.category = req.body.categories ? req.body.categories : (req.session.category ? req.session.category : 'Россия');
    req.session.num = req.body.num ? req.body.num : (req.session.num ? req.session.num : 2);
    req.sessionOptions.maxAge = 10 * 24 * 60 * 60;

    var data = {
        category: req.session.category,
        num: req.session.num
    };

    news.showAllCats(data, function(categories) { res.categories = categories; }, function(news) {
        var username = req.user ? req.user.displayName : '';
        if (res.categories) {
            res.render('index', {
                news: news,
                category: req.session.category,
                num: req.session.num,
                username: username,
                categories: res.categories
            });
        }
    });
});

app.listen(PORT, function () {
    console.log('The application was launched on ' + PORT);
});