const db = require('mongoose');

db.connect('mongodb+srv://admin:9AnE6wSwY8baPYU@wnc.nhw5i.mongodb.net/online-cademy?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true});


module.exports = db;