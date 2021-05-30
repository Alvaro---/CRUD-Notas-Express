const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notes-db-app', {
    //useCreateIndex: true,
    useNewUrlParser: true,
    //useFindAndModify: false, 
    useUnifiedTopology: true,
})  //Creara la base si no existe. Las 3 configuraciones son solo para que funcione la biblioteca
.then(db=>console.log('DB Conectada') )
.catch(err=>console.error(err));