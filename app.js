const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


app.use((req, res) => {
    res.status(200).json({
        message: "Welcome"
    });
});





const userRoutes = require('./api/routes/users');

mongoose.connect( 'mongodb+srv://segun55:' + process.env.MONGO_ATLAS_PW + '@nodecluster-9fpek.mongodb.net/test?retryWrites=true&w=majority'
,{
    //useMongoClient: true
});

mongoose.Promise = global.Promise;



//to get put request on server
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//corse errors, this gives access to users from different servers regardless of their positions
app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    next();
});  

app.use('/users', userRoutes);


//error handling for any form of error by thr user
app.use((req, res, next)=> {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
}); 


app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));



//this makes the code accessible as a module by from other files
module.exports = app;