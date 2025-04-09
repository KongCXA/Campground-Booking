const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const admin = require('firebase-admin');
const path = require('path');

//env vars
dotenv.config({path:'config/config.env'});

//Connect to database
connectDB();

// Init Firebase Admin SDK
if (!admin.apps.length) {
    const serviceAccountPath = path.join(__dirname, 'config/firebaseServiceAccountKey.json');
  
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath)),
    });
}

//Route files
const campgrounds = require('./routes/campgrounds');
const auth = require('./routes/auth');
const bookings = require('./routes/bookings');

const app=express();

//Body parser
app.use(express.json());

app.use('/api/v1/campgrounds', campgrounds);
app.use('/api/v1/auth', auth);
app.use('/api/v1/bookings', bookings);


const PORT=process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(()=>process.exit(1));
})