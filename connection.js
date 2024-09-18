// import mongoose
const mongoose = require('mongoose')

const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log('mongoDB connected succesfully');
    
}).catch((err)=>{
    console.log('mongoDB failed due to',err);
    
})