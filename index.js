// first step :
require('dotenv').config()
//  step 2:
const express = require('express')
// step3:
const cors = require('cors')

// import router
const router = require('./routes')

// import connection.j s file
require('./connection')

const server = express()

server.use(cors())

server.use(express.json())

// use routes
server.use(router)

PORT = 8080 || process.env.PORT

// lisen to port
server.listen(PORT,()=>{
    console.log(`server is sunning in port number ${PORT}`);
    
})

