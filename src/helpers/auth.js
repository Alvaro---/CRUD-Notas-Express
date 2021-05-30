const helpers = {};

//Middleware
helpers.isAuthenticated = (req, res, next)=>{
    if (req.isAuthenticated ()){  //funcion isauthenticate viene de passport
 //  res.locals.user = req.user || null; //Passport guarda en user.    Si no existe va a null.
 //   console.log("////////////////"+res.locals.user+" ???****");
        res.locals.user = req.user.toJSON() || null; //Del indez aca para asegurarse que existe el toJSON y pueda saludar al usuario
        return next();
    }
    req.flash('error_msg', 'Por favor inicie sesion');
    res.redirect('/users/singin')
}

module.exports= helpers