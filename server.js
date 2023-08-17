/******************/
/*npm run dev*/
/******************/
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const corsOptions = require('./config/corsOption')
const { logger } = require('./middleware/logEvent');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection')
const PORT = process.env.PORT || 3800;

//connect to MongoDB
connectDB();

//custom middleware logger
app.use(logger);

//Cors Origin resource sharing
app.use(cors(corsOptions));

//built-in middleware to handle urlencoded data
//to be 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve staic files
app.use('/', express.static(path.join(__dirname, '/public')));

//add routes
app.use('/',require('./routes/root'));
app.use('/register',require('./routes/register'));
app.use('/auth',require('./routes/auth'));
app.use('/refresh',require('./routes/refresh'));
app.use('/logout',require('./routes/logout'));

app.use(verifyJWT);
app.use('/employee',require('./routes/api/employee'));

//all means accept everything
app.all('*',(req,res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }else if(req.accepts('json')){
        res.json({error : '404 not found'});
    }else {
        res.type('txt').send('404 not found');
    }
    
})

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
