const db = require('mongoose');

db.connect('mongodb+srv://admin:9AnE6wSwY8baPYU@wnc.nhw5i.mongodb.net/online-academy?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(() => {
  console.log('Failed to connect to database');
});

module.exports = db;