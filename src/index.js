const express = require('express');
const path = require('path')
const  exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
//inicializaciones 
const app = express();
require('./database');
require('./config/passport');

//seccion de configuracion (settings)
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

//funciones ejecutadas antes de llegar al servidor /(middlewares)
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//variables globales colocr siertos datos paa toda la palicacion +
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
// rautes rutas     
app.use(require('./routes/'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// static files 
app.use(express.static(path.join(__dirname, 'public')));

// servidor escuchando 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
  });