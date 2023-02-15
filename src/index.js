var path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');

const route = require('./routes');
const db = require('./config/db');

const app = express();
const port = 3000;

//Connect to DB
db.connect();

app.use(flash());

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(
    session({
        cookie: { maxAge: 60000 },
        secret: 'secret',
        saveUninitialized: false,
        resave: false,
    }),
);

app.use(cookieParser());

// override with POST having ?_method=DELETE,PUT,PATCH
app.use(methodOverride('_method'));

//public
app.use(express.static(path.join(__dirname, 'public')));

//Express-hanlderbars engine
app.engine(
    '.hbs',
    engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//Routes
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
