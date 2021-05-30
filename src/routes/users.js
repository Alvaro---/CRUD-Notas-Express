const router = require('express').Router();

const User = require('../models/Users');
router.get('/users/singin', (req, res) => {
    //En el get esta la ruta a la que se ingresa. Puede ser distinta del archivo que se mostrara, ene ste caso es igual, caprta users y el mismo archvo,pero este es hbs
    res.render('users/singIn')
})

const passport=require ('passport');
router.post('/users/singin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/singIn',
    failureFlash: true
}));//Llama al authentical location

router.get('/users/singup', (req, res) => {
    res.render('users/singUp');
});

router.post('/users/singup', async (req, res) => {
    //console.log(req.body);
    //res.send('ok');
    const { name, email, password, confirmPassword } = req.body;
    const errors = [];
    if (password != confirmPassword) {
        errors.push({ text: 'La contraseña no coincide' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe tener mas de 4 caracteres' });
    }
    if (errors.length > 0) {
        res.render('users/singup', { errors, name, email, password, confirmPassword });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('errors', 'Email en uso');
            res.redirect('/users/singUp');
        } else {
            //res.send('ok');
            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('succes_msg', 'Usuario registrado correctamente.');
            res.redirect('/users/singin');
        }
    }
});


router.get('/users/logout',(req,res)=>{
    req.logout();
    res.redirect('/users/singin');
});

module.exports = router;