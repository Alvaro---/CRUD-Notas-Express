const router = require('express').Router();

const Note = require('../models/Note');

const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => { //La validacion va al final. Llama la funcion. Si esta autenticado continua y si no vuelve al logeo como esta en el archivo auth
    res.render('notes/newNotes');
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id).lean()
    res.render('notes/editNote', { note });
});

router.put('/notes/editNote/:id', isAuthenticated, async (req, res) => {
    const { title, descripcion } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, descripcion });
    req.flash('succes_msg', 'Edicion copmleta')
    res.redirect('/notes');
});

router.get('/notes', isAuthenticated, async (req, res) => {
    // res.send('Mostrar todas las notas');
    const notes = await Note.find({user:req.user.id}).lean().sort({ date: 'desc' }) // Dentro del parentesis se pueden colcoar parametros de busqueda
    //lean permite obtener el json en vez del mongoose. El sort es opcional.
    res.render('notes/allNotes', { notes });

});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('succes_msg', 'Eliminado correctamente')
    res.redirect('/notes');
});


router.post('/notes/newNotes', isAuthenticated, async (req, res) => {   //Esta ruta es a donde se envia la informacion del formulario
    //console.log(req.body);
    const { title, descripcion } = req.body;
    //Se puede validar con expressvalidator
    const errors = [];
    if (!title) {
        errors.push({ text: 'Por favor escriba un titulo' });
    }
    if (!descripcion) {
        errors.push({ text: 'Por favor escriba una descripcion.' });
    }
    if (errors.length > 0) {
        res.render('notes/newNotes', {
            errors,
            title,
            descripcion,
        });
    } else {

        const NewNote = new Note({ title, descripcion });
        NewNote.user = req.user.id;
        console.log(NewNote);
        await NewNote.save();            //solo necesitaria el save,pero debe ser async asi que se coloca el asynv en la funcin principalapra decir que hay procesos asyncronos. El await es pra decir cual es el proceso asyncrono
        req.flash('succes_msg', 'Nota agregada');
        res.redirect('/notes');

    }
});

module.exports = router;