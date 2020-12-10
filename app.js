const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('express-async-errors');

const authentication = require('./middlewares/auth.mdw');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', require('./routes/auth.route'));
app.use('/api/v1/users', require('./routes/user.route'));
app.use('/api/v1/courses', require('./routes/course.route'));
app.use('/api/v1/categories', require('./routes/category.route'));

app.get('/api/v1',async(req, res)=>{
    res.send({
        message:'API for Online Academy Project (WNC)',
        version:'1.0'
    }) 
})
app.use((req, res, next) => {
    res.status(404).send({
        message: 'Resourse not found!'
    });
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send({
        message: 'Something broke!'
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Online Academy API is running at http://localhost:${PORT}/api/v1`);
});