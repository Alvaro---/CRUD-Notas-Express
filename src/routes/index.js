const router = require('express').Router();


router.get('/', (req,res)=>{
    //res.send('Index');
    res.render('index'); // index.hbs, pero eso esta configurado en el index de configuracion. 
});

router.get('/about', (req,res)=>{
    //res.send('About');
    res.render('about');
})
module.exports = router;