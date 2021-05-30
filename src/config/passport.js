const passport = require('passport');
//Nos permite unirnos a github, google, etc

const LocalStrategy = require('passport-local').Strategy;// Estrategia de conexion local

const User = require('../models/Users');

passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    const usuario = await User.findOne({ email: email });
    //console.log(usuario);
    if (!usuario) {
        return done(null, false, { message: 'usuario no encontrado' });//No hay error, no hay usuario , mensaje
    } else {
        const match = await usuario.matchPassword(password);
        if (match) {
            return done(null, usuario);
        } else {
            return done(null, false, { message: 'Clave incorrecta' });
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);  //Toma el usuario y el callback
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});