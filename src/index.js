const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverraide = require('method-override');
const session = require('express-session');

//Envair mensajes entre vistas
const flash = require('connect-flash');

//autenticacion passport
const passport=require('passport');

//iniciar servidor
const app = express();

//iniciar bd
require('./database');
//traer passport
require('./config/passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'))   //La carpeta views esta en dirname. Es decir, la carpeta actual. Esto se consigue con el modulo path.
app.engine('.hbs', exphbs({
    defaultLayout: 'main', //main.hbs, el archivo principal.
    layoutsDir: path.join(app.get('views'), 'layouts'), //path.join une direcciones. La ruta de view, vista anteriormente en el set, lo concatena a layouts.
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs' //Todos los archivos acaban en .hbs
}));

app.set('view engine', '.hbs'); //el motor de las vistas sera .hbs

//middlewares
app.use(express.urlencoded({ extended: false })) //Al usar el form recive los datos. El false no acepta imagenes 
app.use(methodOverraide('_method')) // Los formularios enviaran varios metodos como put o delete. 
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
//Passport despues de session
app.use(passport.initialize());
app.use(passport.session());
//app.use(flash());

//FLASH MIDDLEWARE
app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.succes_msg = req.flash('succes_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); //errores de passport
   // res.locals.user = req.user.toJSON() || null; //Passport guarda en user.    Si no existe va a null.
    //console.log("////////////////"+res.locals.user+" ???****");
    next();
});



//routes
//De la carpeta de rutas Cada archivo de rutas guardara la informacion para las paginas distintas.
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));


//static files
app.use(express.static(path.join(__dirname, 'public')));

//server is listen
app.listen(app.get('port'), () => {
    console.log("Servidor en puerto ", app.get('port'));
})